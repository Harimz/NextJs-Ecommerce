import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import {
  adminProductListOutput,
  createProductInput,
} from "../../domains/products-schemas";
import { slugify } from "../utils/helpers";
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
import { desc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

type AdminProductListOutput = z.output<typeof adminProductListOutput>;
type AdminProductListItem = AdminProductListOutput[number];
type AdminVariant = AdminProductListItem["variants"][number];
type AdminImage = AdminProductListItem["images"][number];

export const productsRouter = createTRPCRouter({
  list: adminProtectedProcedure
    .output(adminProductListOutput)
    .query(async () => {
      const rows = await db
        .select({
          productId: products.id,
          name: products.name,
          slug: products.slug,
          active: products.active,
          minPriceCents: products.minPriceCents,
          maxPriceCents: products.maxPriceCents,

          variantId: productVariants.id,
          sku: productVariants.sku,
          priceCents: productVariants.priceCents,
          inventory: productVariants.inventory,

          sizeCode: sizes.code,
          colorName: colors.name,
        })
        .from(products)
        .leftJoin(productVariants, eq(productVariants.productId, products.id))
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .orderBy(desc(products.createdAt));

      const productMap = new Map<string, AdminProductListItem>();

      for (const r of rows) {
        let item = productMap.get(r.productId);

        if (!item) {
          item = {
            id: r.productId,
            name: r.name,
            slug: r.slug,
            active: r.active,
            minPriceCents: r.minPriceCents ?? null,
            maxPriceCents: r.maxPriceCents ?? null,
            images: [],
            variants: [],
          };
          productMap.set(r.productId, item);
        }

        if (r.variantId) {
          const v: AdminVariant = {
            id: r.variantId,
            sku: r.sku ?? null,
            priceCents: r.priceCents!,
            inventory: r.inventory ?? 0,
            sizeCode: r.sizeCode ?? null,
            colorName: r.colorName ?? null,
          };
          item.variants.push(v);
        }
      }

      const productIds = Array.from(productMap.keys());
      if (productIds.length === 0) return [];

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

      const out: AdminProductListOutput = Array.from(productMap.values());
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

        await tx.insert(productVariants).values(
          input.variants.map((v) => ({
            productId,
            sku: v.sku,
            active: v.active,
            sizeId: v.sizeId,
            colorId: v.colorId,
            priceCents: v.priceCents,
            compareAtPriceCents: v.compareAtPriceCents,
            inventory: v.inventory,
          })),
        );

        return productId;
      });

      return { id: result };
    }),
});
