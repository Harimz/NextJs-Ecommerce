import { cn } from "@/lib/utils";
import { CreateProductFormValues } from "@/modules/admin/domains/products-schemas";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

export const ProductImages = () => {
  const { control } = useFormContext<CreateProductFormValues>();
  const trpc = useTRPC();
  const {
    fields: images,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "images",
    keyName: "key",
  });

  const getUploadUrls = useMutation(
    trpc.admin.productImages.getUploadUrls.mutationOptions(),
  );

  const deleteImage = useMutation(
    trpc.admin.productImages.delete.mutationOptions(),
  );

  const onRemove = async (index: number) => {
    const toastId = toast.loading("Removing image");
    const img = images[index];

    remove(index);

    try {
      await deleteImage.mutateAsync({ key: img.r2Key });
    } catch (e) {
      append({ ...img, sortOrder: images.length });
      toast.error("Could not remove image");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const onFilesSelected = async (files: FileList | null) => {
    if (!files) return;

    const toastId = toast.loading("Uploading Images");

    const fileArr = Array.from(files);

    const res = await getUploadUrls.mutateAsync({
      files: fileArr.map((f) => ({ name: f.name, type: f.type, size: f.size })),
    });

    await Promise.all(
      res.uploads.map(async (u, idx) => {
        const file = fileArr[idx];

        const putRes = await fetch(u.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!putRes.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        append({
          r2Key: u.key,
          url: u.publicUrl,
          alt: null,
          sortOrder: images.length + idx,
        });
      }),
    );

    toast.dismiss(toastId);
  };

  return (
    <div className="p-6 bg-muted border rounded-md">
      <div className="form-section-title flex items-center gap-4 mb-4">
        <ImageIcon className="w-5 h-5 text-custom-primary" />
        <h1 className="font-bold text-xl">Product Images</h1>
      </div>

      <label
        htmlFor="product-images-upload"
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block"
      >
        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-1">
          Drag and drop images, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG up to 10MB each
        </p>

        <input
          id="product-images-upload"
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => onFilesSelected(e.target.files)}
        />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {images.map((img, index) => (
            <div
              key={img.key}
              className="relative aspect-square rounded-lg overflow-hidden border bg-background group"
            >
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                className="h-full w-full object-cover"
                unoptimized
              />

              <button
                type="button"
                onClick={() => onRemove(index)}
                className={cn(
                  "absolute top-1 right-1 rounded-full bg-background/80 p- cursor-pointer",
                  "opacity-0 group-hover:opacity-100 transition",
                )}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-1 left-1 flex gap-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    className="text-xs bg-background/80 px-1 rounded"
                  >
                    ↑
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    className="text-xs bg-background/80 px-1 rounded"
                  >
                    ↓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
