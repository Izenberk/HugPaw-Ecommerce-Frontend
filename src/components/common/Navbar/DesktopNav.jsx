import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";
import SearchBox from "@/components/common/Navbar/SearchBox";
import UserNav from "@/components/common/Navbar//UserNav";

const DesktopNav = () => {
  return (
    <div className="hidden md:flex items-center justify-between w-full gap-4">
      <nav>
        <ul className="hidden md:flex md:items-center-safe gap-4 ml-4">
          <li className="hover:text-gray-500">
            <Logo />
          </li>

          <li className="hover:text-gray-500">
            <Link to="catalog">Products</Link>
          </li>
          {/* <li className="hover:text-white">
            <Link>Contact</Link>
          </li> */}
        </ul>
      </nav>
      <SearchBox />
      <UserNav />
    </div>
  );
};

export default DesktopNav;
