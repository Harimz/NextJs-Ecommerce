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
  CreateColorInput,
  createColorSchema,
} from "@/modules/admin/domains/colors-schema";

export const CreateColorDialog = () => {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();

  const form = useForm<CreateColorInput>({
    resolver: zodResolver(createColorSchema),
    defaultValues: {
      name: "",
      slug: "",
      hex: undefined,
    },
  });

  const queryClient = useQueryClient();

  const { mutate: createTag, isPending } = useMutation(
    trpc.admin.colors.create.mutationOptions({
      onSuccess: () => {
        toast.success("Color created");

        queryClient.invalidateQueries({
          queryKey: trpc.admin.colors.list.queryKey(),
        });

        setOpen(false);
        form.reset();
      },
      onError: (err) => {
        console.error(err);
        toast.error(err.message ?? "Failed to create color");
      },
    }),
  );

  const handleSubmit = (values: CreateColorInput) => {
    createTag(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Plus /> Add Color
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Color</DialogTitle>
          <DialogDescription>Add a color for your products</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g., White"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Slug</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="white"
                />
                <p className="text-muted-foreground text-xs">
                  URL-friendly identifier (auto-generated if left empty)
                </p>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="hex"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Hex Code</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="#ffffff"
                />
                <p className="text-muted-foreground text-xs">
                  URL-friendly identifier (auto-generated if left empty)
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

            <Button type="submit" variant="primary">
              {isPending ? <Spinner /> : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
