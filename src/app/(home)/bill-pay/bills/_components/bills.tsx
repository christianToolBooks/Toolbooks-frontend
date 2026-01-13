"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import Link from "next/link";
import { BillMetrics } from "./billMetrics";
import { RecentBills } from "./recentBills";
import { BillDetailsModal } from "../modals/bill-details-modal";
import { BillDataByIdFromAPI, BillDataResponseFromAPI } from "@/src/types/billPayTypes";
import { getBillById } from "@/src/lib/services/billServices";
import { toast } from "sonner";

export function BillPayBills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillDataByIdFromAPI | null>(null);
  const [isLoadingBill, setIsLoadingBill] = useState(false);

  const handleViewBill = async (bill: BillDataResponseFromAPI) => {
    setIsLoadingBill(true);
    setIsModalOpen(true);
    
    try {
      const response = await getBillById(bill.id);
      
      if ("statusCode" in response) {
        toast.error(response.message || "Failed to load bill details");
        setIsModalOpen(false);
        return;
      }
      
      setSelectedBill(response.data);
    } catch (error) {
      console.error("Error loading bill details:", error);
      toast.error("Failed to load bill details");
      setIsModalOpen(false);
    } finally {
      setIsLoadingBill(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-chart-1">Bills</h1>
          <p className="text-gray-600">
            Manage and track all your bills and invoices
          </p>
        </div>
        <Link href="/bill-pay/bills/new-bill">
          <Button className="bg-chart-1 hover:bg-chart-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Bill
          </Button>
        </Link>
      </div>

      <BillMetrics />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <RecentBills onViewBill={handleViewBill} />
      <BillDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBill(null);
        }}
        bill={selectedBill}
        isLoading={isLoadingBill}
      />
    </div>
  );
}
