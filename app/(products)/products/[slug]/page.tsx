import { ProductsDetailsView } from "@/modules/products/ui/views/product-details-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const qc = getQueryClient();

  void qc.prefetchQuery(trpc.products.details.queryOptions({ slug }));

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ProductsDetailsView slug={slug} />
    </HydrationBoundary>
  );
};

export default ProductDetailsPage;
