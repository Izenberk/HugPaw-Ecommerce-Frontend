import Blackcat from "@/assets/images/blackcat.jpg"

export default function UserHeader({ avatar, name, role, bio, onEditProfile }) {
    const fallback = Blackcat;

    return (
        <header className="flex items-center gap-5">
        <div className="w-[100px] h-[100px] shrink-0">
            <img
            src={avatar || fallback}
            onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallback;
            }}
            alt={`${name}'s profile`}
            className="w-[100px] h-[100px] rounded-full object-cover border-4 border-border shadow-md"
            loading="lazy"
            referrerPolicy="no-referrer"
            />
        </div>
        <div className="flex flex-col w-full max-w-screen-md bg-background h-24 p-2 rounded-[12px]">
            <p className="font-semibold text-2xl">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
            <p className="text-sm">{bio}</p>
            <div className="mt-2 flex gap-3">
            <button
                type="button"
                onClick={onEditProfile}
                className="text-primary hover:underline hover:cursor-pointer"
            >
                Edit Profile
            </button>
            </div>
        </div>
        </header>
    );
}
