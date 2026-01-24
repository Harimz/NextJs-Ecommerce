import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

export const isTRPCClientError = (
  error: unknown,
): error is TRPCClientError<AppRouter> => {
  return error instanceof TRPCClientError;
};

export const getDisplayErrorMessage = (error: unknown) => {
  let message = "Something went wrong. Please try again";

  if (isTRPCClientError(error)) {
    message = error.message || message;
  } else if (error instanceof Error) {
    message = error.message || message;
  }

  return message;
};

export function getTRPCCode(error: unknown) {
  return isTRPCClientError(error) ? error.data?.code : undefined;
}
