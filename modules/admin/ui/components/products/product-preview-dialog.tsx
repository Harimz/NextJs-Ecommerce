import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Color } from "@/modules/admin/domains/colors-schema";
import { CreateProductFormValues } from "@/modules/admin/domains/products-schemas";
import { Size } from "@/modules/admin/domains/sizes-schema";

import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface Props {
  colors: Color[];
  sizes: Size[];
}

export const ProductPreviewDialog = ({ colors, sizes }: Props) => {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext<CreateProductFormValues>();
  const [variantIndex, setVariantIndex] = useState(0);

  const values = useWatch({ control });

  const images = values?.images ?? [];
  const variants = values?.variants ?? [];
  const selectedVariant = variants[variantIndex] ?? variants[0];

  const colorName = useMemo(() => {
    if (!colors || !selectedVariant?.colorId) return null;

    return colors.find((c) => c.id === selectedVariant.colorId)?.name ?? null;
  }, [colors, selectedVariant.colorId]);

  const sizeName = useMemo(() => {
    if (!sizes || !selectedVariant?.sizeId) return null;

    return sizes.find((s) => s.id === selectedVariant.sizeId)?.label ?? null;
  }, [sizes, selectedVariant?.sizeId]);

  const formatMoney = (cents?: number | null) => {
    if (!cents || cents <= 0) return "—";
    return (cents / 100).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer w-full"
        >
          <Eye /> Preview
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
              <div className="relative h-105 w-full">
                {images.length > 0 ? (
                  <Carousel className="h-full w-full">
                    <CarouselContent className="h-full">
                      {images.map((img) => (
                        <CarouselItem key={img.r2Key} className="h-full">
                          <div className="relative h-105 w-full">
                            <Image
                              src={img.url ?? ""}
                              alt={img.alt ?? "Product image"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    <CarouselPrevious className="left-3" />
                    <CarouselNext className="right-3" />
                  </Carousel>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No images yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                <div>
                  <h1>
                    {values?.name?.trim() ? values.name : "Untitled product"}
                  </h1>

                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 text-yellow-400" />
                    ))}

                    <p className="text-muted-foreground text-xs">(6 Reviews)</p>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <p className="text-muted-foreground">
              {values?.description ??
                "No description provided for this product yet"}
            </p>

            <Separator />

            <div>
              <h1>Size</h1>

              <div className="flex gap-4 mt-4">
                <div className="border rounded-md p-4 h-12 w-12 flex items-center justify-center">
                  <p>M</p>
                </div>
                <div className="border rounded-md p-4 h-12 w-12 flex items-center justify-center">
                  <p>L</p>
                </div>
              </div>
            </div>

            <div>
              <h1>Color</h1>

              <div className="flex gap-4 mt-4">
                <div className="border rounded-md p-4 gap-4 flex items-center justify-center">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: "#fff" }}
                  />

                  <p className="mt-1">White</p>
                </div>

                <div className="border rounded-md p-4 gap-4 flex items-center justify-center">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: "#d12323" }}
                  />

                  <p className="mt-1">Red</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" className="flex-1">
                <ShoppingCart className="size-4" /> Add to Cart
              </Button>
              <Button size="icon" variant="outline">
                <Heart className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
