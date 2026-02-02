import { db } from "@/db";
import {
  colors,
  productImages,
  products,
  productVariants,
  sizes,
} from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray, isNotNull } from "drizzle-orm";
import z from "zod";

export const productsRouter = createTRPCRouter({
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
