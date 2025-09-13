import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";
import SearchBox from "@/components/common/Navbar/SearchBox";
import UserNav from "@/components/common/Navbar//UserNav";

const DesktopNav = () => {
  return (
<div className="hidden md:flex h-16 w-full max-w-screen-2xl items-center px-4 mx-auto">
  <div className="flex items-center gap-6">
    <Logo />

    <nav>
      <ul className="flex items-center gap-6">
        <li className="flex items-center gap-1">
          <Link to="/catalog">Products</Link>
        </li>
      </ul>
    </nav>
  </div>

  <div className="flex-1" />

  <div className="flex items-center gap-6">
    <UserNav />
    <Link
      to="/catalog"
      className="inline-flex items-center rounded-full px-5 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
    >
    Shop Now
    </Link>
  </div>
</div>
  );
};

export default DesktopNav;
