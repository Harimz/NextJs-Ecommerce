import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  q: string;
  onQChange: (v: string) => void;

  status: "all" | "active" | "draft";
  onStatusChange: (v: "all" | "active" | "draft") => void;

  department: string;
  onDepartmentChange: (v: string) => void;
}

export const InventoryFilter = ({
  q,
  onQChange,
  status,
  onStatusChange,
  department,
  onDepartmentChange,
}: Props) => {
  return (
    <div className="mt-6 flex gap-6">
      <Input
        placeholder="Search products..."
        value={q}
        onChange={(e) => onQChange(e.target.value)}
      />

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>

      <Select value={department || "all"} onValueChange={onDepartmentChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="MEN">Men</SelectItem>
          <SelectItem value="WOMEN">Women</SelectItem>
          <SelectItem value="KIDS">Kids</SelectItem>
          <SelectItem value="UNISEX">Unisex</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline">
        <Download /> Export
      </Button>

      <Link href="/admin/products" passHref>
        <Button variant="primary">
          <Plus /> Add Product
        </Button>
      </Link>
    </div>
  );
};
