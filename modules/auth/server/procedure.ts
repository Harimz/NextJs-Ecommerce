import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { RegisterInput } from "../domain/schemas";
import z from "zod";
import { db } from "@/db";
import { user } from "@/db/schema";

export const AuthRouter = createTRPCRouter({
  createUser: baseProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {}),
});
