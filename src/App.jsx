import { RouterProvider } from "react-router-dom";
import { router } from "@/app/Router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <CartProvider>
      <TooltipProvider delayDuration={200}>
        <AuthProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </AuthProvider>
      </TooltipProvider>
    </CartProvider>
  );
}

export default App;
