import { authClient } from "@/lib/auth-client";

export const useUser = () => {
  const session = authClient.useSession();
  const user = session.data?.user ?? null;

  const isLoading = session.isPending;
  const isAuthed = !!user;

  return {
    user,
    session: session.data ?? null,

    isLoading,
    isAuthed,

    status: isLoading
      ? "loading"
      : isAuthed
        ? "authenticated"
        : "unauthenticated",

    error: session.error ?? null,
    refetch: session.refetch,
  };
};
