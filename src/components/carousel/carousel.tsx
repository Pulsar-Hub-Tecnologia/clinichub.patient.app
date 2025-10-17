import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  links?: string[]; // optional: external links for each image
  actionLabel?: string; // optional: label for the action button
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  links = [],
  actionLabel = "Saiba mais",
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection("right");
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleDotClick = (idx: number) => {
    setDirection(idx > current ? "right" : "left");
    setCurrent(idx);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: 600 }}>
      {/* Passador esquerdo */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
        onClick={handlePrev}
        aria-label="Anterior"
        type="button"
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      {/* Passador direito */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
        onClick={handleNext}
        aria-label="Próximo"
        type="button"
      >
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>
      {images.map((img, idx) => {
        let position = "translate-x-full opacity-0";
        if (idx === current) {
          position = "translate-x-0 opacity-100 z-10";
        } else if (
          idx === (current - 1 + images.length) % images.length &&
          direction === "right"
        ) {
          position = "-translate-x-full opacity-0";
        } else if (
          idx === (current + 1) % images.length &&
          direction === "left"
        ) {
          position = "translate-x-full opacity-0";
        }

        return (
          <div
            key={img}
            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${position}`}
          >
            <img
              src={img}
              alt={`slide-${idx}`}
              className="rounded-xl shadow-lg border-4 border-primary max-h-[420px] object-contain bg-white"
            />
            {links[idx] && (
              <a
                href={links[idx]}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-foreground transition"
              >
                <ExternalLink className="w-4 h-4" />
                {actionLabel}
              </a>
            )}
          </div>
        );
      })}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-white" : "bg-white/50"}`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;