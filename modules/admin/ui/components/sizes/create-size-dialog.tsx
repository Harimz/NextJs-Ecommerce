"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  createSizeFormSchema,
  CreateSizeFormValues,
  sizeCategorySchema,
} from "@/modules/admin/domains/sizes-schema";

export const CreateSizeDialog = () => {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<CreateSizeFormValues>({
    resolver: zodResolver(createSizeFormSchema),
    defaultValues: {
      category: "TOP",
      code: "",
      label: "",
      sortOrder: 0,
    },
  });

  const { mutate: createSize, isPending } = useMutation(
    trpc.admin.sizes.create.mutationOptions({
      onSuccess: () => {
        toast.success("Size created");

        queryClient.invalidateQueries({
          queryKey: trpc.admin.sizes.list.queryKey(),
        });

        setOpen(false);
        form.reset();
      },
      onError: (err) => {
        console.error(err);
        toast.error(err.message ?? "Failed to create size");
      },
    }),
  );

  const handleSubmit = (values: CreateSizeFormValues) => {
    createSize(values);
  };

  const categories = sizeCategorySchema.options;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Plus /> Add Size
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Size</DialogTitle>
          <DialogDescription>
            Add a size option for product variants
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category</FieldLabel>

                <select
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={fieldState.invalid}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Code</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g., S"
                  autoComplete="off"
                />

                <p className="text-muted-foreground text-xs">
                  Unique per category (e.g., TOP + S)
                </p>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="label"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Label</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g., Small"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="sortOrder"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Sort Order</FieldLabel>

                <Input
                  type="number"
                  aria-invalid={fieldState.invalid}
                  value={field.value ?? 0}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === "" ? 0 : Number(v));
                  }}
                  placeholder="0"
                />

                <p className="text-muted-foreground text-xs">
                  Lower numbers appear first
                </p>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex gap-6 justify-end w-full mt-6">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? <Spinner /> : "Create Size"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
