import { RouterProvider } from "react-router-dom";
import { router } from "@/app/Router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";


function App() {
  return (
    <CartProvider>
      <TooltipProvider delayDuration={200}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </TooltipProvider>
    </CartProvider>
  );
}

export default App;
