import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

export function ProductModal({ isOpen, onClose, productId, onProductChange }) {
  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedUnitName, setSelectedUnitName] = useState("");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    quantity: "",
    opening_stock: "",
  });

  useEffect(() => {
    api
      .get("/units/")
      .then((response) => setUnits(response.data.results))
      .catch((error) => console.error("Error fetching units:", error));

    if (productId) {
      fetchProduct();
    } else {
      setProduct({
        name: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        quantity: "",
        opening_stock: "",
      });
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}/`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleUnitChange = (id, name) => {
    setSelectedUnitId(id);
    setSelectedUnitName(name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...product,
      unit_id: selectedUnitId,
    };
    try {
      if (productId) {
        await api.put(`/products/${productId}/`, productData);
      } else {
        await api.post("/products/", productData);
      }
      onProductChange();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {productId ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="brand" className="text-right">
                Brand
              </Label>
              <Input
                id="brand"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="unit" className="text-right">
                Unit
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded="false"
                    className="w-full justify-between col-span-3 font-normal"
                  >
                    {selectedUnitName || "Select a unit"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search unit..." />
                    <CommandList>
                      <CommandEmpty>No units found.</CommandEmpty>
                      <CommandGroup>
                        {units.map((unit) => (
                          <CommandItem
                            key={unit.id}
                            onSelect={() =>
                              handleUnitChange(unit.id, unit.name)
                            }
                          >
                            <Check
                              className={
                                selectedUnitId === unit.id
                                  ? "mr-2 h-4 w-4 opacity-100"
                                  : "mr-2 h-4 w-4 opacity-0"
                              }
                            />
                            {unit.name} ({unit.abbreviation})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={product.quantity}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="opening_stock" className="text-right">
                Opening Stock
              </Label>
              <Input
                id="opening_stock"
                name="opening_stock"
                type="number"
                value={product.opening_stock}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {productId ? "Update" : "Add"} Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
