import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:3030/api/v1";

const UserCtx = createContext(null);

const DEFAULT_USER = {
  avatarUrl: "",
  username: "",
  email: "",
  role: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal: "",
    country: "TH",
    phone: "",
  },
};

// Server → Client (map user object from backend into UI front-end)
function serverToClient(u = {}) {
  const primary = Array.isArray(u?.addresses)
    ? u.addresses.find((a) => a?.isDefault) || u.addresses[0]
    : undefined;

  return {
    id: u?._id ?? u?.id,
    avatarUrl: u?.avatarUrl || "",
    username: [u?.firstName, u?.lastName].filter(Boolean).join(" "),
    firstName: u?.firstName || "",
    lastName: u?.lastName || "",
    email: u?.email || "",
    role: u?.role || "Customer",
    userCart: Array.isArray(u?.userCart) ? u.userCart : [],
    favoriteCart: Array.isArray(u?.favoriteCart) ? u.favoriteCart : [],
    address: primary
      ? {
          line1: primary.addressLine1 || "",
          line2: primary.line2 || "",
          city: primary.city || "",
          state: primary.district || "",
          postal: primary.postalCode || "",
          country: primary.country || "TH",
          phone: primary.phone || "",
        }
      : { ...DEFAULT_USER.address },
  };
}

// Client → Server (map patch from UI to payload)
function clientPatchToServer(currentUser = {}, nextUser = {}) {
  const p = {};

  if (nextUser.username) {
    const parts = String(nextUser.username).trim().split(/\s+/);
    p.firstName = parts[0] || currentUser.firstName || "";
    p.lastName = parts.slice(1).join(" ") || currentUser.lastName || "";
  }

  if (nextUser.firstName !== undefined) p.firstName = nextUser.firstName;
  if (nextUser.lastName !== undefined) p.lastName = nextUser.lastName;
  if (nextUser.avatarUrl !== undefined) p.avatarUrl = nextUser.avatarUrl;

  // address.* (UI) → addresses[0].* (backend)
  const a = nextUser.address || {};
  const hasAny =
    a.line1 || a.line2 || a.city || a.state || a.postal || a.country || a.phone;
  if (hasAny) {
    if (a.phone && a.postal) {
      p.addresses = [
        {
          fullName: [
            p.firstName ?? currentUser.firstName,
            p.lastName ?? currentUser.lastName,
          ]
            .filter(Boolean)
            .join(" "),
          phone: a.phone,
          addressLine1: a.line1 || "",
          line2: a.line2 || "",
          district: a.state || "",
          city: a.city || "",
          country: a.country || "TH",
          postalCode: a.postal,
          isDefault: true,
        },
      ];
    } else {
      console.warn("[saveProfile] skip addresses: require phone & postal", a);
    }
  }

  return p;
}

//
async function putUser(id, payload) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Update failed");
  return data;
}

async function uploadAvatarToServer(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/uploads/avatar`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Upload failed");
  return data.url;
}

export function UserProvider({ children }) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(DEFAULT_USER);
  const [loading, setLoading] = useState(false);

  const getJSON = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const refreshUser = async () => {
    if (!authUser?._id && !authUser?.id) return;
    setLoading(true);
    try {
      const data = await getJSON("/users/me");
      const merged = serverToClient(data.user || {});
      setUser((prev) => ({ ...prev, ...merged }));
      return merged;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      setUser(serverToClient(authUser));
      refreshUser().catch(() => {});
    } else {
      setUser(DEFAULT_USER);
    }
  }, [authUser?.id, authUser?._id]);

  const updateUser = (patch) => setUser((prev) => ({ ...prev, ...patch }));

  const updateAddress = (addrPatch) =>
    setUser((prev) => ({
      ...prev,
      address: { ...(prev.address || {}), ...addrPatch },
    }));

  // Save Profile
  const saveProfile = async (nextUser, { avatarFile } = {}) => {
    if (!user?.id) throw new Error("Missing user id");

    if (avatarFile) {
      try {
        const avatarUrl = await uploadAvatarToServer(avatarFile);
        nextUser = { ...nextUser, avatarUrl };
      } catch (e) {
        console.error("Upload avatar failed:", e);
      }
    }

    const payload = clientPatchToServer(user, nextUser);

    const res = await putUser(user.id, payload);

    const merged = serverToClient(res.user || {});
    setUser((prev) => ({ ...prev, ...merged }));

    return { success: true };
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      updateUser,
      updateAddress,
      refreshUser,
      saveProfile,
    }),
    [user, loading]
  );

  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

export const useUser = () => useContext(UserCtx);
