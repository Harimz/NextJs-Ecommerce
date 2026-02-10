import { requireAuth } from "@/lib/guards";
import { ProfileView } from "@/modules/profile/ui/views/profile-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ProfilePage = async () => {
  await requireAuth();
  const qc = getQueryClient();

  void qc.prefetchQuery(trpc.orders.getMine.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ProfileView />{" "}
    </HydrationBoundary>
  );
};

export default ProfilePage;
