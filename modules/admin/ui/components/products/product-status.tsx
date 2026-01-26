import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreateProductFormValues } from "@/modules/admin/domains/products-schemas";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export const ProductStatus = () => {
  const { control } = useFormContext<CreateProductFormValues>();

  return (
    <div className="bg-muted rounded-md p-6 border">
      <div className="text-xl font-bold mb-4">Status</div>

      <Controller
        name="active"
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Active</p>
              <p className="text-xs text-muted-foreground">
                Product visible to customers
              </p>
            </div>

            <Switch
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
          </div>
        )}
      />

      <div className="mt-4 pt-4 border-t border-border">
        <Controller
          name="featuredRank"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Featured Rank</FieldLabel>

              <Input
                type="number"
                placeholder="0"
                value={typeof field.value === "number" ? field.value : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  field.onChange(v === "" ? null : Number(v));
                }}
                aria-invalid={fieldState.invalid}
              />

              <p className="text-xs text-muted-foreground mt-1">
                Higher values appear first in featured sections
              </p>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
};
