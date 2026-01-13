"use client";

import { useState } from "react";
import { Search, Loader2, X, Eye } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { getCustomerById, getCustomerByName } from "@/src/lib/services/customersServices";
import { toast } from "sonner";
import type { Customer } from "@/src/types/customer";

interface CustomerSearchByIdProps {
  onCustomerFound: (customer: Customer) => void;
}

export function CustomerSearchById({ onCustomerFound }: CustomerSearchByIdProps) {
  const [searchType, setSearchType] = useState<"id" | "name">("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundCustomers, setFoundCustomers] = useState<Customer[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error(`Please enter a customer ${searchType === "id" ? "ID" : "name"}`);
      return;
    }

    setIsSearching(true);
    setFoundCustomers([]);

    try {
      const response = searchType === "id" 
        ? await getCustomerById(searchQuery.trim())
        : await getCustomerByName(searchQuery.trim());

      if ("statusCode" in response) {
        toast.error(response.message || "Customer not found");
        return;
      }

      // Normalizar la respuesta a array
      const customers = Array.isArray(response) ? response : [response];
      
      if (customers.length === 0) {
        toast.info("No customers found");
        return;
      }

      toast.success(`Found ${customers.length} customer${customers.length > 1 ? "s" : ""}`);
      setFoundCustomers(customers);
    } catch (error) {
      console.error("Error searching customer:", error);
      toast.error("An error occurred while searching for the customer");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setFoundCustomers([]);
  };

  const handleViewDetails = (customer: Customer) => {
    onCustomerFound(customer);
  };

  const getPlaceholder = () => {
    return searchType === "id" 
      ? "Enter Customer ID (e.g., 123e4567-e89b-12d3-a456-426614174000)"
      : "Enter Customer Name (e.g., John Doe)";
  };

  return (
    <div className="space-y-4">
      {/* Search Type Toggle */}
      <Tabs value={searchType} onValueChange={(value) => setSearchType(value as "id" | "name")}>
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="id">Search by ID</TabsTrigger>
          <TabsTrigger value="name">Search by Name</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Input */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={getPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSearching}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          size="default"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {foundCustomers.length > 0 && (
        <div className="space-y-3">
          {foundCustomers.length > 1 && (
            <p className="text-sm text-muted-foreground">
              Found {foundCustomers.length} customers matching &ldquo;{searchQuery}&ldquo;
            </p>
          )}
          
          {foundCustomers.map((customer) => (
            <div key={customer.id} className="border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <Badge variant={customer.isActive ? "default" : "secondary"}>
                      {customer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium">{customer.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <span className="font-medium">{customer.phone || "N/A"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">ID:</span>{" "}
                      <span className="font-mono text-xs">{customer.id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>{" "}
                      <span className="font-medium">
                        {customer.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(customer)}
                  className="ml-4"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
