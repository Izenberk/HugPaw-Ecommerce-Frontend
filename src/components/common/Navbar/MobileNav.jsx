import React from "react";
import Logo from "../Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  Heart,
  LogOut,
  Menu,
  MessageSquareText,
  PawPrint,
  Settings,
  ShoppingCart,
  UserRound,
  UserRoundPen,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth } from "@/pages/auth/AuthContext";
import Blackcat from "@/assets/images/blackcat.jpg";

const MobileNav = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div>
      {isLoggedIn ? (
        <div className="flex items-center justify-between min-w-max min-h-full">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu className="hover:text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-screen p-5 mt-6.5">
                <DropdownMenuLabel>
                  <div className="flex gap-10 p-3 border-[2px] rounded-md">
                    <div>
                      <img
                        src={Blackcat}
                        alt="UserPic"
                        className="w-[80px] h-[80px] shrink-0 rounded-full object-cover border-4 border-border shadow-md my-2"
                      />
                    </div>
                    <div className="flex flex-col items-left py-5 gap-3 text-[16px]">
                      <p>Black Cat Lover</p>
                      <p>blackcat@gmail.com</p>
                    </div>
                    <div className="absolute right-1/20 -translate-x-1/2 text-gray-300">
                      <X />
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    to="/catalog"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <PawPrint /> Products
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/wishlist"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <Heart /> Wishlist
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/cart"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <ShoppingCart /> My Cart
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/contact"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <MessageSquareText /> Contact
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/setting"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <Settings /> Setting
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    onClick={logout}
                    className="flex gap-3 items-center hover:text-gray-500 w-full text-left"
                  >
                    <LogOut /> Sign Out
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </div>
          <div className="absolute right-1/15 -translate-x-1/2">
            <Link to="/cart" className="hover:text-gray-500">
              <ShoppingCart />
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between min-w-max min-h-full">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu className="hover:text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-screen p-5 mt-6.5">
                <DropdownMenuLabel>
                  <div className="relative flex flex-row w-full gap-3 p-3 border-[2px] rounded-md text-lg">
                    <div className="flex justify-center items-center">
                      <p>Account</p>
                    </div>
                    <div className="absolute right-3 text-gray-300">
                      <X />
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuItem asChild>
                  <Link
                    to="/login"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <UserRound /> Login
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/signup"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <UserRoundPen /> Sign up
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/catalog"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <PawPrint /> Products
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/cart"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <ShoppingCart /> My Cart
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/contact"
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <MessageSquareText /> Contact
                    <div className="absolute right-1/30 -translate-x-1/2">
                      <ChevronRight />
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </div>
          <div className="absolute right-1/15 -translate-x-1/2">
            <Link to="/cart" className="hover:text-gray-500">
              <ShoppingCart />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
