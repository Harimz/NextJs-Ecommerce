import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderTree, Tags } from "lucide-react";
import React from "react";
import { CategoriesTab } from "./categories/categories-tab";
import { TagsTab } from "./tags/tags-tab";
import {
  Category,
  CategoryNode,
} from "@/modules/admin/domains/categories-schemas";
import { Tag } from "@/modules/admin/domains/tags-schema";

interface Props {
  categories: CategoryNode[];
  tags: Tag[];
}

export const Header = ({ categories, tags }: Props) => {
  return (
    <div>
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-custom-primary data-[state=active]:text-primary-foreground cursor-pointer"
          >
            <FolderTree className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="tags"
            className="data-[state=active]:bg-custom-primary data-[state=active]:text-primary-foreground cursor-pointer px-10"
          >
            <Tags className="w-4 h-4 mr-2" />
            Tags
          </TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="animate-fade-in">
          <CategoriesTab categories={categories} />
        </TabsContent>

        <TabsContent value="tags" className="animate-fade-in">
          <TagsTab tags={tags} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
