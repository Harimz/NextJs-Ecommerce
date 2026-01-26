import { CreateProductSection } from "../sections/create-product-section";

export const ProductsView = () => {
  return (
    <div className="mx-auto w-[90%] max-w-440 mt-10">
      <h1 className="text-2xl font-bold">Categories & Tags</h1>

      <p className="text-muted-foreground">
        Organize your products with categories and tags
      </p>

      <CreateProductSection />
    </div>
  );
};
