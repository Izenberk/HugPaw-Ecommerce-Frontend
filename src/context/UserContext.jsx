import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Blackcat from "@/assets/images/blackcat.jpg";

const UserCtx = createContext(null);

const DEFAULT_USER = {
    avatarUrl: Blackcat,
    username: "BlackCat Lover",
    email: "blackcat@example.com",
    role: "Customer",
    address: {
        line1: "99 Catnip Alley",
        line2: "",
        city: "Bangkok",
        state: "Din Daeng",
        postal: "10400",
        country: "Thailand",
    },
};

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("userProfile");
        return saved ? JSON.parse(saved) : DEFAULT_USER;
    });

    useEffect(() => {
        localStorage.setItem("userProfile", JSON.stringify(user));
    }, [user]);

    const updateUser = (patch) => setUser((prev) => ({ ...prev, ...patch }));
    const updateAddress = (addrPatch) =>
        setUser((prev) => ({ ...prev, address: { ...(prev.address || {}), ...addrPatch } }));

    const value = useMemo(
        () => ({ user, setUser, updateUser, updateAddress }),
        [user]
    );

    return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserCtx);
