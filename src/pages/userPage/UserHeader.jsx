import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Mail, MapPin, Settings, UserRound } from "lucide-react";
import { useRef, useState } from "react";

function initials(name = "", email = "") {
    const n = (name || "").trim();
    if (n) {
        const parts = n.split(/\s+/);
        const [a = "", b = ""] = parts;
        return (a[0] + (b[0] || "")).toUpperCase();
    }
    return (email?.[0] || "U").toUpperCase();
}

function formatAddress(addr = {}) {
    const {
        line1, line2, city, state, postal, country
    } = addr;
    return [
        [line1, line2].filter(Boolean).join(" "),
        [city, state, postal].filter(Boolean).join(" "),
        country,
    ]
    .filter(Boolean)
    .join(" • ")
}

/**
 * Props:
 * - user: {
 *     avatarUrl?: string,
 *     username?: string,   // display name
 *     name?: string,       // optional legacy
 *     email: string,
 *     address?: { line1?, line2?, city?, state?, postal?, country? },
 *     role?: string
 *   }
 * - onSave: async (nextUser, { avatarFile }) => void
 */

export default function UserHeader({ user, onSave }) {
    const [open, setOpen] = useState(false);

    // editable state
    const [displayName, setDisplayName] = useState(user?.username || "");
    const [addr, setAddr] = useState({
        line1: user?.address?.line1 || "",
        line2: user?.address?.line2 || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        postal: user?.address?.postal || "",
        country: user?.address?.country || "",
    });

    // avatar editing
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
             // don't set avatarUrl directly here; let backend return canonical URL after upload
        };
        await onSave?.(nextUser, { avatarFile });
        setOpen(false)
    };

    const displayUsername = user?.username || user?.name || "User"

    return (
        <header className="w-full">
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-elevated/50 p-4 md:flex-row md:items-center md:justify-between">
                {/* Left: Identity */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {/* 1) Bigger avatar: 100x100 */}
                        <Avatar className="h-[100px] w-[100px] ring-1 ring-border">
                        <AvatarImage src={avatarPreview || user?.avatarUrl} alt={displayUsername} />
                        <AvatarFallback className="bg-surface text-foreground/80">
                            {initials(displayUsername, user?.email)}
                        </AvatarFallback>
                        </Avatar>

                        {/* Quick-change avatar trigger */}
                        <button
                        type="button"
                        onClick={handlePickFile}
                        className="absolute -bottom-1 -right-1 inline-flex items-center justify-center rounded-full border border-border bg-background p-2 shadow-sm hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Change profile picture"
                        title="Change profile picture"
                        >
                        <Camera className="size-4" />
                        </button>
                        <input id="avatarFile" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>

                    {/* 2) Ensure username shows, email below */}
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

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                {/* 3) Single action: Edit profile (removed duplicate Settings button) */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                    <Button variant="default" className="gap-2">
                        <Settings className="size-4" />
                        Edit profile
                    </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[560px]">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-6 py-2">
                            {/* Avatar picker */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Label htmlFor="avatarFile" className="mb-2 block text-xs text-muted-foreground">
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
                                    >
                                        Upload
                                    </Button>
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

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                            </Button>
                            <Button onClick={handleSave}>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                </div>
            </div>
        </header>
    );
}

// export default function UserHeader({ avatar, name, role, bio, onEditProfile }) {
//     const fallback = Blackcat;

//     return (
//         <header className="flex items-center gap-5">
//         <div className="w-[100px] h-[100px] shrink-0">
//             <img
//             src={avatar || fallback}
//             onError={(e) => {
//                 e.currentTarget.onerror = null;
//                 e.currentTarget.src = fallback;
//             }}
//             alt={`${name}'s profile`}
//             className="w-[100px] h-[100px] rounded-full object-cover border-4 border-border shadow-md"
//             loading="lazy"
//             referrerPolicy="no-referrer"
//             />
//         </div>
//         <div className="flex flex-col w-full max-w-screen-md bg-background h-24 p-2 rounded-[12px]">
//             <p className="font-semibold text-2xl">{name}</p>
//             <p className="text-sm text-muted-foreground">{role}</p>
//             <p className="text-sm">{bio}</p>
//             <div className="mt-2 flex gap-3">
//             <button
//                 type="button"
//                 onClick={onEditProfile}
//                 className="text-primary hover:underline hover:cursor-pointer"
//             >
//                 Edit Profile
//             </button>
//             </div>
//         </div>
//         </header>
//     );
// }

