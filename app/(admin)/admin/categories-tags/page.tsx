import { requireAdmin } from "@/lib/guards";
import { CategoriesTagsView } from "@/modules/admin/ui/views/categories-tags-view";
import React from "react";

const AdminCategoriesTags = async () => {
  await requireAdmin();

  return <CategoriesTagsView />;
};

export default AdminCategoriesTags;
