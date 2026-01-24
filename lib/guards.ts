import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const requireAdmin = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  return session;
};

export const requireAuth = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  return session;
};

export const requireNoAuth = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect("/");

  return session;
};
