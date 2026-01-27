import { SizesSection } from "../sections/sizes-section";

export const SizesView = () => {
  return (
    <div className="mx-auto w-[90%] max-w-440 mt-10">
      <h1 className="text-2xl font-bold">Sizes</h1>

      <p className="text-muted-foreground">Sizes for categories</p>

      <SizesSection />
    </div>
  );
};
