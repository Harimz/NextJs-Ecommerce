"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="mx-auto w-[95%]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">
            Join the HTailors Community
          </h2>
          <p className="mt-4 text-muted-foreground">
            Be the first to know about new arrivals, exclusive offers, and style
            inspiration. Plus, get 10% off your first order.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background"
            />
            <Button type="submit" variant="primary" className="font-medium">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </p>
        </div>
      </div>
    </section>
  );
};
