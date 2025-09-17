import { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:3030/api/v1";

export function EditProfileDialog({ open, onOpenChange, user, onSave }) {
  const [displayName, setDisplayName] = useState(user?.username || "");
  const [addr, setAddr] = useState({
    line: user?.address?.line || "",
    phone: user?.address?.phone || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postal: user?.address?.postal || "",
    country: user?.address?.country || "TH",
  });

  useEffect(() => {
    setDisplayName(user?.username || "");
    setAddr({
      line: user?.address?.line || "",
      phone: user?.address?.phone || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postal: user?.address?.postal || "",
      country: user?.address?.country || "TH",
    });
  }, [user]);

  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setAvatarPreview(user?.avatarUrl || "");
  }, [user?.avatarUrl]);

  const handlePickFile = () => fileInputRef.current?.click();

  async function uploadAvatarToServer(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/uploads/avatar`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Upload failed");
    return data.url;
  }
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localURL = URL.createObjectURL(file);
    setAvatarPreview(localURL);
    setAvatarFile(file);

    try {
      setUploading(true);
      const url = await uploadAvatarToServer(file);

      const bust = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
      setAvatarPreview(bust);

      await onSave?.({ avatarUrl: url }, { avatarFile: null });
    } catch (err) {
      console.error("Upload avatar failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const nextUser = {
      username: (displayName || "").trim(),
      address: { ...addr },
    };
    await onSave?.(nextUser, { avatarFile });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0">
        <div className="flex max-h-[85dvh] flex-col">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>

          {/* ===== Scrollable content ===== */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Label
                  htmlFor="avatarFile"
                  className="mb-2 block text-xs text-muted-foreground"
                >
                  Avatar
                </Label>
                <div className="relative">
                  <div className="h-[100px] w-[100px] overflow-hidden rounded-full ring-1 ring-border">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-surface">
                        <UserRound className="size-6" />
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                    onClick={handlePickFile}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                  <input
                    id="avatarFile"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Display name + Email */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} />
              </div>
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                value={addr.phone}
                onChange={(e) =>
                  setAddr((s) => ({ ...s, phone: e.target.value }))
                }
                placeholder="09x-xxx-xxxx"
              />
            </div>

            {/* Address */}
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="line">Address</Label>
                <Input
                  id="line"
                  value={addr.line}
                  onChange={(e) =>
                    setAddr((s) => ({ ...s, line: e.target.value }))
                  }
                  placeholder="Street, house number"
                />
              </div>

              {/* แถว: City + State + Postal */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={addr.city}
                    onChange={(e) =>
                      setAddr((s) => ({ ...s, city: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">District/State</Label>
                  <Input
                    id="state"
                    value={addr.state}
                    onChange={(e) =>
                      setAddr((s) => ({ ...s, state: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    value={addr.postal}
                    onChange={(e) =>
                      setAddr((s) => ({ ...s, postal: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={addr.country}
                  onChange={(e) =>
                    setAddr((s) => ({ ...s, country: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t bg-background p-4">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
