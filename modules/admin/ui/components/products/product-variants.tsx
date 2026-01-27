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

const mockSizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface Props {
  colors: Color[];
  sizes: Size[];
}

export const ProductVariants = ({ colors, sizes }: Props) => {
  const [variants, setVariants] = useState([
    {
      id: 1,
      size: "M",
      color: "Black",
      colorHex: "#000000",
      price: "29.99",
      comparePrice: "39.99",
      inventory: "100",
      sku: "TSH-BLK-M",
    },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        size: "",
        color: "",
        colorHex: "",
        price: "",
        comparePrice: "",
        inventory: "",
        sku: "",
      },
    ]);
  };

  const updateVariant = (id: number, field: string, value: string) => {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          if (field === "color") {
            const colorData = colors.find(
              (c) => c.name.toLowerCase() === value,
            );
            return {
              ...v,
              color: colorData?.name || value,
              colorHex: colorData?.hex || "",
            };
          }
          return { ...v, [field]: value };
        }
        return v;
      }),
    );
  };

  const removeVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="p-6 border bg-muted rounded-md">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-custom-primary" />
        <h1 className="font-bold text-xl">Product Variants</h1>
      </div>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={variant.id}
            className="p-4 bg-muted/50 rounded-lg border border-border animate-fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">
                Variant {index + 1}
              </span>
              {variants.length > 1 && (
                <button
                  onClick={() => removeVariant(variant.id)}
                  className="p-1 hover:bg-destructive/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  Size
                </Label>
                <Select
                  value={variant.size}
                  onValueChange={(value) =>
                    updateVariant(variant.id, "size", value)
                  }
                >
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  Color
                </Label>
                <Select
                  value={variant.color?.toLowerCase()}
                  onValueChange={(value) =>
                    updateVariant(variant.id, "color", value)
                  }
                >
                  <SelectTrigger className="h-9 text-sm w-full">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem
                        key={color.name}
                        value={color.name.toLowerCase()}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: `${color.hex}` }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Price
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(variant.id, "price", e.target.value)
                  }
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="admin-label">Compare Price</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-9 text-sm"
                  value={variant.comparePrice}
                  onChange={(e) =>
                    updateVariant(variant.id, "comparePrice", e.target.value)
                  }
                />
              </div>
              <div>
                <Label className="admin-label">SKU</Label>
                <Input
                  placeholder="SKU-001"
                  className="h-9 text-sm"
                  value={variant.sku}
                  onChange={(e) =>
                    updateVariant(variant.id, "sku", e.target.value)
                  }
                />
              </div>
              <div>
                <Label className="admin-label">Inventory</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={variant.inventory}
                  onChange={(e) =>
                    updateVariant(variant.id, "inventory", e.target.value)
                  }
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
        <Button
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
