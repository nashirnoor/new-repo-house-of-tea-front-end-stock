import "./App.css";
import { Routes, Route } from "react-router-dom";
import StoreDashboardPage from "./pages/storePages/StoreDashboardPage";
import NotFound404 from "./components/layout/NotFound404";
import StoreProducts from "./pages/storePages/StoreProducts";
import Suppliers from "./pages/storePages/Suppliers";
import Branches from "./pages/storePages/Branches";
import ProductInflow from "./pages/storePages/ProductInflow";
import ProductOutflow from "./pages/storePages/ProductOutflow";
import StoreReports from "./pages/storePages/StoreReports";
import Notifications from "./pages/storePages/Notifications";
import DamagedProductsPage from "./pages/storePages/DamagedProductsPage";
import ProductRequestsPage from "./pages/storePages/ProductRequestsPage";
import { Toaster } from "./components/ui/toaster";
import Layout from "./components/layout/Layout";

function Store() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<StoreDashboardPage />} />
        <Route path="/products" element={<StoreProducts />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/damaged-products" element={<DamagedProductsPage />} />
        <Route path="/product-requests" element={<ProductRequestsPage />} />
        <Route path="/product-inflow" element={<ProductInflow />} />
        <Route path="/product-outflow" element={<ProductOutflow />} />
        <Route path="/reports" element={<StoreReports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </>
  );
}

export default Store;
