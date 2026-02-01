import { FeaturedSection } from "../sections/featured-section";
import { HomeHeader } from "../components/home-header";
import { FeaturesBar } from "../components/features-bar";
import { Newsletter } from "../components/news-letter";
import { PromoBanner } from "../components/promo-banner";
import { NewArrivalsSection } from "../sections/new-arrivals-section";
import { CategoryGrid } from "../components/category-grid";

export const HomeView = () => {
  return (
    <main>
      <HomeHeader />

      <div className="max-w-400 w-[95%] mx-auto">
        <FeaturesBar />

        <div className="mt-6 space-y-10">
          <div>
            <p className="text-custom-primary">EDITOR&apos;S PICK</p>

            <h1 className="font-bold text-4xl">Featured Products</h1>

            <FeaturedSection />
          </div>

          <CategoryGrid />

          <div>
            <p className="text-custom-primary">JUST LANDED</p>

            <h1 className="font-bold text-4xl">New Arrivals</h1>

            <NewArrivalsSection />
          </div>

          <PromoBanner />
        </div>
      </div>

      <Newsletter />
    </main>
  );
};
