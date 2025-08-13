import { Link } from "react-router-dom";
import BrandLogo from "../../assets/images/logo/brand-logo.png";

const Logo = () => {
  return (
    <div className="flex justify-between gap-2 m-4">
      <Link to="/" className="flex items-center gap-2">
        <img
          src={BrandLogo}
          alt="HugPaw Logo"
          className="h-7 w-7 object-contain"
        />
        <span className="text-onPrimary font-bold text-xl">HugPaw</span>
      </Link>
    </div>
  );
};

export default Logo;
