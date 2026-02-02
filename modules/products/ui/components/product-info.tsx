import React, { useEffect, useMemo, useState } from "react";
import { ProductDetails } from "../../../home/domains/product-schema";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const ProductInfo = ({ product }: { product: ProductDetails }) => {
  const colors = useMemo(() => {
    return Array.from(
      new Map(
        product.variants
          .filter((v) => v.colorHex)
          .map((v) => [
            v.colorHex as string,
            {
              colorHex: v.colorHex as string,
              colorName: v.colorName ?? null,
            },
          ]),
      ).values(),
    );
  }, [product.variants]);

  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(
    colors[0]?.colorHex ?? null,
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const variantsForColor = useMemo(() => {
    if (!selectedColorHex) return [];

    return product.variants.filter((v) => v.colorHex === selectedColorHex);
  }, [product.variants, selectedColorHex]);

  const sizesForColor = useMemo(() => {
    const list = Array.from(
      new Map(
        variantsForColor
          .filter((v) => v.sizeId)
          .map((v) => [
            v.sizeId as string,
            {
              sizeId: v.sizeId as string,
              sizeCode: v.sizeCode ?? null,
              sizeLabel: v.sizeLabel ?? null,
              sizeSort: v.sizeSort ?? 0,
              available: (v.active ?? true) && (v.inventory ?? 0) > 0,
              inventory: v.inventory ?? 0,
            },
          ]),
      ).values(),
    ).sort((a, b) => a.sizeSort - b.sizeSort);

    return list;
  }, [variantsForColor]);

  useEffect(() => {
    if (!sizesForColor.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSizeId(null);
      return;
    }

    if (
      selectedSizeId &&
      sizesForColor.some((s) => s.sizeId === selectedSizeId)
    ) {
      return;
    }

    const firstAvailable = sizesForColor.find((s) => s.available);
    setSelectedSizeId(firstAvailable?.sizeId ?? sizesForColor[0].sizeId);
  }, [sizesForColor, selectedSizeId]);

  const selectedVariant = useMemo(() => {
    if (!selectedColorHex) return null;

    const match = product.variants.find(
      (v) => v.colorHex === selectedColorHex && v.sizeId === selectedSizeId,
    );

    return match ?? null;
  }, [product.variants, selectedColorHex, selectedSizeId]);

  const selectedColorName =
    colors.find((c) => c.colorHex === selectedColorHex)?.colorName ?? null;

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground">{product.department}</p>

      <h1 className="font-bold text-xl sm:text-2xl md:text-4xl">
        {product.name}
      </h1>

      <div className="flex gap-1 items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4" />
        ))}
      </div>

      <h2 className="font-bold text-2xl">
        ${centsToDollars(product.minPriceCents)}
      </h2>

      <p className="text-muted-foreground text-xl mt-10">
        {product.description}
      </p>

      <Separator className="my-6" />

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Color</h2>

        <p className="text-muted-foreground">{selectedColorName}</p>
      </div>

      <div className="flex gap-3 items-center">
        {colors.map((c) => (
          <div
            key={c.colorHex}
            className={cn(
              "p-1 rounded-full border-4 border-transparent hover:border-custom-primary transition cursor-pointer",
              selectedColorHex === c.colorHex && "border-custom-primary",
            )}
            title={c.colorName ?? undefined}
            onClick={() => setSelectedColorHex(c.colorHex)}
          >
            <div
              className="rounded-full size-10"
              style={{ backgroundColor: c.colorHex ?? "" }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <h2 className="font-bold text-xl">Size</h2>

        <p className="text-custom-primary underline font-bold cursor-pointer">
          Size Guide
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-3">
        {sizesForColor.map((s) => (
          <Button
            key={s.sizeId}
            type="button"
            disabled={!s.available}
            onClick={() => setSelectedSizeId(s.sizeId)}
            variant="outline"
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition relative",
              selectedSizeId === s.sizeId
                ? "border-custom-primary bg-custom-primary/10"
                : "border-muted",
              s.available
                ? "hover:border-custom-primary"
                : "opacity-50 cursor-not-allowed",
            )}
          >
            {s.sizeCode ?? s.sizeLabel ?? "Size"}
            {!s.available && (
              <span className="pointer-events-none absolute inset-x-2 top-1/2 h-px bg-foreground/40" />
            )}
          </Button>
        ))}
      </div>

      <div className="mt-6 ">
        <h2 className="font-bold text-xl">Quantity</h2>

        <div className="flex gap-4 items-center mt-2">
          <Button
            variant="outline"
            size="icon"
            className="size-12"
            onClick={() =>
              setQuantity((state) => (state > 1 ? (state = state - 1) : state))
            }
          >
            <Minus />
          </Button>

          <p className="font-extralight text-4xl w-20 text-center">
            {quantity}
          </p>

          <Button
            variant="outline"
            size="icon"
            className="size-12"
            onClick={() => setQuantity((state) => (state = state + 1))}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <Button variant="primary" className="flex-1">
          Add to Cart
        </Button>

        <Button size="icon" variant="outline">
          <Heart />
        </Button>
      </div>

      <div className="pt-4 text-xs text-muted-foreground">
        Selected variant: {selectedVariant ? selectedVariant.id : "None"}
      </div>
    </div>
  );
};
