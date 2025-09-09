import { RouterProvider } from "react-router-dom";
import { router } from "@/app/Router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "./context/UserContext";


function App() {
  return (
    <UserProvider>
      <CartProvider>
        <TooltipProvider delayDuration={200}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </TooltipProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
