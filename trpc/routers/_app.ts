import { homeRouter } from "@/modules/home/server";
import { createTRPCRouter } from "../init";
import { adminRouter } from "@/modules/admin/server";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  home: homeRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
