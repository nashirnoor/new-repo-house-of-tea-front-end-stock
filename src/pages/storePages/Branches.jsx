import { BranchesTable } from "@/components/store/BranchesTable";
import React from "react";

const Branches = () => {
  return (
    <>
      <h1 className="font-semibold text-2xl">Branches</h1>
      <BranchesTable />
    </>
  );
};

export default Branches;
