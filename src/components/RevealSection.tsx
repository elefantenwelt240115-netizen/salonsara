"use client";

import { useEffect, useRef, ReactNode } from "react";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  variant?: "up" | "scale";
  delay?: number;
}

export default function RevealSection({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("is-visible"), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const variantClass = variant === "scale" ? "reveal-scale" : "reveal-up";

  return (
    <div
      ref={ref}
      className={`${variantClass} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
