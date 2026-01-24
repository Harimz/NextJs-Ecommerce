import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { CategoryNode } from "@/modules/admin/domains/categories-schemas";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  ChevronRight,
  FolderTree,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const CategoryRow = ({
  category,
  level = 0,
}: {
  category: CategoryNode;
  level?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    trpc.admin.categories.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted category");

        queryClient.invalidateQueries({
          queryKey: trpc.admin.categories.list.queryKey(),
        });
      },
      onError: (err) => {
        toast.error(err.message || "Could not delete category");
      },
    }),
  );

  return (
    <>
      <TableRow className="table-row-hover">
        <TableCell>
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${level * 24}px` }}
          >
            {hasChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    expanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            <FolderTree className="w-4 h-4 text-primary" />
            <span className="font-medium">{category.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {category.slug}
          </code>
        </TableCell>
        <TableCell>{category.productCount}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-popover border-border"
            >
              <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="w-4 h-4 mr-2" />
                Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => mutate({ id: category.id })}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {expanded &&
        category.children?.map((child) => (
          <CategoryRow key={child.id} category={child} level={level + 1} />
        ))}
    </>
  );
};
