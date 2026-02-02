import { auth } from "@/lib/auth";
import { ProductsDetailsView } from "@/modules/products/ui/views/product-details-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { headers } from "next/headers";
import React from "react";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const qc = getQueryClient();

  void qc.prefetchQuery(trpc.products.details.queryOptions({ slug }));

  return <ProductsDetailsView slug={slug} />;
};

export default ProductDetailsPage;
