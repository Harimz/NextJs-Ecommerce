import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Color } from "@/modules/admin/domains/colors-schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

export const ColorRow = ({ color }: { color: Color }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: deleteColor } = useMutation(
    trpc.admin.colors.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted color");

        queryClient.invalidateQueries({
          queryKey: trpc.admin.colors.list.queryKey(),
        });
      },
      onError: (err) => {
        toast.error(err.message || "Could not delete color");
      },
    }),
  );

  return (
    <TableRow>
      <TableCell>{color.name}</TableCell>
      <TableCell>{color.slug}</TableCell>
      <TableCell>
        <div
          style={{ backgroundColor: `${color.hex}` }}
          className="rounded-full h-4 w-4 ml-2"
        />
      </TableCell>
      <TableCell>{color.hex}</TableCell>

      <TableCell className="justify-end flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => deleteColor({ id: color.id })}
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
