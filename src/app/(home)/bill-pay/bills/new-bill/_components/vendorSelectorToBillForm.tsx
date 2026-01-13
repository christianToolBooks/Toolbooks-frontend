// app/(home)/vendors/_components/VendorSelector.tsx
"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Plus, Search } from "lucide-react";

import type { VendorRecord } from "@/src/types/vendorsTypes";

type Props = {
  value?: VendorRecord | null;
  onChange: (vendor: VendorRecord | null) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  onAddNewVendor?: () => void;
};

export function VendorSelector({
  isOpen,
  onOpenChange,
  placeholder = "Select vendor...",
  disabled,
  className,
  buttonClassName,
  onAddNewVendor,
}: Props) {
  // control externo o interno (fallback)
  const [openInternal, setOpenInternal] = React.useState(false);
  const open = isOpen ?? openInternal;
  const setOpen = onOpenChange ?? setOpenInternal;



  const handleAddNew = () => {
    setOpen(false);
    onAddNewVendor?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`w-full justify-start bg-transparent ${buttonClassName ?? ""}`}
          disabled={disabled}
        >
          { placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className={`w-[350px] p-0 ${className ?? ""}`} align="start">
        {/* Header con búsqueda */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              autoFocus
              placeholder="Search vendor by name..."
              onChange={(e) => (e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {onAddNewVendor && (
            <div className="p-1">
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start text-blue-600 font-medium hover:bg-blue-50"
                onClick={handleAddNew}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Vendor
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
