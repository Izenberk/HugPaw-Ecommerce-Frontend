import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound } from "lucide-react";

export function EditProfileDialog({ open, onOpenChange, user, onSave }) {
    const [displayName, setDisplayName] = useState(user?.username || "");
    const [addr, setAddr] = useState({
        line1: user?.address?.line1 || "",
        line2: user?.address?.line2 || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        postal: user?.address?.postal || "",
        country: user?.address?.country || "",
    });
    const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    const handlePickFile = () => fileInputRef.current?.click();
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
    };

    const handleSave = async () => {
        const nextUser = {
        ...user,
        username: displayName.trim() || user.username,
        address: { ...addr },
        };
        await onSave?.(nextUser, { avatarFile });
        onOpenChange?.(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        {/* p-0 to let us control layout; max-h uses dynamic viewport units for mobile */}
        <DialogContent className="sm:max-w-[560px] p-0">
            {/* Column layout: header (fixed) + scroll area (flex-1) + footer (fixed) */}
            <div className="flex max-h-[85dvh] flex-col">
            <DialogHeader className="p-6 pb-2">
                <DialogTitle>Edit profile</DialogTitle>
            </DialogHeader>

            {/* Scrollable content only in the middle */}
            <div
                className="
                flex-1 overflow-y-auto px-6 pb-6 space-y-6
                [-webkit-overflow-scrolling:touch] overscroll-contain
                "
            >
                {/* Avatar picker */}
                <div className="flex items-center gap-4">
                <div className="relative">
                    <Label htmlFor="avatarFile" className="mb-2 block text-xs text-muted-foreground">
                    Avatar
                    </Label>
                    <div className="relative">
                    <div className="h-[100px] w-[100px] overflow-hidden rounded-full ring-1 ring-border">
                        {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
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
                    >
                        Upload
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

                {/* Name + Email */}
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
                    <Label htmlFor="email">Email (read-only)</Label>
                    <Input id="email" value={user?.email || ""} readOnly />
                </div>
                </div>

                {/* Address */}
                <div className="grid gap-3">
                <div className="grid gap-2">
                    <Label htmlFor="line1">Address line 1</Label>
                    <Input
                    id="line1"
                    value={addr.line1}
                    onChange={(e) => setAddr((s) => ({ ...s, line1: e.target.value }))}
                    placeholder="Street, house number"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="line2">Address line 2 (optional)</Label>
                    <Input
                    id="line2"
                    value={addr.line2}
                    onChange={(e) => setAddr((s) => ({ ...s, line2: e.target.value }))}
                    placeholder="Apartment, suite, etc."
                    />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        value={addr.city}
                        onChange={(e) => setAddr((s) => ({ ...s, city: e.target.value }))}
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                        id="state"
                        value={addr.state}
                        onChange={(e) => setAddr((s) => ({ ...s, state: e.target.value }))}
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="postal">Postal</Label>
                    <Input
                        id="postal"
                        value={addr.postal}
                        onChange={(e) => setAddr((s) => ({ ...s, postal: e.target.value }))}
                    />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                    id="country"
                    value={addr.country}
                    onChange={(e) => setAddr((s) => ({ ...s, country: e.target.value }))}
                    />
                </div>
                </div>
            </div>

            {/* Non-scrolling footer */}
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
