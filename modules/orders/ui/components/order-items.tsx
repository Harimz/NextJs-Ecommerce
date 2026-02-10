import { Package } from "lucide-react";
import React from "react";
import {
  OrderDetailsOutput,
  OrderItemsOutput,
} from "../../domain/orders-schema";
import Image from "next/image";
import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { Separator } from "@/components/ui/separator";

export const Orderitems = ({
  orderItems,
  orderDetails,
}: {
  orderItems: OrderItemsOutput;
  orderDetails: OrderDetailsOutput;
}) => {
  return (
    <div className="bg-white dark:bg-muted rounded-sm p-6 border shadow-xs mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Package />

        <h1 className="font-bold text-xl">Order Items</h1>
      </div>

      {orderItems.map((orderItem) => (
        <div key={orderItem.id} className="flex gap-4">
          <div className="relative aspect-3/4 h-20 md:h-30 rounded-md overflow-hidden">
            <Image
              src={orderItem.imageUrl ?? ""}
              alt={orderItem.nameSnapshot}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex justify-between w-full">
            <div>
              <h2>{orderItem.nameSnapshot}</h2>
              <p className="text-muted-foreground text-sm">
                {orderItem.color} / {orderItem.size}
              </p>
              <p className="text-muted-foreground text-sm">
                Qty: {orderItem.quantity}
              </p>
            </div>

            <p className="font-bold text-xl">
              ${centsToDollars(orderItem.lineTotalCents)}
            </p>
          </div>
        </div>
      ))}

      <Separator className="my-6" />

      <div className="space-y-2">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>${centsToDollars(orderDetails.subtotalCents)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping</p>
          <p>${centsToDollars(orderDetails.shippingCents)}</p>
        </div>
        <div className="flex justify-between">
          <p>Tax</p>
          <p>${centsToDollars(orderDetails.taxCents)}</p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Total</h2>

        <p className="font-bold text-xl">
          ${centsToDollars(orderDetails.totalCents)}
        </p>
      </div>
    </div>
  );
};
