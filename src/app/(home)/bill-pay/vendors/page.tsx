"use client";

import { useEffect } from "react";
import { BillPayVendors } from "../_components/vendors";
import NoVendorsPage from "./_components/no-vendors-yet";
import { VendorsSkeletonPage } from "./_components/vendorsSkeletonPage";
import { useGetVendors } from "./_hooks/getVendorsHook";

export default function VendorsPage() {
  const { vendors, loading, refetch } = useGetVendors();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div className="p-10">
        <VendorsSkeletonPage />
      </div>
    );
  }

  if (!vendors || vendors.length === 0) {
    return <NoVendorsPage />;
  }

  return (
    <div className="p-10">
      <BillPayVendors />
    </div>
  );
}
