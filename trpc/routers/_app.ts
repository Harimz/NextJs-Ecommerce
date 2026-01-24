import { createTRPCRouter } from "../init";
import { adminRouter } from "@/modules/admin/server/router";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
