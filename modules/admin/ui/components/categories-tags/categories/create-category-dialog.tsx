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
import {
  CategoryNode,
  createCategoryInput,
  CreateCategoryInput,
} from "@/modules/admin/domains/categories-schemas";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { flattenCategories } from "../../../utils/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CreateCategoryDialog = ({
  categories,
}: {
  categories: CategoryNode[];
}) => {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();

  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategoryInput),
    defaultValues: {
      name: "",
      slug: "",
      parentId: null,
    },
  });

  const queryClient = useQueryClient();
  const { mutate: createCategory, isPending } = useMutation(
    trpc.admin.categories.create.mutationOptions({
      onSuccess: () => {
        toast.success("Category created");

        queryClient.invalidateQueries({
          queryKey: trpc.admin.categories.list.queryKey(),
        });

        setOpen(false);
        form.reset();
      },
      onError: (err) => {
        console.error(err);
        toast.error(err.message ?? "Failed to create category");
      },
    }),
  );

  const handleSubmit = (values: CreateCategoryInput) => {
    createCategory(values);
  };

  const options = flattenCategories(categories);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Plus /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your products
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
                  placeholder="e.g., Summer Collection"
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
                  placeholder="summer-collection"
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
            name="parentId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Parent Category</FieldLabel>

                <Select
                  value={field.value ?? "none"}
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? null : val)
                  }
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="No parent (top-level)" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">No parent (top-level)</SelectItem>

                    {options.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-muted-foreground text-xs">
                  Optional — choose a parent to nest this category.
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
