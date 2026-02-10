"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Facebook, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import React from "react";

const footerLinks = {
  shop: [
    { name: "Women", href: "/women" },
    { name: "Men", href: "/men" },
    { name: "New Arrivals", href: "/new" },
    { name: "Sale", href: "/sale" },
  ],
  help: [
    { name: "Customer Service", href: "/help" },
    { name: "Track Order", href: "/track" },
    { name: "Returns", href: "/returns" },
    { name: "Shipping", href: "/shipping" },
  ],
  about: [
    { name: "Our Story", href: "/about" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
};

export const Footer = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const current = (resolvedTheme ?? theme) as "light" | "dark" | undefined;

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-400 w-[95%] py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-semibold tracking-tight">
                HTAILORS
              </span>
            </Link>

            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Timeless pieces crafted with care. Subscribe for exclusive access
              to new collections and special offers.
            </p>

            <form className="flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background"
              />
              <Button variant="primary" type="submit" className="shrink-0">
                Subscribe
              </Button>
            </form>

            <div className="flex items-center gap-6 mt-6">
              {!mounted ? (
                // Neutral placeholder to avoid SSR/client mismatch
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    disabled
                  >
                    <Sun />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    disabled
                  >
                    <Moon />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className={cn(
                      "rounded-full",
                      current === "light" && "bg-muted",
                    )}
                    onClick={() => setTheme("light")}
                    type="button"
                  >
                    <Sun />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    className={cn(
                      "rounded-full",
                      current === "dark" && "bg-muted",
                    )}
                    onClick={() => setTheme("dark")}
                    type="button"
                  >
                    <Moon />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 HTailors. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
