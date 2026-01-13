"use client";

import { useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { getCustomerById, getCustomerByName } from "@/src/lib/services/customersServices";
import { toast } from "sonner";
import type { Customer } from "@/src/types/customer";

interface CustomerSearchBarProps {
  onSearchResults: (results: Customer[] | null) => void;
  onCustomerFound: (customer: Customer) => void;
}

export function CustomerSearchBar({ onSearchResults, onCustomerFound }: CustomerSearchBarProps) {
  const [searchType, setSearchType] = useState<"id" | "name">("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Si el input está vacío, limpiar los resultados
      onSearchResults(null);
      return;
    }

    setIsSearching(true);

    try {
      const response = searchType === "id" 
        ? await getCustomerById(searchQuery.trim())
        : await getCustomerByName(searchQuery.trim());

      if ("statusCode" in response) {
        toast.error(response.message || "Customer not found");
        onSearchResults([]);
        return;
      }

      // Normalizar la respuesta a array
      const customers = Array.isArray(response) ? response : [response];
      
      if (customers.length === 0) {
        toast.info("No customers found");
        onSearchResults([]);
        return;
      }

      toast.success(`Found ${customers.length} customer${customers.length > 1 ? "s" : ""}`);
      onSearchResults(customers);

      // Si es búsqueda por ID y hay un solo resultado, abrir el modal automáticamente
      if (searchType === "id" && customers.length === 1) {
        onCustomerFound(customers[0]);
      }
    } catch (error) {
      console.error("Error searching customer:", error);
      toast.error("An error occurred while searching for the customer");
      onSearchResults([]);
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
    onSearchResults(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Si el input está vacío, limpiar los resultados inmediatamente
    if (!value.trim()) {
      onSearchResults(null);
    }
  };

  const getPlaceholder = () => {
    return searchType === "id" 
      ? "Search by Customer ID..."
      : "Search by Customer Name...";
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Search Customer</h3>
        
        {/* Search Type Toggle */}
        <Tabs value={searchType} onValueChange={(value) => {
          setSearchType(value as "id" | "name");
          setSearchQuery("");
          onSearchResults(null);
        }}>
          <TabsList className="grid w-[300px] grid-cols-2">
            <TabsTrigger value="name">By Name</TabsTrigger>
            <TabsTrigger value="id">By ID</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search Input */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={getPlaceholder()}
            value={searchQuery}
            onChange={handleInputChange}
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
    </div>
  );
}
