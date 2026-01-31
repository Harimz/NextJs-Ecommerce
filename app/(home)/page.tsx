import { HomeView } from "@/modules/home/ui/views/home-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Home = async () => {
  const qc = getQueryClient();

  await qc.prefetchQuery(trpc.home.products.featured.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <HomeView />
    </HydrationBoundary>
  );
};

export default Home;
