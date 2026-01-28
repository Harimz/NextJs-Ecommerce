import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Layers, Palette, Plus, Ruler, X } from "lucide-react";
import { Color } from "@/modules/admin/domains/colors-schema";
import { Size } from "@/modules/admin/domains/sizes-schema";
import { CreateProductFormValues } from "@/modules/admin/domains/products-schemas";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import {
  centsToDollars,
  dollarsToCents,
  getSizeCategory,
} from "../../utils/helpers";

interface Props {
  colors: Color[];
  sizes: Size[];
}

export const ProductVariants = ({ colors, sizes }: Props) => {
  const { control } = useFormContext<CreateProductFormValues>();

  const productType = useWatch({ control, name: "productType" });
  const sizeCategory = getSizeCategory(productType);

  const sizeOptions = sizes
    .filter((s) => s.category === sizeCategory)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
    keyName: "key",
  });

  const addVariant = () => {
    append({
      sku: null,
      active: true,
      sizeId: null,
      colorId: null,
      priceCents: 0,
      compareAtPriceCents: null,
      inventory: 0,
    });
  };

  return (
    <div className="p-6 border bg-muted rounded-md">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-custom-primary" />
        <h1 className="font-bold text-xl">Product Variants</h1>
      </div>

      <div className="space-y-4">
        {fields.map((variant, index) => {
          const showSize = sizeCategory !== "ONE_SIZE";

          return (
            <div
              key={variant.key}
              className="p-4 bg-muted/50 rounded-lg border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">
                  Variant {index + 1}
                </span>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {showSize && (
                  <div>
                    <Label className="flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      Size
                    </Label>

                    <Controller
                      control={control}
                      name={`variants.${index}.sizeId`}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full h-9 text-sm">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {sizeOptions.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}

                <div>
                  <Label className="flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    Color
                  </Label>

                  <Controller
                    control={control}
                    name={`variants.${index}.colorId`}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 text-sm w-full">
                          <SelectValue placeholder="Color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{
                                    backgroundColor: c.hex ?? "transparent",
                                  }}
                                />
                                {c.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Price
                  </Label>

                  <Controller
                    control={control}
                    name={`variants.${index}.priceCents`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="h-9 text-sm"
                        value={centsToDollars(field.value as number)}
                        onChange={(e) =>
                          field.onChange(dollarsToCents(e.target.value))
                        }
                      />
                    )}
                  />
                </div>

                <div>
                  <Label className="admin-label">Compare Price</Label>

                  <Controller
                    control={control}
                    name={`variants.${index}.compareAtPriceCents`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="h-9 text-sm"
                        value={centsToDollars(field.value as number)}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (!raw) return field.onChange(null);
                          field.onChange(dollarsToCents(raw));
                        }}
                      />
                    )}
                  />
                </div>

                <div>
                  <Label className="admin-label">SKU</Label>
                  <Controller
                    control={control}
                    name={`variants.${index}.sku`}
                    render={({ field }) => (
                      <Input
                        placeholder="SKU-001"
                        className="h-9 text-sm"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    )}
                  />
                </div>

                <div>
                  <Label className="admin-label">Inventory</Label>
                  <Controller
                    control={control}
                    name={`variants.${index}.inventory`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="h-9 text-sm"
                        value={(field.value as number) ?? 0}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value || 0))
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={addVariant}
          className="w-full border-dashed hover:border-primary hover:text-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>
    </div>
  );
};
