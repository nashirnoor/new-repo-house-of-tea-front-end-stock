import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/services/api";
import DamagedProductModal from "../modals/DamagedProductModal";
import ConfirmationModal from "../modals/ConfirmationModal";

export const DamagedProductsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [isDamagedProductModalOpen, setIsDamagedProductModalOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDamagedProduct, setSelectedDamagedProduct] = useState(null);
  const [damagedProductToDelete, setDamagedProductToDelete] = useState(null);

  useEffect(() => {
    fetchDamagedProducts();
  }, []);

  const fetchDamagedProducts = async () => {
    try {
      const response = await api.get("/damaged-products/");
      setData(response.data.results);
    } catch (error) {
      console.error("Error fetching damaged products:", error);
    }
  };

  const handleAddDamagedProduct = () => {
    setSelectedDamagedProduct(null);
    setIsDamagedProductModalOpen(true);
  };

//   const handleEditDamagedProduct = (damagedProduct) => {
//     setSelectedDamagedProduct(damagedProduct);
//     setIsDamagedProductModalOpen(true);
//   };

  const handleDeleteDamagedProduct = (damagedProduct) => {
    setDamagedProductToDelete(damagedProduct);
    setIsDeleteModalOpen(true);
  };

  const handleSaveDamagedProduct = async (formData) => {
    try {
      if (selectedDamagedProduct) {
        await api.put(
          `/damaged-products/${selectedDamagedProduct.id}/`,
          formData
        );
      } else {
        await api.post("/damaged-products/", formData);
      }
      fetchDamagedProducts();
      setIsDamagedProductModalOpen(false);
    } catch (error) {
      console.error("Error saving damaged product:", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/damaged-products/${damagedProductToDelete.id}/`);
      fetchDamagedProducts();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting damaged product:", error);
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
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "date_reported",
      header: "Date Reported",
      cell: ({ row }) => {
        const dateReported = new Date(row.getValue("date_reported"));
        const formatted = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(dateReported);

        return <div>{formatted}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const damagedProduct = row.original;
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
              {/* <DropdownMenuItem
                onClick={() => handleEditDamagedProduct(damagedProduct)}
              >
                Edit damaged product
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => handleDeleteDamagedProduct(damagedProduct)}
              >
                Delete damaged product
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
          placeholder="Filter damaged products..."
          value={table.getColumn("product_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("product_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={handleAddDamagedProduct}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Damaged Product
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
      <DamagedProductModal
        isOpen={isDamagedProductModalOpen}
        onClose={() => setIsDamagedProductModalOpen(false)}
        onSave={handleSaveDamagedProduct}
        damagedProduct={selectedDamagedProduct}
      />
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this damaged product record? This action cannot be undone."
      />
    </div>
  );
};
