import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  LayoutDashboard,
  Layers3,
  UserRoundPen,
  Send,
  PackageOpen,
} from "lucide-react";
import LogoutBtn from "./LogoutBtn";
import NotificationBadge from "./NotificationBadge";

const BranchSidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-[#6f42c1] text-white"
      : "hover:bg-[#5a329e] hover:text-white";
  };

  const menuItems = [
    { path: "/branch", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/branch/inventory", icon: PackageOpen, label: "Inventory" },
    { path: "/branch/requests", icon: Send, label: "Product Requests" },
    { path: "/branch/reports", icon: Layers3, label: "Reports" },
    { path: "/branch/profile", icon: UserRoundPen, label: "Profile" },
  ];

  const renderMenuItem = (item) => (
    <TooltipProvider key={item.path}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.path}
            className={`flex items-center space-x-2 p-2 rounded ${isActive(
              item.path
            )}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="md:hidden">
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="w-20 md:w-64 bg-white p-4 h-screen border-r border-gray-300 flex flex-col">
      <Link to="/" className="mb-8 flex justify-center md:justify-start">
        <div className="hidden sm:flex flex-col gap-2 items-center justify-center text-black-500 text-xl font-semibold">
          <img
            src="/nasscript_full_banner_logo.png"
            alt="LOGO"
            className="w-auto h-10"
          />
          {user?.managed_branch ? `${user.managed_branch.name}` : "Branch Name"}
        </div>
        <div className="block sm:hidden">
          <img src="/nasscript_logo.png" alt="LOGO" className="w-auto h-10" />
        </div>
      </Link>
      <nav className="flex-grow">
        <ul className="space-y-2">{menuItems.map(renderMenuItem)}</ul>
      </nav>
      <div className="mt-8">
        <ul>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/branch/notifications"
                  className={`flex items-center space-x-2 p-2 rounded ${isActive(
                    "/branch/notifications"
                  )}`}
                >
                  <NotificationBadge />
                  <Bell className="w-6 h-6" />
                  <span className="hidden md:inline">Notifications</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="r ight" className="md:hidden">
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <LogoutBtn />
        </ul>
      </div>
    </div>
  );
};

export default BranchSidebar;
