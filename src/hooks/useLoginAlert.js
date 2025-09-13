
import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";

export default function useLoginAlert(
  message = "Please log in to access this feature."
) {
  const { isLoggedIn } = useAuth();

  return useCallback(
    (e) => {
      if (!isLoggedIn) {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        alert(message);
        return false;
      }
      return true;
    },
    [isLoggedIn, message]
  );
}
