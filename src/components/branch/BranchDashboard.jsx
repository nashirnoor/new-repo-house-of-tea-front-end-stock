import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { AlertCircle, Package, ShoppingCart } from "lucide-react";
import { api } from "@/services/api";
import Loader from "../layout/Loader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const BranchDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/branch-dashboard/");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching branch dashboard data:", error);
      setError(
        "Failed to fetch branch dashboard data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!dashboardData) return null;

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Branch Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Products"
          value={dashboardData.overview.total_products}
          icon={<Package className="h-6 w-6 text-blue-500" />}
          description="Products in branch"
        />
        <StatCard
          title="Active Products"
          value={dashboardData.overview.active_products}
          icon={<Package className="h-6 w-6 text-green-500" />}
          description="Active products in branch"
        />
        <StatCard
          title="Total Requests"
          value={dashboardData.overview.total_requests}
          icon={<ShoppingCart className="h-6 w-6 text-purple-500" />}
          description="Total product requests"
        />
        <StatCard
          title="Pending Requests"
          value={dashboardData.overview.pending_requests}
          icon={<AlertCircle className="h-6 w-6 text-yellow-500" />}
          description="Pending product requests"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products by Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.top_products} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product__name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" name="Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.request_status}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {dashboardData.request_status.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Outflow Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.product_outflow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date_sent" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_quantity"
                  stroke="#8884d8"
                  name="Quantity Sent"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Inventory Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.inventory_levels}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product__name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#82ca9d" name="Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export default BranchDashboard;
