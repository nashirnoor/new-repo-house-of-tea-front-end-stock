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
import {
  api,
  fetchBranches,
  fetchProductRequests,
  fetchStoreProducts,
} from "@/services/api";
import ProductRequestModal from "../modals/ProductRequestModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const ProductRequestsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    fetchProductRequests()
      .then((data) => setData(data.results))
      .catch((error) =>
        console.log(`Error fetching product requests: ${error}`)
      );

    fetchStoreProducts()
      .then((data) => setProducts(data.results))
      .catch((error) => console.log(`Error fetching products: ${error}`));

    fetchBranches()
      .then((data) => setBranches(data.results))
      .catch((error) => console.log(`Error fetching branches: ${error}`));
  }, []);

  const updateRequestStatus = useCallback((id, newStatus) => {
    setData((prevData) =>
      prevData.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  }, []);

  const handleCreateRequest = async (formData) => {
    try {
      const response = await api.post("/product-requests/", formData);
      setData((prevData) => [...prevData, response.data]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create product request:", error);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await api.delete(`/product-requests/${selectedRequestId}/`);
      setData((prevData) =>
        prevData.filter((request) => request.id !== selectedRequestId)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete product request:", error);
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
      accessorKey: "branch_name",
      header: "Branch",
      cell: ({ row }) => <div>{row.getValue("branch_name")}</div>,
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
      cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "date_requested",
      header: "Date Requested",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("date_requested")).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const [isOpen, setIsOpen] = useState(false);
        const [newStatus, setNewStatus] = useState(row.getValue("status"));

        const handleStatusChange = async () => {
          try {
            await api.patch(`/product-requests/${row.original.id}/`, {
              status: newStatus,
            });
            updateRequestStatus(row.original.id, newStatus);
            setIsOpen(false);
          } catch (error) {
            console.error("Failed to update status:", error);
          }
        };

        return (
          <>
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
              {status === "pending" ? (
                <p className="text-yellow-900 bg-yellow-100 p-2 capitalize rounded-md shadow-md">
                  {status}
                </p>
              ) : status === "fulfilled" ? (
                <p className="text-green-900 bg-green-100 p-2 capitalize rounded-md shadow-md">
                  {status}
                </p>
              ) : (
                <p className="text-indigo-900 bg-indigo-100 p-2 capitalize rounded-md shadow-md">
                  {status}
                </p>
              )}
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Status</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      id="status"
                      className="col-span-3"
                      value={newStatus}
                      onValueChange={(value) => setNewStatus(value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue value={newStatus} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="acknowledged">
                          Acknowledged
                        </SelectItem>
                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleStatusChange}>
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const request = row.original;
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
                  navigator.clipboard.writeText(request.id.toString())
                }
              >
                Copy request ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRequestId(request.id);
                  setIsDeleteModalOpen(true);
                }}
                className="text-red-600"
              >
                Delete request
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
          placeholder="Filter requests..."
          value={table.getColumn("product_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("product_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
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
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Request
          </Button>
        </div>
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
      <ProductRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRequest}
        products={products}
        branches={branches}
      />
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteRequest}
        title="Delete Product Request"
        description="Are you sure you want to delete this product request? This action cannot be undone."
      />
    </div>
  );
};
