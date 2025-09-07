const Topbar = () => {
  return (
    <div className="topbar">
      Free shipping on orders over $50
      <a href="/catalog" className="topbar-link hover:text-red-500 ml-1">
        Shop Now
      </a>
    </div>
  );
};

export default Topbar;
