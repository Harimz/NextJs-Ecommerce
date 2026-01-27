import { createTRPCRouter } from "@/trpc/init";
import { categoriesRouter } from "./routers/categories-router";
import { tagsRouter } from "./routers/tags-router";
import { productsRouter } from "./routers/products-router";
import { colorsRouter } from "./routers/colors-router";
import { sizesRouter } from "./routers/sizes-router";
import { productImagesRouter } from "./routers/product-images-router";

export const adminRouter = createTRPCRouter({
  categories: categoriesRouter,
  tags: tagsRouter,
  products: productsRouter,
  colors: colorsRouter,
  sizes: sizesRouter,
  productImages: productImagesRouter,
});
