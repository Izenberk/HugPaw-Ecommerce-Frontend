import ToastCard from "@/components/ui/toasts/ToastCard";
import toast from "react-hot-toast";

export function showToast(tone, props, options) {
    return toast.custom(
        (t) => <ToastCard id={t.id} tone={tone} {...props} />,
        { duration: 2500, ...options }
    );
}