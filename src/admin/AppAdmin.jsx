// src/admin/AppAdmin.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ItemsPage from "./pages/ItemsPage.jsx";

export default function AppAdmin() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/items" element={<ItemsPage />} />
        <Route path="*" element={<Navigate to="/admin/items" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
