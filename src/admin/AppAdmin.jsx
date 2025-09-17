// src/admin/AppAdmin.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ItemsPage from "./pages/ProductsPage.jsx";

export default function AppAdmin() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/products" element={<ItemsPage />} />
        <Route path="*" element={<Navigate to="/admin/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
