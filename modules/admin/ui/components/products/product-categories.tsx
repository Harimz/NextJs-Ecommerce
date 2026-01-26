import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { CategoryNode } from "@/modules/admin/domains/categories-schemas";
import { CreateProductFormValues } from "@/modules/admin/domains/products-schemas";
import { Tags, X } from "lucide-react";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type FlatCategory = {
  id: string;
  name: string;
  depth: number;
};

function flattenCategories(nodes: CategoryNode[], depth = 0): FlatCategory[] {
  const out: FlatCategory[] = [];

  for (const n of nodes) {
    out.push({ id: n.id, name: n.name, depth });
    if (n.children?.length) {
      out.push(...flattenCategories(n.children, depth + 1));
    }
  }

  return out;
}

export const ProductCategories = ({
  categories,
}: {
  categories: CategoryNode[];
}) => {
  const { control } = useFormContext<CreateProductFormValues>();

  const flat = React.useMemo(() => flattenCategories(categories), [categories]);

  return (
    <div className="bg-muted p-6 rounded-md border">
      <div className="flex items-center gap-2 mb-4">
        <Tags className="w-5 h-5 text-custom-primary" />
        <h1 className="font-bold text-xl">Categories</h1>
      </div>

      <Controller
        name="categoryIds"
        control={control}
        render={({ field, fieldState }) => {
          const selected = field.value ?? [];

          const toggleCategory = (id: string) => {
            const next = selected.includes(id)
              ? selected.filter((x) => x !== id)
              : [...selected, id];

            field.onChange(next);
          };

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Select categories</FieldLabel>

              <div className="flex flex-wrap gap-4]">
                {flat.map((c) => {
                  const isSelected = selected.includes(c.id);

                  return (
                    <Badge
                      key={c.id}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        isSelected ? "bg-custom-primary" : "",
                      )}
                      onClick={() => toggleCategory(c.id)}
                      title={c.depth ? "Subcategory" : "Category"}
                    >
                      {c.name}
                      {isSelected && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  );
                })}
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    </div>
  );
};
