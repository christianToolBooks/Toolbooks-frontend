"use client";

import * as React from "react";
import { useGetVendors } from "../../../vendors/_hooks/getVendorsHook";
import { VendorRecord } from "@/src/types/vendorsTypes";

interface VendorSelectorProps {
  value: string;
  onChange: (vendor: VendorRecord | null) => void;
  placeholder?: string;
}

export function VendorSelector({
  value,
  onChange,
  placeholder = "Search or select a vendor",
}: VendorSelectorProps) {
  const { vendors, loading, error } = useGetVendors();
  const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredVendors = React.useMemo(() => {
    if (!search.trim()) return vendors;
    const searchLower = search.toLowerCase();
    return vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchLower) ||
        vendor.email?.toLowerCase().includes(searchLower)
    );
  }, [vendors, search]);

  const selectedVendor = vendors.find((v) => v.id === value);

  const handleSelect = (vendor: VendorRecord) => {
    onChange(vendor);
    setSearch("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSearch("");
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const displayValue = React.useMemo(() => {
    if (search) return search;
    return selectedVendor?.name || "";
  }, [search, selectedVendor]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={loading ? "Loading vendors..." : placeholder}
          className="h-10 w-full border-2 border-chart-5 bg-transparent px-2 pr-8 text-base focus:border-[#1E3A8A] focus:ring-0 rounded-md"
          disabled={loading}
        />
        {selectedVendor && !search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
            title="Clear selection"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {error && (
              <div className="px-3 py-2 text-sm text-red-600">
                Error loading vendors: {error}
              </div>
            )}
            {!error && filteredVendors.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                {search
                  ? `No vendors found for "${search}"`
                  : "No vendors available"}
              </div>
            )}
            {filteredVendors.map((vendor) => (
              <button
                key={vendor.id}
                type="button"
                onClick={() => handleSelect(vendor)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                  vendor.id === value ? "bg-blue-50" : ""
                }`}
              >
                <div className="font-medium text-[#1E3A8A]">{vendor.name}</div>
                {vendor.email && (
                  <div className="text-xs text-gray-500">{vendor.email}</div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
