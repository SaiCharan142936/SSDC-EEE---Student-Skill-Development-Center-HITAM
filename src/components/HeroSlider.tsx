import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Slide {
  img: string;
  title: string;
  subtitle: string;
  cta: { label: string; to: string };
}

interface HeroSliderProps {
  slides: Slide[];
  interval?: number;
}

const HeroSlider = ({ slides, interval = 4000 }: HeroSliderProps) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  return (
    <section className="relative w-full h-[320px] md:h-[420px] lg:h-[480px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white max-w-lg leading-tight">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="mt-2 text-sm md:text-base text-white/85 max-w-md">
                  {slide.subtitle}
                </p>
              )}
              <Link
                to={slide.cta.to}
                className="inline-flex items-center gap-1.5 mt-4 rounded-sm bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {slide.cta.label}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-background/70 hover:bg-background/90 rounded-full p-2 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-background/70 hover:bg-background/90 rounded-full p-2 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-2.5 bg-white/60 hover:bg-white/80"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
