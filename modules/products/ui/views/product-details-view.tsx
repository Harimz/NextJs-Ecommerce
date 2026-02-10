import { ProductDetailsSection } from "../sections/product-details-section";

interface Props {
  slug: string;
}

export const ProductsDetailsView = ({ slug }: Props) => {
  return (
    <div className="max-w-400 w-[95%] mx-auto">
      <ProductDetailsSection slug={slug} />
    </div>
  );
};
