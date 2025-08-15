import { Link } from "react-router-dom";
import BrandLogo from "../../assets/images/logo/brand-logo.png";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src={BrandLogo}
        alt="HugPaw Logo"
        className="h-7 w-7 object-contain"
      />
      <span className="text-onPrimary font-bold text-xl">HugPaw</span>
    </Link>
  );
};

export default Logo;
