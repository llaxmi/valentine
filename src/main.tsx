import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ComposePage from "./pages/ComposePage";
import StatusPageRoute from "./pages/StatusPageRoute";
import ViewerPage from "./pages/ViewerPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComposePage />} />
        <Route path="/v/:id" element={<ViewerPage />} />
        <Route path="/check/:token" element={<StatusPageRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
