import { HomeView } from "@/modules/home/ui/views/home-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Home = async () => {
  const qc = getQueryClient();

  void qc.prefetchQuery(trpc.home.products.featured.queryOptions());
  void qc.prefetchQuery(trpc.home.products.newArrivals.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <HomeView />
    </HydrationBoundary>
  );
};

export default Home;
