const Topbar = () => {
  return (
    <div className="top-0 left-0 w-full z-50 bg-gray-800 text-white text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 py-2 px-4">
        <span className="text-center">
          🎉 🎉 Use promo code "HappyHugPaw" for 5% off 🎉 🎉
        </span>
        <a
          href="/catalog"
          className="underline underline-offset-4 font-medium hover:text-lime-300 transition"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
};

export default Topbar;
