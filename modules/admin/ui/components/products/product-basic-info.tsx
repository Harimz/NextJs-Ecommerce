import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateProductFormValues } from "@/modules/admin/domains/products-schemas";
import { Box } from "lucide-react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const PRODUCT_TYPES = [
  "SHIRT",
  "PANTS",
  "DRESS",
  "OUTERWEAR",
  "SKIRT",
  "SHORTS",
  "SWEATER",
  "HOODIE",
  "ACCESSORY",
] as const;

const DEPARTMENTS = ["MEN", "WOMEN", "KIDS", "UNISEX"] as const;

export const ProductBasicInfo = () => {
  const { control } = useFormContext<CreateProductFormValues>();

  return (
    <section className="space-y-4 bg-muted p-6 border rounded-md">
      <div className="flex gap-4 items-center">
        <Box className="size-6 text-custom-primary" />
        <h1 className="font-bold text-xl">Basic Information</h1>
      </div>

      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Product Name</FieldLabel>

            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="e.g., Classic Cotton T-Shirt"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Controller
            name="slug"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Slug</FieldLabel>

                <Input
                  {...field}
                  value={(field.value ?? "") as string}
                  aria-invalid={fieldState.invalid}
                  placeholder="classic-cotton-t-shirt"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex-1">
          <Controller
            name="productType"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Product Type</FieldLabel>

                <Select
                  value={field.value ?? "none"}
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? null : val)
                  }
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    {PRODUCT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      <Controller
        name="department"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Department</FieldLabel>

            <Select
              value={field.value ?? "none"}
              onValueChange={(val) =>
                field.onChange(val === "none" ? null : val)
              }
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>

              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Description</FieldLabel>

            <Textarea
              className="min-h-30 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none"
              aria-invalid={fieldState.invalid}
              placeholder="Describe the product (materials, fit, features, care instructions, etc.)"
              value={(field.value ?? "") as string}
              onChange={(e) => field.onChange(e.target.value)}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </section>
  );
};
