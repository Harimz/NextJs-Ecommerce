import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Size } from "@/modules/admin/domains/sizes-schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const SizeRow = ({ size }: { size: Size }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: deleteSize } = useMutation(
    trpc.admin.sizes.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Deleted color");

        queryClient.invalidateQueries({
          queryKey: trpc.admin.sizes.list.queryKey(),
        });
      },
      onError: (err) => {
        toast.error(err.message || "Could not delete color");
      },
    }),
  );

  return (
    <TableRow>
      <TableCell>{size.label}</TableCell>
      <TableCell>{size.category}</TableCell>

      <TableCell>{size.code}</TableCell>

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
              onClick={() => deleteSize({ id: size.id })}
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
