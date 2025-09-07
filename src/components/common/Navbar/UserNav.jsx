import { useAuth } from "@/context/AuthContext";
import { Heart, ShoppingCart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import DropdownAccount from "./DropdownAccount";

export default function UserNav() {
  // eslint-disable-next-line no-unused-vars
  const { isLoggedIn, logout } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        <ul className="flex items-center gap-6">
          <li className="flex items-center hover:text-gray-500">
            <Link to="/user">
              <Heart />
            </Link>
          </li>
          <li className="flex items-center hover:text-gray-500">
            <Link to="/cart">
              <ShoppingCart />
            </Link>
          </li>
          <DropdownAccount />
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
