import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { useIsMobile } from "@/src/hooks/useMobile";
import { FilterIcon, RefreshCw, RefreshCwIcon, X } from "lucide-react";
import UseGeneralLedgerFilter from "../../hooks/generalLedgerHooks/useGeneralLedgerFilter";
import { Dispatch, SetStateAction } from "react";
import {
  AccountFilterType,
  DateFilter,
} from "../../hooks/generalLedgerHooks/useGeneralLedger";
import AccountFilter from "./GlAccountFilter";

export const dateRangeOptions = [
  "All",
  "Today",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "Last 2 Months",
  "Last 6 Months",
  "Custom",
];

interface GeneralLedgerFilersProps {
  setDateToFilter: Dispatch<SetStateAction<DateFilter>>;
  setAccountFilter: Dispatch<SetStateAction<AccountFilterType | null>>;
  setPage: Dispatch<SetStateAction<number>>;
  refresh?: () => Promise<void>;
  loading: boolean;
}

export default function GeneralLedgerFilers({
  setDateToFilter,
  setAccountFilter,
  refresh,
  setPage,
  loading,
}: GeneralLedgerFilersProps) {
  const isMobile = useIsMobile();
  const { showMobileFilters, setShowMobileFilters, filters, setFilters } =
    UseGeneralLedgerFilter({ setDateToFilter });

    const handleClearFilters = () => {
    setFilters({
       dateRange: 'All',
    customDateFrom: '',
    customDateTo: '',
    source: 'All Sources',
    accountFilter: '',
    sortBy: 'date',
    });
  };
  return (
    <div className="space-y-3">
      <Card className="p-5 border rounded-lg bg-muted/20">
        <div className="flex items-center max-md:gap-2 justify-between ">
          {isMobile ? (
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <div className="flex items-center gap-2">
                <div className="mb-4">
                  <AccountFilter
                    setAccountFilter={setAccountFilter}
                    setPage={setPage}
                  />
                </div>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
              </div>
              <SheetContent side="bottom" className="p-12">
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>
                    Adjust the filters to refine your transaction view
                  </SheetDescription>
                </SheetHeader>
                <div className="flex mt-4  gap-6 items-center justify-center">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Date Range
                    </label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, dateRange: value }))
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {dateRangeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {filters.dateRange === "Custom" && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          From Date
                        </label>
                        <Input
                          type="date"
                          value={filters.customDateFrom}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              customDateFrom: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          To Date
                        </label>
                        <Input
                          type="date"
                          value={filters.customDateTo}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              customDateTo: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex gap-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Date Range
                </label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, dateRange: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {filters.dateRange === "Custom" && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      From Date
                    </label>
                    <Input
                      type="date"
                      value={filters.customDateFrom}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          customDateFrom: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      To Date
                    </label>
                    <Input
                      type="date"
                      value={filters.customDateTo}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          customDateTo: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              )}
              <div>
                <AccountFilter
                  setAccountFilter={setAccountFilter}
                  setPage={setPage}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mt-9 md:pb-4">
            <div className="flex gap-2">
              {isMobile ? (
                <div>
                  <Button
                    variant="outline"
                    className="mt-auto bg-transparent"
                    onClick={refresh}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="mt-auto bg-transparent"
                  >
                    <X className="mr-2 h-4 w-4" /> Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="mt-auto bg-transparent"
                  >
                    <X className="mr-2 h-4 w-4" /> Clear All Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-auto bg-transparent"
                    onClick={refresh}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
