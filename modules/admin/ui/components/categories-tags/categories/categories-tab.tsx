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
  CategoryNode,
  createCategoryInput,
  CreateCategoryInput,
} from "@/modules/admin/domains/categories-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { CreateCategoryDialog } from "./create-category-dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryRow } from "./category-row";

export const CategoriesTab = ({
  categories,
}: {
  categories: CategoryNode[];
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="relative w-100">
          <Input className="w-full pl-10" placeholder="Search categories..." />

          <FaSearch className="size-4 text-gray-500 absolute left-3.5 top-2.5" />
        </div>

        <CreateCategoryDialog categories={categories} />
      </div>

      <div className="mt-6 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Slug</TableHead>
              <TableHead className="text-muted-foreground">Products</TableHead>
              <TableHead className="text-muted-foreground w-15"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <CategoryRow key={category.id} category={category} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
