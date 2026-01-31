import { FeaturedSection } from "../sections/featured-section";
import { HomeHeader } from "../components/home-header";
import { FeaturesBar } from "../components/features-bar";

export const HomeView = () => {
  return (
    <main>
      <HomeHeader />

      <div className="max-w-520 w-[95%] mx-auto">
        <FeaturesBar />

        <div className="mt-6">
          <p className="text-custom-primary">EDITOR&apos;S PICK</p>

          <h1 className="font-bold text-4xl">Featured Products</h1>

          <FeaturedSection />
        </div>
      </div>
    </main>
  );
};
