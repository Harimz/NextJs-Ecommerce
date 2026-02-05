import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartUiStore } from "../ui/stores/cart-ui-store";
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type GetMyCartOutput = RouterOutputs["cart"]["getMyCart"];

export type AddToCartOptimistic = {
  priceCents: number;
  productId: string;
  productName: string;
  productSlug: string;
  compareAtPriceCents?: number | null;
  inventory?: number;
  size?: string | null;
  color?: string | null;
  imageUrl?: string | null;
};

export function useAddToCart(optimistic?: AddToCartOptimistic) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { open, setLastAdded } = useCartUiStore();

  return useMutation(
    trpc.cart.addItem.mutationOptions({
      onMutate: async ({ variantId, quantity = 1 }) => {
        setLastAdded(variantId);
        open();

        await queryClient.cancelQueries({
          queryKey: trpc.cart.getMyCart.queryKey(),
        });

        const previous = queryClient.getQueryData<GetMyCartOutput>(
          trpc.cart.getMyCart.queryKey(),
        );

        if (!previous || !optimistic) {
          return { previous };
        }

        queryClient.setQueryData<GetMyCartOutput>(
          trpc.cart.getMyCart.queryKey(),
          {
            ...previous,
            items: upsertOptimisticItem(previous.items, {
              variantId,
              quantity,
              optimistic,
            }),
            subtotalCents:
              previous.subtotalCents + optimistic.priceCents * quantity,
          },
        );

        return { previous };
      },

      onError: (_err, _vars, ctx) => {
        if (ctx?.previous) {
          queryClient.setQueryData(
            trpc.cart.getMyCart.queryKey(),
            ctx.previous,
          );
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.cart.getMyCart.queryKey(),
        });
      },
    }),
  );
}

export function useUpdateCartItemQuantity() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const queryKey = trpc.cart.getMyCart.queryKey();

  return useMutation(
    trpc.cart.updateItemQty.mutationOptions({
      onMutate: async ({ variantId, quantity }) => {
        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<GetMyCartOutput>(queryKey);
        if (!previous) return { previous };

        const nextItems = previous.items
          .map((it) => (it.variantId === variantId ? { ...it, quantity } : it))
          .filter((it) => it.quantity > 0);

        const subtotalCents = nextItems.reduce(
          (acc, it) => acc + it.priceCents * it.quantity,
          0,
        );

        queryClient.setQueryData<GetMyCartOutput>(queryKey, {
          ...previous,
          items: nextItems,
          subtotalCents,
        });

        return { previous };
      },

      onError: (_err, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    }),
  );
}

export function useRemoveCartItem() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const queryKey = trpc.cart.getMyCart.queryKey();

  return useMutation(
    trpc.cart.removeItems.mutationOptions({
      onMutate: async ({ variantId }) => {
        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<GetMyCartOutput>(queryKey);
        if (!previous) return { previous };

        const nextItems = previous.items.filter(
          (it) => it.variantId !== variantId,
        );

        const subtotalCents = nextItems.reduce(
          (acc, it) => acc + it.priceCents * it.quantity,
          0,
        );

        queryClient.setQueryData<GetMyCartOutput>(queryKey, {
          ...previous,
          items: nextItems,
          subtotalCents,
        });

        return { previous };
      },

      onError: (_err, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    }),
  );
}

export function useClearCart() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const queryKey = trpc.cart.getMyCart.queryKey();

  return useMutation(
    trpc.cart.clearCart.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<GetMyCartOutput>(queryKey);
        if (!previous) return { previous };

        queryClient.setQueryData<GetMyCartOutput>(queryKey, {
          ...previous,
          items: [],
          subtotalCents: 0,
        });

        return { previous };
      },

      onError: (_err, _vars, ctx) => {
        if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    }),
  );
}

function upsertOptimisticItem(
  items: GetMyCartOutput["items"],
  vars: {
    variantId: string;
    quantity: number;
    optimistic: AddToCartOptimistic;
  },
): GetMyCartOutput["items"] {
  const idx = items.findIndex((i) => i.variantId === vars.variantId);

  if (idx !== -1) {
    const updated = [...items];
    updated[idx] = {
      ...updated[idx]!,
      quantity: updated[idx]!.quantity + vars.quantity,
    };
    return updated;
  }

  return [
    ...items,
    {
      id: `optimistic-${vars.variantId}`,
      variantId: vars.variantId,
      quantity: vars.quantity,

      priceCents: vars.optimistic.priceCents,
      compareAtPriceCents: vars.optimistic.compareAtPriceCents ?? null,
      inventory: vars.optimistic.inventory ?? 999999,

      productId: vars.optimistic.productId,
      productName: vars.optimistic.productName,
      productSlug: vars.optimistic.productSlug,

      size: vars.optimistic.size ?? null,
      color: vars.optimistic.color ?? null,

      imageUrl: vars.optimistic.imageUrl ?? null,
    },
  ];
}
