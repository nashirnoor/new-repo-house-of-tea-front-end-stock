import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const BranchManagerForm = () => {
  const userId = useSelector((state) => state.auth.user.id);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
  });
  const [initialData, setInitialData] = useState(formData);

  useEffect(() => {
    handleFetchManagerDetails(userId);
  }, [userId]);

  const handleFetchManagerDetails = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/`);
      setFormData(response.data);
      setInitialData(response.data);
    } catch (error) {
      console.error("Error fetching manager details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveManager(formData);
  };

  const handleSaveManager = async (formData) => {
    try {
      await api.patch(`/users/${userId}/`, formData);
      handleFetchManagerDetails(userId);
    } catch (error) {
      console.error("Error saving manager details:", error);
    }
  };

  const hasDataChanged =
    JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Manager Details</CardTitle>
        <CardDescription>
          Modify your personal information below and click Update to save the changes.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col items-start">
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone_number" className="text-right">
              Phone Number
            </Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </CardContent>
        <CardFooter>
          {hasDataChanged && <Button type="submit">Update Manager Details</Button>}
        </CardFooter>
      </form>
    </Card>
  );
};

export default BranchManagerForm;