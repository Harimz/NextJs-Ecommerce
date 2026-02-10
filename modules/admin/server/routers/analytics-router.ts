import { db } from "@/db";
import {
  categories,
  orderItems,
  orders,
  productCategories,
  products,
} from "@/db/schema";
import { adminProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import z from "zod";

const countedStatuses = ["paid", "fulfilled"] as const;

export const analyticsRouter = createTRPCRouter({
  kpis: adminProtectedProcedure
    .input(z.object({ days: z.number().min(1).max(365).default(30) }))
    .query(async ({ input }) => {
      const since = new Date();
      since.setDate(since.getDate() - input.days);

      const [row] = await db
        .select({
          revenueCents: sql<number>`coalesce(sum(${orders.totalCents}), 0)::int`,
          ordersCount: sql<number>`count(*)::int`,
        })
        .from(orders)
        .where(
          and(
            inArray(orders.status, countedStatuses),
            gte(orders.createdAt, since),
          ),
        );

      const [unitsRow] = await db
        .select({
          unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
        })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            inArray(orders.status, countedStatuses),
            gte(orders.createdAt, since),
          ),
        );

      const revenueCents = row?.revenueCents ?? 0;
      const ordersCount = row?.ordersCount ?? 0;
      const unitsSold = unitsRow?.unitsSold ?? 0;

      return {
        revenueCents,
        ordersCount,
        unitsSold,
        aovCents: ordersCount ? Math.round(revenueCents / ordersCount) : 0,
      };
    }),

  revenueOverview: adminProtectedProcedure
    .input(z.object({ days: z.number().min(7).max(365).default(30) }))
    .query(async ({ input }) => {
      const since = new Date();
      since.setDate(since.getDate() - input.days);

      const day = sql<string>`date_trunc('day', ${orders.createdAt})::date`;

      const rows = await db
        .select({
          date: day,
          revenueCents: sql<number>`coalesce(sum(${orders.totalCents}), 0)::int`,
          ordersCount: sql<number>`count(*)::int`,
        })
        .from(orders)
        .where(
          and(
            inArray(orders.status, countedStatuses),
            gte(orders.createdAt, since),
          ),
        )
        .groupBy(day)
        .orderBy(day);

      return { points: rows };
    }),

  recentOrders: adminProtectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id: orders.id,
          createdAt: orders.createdAt,
          status: orders.status,
          totalCents: orders.totalCents,
          email: orders.email,
        })
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(input.limit);

      return { items: rows };
    }),

  topProducts: adminProtectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
        limit: z.number().min(1).max(20).default(10),
      }),
    )
    .query(async ({ input }) => {
      const since = new Date();
      since.setDate(since.getDate() - input.days);

      const rows = await db
        .select({
          productId: products.id,
          name: products.name,
          unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
          revenueCents: sql<number>`coalesce(sum(${orderItems.lineTotalCents}), 0)::int`,
        })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(
          and(
            inArray(orders.status, countedStatuses),
            gte(orders.createdAt, since),
          ),
        )
        .groupBy(products.id, products.name)
        .orderBy(sql`coalesce(sum(${orderItems.lineTotalCents}), 0) desc`)
        .limit(input.limit);

      return { items: rows };
    }),

  salesByDepartment: adminProtectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
      }),
    )
    .query(async ({ input }) => {
      const since = new Date();
      since.setDate(since.getDate() - input.days);

      const rows = await db
        .select({
          department: products.department,
          unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
          revenueCents: sql<number>`coalesce(sum(${orderItems.lineTotalCents}), 0)::int`,
        })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(
          and(
            inArray(orders.status, countedStatuses),
            gte(orders.createdAt, since),
          ),
        )
        .groupBy(products.department)
        .orderBy(sql`coalesce(sum(${orderItems.lineTotalCents}), 0) desc`);

      return { items: rows };
    }),
});
