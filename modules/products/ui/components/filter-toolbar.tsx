import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import React, { useState } from "react";
import { FilterSidebar } from "./filter-sidebar";
import { useProductsFilter } from "../hooks/use-products-filter";

export const FilterToolbar = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { filters, setFilters } = useProductsFilter();

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm z-10">
      <div className="py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6 border-b">
                <h2 className="font-display text-lg font-semibold">Filters</h2>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)]">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>

          <span className="text-sm text-muted-foreground">0 products</span>

          {/* <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
            <X className="h-3 w-3 ml-1" />
          </Button> */}
        </div>

        <div className="flex items-center gap-3">
          <Select onValueChange={(v) => setFilters({ sort: v })}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
