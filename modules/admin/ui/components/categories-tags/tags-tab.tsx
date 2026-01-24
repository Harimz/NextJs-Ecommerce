import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";
import { FaSearch } from "react-icons/fa";

export const TagsTab = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="relative w-100">
          <Input className="w-full pl-10" placeholder="Search tags..." />

          <FaSearch className="size-4 text-gray-500 absolute left-3.5 top-2.5" />
        </div>

        <Button variant="primary">
          <Plus /> Add Tag
        </Button>
      </div>
    </div>
  );
};
