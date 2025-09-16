import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, CircleUserRound, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCloseOnRouteChange } from "@/hooks/useCloseOnRouteChange";

function displayNameFromUser(user) {
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "User";
  return name.trim();
}

const DropdownAccount = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  useCloseOnRouteChange(setOpen);

  const [avatarSrc, setAvatarSrc] = useState(Blackcat);
  useEffect(() => {
    if (user?.avatarUrl) {
      const url = user.avatarUrl;
      const bust = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
      setAvatarSrc(bust);
    } else {
      setAvatarSrc(Blackcat);
    }
  }, [user?.avatarUrl]);

  const name = useMemo(() => displayNameFromUser(user), [user]);
  const email = user?.email || "—";

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
              <Link to={isLoggedIn ? "/user" : "/login"} className="flex items-center gap-2">
                <div>
                  <img
                    src={avatarSrc}
                    onError={(e) => {
                      e.currentTarget.src = Blackcat;
                    }}
                    alt="UserPic"
                    className="w-[90px] h-[90px] shrink-0 rounded-full object-cover border-4 border-border shadow-md"
                  />
                </div>
                <div className="flex flex-col items-left py-4 gap-3 text-[16px]">
                  <p>{isLoggedIn ? name : "Guest"}</p>
                  <p>{isLoggedIn ? email : "Sign in to continue"}</p>
                </div>
                <div className="absolute right-1/50 -translate-x-1/2 text-gray-500" />
              </Link>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {isLoggedIn ? (
            <>
              <DropdownMenuItem asChild>
                <Link to="/user" className="flex w-full items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Settings />
                    Setting
                  </span>
                  <ChevronRight />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={logout}
                className="flex w-full items-center justify-between cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut />
                  Sign out
                </span>
                <ChevronRight />
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/login" className="flex w-full items-center justify-between">
                <span>Sign in</span>
                <ChevronRight />
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownAccount;
