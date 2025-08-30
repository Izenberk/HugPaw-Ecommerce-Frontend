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
  // eslint-disable-next-line no-unused-vars
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useCloseOnRouteChange(setOpen)

  return (
    <div className="z-[200]">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <div className="flex items-center gap-2">
          <DropdownMenuTrigger className="flex items-center gap-2 hover:text-gray-500">
            <CircleUserRound />
            <span>Account</span>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent className="z-[1000]">
          <DropdownMenuLabel>
            <div className="flex justify-between gap-6">
              <Link to="/user" className="flex items-center gap-2">
                <div>
                  <img
                    src={Blackcat}
                    alt="UserPic"
                    className="w-[90px] h-[90px] shrink-0 rounded-full object-cover border-4 border-border shadow-md"
                  />
                </div>
                <div className="flex flex-col items-left py-4 gap-3 text-[16px]">
                  <p>Black Cat Lover</p>
                  <p>blackcat@gmail.com</p>
                </div>
                <div className="absolute right-1/50 -translate-x-1/2 text-gray-500">
                  
                </div>
              </Link>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings />
            Setting
            <div className="absolute right-1/30 -translate-x-1/2">
              <ChevronRight />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut />
            Sign out
            <div className="absolute right-1/30 -translate-x-1/2">
              <ChevronRight />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownAccount;
