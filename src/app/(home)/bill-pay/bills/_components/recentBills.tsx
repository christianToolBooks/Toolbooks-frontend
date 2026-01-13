"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, Eye, Edit } from "lucide-react";
import { useGetBills } from "../../hooks/useGetBills";
import { RecentBillsSkeleton } from "../skeletons/recent-bills-skeleton";
import { AllBillsTable } from "./allBillsTable";
import {
  getAgingColor,
  getPriorityColor,
  getStatusColor,
  normalizeDate,
} from "../../_helpers/helpersToBill";
import { BillDataResponseFromAPI } from "@/src/types/billPayTypes";

export function RecentBills({
  onViewBill,
}: {
  onViewBill: (bill: BillDataResponseFromAPI) => void;
}) {
  const { allBills, loading } = useGetBills();
  const [showAllBills, setShowAllBills] = useState(false);

  const latestFour = useMemo(() => {
    const list = Array.isArray(allBills) ? [...allBills] : [];
    list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    return list.slice(0, 4);
  }, [allBills]);

  if (loading && !allBills.length) {
    return <RecentBillsSkeleton />;
  }

  if (showAllBills) {
    return (
      <AllBillsTable
        bills={allBills}
        onClose={() => setShowAllBills(false)}
        onViewBill={onViewBill}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>Last 4 created bills</CardDescription>
          {latestFour.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowAllBills(true)}
              className="text-primary hover:bg-secondary"
            >
              See all bills
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {latestFour.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No bills yet
            </p>
            <p className="text-xs text-muted-foreground">
              Create your first bill to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {latestFour.map((bill) => {
              const dueDate = normalizeDate(bill.dueDate);
              const today = normalizeDate(new Date());
              const isOverdue = dueDate.getTime() < today.getTime();
              const isDueToday = dueDate.getTime() === today.getTime();
              const isPaid = bill.financialStatus === "paid";
              let dueLabel = "On time";
              let dueClass = "bg-green-100 text-green-700";

              if (!isPaid) {
                if (isDueToday) {
                  dueLabel = "Due today";
                  dueClass = "bg-yellow-100 text-yellow-700";
                } else if (isOverdue) {
                  dueLabel = "Overdue";
                  dueClass = "bg-red-100 text-red-700";
                }
              }

              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 border rounded-xl bg-card "
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-base text-foreground">
                        Invoice #{bill.invoiceNumber}
                      </h3>
                      {bill.status && (
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status}
                        </Badge>
                      )}
                      {bill.financialStatus && (
                        <Badge className={getPriorityColor(bill.financialStatus)}>
                          {bill.financialStatus}
                        </Badge>
                      )}
                      {bill.agingStage && (
                        <Badge className={getAgingColor(bill.agingStage)}>
                          {bill.agingStage}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {bill.vendor?.name || "No vendor"}
                    </p>
                    {bill.memo && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">
                        {bill.memo}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ${parseFloat(bill.total).toLocaleString()} {bill.currency}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className={dueClass}>
                          {dueLabel} • {bill.dueDate}
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-accent"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onViewBill(bill)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
