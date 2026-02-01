import { Button } from "@/components/ui/button";

export const PromoBanner = () => {
  return (
    <section className="py-12 md:py-16 ">
      <div className="mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-foreground dark:bg-muted dark:text-white text-background">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
            <span className="text-sm font-medium tracking-widest uppercase opacity-80">
              Limited Time Offer
            </span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-semibold">
              Up to 40% Off
            </h2>
            <p className="mt-4 text-lg opacity-80 max-w-md mx-auto">
              Enjoy exclusive discounts on selected styles. Don&apos;t miss out
              on our biggest sale of the season.
            </p>
            <Button
              size="lg"
              variant="primary"
              className="mt-6 text-white font-medium"
            >
              Shop Sale
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
