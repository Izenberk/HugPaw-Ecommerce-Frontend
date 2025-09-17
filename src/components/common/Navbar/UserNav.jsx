import { useAuth } from "@/context/AuthContext";
import { Heart, ShoppingCart, LogOut } from "lucide-react";
import { Link, } from "react-router-dom";
import DropdownAccount from "./DropdownAccount";
import useLoginAlert from "@/hooks/useLoginAlert";
import { useCart } from "@/context/CartContext";

export default function UserNav() {
  // eslint-disable-next-line no-unused-vars
  const { isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();
  const stopIfLoggedOut = useLoginAlert("Please log in to access the cart.");

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
              {!cartCount > 0 ? (
                <ul>
                  <li>
                    <ShoppingCart />
                  </li>
                </ul>
              ) : (
                <ul className="relative">
                  <li>
                    <ShoppingCart />
                  </li>
                  <span className="absolute -right-4 -top-2.5 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                    {cartCount}
                  </span>
                </ul>
              )}
            </Link>
          </li>
          <DropdownAccount />
        </ul>
      ) : (
        <ul className="flex items-center gap-4 text-primary-foreground ">
          <li className="flex items-center hover: text-gray-500 ">
            <Link
              to="/cart"
              onClick={stopIfLoggedOut}
              onAuxClick={stopIfLoggedOut}
            >
              <ul>
                <li>
                  <ShoppingCart />
                </li>
              </ul>
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
