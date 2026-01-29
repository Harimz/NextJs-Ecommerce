import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  AdminProductListPagedOutput,
  AdminProductOutput,
} from "@/modules/admin/domains/products-schemas";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Eye,
  ImageIcon,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export const InventoryRow = ({ product }: { product: AdminProductOutput }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const productInventory = product.variants.reduce(
    (acc, v) => acc + v.inventory,
    0,
  );

  const toggleActive = useMutation(
    trpc.admin.products.toggleActive.mutationOptions({
      onMutate: async ({ id, active }) => {
        await queryClient.cancelQueries({
          queryKey: trpc.admin.products.list.queryKey(),
        });

        const snapshots =
          queryClient.getQueriesData<AdminProductListPagedOutput>({
            queryKey: trpc.admin.products.list.queryKey(),
          });

        queryClient.setQueriesData<AdminProductListPagedOutput>(
          {
            queryKey: trpc.admin.products.list.queryKey(),
          },
          (old) => {
            if (!old) return old;

            return {
              ...old,
              items: old.items.map((p) => (p.id === id ? { ...p, active } : p)),
            };
          },
        );

        return { snapshots };
      },

      onError: (_err, _vars, ctx) => {
        ctx?.snapshots?.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.products.list.queryKey(),
        });
      },
    }),
  );

  const { mutate: deleteProduct } = useMutation(
    trpc.admin.products.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admin.products.list.queryKey(),
        });

        toast.success("Deleted product");
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    }),
  );

  return (
    <TableRow key={product.id} className="table-row-hover animate-fade-in">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.slug}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            className="cursor-pointer"
            checked={product.active}
            onCheckedChange={(checked) =>
              toggleActive.mutate({ id: product.id, active: checked })
            }
          />
          <Badge
            variant={product.active ? "default" : "secondary"}
            className={product.active ? "bg-success/20 text-success" : ""}
          >
            {product.active ? "Active" : "Draft"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {product.department}
        </span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <span className="font-medium text-foreground">
            ${((product.minPriceCents ?? 0) / 100).toFixed(2)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {productInventory === 0
            ? "Out of stock"
            : `${productInventory} in stock`}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground font-mono">
          {product.variants.length}
        </span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => deleteProduct({ id: product.id })}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
