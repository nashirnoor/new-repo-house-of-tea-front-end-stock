"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function MultiProductInflowModal({
  isCreateModalOpen,
  setIsCreateModalOpen,
  fetchProductInflows,
  products,
  suppliers,
  api,
}) {
  const [inflowItems, setInflowItems] = useState([
    {
      id: 1,
      product: "",
      supplier: "",
      quantity_received: "",
      manufacturing_date: "",
      expiry_date: "",
    },
  ]);

  const addInflowItem = () => {
    setInflowItems([
      ...inflowItems,
      {
        id: inflowItems.length + 1,
        product: "",
        supplier: "",
        quantity_received: "",
        manufacturing_date: "",
        expiry_date: "",
      },
    ]);
  };

  const removeInflowItem = (id) => {
    setInflowItems(inflowItems.filter((item) => item.id !== id));
  };

  const updateInflowItem = (id, field, value) => {
    setInflowItems(
      inflowItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCreateInflow = async (e) => {
    e.preventDefault();

    try {
      await api.post("/product-inflow/", inflowItems);
      setIsCreateModalOpen(false);
      fetchProductInflows();
      setInflowItems([
        {
          id: 1,
          product: "",
          supplier: "",
          quantity_received: "",
          manufacturing_date: "",
          expiry_date: "",
        },
      ]);
    } catch (error) {
      console.error("Failed to create product inflow:", error);
    }
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Create Multiple Product Inflows</DialogTitle>
          <DialogDescription>
            Add multiple product inflow records
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateInflow}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>MFG Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inflowItems.map((item) => (
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
                            ? products.find(
                                (p) => p.id.toString() === item.product
                              )?.name
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
                                    updateInflowItem(
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
                          {item.supplier
                            ? suppliers.find(
                                (s) => s.id.toString() === item.supplier
                              )?.name
                            : "Select supplier..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search supplier..." />
                          <CommandList>
                            <CommandEmpty>No supplier found.</CommandEmpty>
                            <CommandGroup>
                              {suppliers.map((supplier) => (
                                <CommandItem
                                  key={supplier.id}
                                  value={supplier.name}
                                  onSelect={() =>
                                    updateInflowItem(
                                      item.id,
                                      "supplier",
                                      supplier.id.toString()
                                    )
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item.supplier === supplier.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {supplier.name}
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
                      value={item.quantity_received}
                      onChange={(e) =>
                        updateInflowItem(
                          item.id,
                          "quantity_received",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !item.manufacturing_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {item.manufacturing_date ? (
                            format(new Date(item.manufacturing_date), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            item.manufacturing_date
                              ? new Date(item.manufacturing_date)
                              : undefined
                          }
                          onSelect={(date) =>
                            updateInflowItem(
                              item.id,
                              "manufacturing_date",
                              date ? format(date, "yyyy-MM-dd") : ""
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                            updateInflowItem(
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInflowItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={addInflowItem}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <DialogFooter>
              <Button type="submit">Create Inflows</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
