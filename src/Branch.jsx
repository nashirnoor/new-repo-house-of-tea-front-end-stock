import "./App.css";
import { Routes, Route } from "react-router-dom";
import BranchDashboardPage from "./pages/branchPages/BranchDashboardPage";
import InventoryPage from "./pages/branchPages/InventoryPage";
import ProductRequestsPage from "./pages/branchPages/ProductRequestsPage";
import BranchReports from "./pages/branchPages/BranchReports";
import ProfilePage from "./pages/branchPages/ProfilePage";
import NotificationPage from "./pages/branchPages/NotificationPage";
import { Toaster } from "./components/ui/toaster";

function Branch() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<BranchDashboardPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/requests" element={<ProductRequestsPage />} />
        <Route path="/reports" element={<BranchReports />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
    </>
  );
}

export default Branch;
