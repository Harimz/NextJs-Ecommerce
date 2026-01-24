import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderTree, Tags } from "lucide-react";
import React from "react";
import { CategoriesTab } from "./categories-tab";
import { TagsTab } from "./tags-tab";

export const Header = () => {
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
          <CategoriesTab />
        </TabsContent>

        <TabsContent value="tags" className="animate-fade-in">
          <TagsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
