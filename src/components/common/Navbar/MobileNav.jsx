// MobileNav.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu, ChevronRight, PawPrint, Heart, ShoppingCart,
  MessageSquareText, Settings, LogOut, UserRound, UserRoundPen
} from "lucide-react";
import { useAuth } from "@/pages/auth/AuthContext";
import Logo from "../Logo";
import Blackcat from "@/assets/images/blackcat.jpg";
import { useCloseOnRouteChange } from "@/hooks/useCloseOnRouteChange";

const MobileNav = () => {
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Close when the route changes
  useCloseOnRouteChange(setOpen);

  return (
    <div className="h-14">
      <div className="grid grid-cols-3 items-center h-14">
        {/* Left: Menu trigger */}
        <div className="pl-3">
          <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
            <DropdownMenuTrigger asChild aria-label="Menu">
              <button type="button" className="p-2 rounded-md hover:bg-foreground/10">
                <Menu className="hover:text-gray-500" />
              </button>
            </DropdownMenuTrigger>

            {/* Lightweight overlay to close on any outside tap/click */}
            {open && (
              <div
                className="fixed inset-0 z-[9995]"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
            )}

            {/* Menu content */}
            <DropdownMenuContent
              className="w-screen p-5 mt-2 z-[10000]"
              align="start"
              sideOffset={8}
              onPointerDownOutside={() => setOpen(false)}  // close on outside tap/click
              onEscapeKeyDown={() => setOpen(false)}       // close on Esc
            >
              {isLoggedIn ? (
                <>
                  <DropdownMenuLabel asChild>
                    <Link to="/user" onClick={() => setOpen(false)}>
                      <div className="relative flex gap-10 p-3 border-2 rounded-md">
                        <img
                          src={Blackcat}
                          alt="UserPic"
                          className="w-[80px] h-[80px] shrink-0 rounded-full object-cover border-4 border-border shadow-md my-2"
                        />
                        <div className="flex flex-col justify-center gap-1 text-[16px]">
                          <p>Black Cat Lover</p>
                          <p className="text-muted-foreground">blackcat@gmail.com</p>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                          <ChevronRight />
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuLabel>

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/catalog" className="flex gap-3 items-center hover:text-gray-500">
                      <PawPrint /> Products
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/user" className="flex gap-3 items-center hover:text-gray-500">
                      <Heart /> Wishlist
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/cart" className="flex gap-3 items-center hover:text-gray-500">
                      <ShoppingCart /> My Cart
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/contact" className="flex gap-3 items-center hover:text-gray-500">
                      <MessageSquareText /> Contact
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/setting" className="flex gap-3 items-center hover:text-gray-500">
                      <Settings /> Setting
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      logout();
                    }}
                    className="flex gap-3 items-center hover:text-gray-500"
                  >
                    <LogOut /> Sign Out
                    <div className="absolute right-4"><ChevronRight /></div>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/login" className="flex gap-3 items-center hover:text-gray-500">
                      <UserRound /> Login
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/signup" className="flex gap-3 items-center hover:text-gray-500">
                      <UserRoundPen /> Sign up
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/catalog" className="flex gap-3 items-center hover:text-gray-500">
                      <PawPrint /> Products
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/cart" className="flex gap-3 items-center hover:text-gray-500">
                      <ShoppingCart /> My Cart
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
                    <Link to="/contact" className="flex gap-3 items-center hover:text-gray-500">
                      <MessageSquareText /> Contact
                      <div className="absolute right-4"><ChevronRight /></div>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Right: Cart */}
        <div className="flex justify-end pr-3">
          <Link to="/cart" className="hover:text-gray-500">
            <ShoppingCart />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
