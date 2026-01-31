import React from "react";
import { ProductDetailsSection } from "../sections/product-details-section";

export const ProductsDetailsView = ({ slug }: { slug: string }) => {
  return (
    <div className="max-w-400 w-[95%] mx-auto">
      <ProductDetailsSection slug={slug} />
    </div>
  );
};
