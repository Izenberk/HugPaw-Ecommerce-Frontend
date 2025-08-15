import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/pages/auth/AuthContext";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
import Blackcat from "@/assets/images/blackcat.jpg";

const DropdownAccout = () => {
  const { isLoggedIn, logout } = useAuth();
  return (
    <div>
      <DropdownMenu>
        <div className="flex items-center gap-2">
          <DropdownMenuTrigger className="flex items-center gap-2">
            <CircleUserRound />
            Account
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div className="flex justify-between gap-4">
              <div>
                <img
                  src={Blackcat}
                  alt="UserPic"
                  className="w-[90px] h-[90px] shrink-0 rounded-full object-cover border-4 border-border shadow-md"
                />
              </div>
              <div className="flex flex-col items-left py-5 gap-3 text-[16px]">
                <p>Black Cat Lover</p>
                <p>blackcat@gmail.com</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings />
            Setting
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownAccout;
