import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { CartItemOutput } from "@/modules/cart/domain/cart-schema";
import Image from "next/image";

interface Props {
  cartItems: CartItemOutput[];
}

export const OrderSummary = ({ cartItems }: Props) => {
  return (
    <div className="flex-1 shadow-sm border rounded-md bg-white p-6">
      <h1 className="font-bold text-3xl mb-6">Order Summary</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative">
              <div className="relative aspect-3/4 h-30 rounded-md overflow-hidden">
                <Image
                  src={item.imageUrl ?? ""}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute -top-2 -right-2 bg-custom-primary text-white h-7 w-7 rounded-full flex items-center justify-center text-xl font-bold">
                {item.quantity}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-xl">{item.productName}</h1>

                <p className="font-bold text-2xl">
                  ${centsToDollars(item.priceCents)}
                </p>
              </div>

              <p className="text-muted-foreground">
                {item.color} / {item.size}
              </p>

              <p className="text-muted-foreground">
                ${centsToDollars(item.priceCents)} each
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
