import { ProductsDetailsView } from "@/modules/home/ui/views/product-details-view";
import { getQueryClient, trpc } from "@/trpc/server";
import React from "react";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const qc = getQueryClient();

  void qc.prefetchQuery(trpc.home.products.details.queryOptions({ slug }));

  return <ProductsDetailsView slug={slug} />;
};

export default ProductDetailsPage;
