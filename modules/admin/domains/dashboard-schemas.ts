import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type AdminDashboardKPIOutput =
  RouterOutputs["admin"]["analytics"]["kpis"];

export type AdminRevenueOutput =
  RouterOutputs["admin"]["analytics"]["revenueOverview"];
