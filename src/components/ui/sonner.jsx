import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          background: "var(--success)",
          color: "var(--popover-foreground)",
          border: "var(--border)"
        }
      }
      {...props} />
  );
}

export { Toaster }
