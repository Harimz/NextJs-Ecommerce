import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CheckoutPage = async () => {
  return <CheckoutView />;
};

export default CheckoutPage;
