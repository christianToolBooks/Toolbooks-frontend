"use client";

import { CustomersDataTable } from "./_components/customerDataTable";
import { useState } from "react";
import { createColumns } from "./_components/customerColumns";
import UseCustomers from "./hooks/useCustomer";
import CustomerPageLoader from "./loading";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import NoCustomersPage from "../invoices/no-founded/page";
import { ViewCandidateDialog } from "./_components/dialogs/viewCustomerDialog";
import type { Customer } from "@/src/types/customer";
import { CustomerSearchBar } from "./_components/CustomerSearchBar";

export default function CustomerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[] | null>(null);
  const router = useRouter();

  const { customers, getCustomers } = UseCustomers(setIsLoading);

  const columns = createColumns({
    onDeleteSuccess: getCustomers,
    onStatusChange: getCustomers,
  });

  const handleCreateCustomer = () => {
    router.push("/customer/create/select-type");
  };

  const handleCustomerFound = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  };

  const handleSearchResults = (results: Customer[] | null) => {
    setSearchResults(results);
  };

  if (isLoading) {
    return <CustomerPageLoader />;
  }

  if (customers.length === 0) {
    return <NoCustomersPage />;
  }

  // Mostrar resultados de búsqueda si existen, sino mostrar todos los clientes
  const dataToShow = searchResults !== null ? searchResults : customers;

  return (
    <div className="@container/main px-4 lg:px-6">
      <div className="flex max-md:flex-col gap-10 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-chart-1 dark:text-gray-100">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Here you can create and manage customers.
          </p>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Customers List</h2>
        <Button
          onClick={handleCreateCustomer}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <CustomerSearchBar
          onSearchResults={handleSearchResults}
          onCustomerFound={handleCustomerFound}
        />
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto">
          <CustomersDataTable
            columns={columns}
            data={dataToShow}
            isLoading={false}
            onRefresh={getCustomers}
          />
        </div>
      </div>

      {/* View Customer Dialog */}
      {selectedCustomer && (
        <ViewCandidateDialog
          customer={selectedCustomer}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}
    </div>
  );
}
