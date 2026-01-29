import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import {
  adminProductListInput,
  adminProductListOutput,
  adminProductListPagedOutput,
  AdminProductListPagedOutput,
  createProductInput,
} from "../../domains/products-schemas";
import {
  makeSkuBaseFromSlug,
  makeVariantSku,
  skuTokenize,
  slugify,
} from "../utils/helpers";
import { db } from "@/db";
import {
  colors,
  productCategories,
  productFlags,
  productImages,
  products,
  productTags,
  productVariants,
  sizes,
} from "@/db/schema";
import { and, count, desc, eq, ilike, inArray, lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

type AdminProductListOutput = z.output<typeof adminProductListOutput>;
type AdminProductListItem = AdminProductListOutput[number];
type AdminVariant = AdminProductListItem["variants"][number];
type AdminImage = AdminProductListItem["images"][number];

export const productsRouter = createTRPCRouter({
  list: adminProtectedProcedure
    .input(adminProductListInput)
    .output(adminProductListPagedOutput)
    .query(async ({ input }) => {
      const limit = input.limit ?? 20;
      const q = input.q?.trim();
      const status = input.status ?? "all";

      // ---- total count (optional but nice for UI)
      const totalWhere = and(
        q
          ? or(ilike(products.name, `%${q}%`), ilike(products.slug, `%${q}%`))
          : undefined,
        input.department
          ? eq(products.department, input.department)
          : undefined,
        status === "active"
          ? eq(products.active, true)
          : status === "draft"
            ? eq(products.active, false)
            : undefined,
      );

      const [{ total }] = await db
        .select({ total: count() })
        .from(products)
        .where(totalWhere);

      // ---- page products only (limit + 1 to compute nextCursor)
      // cursor is "createdAt|id" (stable ordering)
      let cursorCreatedAt: Date | undefined;
      let cursorId: string | undefined;

      if (input.cursor) {
        const [createdAtIso, id] = input.cursor.split("|");
        if (createdAtIso && id) {
          cursorCreatedAt = new Date(createdAtIso);
          cursorId = id;
        }
      }

      const pageWhere = and(
        totalWhere,
        cursorCreatedAt && cursorId
          ? or(
              lt(products.createdAt, cursorCreatedAt),
              and(
                eq(products.createdAt, cursorCreatedAt),
                lt(products.id, cursorId),
              ),
            )
          : undefined,
      );

      const pageProducts = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          active: products.active,
          department: products.department,
          minPriceCents: products.minPriceCents,
          maxPriceCents: products.maxPriceCents,
          createdAt: products.createdAt,
        })
        .from(products)
        .where(pageWhere)
        .orderBy(desc(products.createdAt), desc(products.id))
        .limit(limit + 1);

      const hasNext = pageProducts.length > limit;
      const itemsPage = hasNext ? pageProducts.slice(0, limit) : pageProducts;

      const nextCursor =
        hasNext && itemsPage.length > 0
          ? `${itemsPage[itemsPage.length - 1]!.createdAt.toISOString()}|${
              itemsPage[itemsPage.length - 1]!.id
            }`
          : null;

      const productIds = itemsPage.map((p) => p.id);
      if (productIds.length === 0) {
        return { items: [], nextCursor: null, total: total ?? 0 };
      }

      const variantRows = await db
        .select({
          productId: productVariants.productId,
          id: productVariants.id,
          sku: productVariants.sku,
          priceCents: productVariants.priceCents,
          inventory: productVariants.inventory,
          sizeCode: sizes.code,
          colorName: colors.name,
        })
        .from(productVariants)
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .where(inArray(productVariants.productId, productIds));

      const imageRows = await db
        .select({
          id: productImages.id,
          productId: productImages.productId,
          url: productImages.url,
          alt: productImages.alt,
          sortOrder: productImages.sortOrder,
          r2Key: productImages.r2Key,
        })
        .from(productImages)
        .where(inArray(productImages.productId, productIds))
        .orderBy(productImages.productId, productImages.sortOrder);

      const productMap = new Map<string, AdminProductListItem>();

      for (const p of itemsPage) {
        productMap.set(p.id, {
          id: p.id,
          name: p.name,
          slug: p.slug,
          active: p.active,
          department: p.department,
          minPriceCents: p.minPriceCents ?? null,
          maxPriceCents: p.maxPriceCents ?? null,
          images: [],
          variants: [],
        });
      }

      for (const r of variantRows) {
        const item = productMap.get(r.productId);
        if (!item) continue;

        const v: AdminVariant = {
          id: r.id,
          sku: r.sku ?? null,
          priceCents: r.priceCents,
          inventory: r.inventory ?? 0,
          sizeCode: r.sizeCode ?? null,
          colorName: r.colorName ?? null,
        };

        item.variants.push(v);
      }

      for (const img of imageRows) {
        const item = productMap.get(img.productId);
        if (!item) continue;

        const i: AdminImage = {
          id: img.id,
          url: img.url,
          alt: img.alt ?? null,
          sortOrder: img.sortOrder,
          r2Key: img.r2Key,
        };

        item.images.push(i);
      }

      const outItems = productIds
        .map((id) => productMap.get(id)!)
        .filter(Boolean);

      const out: AdminProductListPagedOutput = {
        items: outItems,
        nextCursor,
        total: total ?? 0,
      };

      return out;
    }),

  create: adminProtectedProcedure
    .input(createProductInput)
    .mutation(async ({ input }) => {
      const slug =
        input.slug ?? slugify(input.name) ?? crypto.randomUUID().slice(0, 8);

      const [existing] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, slug));

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Product slug already exists",
        });
      }

      const seen = new Set<string>();
      for (const v of input.variants) {
        const key = `${v.sizeId ?? "null"}:${v.colorId ?? "null"}`;

        if (seen.has(key)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Duplicate variant (same size & color)",
          });
        }

        seen.add(key);
      }

      const prices = input.variants.map((v) => v.priceCents);
      const minPriceCents = Math.min(...prices);
      const maxPriceCents = Math.max(...prices);

      const result = await db.transaction(async (tx) => {
        const [product] = await tx
          .insert(products)
          .values({
            name: input.name,
            slug,
            description: input.description,
            productType: input.productType,
            department: input.department,
            active: input.active,
            featuredRank: input.featuredRank,
            minPriceCents,
            maxPriceCents,
          })
          .returning({ id: products.id });

        const productId = product.id;

        if (input.categoryIds.length > 0) {
          await tx.insert(productCategories).values(
            input.categoryIds.map((categoryId) => ({
              productId,
              categoryId,
            })),
          );
        }

        if (input.tagIds.length > 0) {
          await tx.insert(productTags).values(
            input.tagIds.map((tagId) => ({
              productId,
              tagId,
            })),
          );
        }

        if (input.flags.length > 0) {
          await tx.insert(productFlags).values(
            input.flags.map((flag) => ({
              productId,
              flag,
            })),
          );
        }

        if (input.images.length > 0) {
          await tx.insert(productImages).values(
            input.images.map((img) => ({
              productId,
              r2Key: img.r2Key,
              url: img.url,
            })),
          );
        }

        const sizeIds = Array.from(
          new Set(input.variants.map((v) => v.sizeId).filter(Boolean)),
        ) as string[];

        const colorIds = Array.from(
          new Set(input.variants.map((v) => v.colorId).filter(Boolean)),
        ) as string[];

        const sizeRows =
          sizeIds.length > 0
            ? await tx
                .select({ id: sizes.id, code: sizes.code })
                .from(sizes)
                .where(inArray(sizes.id, sizeIds))
            : [];

        const colorRows =
          colorIds.length > 0
            ? await tx
                .select({ id: colors.id, name: colors.name })
                .from(colors)
                .where(inArray(colors.id, colorIds))
            : [];

        const sizeMap = new Map(sizeRows.map((s) => [s.id, s.code]));
        const colorMap = new Map(colorRows.map((c) => [c.id, c.name]));

        const base = makeSkuBaseFromSlug(slug);

        const usedSkus = new Set<string>();

        const variantsToInsert = input.variants.map((v, index) => {
          const sizeCode = v.sizeId ? (sizeMap.get(v.sizeId) ?? null) : null;
          const colorName = v.colorId
            ? (colorMap.get(v.colorId) ?? null)
            : null;

          let sku = v.sku?.trim() || null;

          if (!sku) {
            sku = makeVariantSku({ base, sizeCode, colorName, index });
          } else {
            sku = skuTokenize(sku);
          }

          // Ensure uniqueness within this product (just in case)
          let finalSku = sku;
          let bump = 2;
          while (usedSkus.has(finalSku)) {
            finalSku = `${sku}-${String(bump).padStart(2, "0")}`;
            bump++;
          }
          usedSkus.add(finalSku);

          return {
            productId,
            sku: finalSku,
            active: v.active,
            sizeId: v.sizeId,
            colorId: v.colorId,
            priceCents: v.priceCents,
            compareAtPriceCents: v.compareAtPriceCents,
            inventory: v.inventory,
          };
        });

        await tx.insert(productVariants).values(variantsToInsert);

        return productId;
      });

      return { id: result };
    }),

  toggleActive: adminProtectedProcedure
    .input(z.object({ id: z.string().uuid(), active: z.boolean() }))
    .mutation(async ({ input }) => {
      await db
        .update(products)
        .set({ active: input.active })
        .where(eq(products.id, input.id));

      return { id: input.id, active: input.active };
    }),

  delete: adminProtectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.id, input.id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This product does not exist",
        });
      }

      const [product] = await db
        .delete(products)
        .where(eq(products.id, input.id))
        .returning();

      return product;
    }),
});
