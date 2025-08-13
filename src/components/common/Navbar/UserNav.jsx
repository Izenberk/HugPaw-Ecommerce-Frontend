import { CircleUserRound, Heart, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { set } from "zod";

const UserNav = () => {
  const [isLoggedgin, setIsLoggedgin] = useState(false);
  const toggleLogin = () => setIsLoggedin(!isLoggedIn);

  return (
    <div>
      {isLoggedgin ? (
        <ul>
          <li className="flex items-center hover:opacity-80 cursor-pointer">
            <Link to="/">
              <Heart />
            </Link>
          </li>
          <li className="flex items-center hover:opacity-80 cursor-pointer">
            <Link to="/">
              <ShoppingCart />
            </Link>
          </li>
          <li className="flex flex-row items-center hover:opacity-80 cursor-pointer">
            <Link to="user" className="flex items-center gap-2">
              <CircleUserRound />
              <div>Account</div>
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="flex items-center gap-4 text-primary-foreground">
          <li className="hover:text-white" onClick={toggleLogin}>
            <Link to="/login">Login</Link>
          </li>
          <li className="hover:text-white">
            <Link to="/signup">Sign Up</Link>
          </li>
          <li className="hover:text-white">
            <Link to="/">Contact</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserNav;
