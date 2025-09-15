// src/app/Router.jsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/app/Layout.jsx";
import HomePage from "@/pages/HomePage.jsx";
import Login from "@/pages/auth/Login.jsx";
import ProductCatalogPage from "@/pages/ProductCatalogPage.jsx";
import CartPage from "@/pages/CartPage.jsx";
import ProductCustomPage, { productLoader } from "@/pages/ProductCustomPage.jsx";
import Signup from "@/pages/auth/SignUp.jsx";
import NotFound from "@/pages/404_page.jsx";
import UserPage from "@/pages/UserPage.jsx";
import CheckoutPage from "@/pages/CheckoutPage.jsx";
import ResetPassword from "@/pages/auth/ResetPassword.jsx";
import VerificationForm from "@/pages/auth/VerificationForm";
import ForgotPassword from "@/pages/auth/ForgetPassword";

// --- NEW: lazy admin imports (JS components you just built) ---
import React, { Suspense } from "react";
const AdminLayout = React.lazy(() => import("@/admin/AdminLayout.jsx"));     // simple shell (header/sidebar) or reuse Layout
const ItemsPage   = React.lazy(() => import("@/admin/pages/ItemsPage.jsx")); // list + modal form


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "user", element: <UserPage /> },
      { path: "catalog", element: <ProductCatalogPage /> },
      {
        path: "products/:id",
        loader: productLoader,
        element: <ProductCustomPage />,
        errorElement: <div className="p-6">Product not found 🐾</div>,
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "cart", element: <CartPage /> },
      { path: "cart/checkout", element: <CheckoutPage /> },
      { path: "forgotpassword", element: <ForgotPassword /> },
      { path: "verification", element: <VerificationForm /> },
      { path: "resetpassword", element: <ResetPassword /> },
    ],
  },

  // --- NEW: admin area root (separate tree) ---
  {
    path: "/admin",
    element: (
      <Suspense fallback={<div className="p-6">Loading admin…</div>}>

          <AdminLayout />

      </Suspense>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <div className="p-6">Admin dashboard (coming soon)</div>,
      },
      {
        path: "items",
        element: (
          <Suspense fallback={<div className="p-6">Loading items…</div>}>
            <ItemsPage />
          </Suspense>
        ),
      },
    ],
  },
]);
