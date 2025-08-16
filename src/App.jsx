import { RouterProvider } from "react-router-dom";
import { router } from "@/app/Router";
import { AuthProvider } from "./pages/auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
