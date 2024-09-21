import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AreaChart,
  Area,
} from "recharts";
import {
  AlertCircle,
  ArrowDownIcon,
  ArrowUpIcon,
  PieChart as PieChartIcon,
  Package,
} from "lucide-react";
import { api } from "@/services/api";
import Loader from "../layout/Loader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/dashboard/?period=${period}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!dashboardData) return null;

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Inventory Analytics Dashboard
        </h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Products"
          value={dashboardData.total_products}
          icon={<Package className="h-6 w-6 text-blue-500" />}
          description="Current inventory size"
        />
        <StatCard
          title="Total Branches"
          value={dashboardData.total_branches}
          icon={<PieChartIcon className="h-6 w-6 text-green-500" />}
          description="Number of active locations"
        />
        <StatCard
          title="Total Inflow"
          value={`${dashboardData.total_inflow} units`}
          subValue={`QAR ${dashboardData.total_inflow_value.toFixed(2)}`}
          icon={<ArrowDownIcon className="h-6 w-6 text-green-600" />}
          description="Products received"
        />
        <StatCard
          title="Total Outflow"
          value={`${dashboardData.total_outflow} units`}
          subValue={`QAR ${dashboardData.total_outflow_value.toFixed(2)}`}
          icon={<ArrowUpIcon className="h-6 w-6 text-red-600" />}
          description="Products dispatched"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products by Outflow</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.top_products} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_outflow" fill="#8884d8" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branch Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.branch_stock}
                  dataKey="total_stock"
                  nameKey="branch__name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {dashboardData.branch_stock.map((entry, index) => (
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
            <CardTitle>Expired Products Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.expired_products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product__name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total_expired"
                  stroke="#FF8042"
                  fill="#FF8042"
                  name="Expired Units"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center bg-yellow-100 p-4 rounded-lg">
                <AlertCircle className="h-12 w-12 text-yellow-500 mb-2" />
                <p className="text-2xl font-semibold">
                  {dashboardData.low_stock_products}
                </p>
                <p className="text-sm text-gray-600 text-center">
                  Products with Low Stock
                </p>
              </div>
              <div className="flex flex-col items-center justify-center bg-red-100 p-4 rounded-lg">
                <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                <p className="text-2xl font-semibold">
                  {dashboardData.expired_products.reduce(
                    (sum, item) => sum + item.total_expired,
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600 text-center">
                  Total Expired Products
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground">{subValue}</div>
      )}
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export default Dashboard;
