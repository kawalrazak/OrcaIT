"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/hero-van-street.png",
    alt: "ORCA IT van providing IT support in the city",
    position: "object-[center_55%]",
  },
  {
    src: "/hero-van-bridge.png",
    alt: "ORCA IT van on the road providing home and business IT support",
    position: "object-[center_60%]",
  },
  {
    src: "/hero-tram-shelter.jpg",
    alt: "ORCA IT tram-stop advertisement for home and business IT support",
    position: "object-[center_50%]",
  },
  {
    src: "/hero-billboard.png",
    alt: "ORCA IT billboard advertising IT support for home and business",
    position: "object-[center_40%]",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [index]);

  return (
    <>
      {slides.map((slide, slideIndex) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={slideIndex === 0}
          className={`object-cover ${slide.position} transition-opacity duration-1000 ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
        />
      ))}

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            onClick={() => setIndex(slideIndex)}
            className={`size-2.5 rounded-full border border-white/80 transition ${
              slideIndex === index
                ? "scale-110 bg-white"
                : "bg-white/35 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </>
  );
}
