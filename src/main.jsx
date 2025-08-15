import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./pages/auth/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TooltipProvider delayDuration={200}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TooltipProvider>
  </StrictMode>
);
