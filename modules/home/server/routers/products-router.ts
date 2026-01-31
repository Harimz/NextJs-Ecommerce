import { db } from "@/db";
import { productImages, products } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, asc, desc, eq, inArray, isNotNull } from "drizzle-orm";

export const productsRouter = createTRPCRouter({
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
