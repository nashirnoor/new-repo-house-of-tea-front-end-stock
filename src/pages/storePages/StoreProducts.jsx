import { ProductsTable } from "@/components/store/ProductsTable";
import React from "react";

const StoreProducts = () => {
  return (
    <>
      <h1 className="font-semibold text-2xl">Products</h1>
      <ProductsTable />
    </>
  );
};

export default StoreProducts;
