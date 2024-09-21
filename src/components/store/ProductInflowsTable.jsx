import React, { useState, useEffect, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  PlusCircle,
  Check,
  ChevronsUpDown,
  CalendarIcon,
} from "lucide-react";

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
import { api } from "@/services/api";
import ConfirmationModal from "../modals/ConfirmationModal";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import MultiProductInflowModal from "../modals/MultiProductInflowModal";

export const ProductInflowsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInflowId, setSelectedInflowId] = useState(null);
  const [formData, setFormData] = useState({
    product: "",
    supplier: "",
    quantity_received: "",
    manufacturing_date: "",
    expiry_date: "",
  });

  useEffect(() => {
    fetchProductInflows();
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProductInflows = async () => {
    try {
      const response = await api.get("/product-inflow/");
      setData(response.data.results);
    } catch (error) {
      console.error("Error fetching product inflows:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data.results);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get("/suppliers/");
      setSuppliers(response.data.results);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleDeleteInflow = async () => {
    try {
      await api.delete(`/product-inflow/${selectedInflowId}/`);
      setData((prevData) =>
        prevData.filter((inflow) => inflow.id !== selectedInflowId)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete product inflow:", error);
    }
  };

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
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
    },
    {
      accessorKey: "supplier_name",
      header: "Supplier",
      cell: ({ row }) => <div>{row.getValue("supplier_name")}</div>,
    },
    {
      accessorKey: "quantity_received",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity Received
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("quantity_received")}</div>,
    },
    {
      accessorKey: "manufacturing_date",
      header: "Manufacturing Date",
      cell: ({ row }) =>
        row.getValue("manufacturing_date")
          ? format(new Date(row.getValue("manufacturing_date")), "PPP")
          : "N/A",
    },
    {
      accessorKey: "expiry_date",
      header: "Expiry Date",
      cell: ({ row }) =>
        row.getValue("expiry_date")
          ? format(new Date(row.getValue("expiry_date")), "PPP")
          : "N/A",
    },
    {
      accessorKey: "date_received",
      header: "Date Received",
      cell: ({ row }) => <div>{row.getValue("date_received")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const inflow = row.original;
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
                  navigator.clipboard.writeText(inflow.id.toString())
                }
              >
                Copy inflow ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedInflowId(inflow.id);
                  setIsDeleteModalOpen(true);
                }}
                className="text-red-600"
              >
                Delete inflow
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
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter inflows..."
          value={table.getColumn("product_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("product_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Inflow
        </Button>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
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
      <MultiProductInflowModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        fetchProductInflows={fetchProductInflows}
        products={products}
        suppliers={suppliers}
        api={api}
      />
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteInflow}
        title="Delete Product Inflow"
        description="Are you sure you want to delete this product inflow? This action cannot be undone."
      />
    </div>
  );
};

export default ProductInflowsTable;
