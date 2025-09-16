import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Settings } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";

function initials(name = "", email = "") {
  const n = (name || "").trim();
  if (n) {
    const [a = "", b = ""] = n.split(/\s+/);
    return (a[0] + (b[0] || "")).toUpperCase();
  }
  return (email?.[0] || "U").toUpperCase();
}

function formatAddress(addr = {}) {
  const { line, city, state, postal, country } = addr;
  return [
    [line].filter(Boolean).join(" "),
    [city, state, postal].filter(Boolean).join(" "),
    country,
  ]
    .filter(Boolean)
    .join(" • ");
}

export default function UserHeader({ user, onSave }) {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  useEffect(() => {
    setAvatarUrl(user?.avatarUrl || "");
  }, [user?.avatarUrl]);

  const displayUsername = user?.username || user?.name || "User";

  const handleSave = async (patch, extra) => {
    const res = await onSave?.(patch, extra);
    if (patch?.avatarUrl) {
      const bust = `${patch.avatarUrl}${
        patch.avatarUrl.includes("?") ? "&" : "?"
      }t=${Date.now()}`;
      setAvatarUrl(bust);
    }
    return res;
  };

  return (
    <header className="w-full">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-elevated/50 p-4 md:flex-row md:items-center md:justify-between">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-[100px] w-[100px] ring-1 ring-border">
              <AvatarImage src={avatarUrl} alt={displayUsername} />
              <AvatarFallback className="bg-surface text-foreground/80">
                {initials(displayUsername, user?.email)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold leading-none">
              {displayUsername}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-foreground/80">
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{user?.email || "—"}</span>
            </div>
            {user?.address && (
              <div className="mt-1 flex items-center gap-2 text-sm text-foreground/80">
                <MapPin className="size-4 shrink-0" />
                <span className="truncate">{formatAddress(user.address)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            className="gap-2"
            onClick={() => setOpen(true)}
          >
            <Settings className="size-4" />
            Edit profile
          </Button>

          <EditProfileDialog
            open={open}
            onOpenChange={setOpen}
            user={user}
            onSave={handleSave}
          />
        </div>
      </div>
    </header>
  );
}
