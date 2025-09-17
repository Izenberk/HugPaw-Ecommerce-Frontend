
import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";
import { showToast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";

export default function useLoginAlert(
  message = "Please log in to access this feature."
) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return useCallback(
    (e) => {
      if (!isLoggedIn) {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        // alert(message);
          showToast("alert", {
                    title: message,
                    onAction: () => navigate("/login"),
                }, { duration: 2000 });
        return false;
      }
      return true;
    },
    [isLoggedIn, message]
  );
}
