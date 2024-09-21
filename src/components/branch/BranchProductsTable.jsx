import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, fetchBranchProducts } from "@/services/api";
import BarcodeModal from "../modals/BarcodeModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export const BranchProductsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");
  console.log(data);
  

  useEffect(() => {
    fetchBranchProducts()
      .then((data) => setData(data.results))
      .catch((error) =>
        console.log(`Error fetching branch products: ${error}`)
      );
  }, []);
  const VITE_APP_MEDIA_BASE_URL = 'https://backend-house-of-tea-production.up.railway.app/media';


  const handleShowBarcode = (product) => {
    const productBarcode = `${VITE_APP_MEDIA_BASE_URL}/${product.product_barcode}`;
  
    setSelectedBarcode(productBarcode);
    setSelectedProductName(product.product_name);
    setIsBarcodeModalOpen(true);
  };

  const updateProductQuantity = useCallback((id, newQuantity) => {
    setData((prevData) =>
      prevData.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );
  }, []);

  const updateProductStatus = useCallback((id, newStatus) => {
    setData((prevData) =>
      prevData.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  }, []);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
    },
    {
      accessorKey: "product_sku",
      header: "SKU",
      cell: ({ row }) => <div>{row.getValue("product_sku")}</div>,
    },
    {
      accessorKey: "product_category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("product_category")}</div>,
    },
    {
      accessorKey: "product_brand",
      header: "Brand",
      cell: ({ row }) => <div>{row.getValue("product_brand")}</div>,
    },
    {
      accessorKey: "product_unit",
      header: "Unit",
      cell: ({ row }) => (
        <div>{row.getValue("product_unit") ? `${row.getValue("product_unit")}` : "N/A"}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [newQuantity, setNewQuantity] = useState(
          row.getValue("quantity")
        );

        const handleQuantityChange = async () => {
          try {
            await api.post(
              `/branch-products/${row.original.id}/update_quantity/`,
              { quantity: newQuantity }
            );
            updateProductQuantity(row.original.id, newQuantity);
            setIsOpen(false);
          } catch (error) {
            console.error("Failed to update quantity:", error);
          }
        };

        return (
          <>
            {row.getValue("status") === "inactive" ? (
              <div>{row.getValue("quantity")}</div>
            ) : (
              <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                {row.getValue("quantity")}
              </div>
            )}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Quantity</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="quantity" className="text-right">
                      Quantity
                    </label>
                    <Input
                      id="quantity"
                      type="number"
                      className="col-span-3"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleQuantityChange}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const [isActive, setIsActive] = useState(status === "active");

        const handleStatusToggle = async () => {
          const newStatus = isActive ? "inactive" : "active";
          try {
            await api.patch(`/branch-products/${row.original.id}/`, {
              status: newStatus,
            });
            updateProductStatus(row.original.id, newStatus);
            setIsActive(!isActive);
          } catch (error) {
            console.error("Failed to update status:", error);
          }
        };

        return (
          <div className="flex items-center justify-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusToggle}
              className={`${
                isActive ? "bg-green-500" : "bg-gray-300"
              } transition-colors`}
            />
            <span
              className={`capitalize ${
                isActive ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(product.product_sku.toString())
                }
              >
                Copy product SKU
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleShowBarcode(product)}>
                Show Barcode
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter products..."
          value={table.getColumn("product_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("product_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-center"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <BarcodeModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        barcodeImage={selectedBarcode}
        productName={selectedProductName}
      />
    </div>
  );
};
