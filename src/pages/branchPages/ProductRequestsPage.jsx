import { BranchProductRequestsTable } from "@/components/branch/BranchProductRequestsTable";
import React from "react";

const ProductRequestsPage = () => {
  return (
    <>
      <h1 className="font-semibold text-2xl">Branch Product Requests</h1>
      <BranchProductRequestsTable />
    </>
  );
};

export default ProductRequestsPage;
