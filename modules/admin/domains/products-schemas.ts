import {
  departmentEnum,
  productFlagEnum,
  productImagesInsertSchema,
  productsInsertSchema,
  productsSelectSchema,
  productTypeEnum,
  productVariantsInsertSchema,
} from "@/db/schema";
import z from "zod";

export const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case (e.g. my-product)");

export const departmentSchema = z.enum(departmentEnum.enumValues);
export const productTypeSchema = z.enum(productTypeEnum.enumValues);
export const productFlagSchema = z.enum(productFlagEnum.enumValues);

export type Product = z.infer<typeof productsSelectSchema>;

export const createProductImageInput = productImagesInsertSchema
  .pick({
    r2Key: true,
    url: true,
    alt: true,
    sortOrder: true,
  })
  .extend({
    r2Key: z.string().min(1, "Missing image key"),
    url: z.string().url("Invalid image URL"),
    alt: z.string().trim().optional().nullable(),
    sortOrder: z.coerce.number().int().default(0),
  });

export type CreateProductImageInput = z.infer<typeof createProductImageInput>;

export const createProductVariantInput = productVariantsInsertSchema
  .pick({
    sku: true,
    active: true,
    sizeId: true,
    colorId: true,
    priceCents: true,
    compareAtPriceCents: true,
    inventory: true,
  })
  .extend({
    sku: z.string().trim().optional().nullable(),
    active: z.coerce.boolean().default(true),

    sizeId: z.string().uuid().optional().nullable(),
    colorId: z.string().uuid().optional().nullable(),

    priceCents: z.coerce.number().int().min(0, "Price must be >= 0"),
    compareAtPriceCents: z.coerce.number().int().min(0).optional().nullable(),
    inventory: z.coerce
      .number()
      .int()
      .min(0, "Inventory must be >= 0")
      .default(0),
  })
  .superRefine((v, ctx) => {
    if (v.compareAtPriceCents != null && v.compareAtPriceCents < v.priceCents) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["compareAtPriceCents"],
        message: "Compare-at price must be >= price",
      });
    }
  });

export type CreateProductVariantInput = z.infer<
  typeof createProductVariantInput
>;

export const createProductInput = productsInsertSchema
  .pick({
    name: true,
    slug: true,
    description: true,
    productType: true,
    department: true,
    active: true,
    featuredRank: true,
  })
  .extend({
    name: z.string().trim().min(2, "Name is required"),

    slug: slugSchema.optional(),

    description: z.string().trim().optional().nullable(),

    productType: productTypeSchema,
    department: departmentSchema,

    active: z.coerce.boolean().default(true),

    featuredRank: z.coerce.number().int().min(1).optional().nullable(),

    categoryIds: z.array(z.string().uuid()).default([]),
    tagIds: z.array(z.string().uuid()).default([]),
    flags: z.array(productFlagSchema).default([]),

    images: z.array(createProductImageInput).default([]),

    variants: z
      .array(createProductVariantInput)
      .min(1, "Add at least one variant"),
  });

export type CreateProductFormValues = z.input<typeof createProductInput>;
export type CreateProductOutput = z.output<typeof createProductInput>;

export const updateProductInput = productsInsertSchema
  .pick({
    name: true,
    slug: true,
    description: true,
    productType: true,
    department: true,
    active: true,
    featuredRank: true,
  })
  .partial()
  .extend({
    id: z.string().uuid(),

    slug: slugSchema.optional(),

    categoryIds: z.array(z.string().uuid()).optional(),
    tagIds: z.array(z.string().uuid()).optional(),
    flags: z.array(productFlagSchema).optional(),

    images: z.array(createProductImageInput).optional(),
    variants: z.array(createProductVariantInput).optional(),
  });

export type UpdateProductInput = z.infer<typeof updateProductInput>;

export const adminProductListImageSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  alt: z.string().nullable(),
  sortOrder: z.number().int(),
  r2Key: z.string(),
});

export const adminProductListVariantSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().nullable(),
  priceCents: z.number().int(),
  inventory: z.number().int(),
  sizeCode: z.string().nullable(),
  colorName: z.string().nullable(),
});

export const adminProductListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  active: z.boolean(),
  minPriceCents: z.number().int().nullable(),
  maxPriceCents: z.number().int().nullable(),

  images: z.array(adminProductListImageSchema),
  variants: z.array(adminProductListVariantSchema),
});

export const adminProductListOutput = z.array(adminProductListItemSchema);

export type AdminProductOutput = z.output<typeof adminProductListItemSchema>;
export type AdminProductListOutput = z.output<typeof adminProductListOutput>;
