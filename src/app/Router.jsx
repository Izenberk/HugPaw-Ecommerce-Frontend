import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "@/app/Layout.jsx";
import NotFound from "@/pages/404_page.jsx";

import HomePage from "@/pages/HomePage.jsx";
import Login from "@/pages/auth/Login.jsx";
import Signup from "@/pages/auth/SignUp.jsx";
import ResetPassword from "@/pages/auth/ResetPassword.jsx";
import VerificationForm from "@/pages/auth/VerificationForm";
import ForgotPassword from "@/pages/auth/ForgetPassword";

import ProductCatalogPage from "@/pages/ProductCatalogPage.jsx";
import ProductCustomPage, { productLoader } from "@/pages/ProductCustomPage.jsx";
import CartPage from "@/pages/CartPage.jsx";
import CheckoutPage from "@/pages/CheckoutPage.jsx";
import UserPage from "@/pages/UserPage.jsx";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// 🧩 Admin pages (NO BrowserRouter inside these files)
import AdminLayout from "@/admin/AdminLayout.jsx";
import ItemsPage from "@/admin/pages/ProductsPage.jsx"; // formerly used by AppAdmin

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      { path: "catalog", element: <ProductCatalogPage /> },
      {
        path: "products/:id",
        loader: productLoader,
        element: <ProductCustomPage />,
        errorElement: <div className="p-6">Product not found 🐾</div>,
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgotpassword", element: <ForgotPassword /> },
      { path: "verification", element: <VerificationForm /> },
      { path: "resetpassword", element: <ResetPassword /> },

      { path: "cart", element: <CartPage /> },
      {
        path: "cart/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // 🔐 Admin subtree guarded by AdminRoute
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    errorElement: <div className="p-6">Admin page not found</div>,
    children: [
      { index: true, element: <Navigate to="products" replace /> },
      { path: "products", element: <ItemsPage /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
