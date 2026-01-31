"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "New Season",
    subtitle: "Spring/Summer 2024",
    description: "Discover our latest collection of timeless essentials",
    cta: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920",
    align: "left" as const,
  },
  {
    id: 2,
    title: "Tailored Elegance",
    subtitle: "The Art of Dressing",
    description: "Premium fabrics meet exceptional craftsmanship",
    cta: "Explore Collection",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920",
    align: "center" as const,
  },
  {
    id: 3,
    title: "Sustainable Style",
    subtitle: "Fashion with Purpose",
    description: "Consciously crafted pieces for the modern wardrobe",
    cta: "Learn More",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920",
    align: "right" as const,
  },
];

export const HomeHeader = () => {
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[70vh] min-h-[600px] overflow-hidden bg-muted">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            index === current ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="absolute inset-0">
            {isLoading && index === 0 && (
              <div className="absolute inset-0 skeleton-shimmer" />
            )}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              onLoad={() => setIsLoading(false)}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/20 to-transparent" />
          </div>

          <div
            className={cn(
              "relative h-full flex w-[90%] mx-auto items-center justify-start",
              slide.align === "center" && "justify-center",
              slide.align === "right" && "justify-end",
            )}
          >
            <div
              className={cn(
                "max-w-xl text-white animate-fade-in",
                slide.align === "center" && "text-center",
                slide.align === "right" && "text-end",
              )}
            >
              <span className="text-sm font-medium tracking-widest uppercase opacity-90">
                {slide.subtitle}
              </span>
              <h1 className="mt-2 font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                {slide.title}
              </h1>
              <p className="mt-4 text-lg opacity-90 max-w-md">
                {slide.description}
              </p>
              <Button size="lg" className="mt-6 font-medium" variant="primary">
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white"
        onClick={prev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white"
        onClick={next}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === current
                ? "w-8 bg-white"
                : "w-1.5 bg-white/50 hover:bg-white/70",
            )}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
};
