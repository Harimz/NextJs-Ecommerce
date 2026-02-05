import React from "react";
import { CartItemOutput } from "../../domain/cart-schema";
import Link from "next/link";
import { useCartUiStore } from "../stores/cart-ui-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import {
  centsToDollars,
  dollarsToCents,
} from "@/modules/admin/ui/utils/helpers";
import {
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "../../api/cart-mutations";

export const CartItemRow = ({ item }: { item: CartItemOutput }) => {
  const { close } = useCartUiStore();
  const remove = useRemoveCartItem();
  const updateQty = useUpdateCartItemQuantity();

  const dec = () => {
    updateQty.mutate({
      variantId: item.variantId,
      quantity: Math.max(0, item.quantity - 1),
    });
  };

  const inc = () => {
    updateQty.mutate({
      variantId: item.variantId,
      quantity: Math.min(item.inventory, item.quantity + 1),
    });
  };

  return (
    <div key={item.id} className="flex gap-4">
      <Link
        href={`/products/${item.productSlug}`}
        onClick={() => close()}
        className="relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted"
      >
        <Image
          fill
          src={item.imageUrl ?? ""}
          alt={item.productName}
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${item.productSlug}`}
              onClick={() => close()}
              className="font-medium text-sm hover:underline line-clamp-1"
            >
              {item.productName}
            </Link>
            <p className="text-sm text-muted-foreground mt-0.5">
              {item.color} / {item.size}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2"
            onClick={() => remove.mutate({ variantId: item.variantId })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={dec}
              disabled={updateQty.isPending || item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={inc}
              disabled={updateQty.isPending || item.quantity >= item.inventory}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="font-medium text-sm">
              {centsToDollars(item.priceCents)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {centsToDollars(item.priceCents)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
