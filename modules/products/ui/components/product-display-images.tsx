import { useState } from "react";
import { ProductImages } from "../../../home/domains/product-schema";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const ProductDisplayImages = ({ images }: { images: ProductImages }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-2 w-full">
      <div className="relative aspect-3/4 w-full">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt ?? ""}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex gap-1">
        {images.map((image, i) => (
          <div
            key={image.id}
            className={cn(
              "p-1 border-3 border-transparent",
              selectedImage === i &&
                "border-custom-primary rounded-md border-3",
            )}
          >
            <div
              className="relative h-30 aspect-3/4 rounded-sm overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(i)}
            >
              <Image src={image.url} alt={image.alt ?? ""} fill />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
