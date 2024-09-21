import { DamagedProductsTable } from '@/components/store/DamagedProductsTable'
import React from 'react'

const DamagedProductsPage = () => {
  return (
    <>
      <h1 className="font-semibold text-2xl">Damaged Products</h1>
      <DamagedProductsTable />
    </>
  )
}

export default DamagedProductsPage
