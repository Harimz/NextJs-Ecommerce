"use client";

import { useState } from "react";
import { Department, ProductType } from "../data";
import { Separator } from "@/components/ui/separator";
import { FilterToolbar } from "../components/filter-toolbar";
import { FilterSidebar } from "../components/filter-sidebar";
import { FilteredProductsSection } from "../sections/filtered-products-section";

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

export interface FilterState {
  departments: Department[];
  productTypes: ProductType[];
  priceRange: [number, number];
  onSale: boolean;
}

export const ProductsView = () => {
  const [filters, setFilters] = useState<FilterState>({
    departments: [],
    productTypes: [],
    priceRange: [0, 50000],
    onSale: false,
  });

  return (
    <main className="min-h-screen relative mx-auto max-w-400 w-[90%] mb-20">
      <div className="container py-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          All Products
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our complete collection of premium clothing and accessories
        </p>
      </div>

      <Separator />

      <FilterToolbar />

      <div className="flex gap-10">
        <div className="hidden lg:block">
          <h1 className="my-4 font-bold text-2xl">Filters</h1>
          <FilterSidebar />
        </div>

        <FilteredProductsSection />
      </div>
    </main>
  );
};
