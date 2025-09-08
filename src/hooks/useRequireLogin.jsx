import { useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function useRequireLogin({
    message = "Please log in to access this feature.",
    description = "You need an account to continue.",
    loginPath = "/login",
    rememberRedirect = true,
    icon = <PawPrint className="text-primary" />, // default icon
    } = {}) {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const ensureLoggedIn = useCallback(() => {
        if (isLoggedIn) return true;

        const redirect = rememberRedirect
        ? `?redirect=${encodeURIComponent(location.pathname + location.search)}`
        : "";

        showToast("warn", {
            icon,
            title: message,
            description,
            actionLabel: "Log in",
            onAction: () => navigate(`${loginPath}${redirect}`),
        }, { duration: 4000 });

        return false;
    }, [
        isLoggedIn,
        location.pathname,
        location.search,
        loginPath,
        rememberRedirect,
        message,
        description,
        navigate,
        icon,
    ]);

    const requireLogin = useCallback(
        (handler) =>
        (e) => {
            if (ensureLoggedIn()) return handler?.(e);
            e?.preventDefault?.();
            e?.stopPropagation?.();
            return false;
        },
        [ensureLoggedIn]
    );

    return { ensureLoggedIn, requireLogin, isLoggedIn };
}
