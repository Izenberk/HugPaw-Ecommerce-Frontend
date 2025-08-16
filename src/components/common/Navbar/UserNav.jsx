import { useAuth } from "@/pages/auth/AuthContext";
import { Heart, ShoppingCart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import DropdownAccout from "./DropdownAccout";

export default function UserNav() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        <ul className="flex items-center gap-6">
          <li className="flex items-center hover:text-gray-500">
            <Link to="/wishlist">
              <Heart />
            </Link>
          </li>
          <li className="flex items-center hover:text-gray-500">
            <Link to="/cart">
              <ShoppingCart />
            </Link>
          </li>
          <li className="flex items-center hover:text-gray-500">
            <Link to="/user" className="flex items-center gap-2">
              <span>Profile</span>
            </Link>
          </li>

          {/* <li className="flex items-center">
            <button
              onClick={logout}
              className="flex items-center gap-2 hover:text-red-500"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </li> */}
          <DropdownAccout />
        </ul>
      ) : (
        <ul className="flex items-center gap-4 text-primary-foreground">
          <li className="flex items-center hover: text-gray-500">
            <Link to="/cart">
              <ShoppingCart />
            </Link>
          </li>
          <li className="hover:text-gray-500">
            <Link to="/login">Login</Link>
          </li>
          <li className="hover:text-gray-500">
            <Link to="/signup">Sign Up</Link>
          </li>
        </ul>
      )}
    </div>
  );
}
