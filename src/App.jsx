import { RouterProvider } from "react-router-dom";
import { router } from "@/app/Router";
import { AuthProvider } from "./pages/auth/AuthContext";
import { CartProvider } from "./pages/userCart/CartContext";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
        </CartProvider>
   </AuthProvider>
  );
}

export default App;
