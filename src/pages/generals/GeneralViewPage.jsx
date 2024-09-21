import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Package,
  Store,
  UserCircle,
  LogIn,
  LogOut,
  Container,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/features/slices/authSlice";

const GeneralViewPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (error) {
      console.error(`Failed to log out: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="shadow-none">
        <div className="container mx-auto px-4 py-4 flex gap-2 justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Container size={28} className="text-blue-600" />
            <div className="hidden sm:block text-2xl font-bold text-blue-600">InventoryPro</div>
          </Link>
          <div className="w-full flex justify-end">
            <div>
              {user ? (
                user.role === "admin" ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/store")}
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Store
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("/branch")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Branch
                  </Button>
                )
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => handleNavigation("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
            {user && (
              <Button
                variant="ghost"
                className="hover:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-blue-700">
              Welcome to InventoryPro
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2">
              Streamline your product management across stores and branches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <FeatureCard
                icon={<Package className="h-12 w-12 text-blue-500" />}
                title="Product Management"
                description="Efficiently manage products, track inflows and outflows, and handle damaged inventory."
              />
              <FeatureCard
                icon={<Store className="h-12 w-12 text-green-500" />}
                title="Multi-Branch Support"
                description="Seamlessly manage inventory across multiple branches and a central store."
              />
              <FeatureCard
                icon={<UserCircle className="h-12 w-12 text-purple-500" />}
                title="Supplier Management"
                description="Keep track of supplier information and manage supplier-store transactions."
              />
              <FeatureCard
                icon={<Package className="h-12 w-12 text-red-500" />}
                title="Comprehensive Reporting"
                description="Generate detailed reports on inventory, supplier performance, and more."
              />
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          &copy; 2024 InventoryPro. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <CardTitle className="text-xl font-semibold text-center">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-center text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

export default GeneralViewPage;
