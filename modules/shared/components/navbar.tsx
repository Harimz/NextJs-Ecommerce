"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "../hooks/use-user";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserButton } from "@/modules/auth/ui/components/user-button";
import { UserButtonSkeleton } from "@/modules/auth/ui/skeletons/user-button-skeleton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartUiStore } from "@/modules/cart/ui/stores/cart-ui-store";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { user, isLoading } = useUser();
  const { open } = useCartUiStore();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const submit = () => {
    const q = query.trim();
    if (!q) router.push(`/products`);

    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="p-6 border-b-2 sticky top-0 z-50 bg-white dark:bg-muted">
      <div className="flex justify-between max-w-400 w-[95%] mx-auto">
        <div className="flex items-center gap-20">
          <Link href="/" passHref>
            <h1 className="font-bold text-xl">HTAILORS</h1>
          </Link>

          <div className="relative w-100 max-w-200 hidden md:block">
            <Input
              placeholder="Search..."
              className="pl-10 w-full"
              onChange={({ target }) => setQuery(target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Button
            size="icon"
            variant="outline"
            className={cn("rounded-full cursor-pointer")}
            onClick={() => open()}
          >
            <ShoppingCart />
          </Button>

          {!user && !isLoading && (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/sign-up" passHref>
                <Button
                  variant="outline"
                  className="cursor-pointer hidden md:block"
                >
                  Sign Up
                </Button>
              </Link>

              <Link href="/login" passHref>
                <Button variant="primary">Login</Button>
              </Link>
            </div>
          )}

          {isLoading && <UserButtonSkeleton />}

          {user && <UserButton />}
        </div>
      </div>
    </nav>
  );
};
