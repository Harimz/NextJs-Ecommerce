import { ColorsSection } from "../sections/colors-section";

export const ColorsView = () => {
  return (
    <div className="mx-auto w-[90%] max-w-440 mt-10">
      <h1 className="text-2xl font-bold">Colors</h1>

      <p className="text-muted-foreground">
        Organize and create colors for products
      </p>

      <ColorsSection />
    </div>
  );
};
