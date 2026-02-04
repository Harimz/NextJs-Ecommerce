import { FeaturedProduct } from "../../../home/domains/product-schema";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { FilteredProduct } from "../../domains/product-reviews-schema";

export const ProductCard = ({
  product,
}: {
  product: FeaturedProduct | FilteredProduct;
}) => {
  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-muted w-full">
          <Image
            src={product.image?.url ?? ""}
            alt={product.image?.alt ?? ""}
            fill
            className="object-cover duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

            <Button
              variant="secondary"
              className="w-full bg-background/95 backdrop-blur-sm hover:bg-background font-medium"
              onClick={(e) => {
                e.preventDefault();
                // Quick add logic would go here
              }}
            >
              Quick Add
            </Button>
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-1">
        <Link passHref href={`/product/${product.slug}`}>
          <h3 className="font-medium text-sm leading-tight hover:text-custom-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground capitalize">
          {product.department.toLowerCase()}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            ${centsToDollars(product.minPriceCents)}
          </span>
        </div>
      </div>
    </div>
  );
};
