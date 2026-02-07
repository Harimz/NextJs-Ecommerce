import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";
import { getQueryClient, trpc } from "@/trpc/server";

const CheckoutPage = async () => {
  const qc = getQueryClient();

  void qc.prefetchQuery(trpc.cart.getMyCart.queryOptions());

  void qc.prefetchQuery(trpc.checkout.getSummary.queryOptions());

  return <CheckoutView />;
};

export default CheckoutPage;
