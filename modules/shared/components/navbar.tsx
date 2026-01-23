"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useUser } from "../hooks/use-user";
import Link from "next/link";
import { Moon, Search, ShoppingCart, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { UserButton } from "@/modules/auth/ui/components/user-button";

export const Navbar = () => {
  const { user } = useUser();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <nav className="p-6">
      <div className="flex justify-between mx-auto w-640">
        <div className="flex items-center gap-20">
          <h1 className="font-bold text-xl">Sterling</h1>

          <div className="relative w-200">
            <Input placeholder="Search..." className="pl-10 w-full" />
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
          </div>
        </div>

        <div className="flex items-center gap-10">
          {mounted && (
            <Button
              size="icon"
              className="rounded-full bg-transparent text-black dark:text-white border cursor-pointer"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>
          )}

          {
            <Button
              size="icon"
              variant="outline"
              className="rounded-full cursor-pointer"
            >
              <ShoppingCart />
            </Button>
          }

          {!user && (
            <div className="flex items-center gap-6">
              <Link href="/sign-up" passHref>
                <Button variant="outline" className="cursor-pointer">
                  Sign Up
                </Button>
              </Link>

              <Link href="/login" passHref>
                <Button variant="primary">Login</Button>
              </Link>
            </div>
          )}

          {user && <UserButton />}
        </div>
      </div>
    </nav>
  );
};
