import { db } from "@/db";
import {
  colors,
  productCategories,
  productImages,
  products,
  productVariants,
  sizes,
} from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  sql,
} from "drizzle-orm";
import z from "zod";
import { productsListInput } from "../../domains/product-reviews-schema";

export const productsRouter = createTRPCRouter({
  list: baseProcedure.input(productsListInput).query(async ({ input }) => {
    const {
      departments,
      productTypes,
      minPriceCents,
      maxPriceCents,
      onSale,
      sort,
      limit,
      cursor,
    } = input;

    const whereParts = [
      eq(products.active, true),

      gte(products.minPriceCents, minPriceCents),
      lte(products.minPriceCents, maxPriceCents),
    ];

    if (input.q) {
      const q = `%${input.q.toLowerCase()}%`;

      whereParts.push(
        sql`
          (
            lower(${products.name}) like ${q}
            or lower(${products.description}) like ${q}
          )
        `,
      );
    }

    if (departments.length) {
      whereParts.push(inArray(products.department, departments));
    }

    if (productTypes.length) {
      whereParts.push(inArray(products.productType, productTypes));
    }

    if (onSale) {
      whereParts.push(
        sql`exists (
          select 1
          from ${productVariants} pv
          where pv.product_id = ${products.id}
            and pv.compare_at_price_cents is not null
            and pv.compare_at_price_cents > pv.price_cents
        )`,
      );
    }

    if (cursor) {
      if (sort === "newest") {
        whereParts.push(
          sql`(
            ${products.createdAt}, ${products.id}
          ) < (
            ${new Date(cursor.createdAt!)}, ${cursor.id}
          )`,
        );
      }

      if (sort === "price-asc") {
        whereParts.push(
          sql`(
            ${products.minPriceCents}, ${products.id}
          ) > (
            ${cursor.minPriceCents!}, ${cursor.id}
          )`,
        );
      }

      if (sort === "price-desc") {
        whereParts.push(
          sql`(
            ${products.minPriceCents}, ${products.id}
          ) < (
            ${cursor.minPriceCents!}, ${cursor.id}
          )`,
        );
      }

      if (sort === "rating") {
        whereParts.push(
          sql`(
            ${products.ratingAvg}::numeric, ${products.ratingCount}, ${products.id}
          ) < (
            ${cursor.ratingAvg!}::numeric, ${cursor.ratingCount!}, ${cursor.id}
          )`,
        );
      }
    }

    const where = and(...whereParts);

    const orderBy =
      sort === "newest"
        ? [desc(products.createdAt), desc(products.id)]
        : sort === "price-asc"
          ? [asc(products.minPriceCents), asc(products.id)]
          : sort === "price-desc"
            ? [desc(products.minPriceCents), desc(products.id)]
            : [
                desc(products.ratingAvg),
                desc(products.ratingCount),
                desc(products.id),
              ];

    const items = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        department: products.department,
        productType: products.productType,

        minPriceCents: products.minPriceCents,
        maxPriceCents: products.maxPriceCents,

        ratingAvg: products.ratingAvg,
        ratingCount: products.ratingCount,

        createdAt: products.createdAt,
      })
      .from(products)
      .where(where)
      .orderBy(...orderBy)
      .limit(limit + 1);

    const hasNext = items.length > limit;
    const pageItems = hasNext ? items.slice(0, limit) : items;

    const productIds = pageItems.map((p) => p.id);
    const images = productIds.length
      ? await db
          .select({
            productId: productImages.productId,
            id: productImages.id,
            url: productImages.url,
            alt: productImages.alt,
            sortOrder: productImages.sortOrder,
            createdAt: productImages.createdAt,
          })
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
          .orderBy(
            productImages.productId,
            asc(productImages.sortOrder),
            asc(productImages.createdAt),
          )
      : [];

    const firstImageByProduct = new Map<
      string,
      { id: string; url: string; alt: string | null }
    >();

    for (const img of images) {
      if (!firstImageByProduct.has(img.productId)) {
        firstImageByProduct.set(img.productId, {
          id: img.id,
          url: img.url,
          alt: img.alt ?? null,
        });
      }
    }

    const resultItems = pageItems.map((p) => ({
      ...p,
      ratingAvg: Number(p.ratingAvg),
      image: firstImageByProduct.get(p.id) ?? null,
    }));

    const last = pageItems[pageItems.length - 1];
    const nextCursor =
      hasNext && last
        ? sort === "newest"
          ? { id: last.id, createdAt: last.createdAt.toISOString() }
          : sort === "price-asc" || sort === "price-desc"
            ? { id: last.id, minPriceCents: last.minPriceCents ?? 0 }
            : {
                id: last.id,
                ratingAvg: Number(last.ratingAvg),
                ratingCount: last.ratingCount ?? 0,
              }
        : null;

    return {
      items: resultItems,
      nextCursor,
    };
  }),

  details: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const { slug } = input;

      const [product] = await db
        .select()
        .from(products)
        .where(and(eq(products.slug, slug), eq(products.active, true)));

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That product does not exist",
        });
      }

      const images = await db
        .select({
          id: productImages.id,
          url: productImages.url,
          r2Key: productImages.r2Key,
          alt: productImages.alt,
          sortOrder: productImages.sortOrder,
          createdAt: productImages.createdAt,
        })
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .orderBy(asc(productImages.sortOrder), asc(productImages.createdAt));

      const variants = await db
        .select({
          id: productVariants.id,
          sku: productVariants.sku,
          active: productVariants.active,
          priceCents: productVariants.priceCents,
          compareAtPriceCents: productVariants.compareAtPriceCents,
          inventory: productVariants.inventory,

          sizeId: productVariants.sizeId,
          sizeCode: sizes.code,
          sizeLabel: sizes.label,
          sizeSort: sizes.sortOrder,

          colorId: productVariants.colorId,
          colorName: colors.name,
          colorSlug: colors.slug,
          colorHex: colors.hex,
        })
        .from(productVariants)
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .where(eq(productVariants.productId, product.id))
        .orderBy(
          desc(productVariants.active),
          asc(sizes.sortOrder),
          asc(colors.name),
        );
      return {
        ...product,
        images,
        variants,
      };
    }),

  featured: baseProcedure.query(async () => {
    const items = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        minPriceCents: products.minPriceCents,
        maxPriceCents: products.maxPriceCents,
        department: products.department,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(and(eq(products.active, true), isNotNull(products.featuredRank)))
      .orderBy(asc(products.featuredRank), desc(products.createdAt))
      .limit(8);

    const productIds = items.map((item) => item.id);
    if (productIds.length === 0) {
      return items.map((p) => ({ ...p, image: null }));
    }

    const images = await db
      .select({
        productId: productImages.productId,
        id: productImages.id,
        url: productImages.url,
        alt: productImages.alt,
        sortOrder: productImages.sortOrder,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(
        productImages.productId,
        asc(productImages.sortOrder),
        asc(productImages.createdAt),
      );

    const firstImageByProduct = new Map<
      string,
      { id: string; url: string; alt: string | null; sortOrder: number }
    >();

    for (const img of images) {
      if (!firstImageByProduct.has(img.productId)) {
        firstImageByProduct.set(img.productId, {
          id: img.id,
          url: img.url,
          alt: img.alt ?? null,
          sortOrder: img.sortOrder,
        });
      }
    }

    return items.map((p) => ({
      ...p,
      image: firstImageByProduct.get(p.id) ?? null,
    }));
  }),

  newArrivals: baseProcedure.query(async () => {
    const items = await db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.createdAt))
      .limit(8);

    const productIds = items.map((item) => item.id);
    if (productIds.length === 0) {
      return items.map((p) => ({ ...p, image: null }));
    }

    const images = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(
        productImages.productId,
        asc(productImages.sortOrder),
        asc(productImages.createdAt),
      );

    const firstImageByProduct = new Map<
      string,
      { id: string; url: string; alt: string | null; sortOrder: number }
    >();

    for (const img of images) {
      if (!firstImageByProduct.has(img.productId)) {
        firstImageByProduct.set(img.productId, {
          id: img.id,
          url: img.url,
          alt: img.alt ?? null,
          sortOrder: img.sortOrder,
        });
      }
    }

    return items.map((p) => ({
      ...p,
      image: firstImageByProduct.get(p.id) ?? null,
    }));
  }),
});
