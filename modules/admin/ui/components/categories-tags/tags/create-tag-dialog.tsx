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
  createTagInput,
  CreateTagInput,
} from "@/modules/admin/domains/tags-schema";

export const CreateTagDialog = () => {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();

  const form = useForm<CreateTagInput>({
    resolver: zodResolver(createTagInput),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate: createTag, isPending } = useMutation(
    trpc.admin.tags.create.mutationOptions({
      onSuccess: () => {
        toast.success("Tag created");

        queryClient.invalidateQueries({
          queryKey: trpc.admin.tags.list.queryKey(),
        });

        setOpen(false);
        form.reset();
      },
      onError: (err) => {
        console.error(err);
        toast.error(err.message ?? "Failed to create tag");
      },
    }),
  );

  const handleSubmit = (values: CreateTagInput) => {
    console.log(values);
    createTag(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Plus /> Add Tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
          <DialogDescription>
            Add a new tag to label your products
          </DialogDescription>
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
                  placeholder="e.g., Flash Sale"
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
                  placeholder="flash-sale"
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
