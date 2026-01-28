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
import { AdminProductOutput } from "@/modules/admin/domains/products-schemas";
import {
  Copy,
  Eye,
  ImageIcon,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import React from "react";

export const InventoryRow = ({ product }: { product: AdminProductOutput }) => {
  const productInventory = product.variants.reduce(
    (acc, v) => acc + v.inventory,
    0,
  );

  return (
    <TableRow key={product.id} className="table-row-hover animate-fade-in">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
            {product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
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
            checked={product.active}
            className="data-[state=checked]:bg-success"
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
        <span className="text-sm text-muted-foreground">{product.id}</span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <span className="font-medium text-foreground">
            ${product.minPriceCents?.toFixed(2)}
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
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
