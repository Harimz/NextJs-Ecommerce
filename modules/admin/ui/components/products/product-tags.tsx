import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Tag as TagIcon, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import type { Tag } from "@/modules/admin/domains/tags-schema";
import type { CreateProductFormValues } from "@/modules/admin/domains/products-schemas";

export const ProductTags = ({ tags }: { tags: Tag[] }) => {
  const { control } = useFormContext<CreateProductFormValues>();

  return (
    <div className="bg-muted p-6 rounded-md border">
      <div className="flex items-center gap-2 mb-4">
        <TagIcon className="w-5 h-5 text-custom-primary" />
        <h1 className="font-bold text-xl">Tags</h1>
      </div>

      <Controller
        name="tagIds"
        control={control}
        render={({ field, fieldState }) => {
          const selected = field.value ?? [];

          const toggleTag = (id: string) => {
            field.onChange(
              selected.includes(id)
                ? selected.filter((x) => x !== id)
                : [...selected, id],
            );
          };

          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Select tags</FieldLabel>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selected.includes(tag.id);

                  return (
                    <Badge
                      key={tag.id}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        isSelected ? "bg-custom-primary" : "",
                      )}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
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
