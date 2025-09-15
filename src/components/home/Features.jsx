import React from "react";

const mockFeatures = [
  {
    id: "vet-approved",
    title: "Vet-approved quality",
    desc: "Carefully selected pet supplies recommended by veterinarians.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor">
        <path strokeWidth="1.5" d="M12 3l2.3 4.7L19 9l-4 3.9.9 5.6L12 16l-3.9 2.5.9-5.6L5 9l4.7-1.3L12 3z"/>
      </svg>
    ),
  },
  {
    id: "smart-packaging",
    title: "Smarter packaging",
    desc: "Easy-to-use, pet-safe, and eco-friendly packaging design.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor">
        <path strokeWidth="1.5" d="M7 7h10v10H7z"/><path strokeWidth="1.5" d="M7 12h10"/>
      </svg>
    ),
  },
  {
    id: "tested",
    title: "Third-party tested",
    desc: "Independent lab-tested products to ensure safety and quality.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor">
        <path strokeWidth="1.5" d="M9 3v5l-4 7a4 4 0 004 6h6a4 4 0 004-6l-4-7V3"/>
      </svg>
    ),
  },
  {
    id: "fast-shipping",
    title: "Fast & caring delivery",
    desc: "Quick shipping with secure packaging, always putting pets first",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor">
        <path strokeWidth="1.5" d="M3 7h10l4 4h4v6h-3"/><path strokeWidth="1.5" d="M3 7v10h10V7M7 21a2 2 0 110-4 2 2 0 010 4zm10 0a2 2 0 110-4 2 2 0 010 4z"/>
      </svg>
    ),
  },
];

function HugPawFeatures({ items = mockFeatures }) {
  return (
    <section
      id="why-us"
      className="relative isolate py-14 sm:py-16 lg:py-20"
      aria-labelledby="hugpaw-features-heading"
    >
      <div className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 sm:mb-12">
          <h2
            id="hugpaw-features-heading"
            className="text-2xl md:text-5xl font-semibold tracking-tight text-slate-900"
          >
            For happier pets, every day.
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Because they deserve the very best.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((f) => (
            <li key={f.id} className="group rounded-2xl bg-white/70 backdrop-blur ring-1 ring-black/5 p-6 hover:shadow-md transition">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-black mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-medium text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default HugPawFeatures;
