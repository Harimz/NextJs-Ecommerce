import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import { SuperJSON } from "superjson";

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return { session };
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  transformer: SuperJSON,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({
    ctx: {
      ...ctx,
      auth: ctx.session,
    },
  });
});

export const adminProtectedProcedure = protectedProcedure.use(
  ({ ctx, next }) => {
    if (ctx.auth.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }

    return next({ ctx: { ...ctx, auth: ctx.session } });
  },
);
