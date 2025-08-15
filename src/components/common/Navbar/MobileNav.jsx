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
  BookHeart,
  KeyRound,
  Menu,
  PawPrint,
  Phone,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";

const MobileNav = () => {
  return (
    <div className="flex items-center justify-between min-w-max min-h-full">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                className="flex justify-between items-center gap-3"
                to="/catalog"
              >
                <PawPrint /> Products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex justify-between items-center gap-3"
                to="/cart"
              >
                <ShoppingCart /> My Cart
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex justify-between items-center gap-3"
                to="/signup"
              >
                <BookHeart /> Sign up
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex justify-between items-center gap-3"
                to="/login"
              >
                <KeyRound /> Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex justify-between items-center gap-3"
                to="/contact"
              >
                <Phone /> Contact
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <Logo />
      </div>
      <div className="w-6 h-6" />
    </div>
  );
};

export default MobileNav;
