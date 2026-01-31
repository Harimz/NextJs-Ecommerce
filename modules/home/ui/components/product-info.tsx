import React from "react";
import { ProductDetails } from "../../domains/product-schema";
import { Star } from "lucide-react";
import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { Separator } from "@/components/ui/separator";

export const ProductInfo = ({ product }: { product: ProductDetails }) => {
  const uniqueColors = Array.from(
    new Map(
      product.variants
        .filter((v) => v.colorHex)
        .map((v) => [
          v.colorHex,
          {
            colorHex: v.colorHex,
            colorName: v.colorName,
          },
        ]),
    ).values(),
  );
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

      <Separator />

      <h2 className="font-semibold text-xl text-muted-foreground">Color</h2>

      <div className="flex gap-3">
        {uniqueColors.map((c) => (
          <button
            key={c.colorHex}
            className="p-1 rounded-full border-2 border-transparent hover:border-custom-primary transition"
            title={c.colorName ?? undefined}
          >
            <div
              className="rounded-full size-10"
              style={{ backgroundColor: c.colorHex ?? "" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
