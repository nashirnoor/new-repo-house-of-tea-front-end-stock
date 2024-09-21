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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductRequestModal = ({
  isOpen,
  onClose,
  onSave,
  products,
  branches,
}) => {
  const [formData, setFormData] = useState({
    product: "",
    branch: "",
    quantity: "",
  });

  useEffect(() => {
    setFormData({
      product: "",
      branch: "",
      quantity: "",
    });
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      product: value,
    }));
  };

  const handleBranchChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      branch: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product Request</DialogTitle>
          <DialogDescription>
            Request products for your branch
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Product
              </Label>
              <Select
                id="product"
                name="product"
                value={formData.product}
                onValueChange={handleProductChange}
                className="col-span-3"
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="branch" className="text-right">
                Branch
              </Label>
              <Select
                id="branch"
                name="branch"
                value={formData.branch}
                onValueChange={handleBranchChange}
                className="col-span-3 text-black"
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductRequestModal;
