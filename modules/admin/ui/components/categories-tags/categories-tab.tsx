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
import {
  createCategoryInput,
  CreateCategoryInput,
} from "@/modules/admin/domains/categories-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { CreateCategoryDialog } from "./create-category-dialog";

export const CategoriesTab = () => {
  const [] = useState();

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="relative w-100">
          <Input className="w-full pl-10" placeholder="Search categories..." />

          <FaSearch className="size-4 text-gray-500 absolute left-3.5 top-2.5" />
        </div>

        <CreateCategoryDialog />
      </div>
    </div>
  );
};
