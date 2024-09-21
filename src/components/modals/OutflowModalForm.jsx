"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Check,
  ChevronsUpDown,
  CalendarIcon,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OutflowModalForm({
  products,
  branches,
  onSubmit,
  onCancel,
}) {
  const [outflowItems, setOutflowItems] = useState([
    {
      id: 1,
      product: "",
      branch: "",
      quantity_sent: "",
      expiry_date: "",
    },
  ]);

  const [errors, setErrors] = useState({});

  const addOutflowItem = () => {
    setOutflowItems([
      ...outflowItems,
      {
        id: outflowItems.length + 1,
        product: "",
        branch: "",
        quantity_sent: "",
        expiry_date: "",
      },
    ]);
  };

  const removeOutflowItem = (id) => {
    setOutflowItems(outflowItems.filter((item) => item.id !== id));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[id];
      return newErrors;
    });
  };

  const updateOutflowItem = (id, field, value) => {
    setOutflowItems(
      outflowItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

    if (field === "product" || field === "quantity_sent") {
      validateQuantity(id, value, field);
    }
  };

  const validateQuantity = (id, value, field) => {
    const item = outflowItems.find((item) => item.id === id);
    if (!item) return;

    const product = products.find((p) => p.id.toString() === item.product);
    if (!product) return;

    const quantitySent =
      field === "quantity_sent"
        ? parseInt(value)
        : parseInt(item.quantity_sent);

    if (isNaN(quantitySent) || quantitySent <= 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "Quantity must be a positive number",
      }));
    } else if (quantitySent > product.quantity) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: `Quantity exceeds available stock (${product.quantity})`,
      }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      onSubmit(outflowItems);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Quantity Sent</TableHead>
            <TableHead>Expiry Date</TableHead>
            {/* <TableHead>Available Stock</TableHead> */}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outflowItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {item.product
                        ? products.find((p) => p.id.toString() === item.product)
                            ?.name
                        : "Select product..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search product..." />
                      <CommandList>
                        <CommandEmpty>No products found.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.name}
                              onSelect={() =>
                                updateOutflowItem(
                                  item.id,
                                  "product",
                                  product.id.toString()
                                )
                              }
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.product === product.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {item.branch
                        ? branches.find((b) => b.id.toString() === item.branch)
                            ?.name
                        : "Select branch..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search branch..." />
                      <CommandList>
                        <CommandEmpty>No branch found.</CommandEmpty>
                        <CommandGroup>
                          {branches.map((branch) => (
                            <CommandItem
                              key={branch.id}
                              value={branch.name}
                              onSelect={() =>
                                updateOutflowItem(
                                  item.id,
                                  "branch",
                                  branch.id.toString()
                                )
                              }
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.branch === branch.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {branch.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity_sent}
                  onChange={(e) =>
                    updateOutflowItem(item.id, "quantity_sent", e.target.value)
                  }
                  className={cn("w-full", errors[item.id] && "border-red-500")}
                />
                {errors[item.id] && (
                  <p className="text-xs text-red-500 mt-1">{errors[item.id]}</p>
                )}
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !item.expiry_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {item.expiry_date ? (
                        format(new Date(item.expiry_date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        item.expiry_date
                          ? new Date(item.expiry_date)
                          : undefined
                      }
                      onSelect={(date) =>
                        updateOutflowItem(
                          item.id,
                          "expiry_date",
                          date ? format(date, "yyyy-MM-dd") : ""
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              {/* <TableCell>
                {item.product && (
                  <span className="text-sm">
                    {products.find((p) => p.id.toString() === item.product)
                      ?.quantity || 0}
                  </span>
                )}
              </TableCell> */}
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOutflowItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Please correct the errors before submitting.
          </AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-4 w-full flex justify-between">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex w-full gap-2 justify-end">
          <Button type="button" variant="outline" onClick={addOutflowItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
          <Button type="submit" disabled={Object.keys(errors).length > 0}>
            Create Outflows
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
