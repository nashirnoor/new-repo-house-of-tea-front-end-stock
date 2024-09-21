"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, CheckCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/notifications/");
      setNotifications(response.data.results);
      setError(null);
    } catch (error) {
      setError("Failed to fetch notifications. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch notifications. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/mark_as_read/`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      toast({
        title: "Success",
        description: "Notification marked as read.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}/`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      toast({
        title: "Success",
        description: "Notification deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6 flex items-center gap-2">
        <Bell className="h-8 w-8" />
        Notifications
      </h1>
      <Card className="w-full shadow-lg border border-gray-200">
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Notifications</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="text-lg text-gray-600 text-center">
              No notifications at the moment.
            </p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="shadow-sm border border-gray-200"
                  >
                    <CardHeader className="relative pb-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                        aria-label="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <h3 className="text-base font-medium text-gray-800 pr-8">
                        {notification.message}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </CardHeader>
                    <CardFooter className="flex justify-end pt-2">
                      {!notification.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 border-blue-600 hover:border-blue-800"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as read
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
