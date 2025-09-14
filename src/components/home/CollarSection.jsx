export default function CollarSection() {
  return (
    <section className="bg-[#e5eaff]">
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
        {/* LEFT : IMAGE */}
        <div className="flex justify-center">
          <img
            src="/images/home/review-collar.png"
            alt="Modern Pet Collar"
            className="object-contain h-[360px] md:h-[420px] rounded-xl overflow-hidden"
          />
        </div>

        {/* RIGHT : CONTENT */}
        <div className="text-gray-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Style Meets Comfort
          </h2>
          <h3 className="text-xl font-semibold mb-3">Pawfect Collar</h3>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            The Pawfect Collar combines durability with modern design. Crafted
            from premium materials, it keeps your pet comfortable while adding a
            stylish touch for everyday adventures.
          </p>
          <button className="px-6 py-3 rounded-full bg-gray-900 text-white font-medium shadow hover:bg-gray-800 transition">
            View Product
          </button>
        </div>
      </div>
    </section>
  );
}
