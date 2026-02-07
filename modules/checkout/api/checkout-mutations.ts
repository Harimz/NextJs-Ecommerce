import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateCheckoutSession = () => {
  const trpc = useTRPC();
  const router = useRouter();

  return useMutation(
    trpc.checkout.createCheckoutSession.mutationOptions({
      onSuccess: (data) => {
        if (!data.checkoutUrl) return;

        router.push(data.checkoutUrl);
      },
    }),
  );
};
