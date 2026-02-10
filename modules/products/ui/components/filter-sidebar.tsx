"use client";

import { useEffect, useState } from "react";
import { Department, ProductType } from "../data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useProductsFilter } from "../hooks/use-products-filter";
import { useDebouncedValue } from "@/modules/shared/hooks/use-debounced-value";
import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const departments: { value: Department; label: string }[] = [
  { value: "WOMEN", label: "Women" },
  { value: "MEN", label: "Men" },
  { value: "KIDS", label: "Kids" },
  { value: "UNISEX", label: "Unisex" },
];

const productTypes: { value: ProductType; label: string }[] = [
  { value: "SHIRT", label: "Shirts" },
  { value: "PANTS", label: "Pants" },
  { value: "DRESS", label: "Dresses" },
  { value: "OUTERWEAR", label: "Outerwear" },
  { value: "SKIRT", label: "Skirts" },
  { value: "SHORTS", label: "Shorts" },
  { value: "SWEATER", label: "Sweaters" },
  { value: "HOODIE", label: "Hoodies" },
  { value: "ACCESSORY", label: "Accessories" },
];

const MIN = 0;
const MAX = 50000;
const STEP = 1000;

export const FilterSidebar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [openSections, setOpenSections] = useState({
    department: true,
    type: true,
    price: true,
  });
  const { filters, setFilters } = useProductsFilter();

  const [localRange, setLocalRange] = useState<[number, number]>([
    filters.minPrice,
    filters.maxPrice,
  ]);

  const debouncedRange = useDebouncedValue(localRange, 250);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalRange([filters.minPrice, filters.maxPrice]);
  }, [filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    if (
      debouncedRange[0] !== filters.minPrice ||
      debouncedRange[1] !== filters.maxPrice
    ) {
      setFilters({
        minPrice: debouncedRange[0],
        maxPrice: debouncedRange[1],
      });
    }
  }, [debouncedRange, filters.minPrice, filters.maxPrice, setFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const q = query.trim();
    if (!q) router.push(`/products`);

    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <aside className="space-y-6 w-full lg:w-64 lg:block">
      <form onSubmit={handleSubmit}>
        <Input
          value={query}
          onChange={({ target }) => setQuery(target.value)}
          placeholder="Search product..."
        />
      </form>

      <Collapsible
        open={openSections.department}
        onOpenChange={(open) =>
          setOpenSections((s) => ({ ...s, department: open }))
        }
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
          Department
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.department ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          {departments.map((dept) => (
            <div key={dept.value} className="flex items-center space-x-3">
              <Checkbox
                checked={filters.departments.includes(dept.value)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...filters.departments, dept.value]
                    : filters.departments.filter((d) => d !== dept.value);

                  setFilters({ departments: next });
                }}
                id={`dept-${dept.value}`}
              />
              <Label
                htmlFor={`dept-${dept.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {dept.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <div className="border-t" />
      <Collapsible
        open={openSections.type}
        onOpenChange={(open) => setOpenSections((s) => ({ ...s, type: open }))}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
          Category
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.type ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          {productTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-3">
              <Checkbox
                id={`type-${type.value}`}
                checked={filters.productTypes.includes(type.value)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...filters.productTypes, type.value]
                    : filters.productTypes.filter((d) => d !== type.value);

                  setFilters({ productTypes: next });
                }}
              />
              <Label
                htmlFor={`type-${type.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <div className="border-t" />
      <Collapsible
        open={openSections.price}
        onOpenChange={(open) => setOpenSections((s) => ({ ...s, price: open }))}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
          Price Range
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <Slider
            min={MIN}
            max={MAX}
            step={STEP}
            value={localRange}
            onValueChange={(v) => setLocalRange([v[0]!, v[1]!])}
            className="mb-4"
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${centsToDollars(localRange[0])}</span>
            <span>${centsToDollars(localRange[1])}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div className="border-t" />
      <div className="flex items-center justify-between py-2">
        <Label htmlFor="on-sale" className="text-sm font-medium cursor-pointer">
          On Sale
        </Label>
        <Switch
          id="on-sale"
          checked={filters.onSale}
          onCheckedChange={(v) => setFilters({ onSale: v })}
        />
      </div>
    </aside>
  );
};
