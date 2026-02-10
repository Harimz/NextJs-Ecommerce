import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useCart = () => {
  const trpc = useTRPC();

  const query = useSuspenseQuery(trpc.cart.getMyCart.queryOptions());

  const { items, subtotalCents } = query.data;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...query,
    items,
    subtotalCents,
    totalItems,
    isPending: query.isPending,
  };
};
