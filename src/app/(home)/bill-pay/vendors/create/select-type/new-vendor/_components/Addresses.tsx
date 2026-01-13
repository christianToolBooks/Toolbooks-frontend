/* app/(home)/vendors/new/_components/Addresses.tsx */
"use client";

import { Plus } from "lucide-react";
import { AddressesProps } from "../types/types";
import { AddressRow } from "./AddressesRow";

export function Addresses({
  addresses,
  onAddAddress,
  onRemoveAddress,
  onUpdateAddress,
  setValue,
  errors, 
}: AddressesProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/80 shadow-sm backdrop-blur-sm">
      <header className="flex items-center justify-between border-b border-[#EFECE6]/50 px-5 py-4 md:px-6">
        <h2 className="text-lg font-semibold text-[#1E3A8A] md:text-xl">Addresses</h2>
        <button
          type="button"
          onClick={onAddAddress}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A8A] text-white transition-colors hover:bg-[#1E3A8A]/90"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>

      <div className="px-5 py-6 md:px-6">
        <div className="space-y-4">
          {addresses?.map((address, index) => (
            <AddressRow
              key={index}
              index={index}
              address={address}
              onUpdateAddress={onUpdateAddress}
              onRemoveAddress={onRemoveAddress}
              setValue={setValue}
              
            />
          ))}
        </div>
      </div>
    </section>
  );
}
