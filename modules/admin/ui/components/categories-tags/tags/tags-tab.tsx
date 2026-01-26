import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { CreateTagDialog } from "./create-tag-dialog";
import { Tag } from "@/modules/admin/domains/tags-schema";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TagsTab = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="relative w-100">
          <Input className="w-full pl-10" placeholder="Search tags..." />

          <FaSearch className="size-4 text-gray-500 absolute left-3.5 top-2.5" />
        </div>

        <CreateTagDialog />
      </div>

      <div className="bg-muted border p-4 rounded-md mt-6">
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {tag.name}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
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
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {tag.slug}
                </code>
                <Badge variant="secondary" className="font-mono text-xs">
                  {0} products
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
