import { CategoriesTagsView } from "@/modules/admin/ui/views/categories-tags-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AdminCategoriesTags = async () => {
  return <CategoriesTagsView />;
};

export default AdminCategoriesTags;
