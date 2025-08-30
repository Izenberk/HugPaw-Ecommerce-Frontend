
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useCloseOnRouteChange(setOpen) {
    const { pathname, search, hash } = useLocation();
    useEffect(() => {
        setOpen(false);
    }, [pathname, search, hash, setOpen]); // keep setOpen to satisfy eslint
}