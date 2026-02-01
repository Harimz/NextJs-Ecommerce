"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { categories } from "../data/categories";
import Link from "next/link";
import Image from "next/image";

export const CategoryGrid = () => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto">
        <h1 className="font-display font-bold text-xl md:text-4xl text-center mb-8">
          Shop by Category
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="relative group aspect-3/4 overflow-hidden rounded-lg bg-muted"
            >
              {!loadedImages[category.slug] && (
                <div className="absolute inset-0 skeleton-shimmer" />
              )}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 group-hover:scale-105",
                  loadedImages[category.slug] ? "opacity-100" : "opacity-0",
                )}
                onLoad={() =>
                  setLoadedImages((prev) => ({
                    ...prev,
                    [category.slug]: true,
                  }))
                }
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <h3 className="font-display text-lg md:text-xl font-semibold text-white">
                  {category.name}
                </h3>
                <span className="text-sm text-white/80 mt-1 inline-block group-hover:underline">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
