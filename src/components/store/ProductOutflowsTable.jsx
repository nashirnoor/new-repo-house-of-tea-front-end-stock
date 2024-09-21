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
import { format } from "date-fns";

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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { api } from "@/services/api";
import ConfirmationModal from "../modals/ConfirmationModal";
import { cn } from "@/lib/utils";
import Loader from "../layout/Loader";
import OutflowModalForm from "../modals/OutflowModalForm";

const ProductOutflowsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOutflowId, setSelectedOutflowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductOutflows();
    fetchProducts();
    fetchBranches();
  }, []);

  const fetchProductOutflows = async () => {
    try {
      setLoading(true);
      const response = await api.get("/product-outflow/");
      setData(response.data.results);
    } catch (error) {
      console.error("Error fetching product outflows:", error);
      setError("Failed to fetch product outflows");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data.results || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await api.get("/branches/");
      setBranches(response.data.results || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setError("Failed to fetch branches");
    }
  };

  const handleCreateOutflow = async (formData) => {
    try {
      const response = await api.post("/product-outflow/", formData);
      setData((prevData) => [...prevData, response.data]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create product outflow:", error);
      setError("Failed to create product outflow!");
    }
  };

  const handleDeleteOutflow = async () => {
    try {
      await api.delete(`/product-outflow/${selectedOutflowId}/`);
      setData((prevData) =>
        prevData.filter((outflow) => outflow.id !== selectedOutflowId)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete product outflow:", error);
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
    },
    {
      accessorKey: "branch_name",
      header: "Branch",
    },
    {
      accessorKey: "quantity_sent",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity Sent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
      accessorKey: "date_sent",
      header: "Date Sent",
      cell: ({ row }) => format(new Date(row.getValue("date_sent")), "PPP"),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const outflow = row.original;
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
                  navigator.clipboard.writeText(outflow.id.toString())
                }
              >
                Copy outflow ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOutflowId(outflow.id);
                  setIsDeleteModalOpen(true);
                }}
                className="text-red-600"
              >
                Delete outflow
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

  if (loading) return <Loader />;
  if (error)
    return <p className="text-center text-xl font-semibold">Error: {error}</p>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter outflows..."
          value={table.getColumn("product_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("product_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Outflow
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Create Product Outflow</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <OutflowModalForm
            products={products}
            branches={branches}
            onSubmit={handleCreateOutflow}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOutflow}
        title="Delete Product Outflow"
        description="Are you sure you want to delete this product outflow? This action cannot be undone."
      />
    </div>
  );
};

export default ProductOutflowsTable;
