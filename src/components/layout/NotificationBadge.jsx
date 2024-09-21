import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { api } from "@/services/api";

const NotificationBadge = () => {
  const location = useLocation();

  const fetchUnreadNotifications = async () => {
    const response = await api.get("/notifications/unread/");
    return response.data.length;
  };

  const { data: unreadCount = 0 } = useQuery(
    "unreadNotifications",
    fetchUnreadNotifications,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 60000, // Data considered fresh for 1 minute
      cacheTime: 300000, // Cache data for 5 minutes
    }
  );

  if (unreadCount === 0 || location.pathname === "/branch/notifications")
    return null;

  return (
    <span className="absolute ml-3 -mt-5 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
      {unreadCount}
    </span>
  );
};

export default NotificationBadge;
