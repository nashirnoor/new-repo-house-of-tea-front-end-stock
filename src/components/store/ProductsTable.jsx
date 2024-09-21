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
  Plus,
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
import { api, fetchStoreProducts } from "@/services/api";
import { ProductModal } from "../modals/ProductModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import BarcodeModal from "../modals/BarcodeModal";

export function ProductsTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");

  useEffect(() => {
    fetchStoreProducts()
      .then((data) => setData(data.results))
      .catch((error) => console.log(`Error fetching store products: ${error}`));
  }, []);

  const handleAddProduct = () => {
    setSelectedProductId(null);
    setIsModalOpen(true);
  };

  const handleShowBarcode = (product) => {
    setSelectedBarcode(product.barcode_image);
    setSelectedProductName(product.name);
    setIsBarcodeModalOpen(true);
  };

  const handleEditProduct = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await api.delete(`/products/${productToDelete}/`);
        setData((prevData) =>
          prevData.filter((product) => product.id !== productToDelete)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleProductChange = async () => {
    try {
      const updatedData = await fetchStoreProducts();
      setData(updatedData.results);
    } catch (error) {
      console.error("Error fetching updated products:", error);
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
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <div>{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "QAR",
        }).format(price);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ row }) => (
        <div>{row.original.unit ? `${row.original.unit.name} (${row.original.unit.abbreviation})` : "N/A"}</div>
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
        const quantity = row.getValue("quantity");
        if (quantity > 0 && quantity <= 10) {
          return (
            <div className="flex justify-center items-center">
              <p className="text-yellow-800 bg-yellow-100 p-2 rounded-lg">
                {quantity}
              </p>
            </div>
          );
        } else if (quantity === 0) {
          return (
            <div className="flex justify-center items-center">
              <p className="text-red-800 bg-red-100 p-2 rounded-lg">
                {quantity}
              </p>
            </div>
          );
        } else {
          return (
            <div className="flex justify-center items-center">
              <p className="text-green-900 bg-green-100 p-2 rounded-lg">
                {quantity}
              </p>
            </div>
          );
        }
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
                  navigator.clipboard.writeText(product.sku.toString())
                }
              >
                Copy product SKU
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                Edit product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
                Delete product
              </DropdownMenuItem>
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
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter products..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name", "sku")?.setFilterValue(event.target.value)
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
          <Button
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            <span>Add Product</span>
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
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={selectedProductId}
        onProductChange={handleProductChange}
      />
      <BarcodeModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        barcodeImage={selectedBarcode}
        productName={selectedProductName}
      />
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
