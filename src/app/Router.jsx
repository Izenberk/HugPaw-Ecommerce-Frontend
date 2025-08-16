import { createBrowserRouter } from "react-router-dom";
import Layout from "@/app/Layout";
import Home from "@/pages/Home";
import UserPage from "@/pages/userPage/UserPage";
import ProductDetail from "@/pages/ProductDetail";
import Login from "@/pages/auth/Login";
import ProductCatalogPage from "@/pages/productCatalog/ProductRoute";
import Signup from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgetPassword";
import ProductDetailRoute from '@/pages/productDetail/ProductDetailRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <div>
        <h1>404 - Page Not Found ⚠️</h1>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "catalog",
        element: <ProductCatalogPage />,
      },
      {
          path: "products/:id",
          element: <ProductDetailRoute />,
      },
      {
        path: "product-customize",
        element: <ProductDetailRoute />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "forgotpassword",
        element: <ForgotPassword />,
      },
    ],
  },
]);
