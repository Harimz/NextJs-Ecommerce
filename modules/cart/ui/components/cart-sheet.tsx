"use client";

import React, { Suspense } from "react";
import { useCartUiStore } from "../stores/cart-ui-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ErrorBoundary } from "react-error-boundary";
import { useCart } from "../../api/cart-queries";
import { CartItemRow } from "./cart-item-row";
import { Separator } from "@/components/ui/separator";
import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { CartSheetSkeleton } from "../skeletons/cart-sheet-skeleton";

export const CartSheet = () => {
  const { isOpen, close, toggle } = useCartUiStore();

  return (
    <Sheet open={isOpen} onOpenChange={toggle}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg p-6">
        <SheetHeader className="space-y-2.5 pb-6">
          <SheetTitle className="flex items-center gap-2 font-display text-xl">
            <ShoppingBag className="h-5 w-5" />
            Your Bag
          </SheetTitle>
        </SheetHeader>

        {isOpen ? (
          <Suspense fallback={<CartSheetSkeleton />}>
            <ErrorBoundary fallback={<div>Failed to load cart</div>}>
              <CartSheetBody onClose={close} />
            </ErrorBoundary>
          </Suspense>
        ) : (
          <div className="flex-1" />
        )}
      </SheetContent>
    </Sheet>
  );
};

function CartSheetBody({ onClose }: { onClose: () => void }) {
  const { items, totalItems, subtotalCents, isPending } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">Your bag is empty</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button onClick={onClose} variant="primary" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="pb-2 text-sm text-muted-foreground">
        {totalItems} item{totalItems === 1 ? "" : "s"}
      </div>

      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
      </ScrollArea>

      <div className="pt-6 space-y-4">
        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{centsToDollars(subtotalCents)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{subtotalCents >= 10000 ? "Free" : centsToDollars(995)}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>
              {centsToDollars(
                subtotalCents >= 10000 ? subtotalCents : subtotalCents + 995,
              )}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full" size="lg" asChild variant="primary">
            <Link href="/checkout" onClick={onClose}>
              Checkout
            </Link>
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Continue Shopping
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Free shipping on orders over $100
        </p>
      </div>
    </>
  );
}
