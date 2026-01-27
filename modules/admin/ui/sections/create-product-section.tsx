"use client";

import { GeneralDisplayError } from "@/modules/shared/components/GeneralDisplayError";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProductFormValues,
  createProductInput,
} from "../../domains/products-schemas";
import { ProductBasicInfo } from "../components/products/product-basic-info";
import { ProductImages } from "../components/products/product-images";
import { ProductVariants } from "../components/products/product-variants";
import { ProductStatus } from "../components/products/product-status";
import { ProductCategories } from "../components/products/product-categories";
import { ProductTags } from "../components/products/product-tags";
import { Button } from "@/components/ui/button";
import { Eye, Save } from "lucide-react";
import { ProductPreviewDialog } from "../components/products/product-preview-dialog";

const defaultValues: CreateProductFormValues = {
  name: "",
  slug: undefined,
  description: null,

  department: "UNISEX",
  productType: "SHIRT",

  active: true,
  featuredRank: null,

  flags: [],
  categoryIds: [],
  tagIds: [],

  images: [],
  variants: [
    {
      sku: null,
      active: true,
      sizeId: null,
      colorId: null,
      priceCents: 0,
      compareAtPriceCents: null,
      inventory: 0,
    },
  ],
};

export const CreateProductSection = () => {
  return (
    <Suspense fallback={"loading..."}>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GeneralDisplayError
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <CreateProductSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const CreateProductSectionSuspense = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const { data: categories } = useSuspenseQuery({
    ...trpc.admin.categories.list.queryOptions({}),
  });

  const { data: tags } = useSuspenseQuery({
    ...trpc.admin.tags.list.queryOptions(),
  });

  const { data: colors } = useSuspenseQuery({
    ...trpc.admin.colors.list.queryOptions(),
  });

  const { data: sizes } = useSuspenseQuery({
    ...trpc.admin.sizes.list.queryOptions(),
  });

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductInput),
    defaultValues,
    mode: "onSubmit",
  });

  const images = useFieldArray({
    control: form.control,
    name: "images",
    keyName: "key",
  });

  const variants = useFieldArray({
    control: form.control,
    name: "variants",
    keyName: "key",
  });

  const createProduct = useMutation(
    trpc.admin.products.create.mutationOptions({}),
  );

  const onSubmit = (values: CreateProductFormValues) => {
    console.log(values);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex mt-6 gap-6 mb-20"
      >
        <div className="flex-1 flex gap-6 flex-col">
          <ProductBasicInfo />

          <ProductImages />

          <ProductVariants colors={colors} sizes={sizes} />
        </div>

        <div className="w-[30%] flex flex-col gap-6">
          <ProductStatus />

          <ProductCategories categories={categories} />

          <ProductTags tags={tags} />

          <div className="p-6 bg-muted border rounded-md flex flex-col gap-4">
            <Button variant="primary" type="submit" className="w-full">
              <Save className="size-4" /> Save Product
            </Button>

            <ProductPreviewDialog colors={colors} sizes={sizes} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
