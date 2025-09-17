import { Link } from "react-router-dom";
import logo from "@/assets/images/logo/brand-logo.png";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} alt="HugPaw Logo" className="h-7 w-7 object-contain" />
      <span className="nav-link text-xl font-bold">
        HugPaw
      </span>
    </Link>
  );
};

export default Logo;
