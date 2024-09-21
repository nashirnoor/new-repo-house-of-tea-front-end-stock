"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

const BranchModal = ({ isOpen, onClose, onSave, branch }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact_details: "",
    manager: "",
  });

  const [unassignedManagers, setUnassignedManagers] = useState([]);

  useEffect(() => {
    if (branch) {
      setFormData(branch);
    } else {
      setFormData({
        name: "",
        location: "",
        contact_details: "",
        manager: "",
      });
    }
  }, [branch]);

  useEffect(() => {
    const fetchUnassignedManagers = async () => {
      try {
        const response = await api.get("/users/unassigned_managers/");
        setUnassignedManagers(response.data);
      } catch (error) {
        console.error("Error fetching unassigned managers:", error);
      }
    };

    fetchUnassignedManagers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManagerChange = (value) => {
    setFormData((prev) => ({ ...prev, manager: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{branch ? "Edit Branch" : "Add Branch"}</DialogTitle>
          <DialogDescription>
            {branch
              ? "Edit the details of this branch."
              : "Add a new branch to your organization."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager" className="text-right">
                Manager
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="col-span-3 w-full justify-between"
                  >
                    {formData.manager
                      ? unassignedManagers.find(
                          (m) => m.id === formData.manager
                        )?.username
                      : "Select a manager"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search manager..." />
                    <CommandList>
                      <CommandEmpty>No managers found.</CommandEmpty>
                      <CommandGroup>
                        {unassignedManagers.map((manager) => (
                          <CommandItem
                            key={manager.id}
                            value={manager.username}
                            onSelect={() => handleManagerChange(manager.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.manager === manager.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {manager.username}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{branch ? "Update" : "Add"} Branch</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BranchModal;
