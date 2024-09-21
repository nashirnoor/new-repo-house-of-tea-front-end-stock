import { ProductRequestsTable } from "@/components/store/ProductRequestsTable";
import React from "react";

const ProductRequestsPage = () => {
  return (
    <>
      <h1 className="font-semibold text-2xl">All Product Requests</h1>
      <ProductRequestsTable />
    </>
  );
};

export default ProductRequestsPage;
