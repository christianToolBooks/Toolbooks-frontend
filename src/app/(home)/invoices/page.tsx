"use client";

import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/DataTable";
import { useRouter } from "next/navigation";
import { UseInvoiceContex } from "./context/invoiceProvider";
import NoCustomersPage from "./no-founded/page";
import InvoicesLoading from "./loading";

export default function InvoicesPage() {
  const {
    isLoadingInvoices,
    isLoadingCustomers,
    customers,
  } = UseInvoiceContex();
  const router = useRouter();

  const handleCreateInvoice = () => {
    router.push("/invoices/new");
  };

  // Mostrar loading mientras cualquiera de los dos está cargando
  const isLoading = isLoadingInvoices || isLoadingCustomers;

  if (isLoading) {
    return <InvoicesLoading />;
  }

  // Una vez cargado todo, verificar si hay customers
  if (customers.length === 0) {
    return <NoCustomersPage />;
  }

  // Si hay customers, mostrar la tabla de invoices
  return (
    <div className="@container/main px-4 lg:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-chart-1 dark:text-gray-100">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Here you can view and manage all your invoices.
          </p>
        </div>

        <Button className="cursor-pointer" onClick={handleCreateInvoice}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Invoice
        </Button>
      </div>

      <DataTable columns={columns} />
    </div>
  );
}
