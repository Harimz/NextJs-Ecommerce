"use server";

import { cookies } from "next/headers";

const CART_COOKIE = "cart_id";

export const getCartIdCookie = async (): Promise<string | undefined> => {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value;
};

export const setCartIdCookie = async (cartId: string) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: CART_COOKIE,
    value: cartId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const clearCartIdCookie = async (): Promise<void> => {
  const store = await cookies();
  store.delete(CART_COOKIE);
};
