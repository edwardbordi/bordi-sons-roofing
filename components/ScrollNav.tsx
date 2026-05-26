"use client";

import { useEffect, useState } from "react";

type Section = {
  id: string;
  label: string;
};

const sections: Section[] = [
  { id: "hero", label: "Home" },
  { id: "testimonials", label: "Reviews" },
  { id: "process", label: "Process" },
  { id: "features", label: "Anatomy" },
  { id: "colors", label: "Colors" },
  { id: "trust", label: "Trust" },
  { id: "cta", label: "Get Started" },
  { id: "footer", label: "Contact" },
];

export default function ScrollNav() {
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    // Set up IntersectionObserver to detect which section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // Section is "active" when it's in the middle 40% of the viewport
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0,
      }
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      role="navigation"
      aria-label="Page sections"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            aria-label={`Navigate to ${section.label} section`}
            className="group relative flex cursor-pointer items-center focus:outline-none"
          >
            {/* Tooltip — appears to the LEFT of the bar on hover */}
            <span className="pointer-events-none absolute right-full mr-3 rounded bg-slate-900 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {section.label}
            </span>

            {/* The bar — wider and red when active */}
            <span
              className={
                "rounded-full transition-all duration-300 " +
                (isActive
                  ? "h-8 w-[3px] bg-red-600"
                  : "h-6 w-[2px] bg-slate-300 group-hover:bg-slate-500")
              }
            />
          </button>
        );
      })}
    </nav>
  );
}
