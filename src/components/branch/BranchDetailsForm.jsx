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

const BranchDetailsForm = () => {
  const branchId = useSelector((state) => state.auth.user.managed_branch.id);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact_details: "",
  });
  const [initialData, setInitialData] = useState(formData);

  useEffect(() => {
    handleFetchBranchDetails(branchId);
  }, []);

  const handleFetchBranchDetails = async (branchId) => {
    try {
      const response = await api.get(`/branches/${branchId}/`);
      setFormData(response.data);
      setInitialData(response.data);
    } catch (error) {
      console.error("Error fetching branch details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveBranch(formData);
  };

  const handleSaveBranch = async (formData) => {
    try {
      await api.put(`/branches/${branchId}/`, formData);
      handleFetchBranchDetails(branchId);
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  const hasDataChanged =
    JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Branch</CardTitle>
        <CardDescription>
          Modify the branch details below and click Update to save the changes.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col items-start">
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact_details" className="text-right">
              Contact Details
            </Label>
            <Input
              id="contact_details"
              name="contact_details"
              value={formData.contact_details}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </CardContent>
        <CardFooter>
          {hasDataChanged && <Button type="submit">Update Branch</Button>}
        </CardFooter>
      </form>
    </Card>
  );
};

export default BranchDetailsForm;
