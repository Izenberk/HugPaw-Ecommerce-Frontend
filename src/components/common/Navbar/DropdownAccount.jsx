// src/components/common/Navbar/DropdownAccount.jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/pages/auth/AuthContext";
import { ChevronRight, CircleUserRound, LogOut, Settings } from "lucide-react";
import Blackcat from "@/assets/images/blackcat.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCloseOnRouteChange } from "@/hooks/useCloseOnRouteChange";

const DropdownAccount = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Close when route changes
  useCloseOnRouteChange(setOpen);

  return (
    <div className="z-[200]">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-foreground/10"
          >
            <CircleUserRound />
            <span>Account</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="z-[10000] w-72 p-2"
          // Close on outside click/tap and Esc
          onPointerDownOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
        >
          <DropdownMenuLabel asChild>
            <Link
              to="/user"
              onClick={() => setOpen(false)}
              className="relative flex items-center gap-4 p-3 rounded-md hover:bg-muted"
            >
              <img
                src={Blackcat}
                alt="UserPic"
                className="w-[90px] h-[90px] shrink-0 rounded-full object-cover border-4 border-border shadow-md"
              />
              <div className="flex flex-col justify-center gap-1 text-[16px]">
                <p>Black Cat Lover</p>
                <p className="text-muted-foreground">blackcat@gmail.com</p>
              </div>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </Link>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild onSelect={() => setOpen(false)}>
            <Link to="/setting" className="relative flex items-center gap-2 pr-8">
              <Settings className="h-4 w-4" />
              <span>Setting</span>
              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // run logout before menu unmount
              setOpen(false);
              logout();
            }}
            className="relative flex items-center gap-2 pr-8"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
            <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownAccount;
