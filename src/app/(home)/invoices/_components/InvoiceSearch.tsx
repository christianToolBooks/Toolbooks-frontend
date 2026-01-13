'use client';

import { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Calendar } from '@/src/components/ui/calendar';
import { format } from 'date-fns';
import { InvoiceSearchParams } from '@/src/types/invoice';
import { cn } from '@/src/lib/utils/utils';

interface InvoiceSearchProps {
  onSearch: (params: InvoiceSearchParams) => void;
  isLoading?: boolean;
}

export function InvoiceSearch({ onSearch, isLoading }: InvoiceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<InvoiceSearchParams>({
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    minTotal: undefined,
    maxTotal: undefined,
    sortBy: undefined,
    sortDir: 'DESC',
  });

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    onSearch({ q: query });
  };

  const handleAdvancedSearch = () => {
    const searchParams: InvoiceSearchParams = {
      q: searchQuery || undefined,
      ...filters,
    };
    onSearch(searchParams);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      startDate: undefined,
      endDate: undefined,
      status: undefined,
      minTotal: undefined,
      maxTotal: undefined,
      sortBy: undefined,
      sortDir: 'DESC',
    });
    onSearch({});
  };

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.status ||
    filters.minTotal ||
    filters.maxTotal;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by invoice number, customer name..."
            value={searchQuery}
            onChange={(e) => handleQuickSearch(e.target.value)}
            className="pl-9 pr-9"
            disabled={isLoading}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => handleQuickSearch('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'gap-2',
                hasActiveFilters && 'border-primary'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  •
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-auto p-0 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={(filters.status as string) || ''}
                  onValueChange={(value) =>
                    setFilters({ ...filters, status: value || undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        {filters.startDate
                          ? format(new Date(filters.startDate), 'PP')
                          : 'From'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          filters.startDate ? new Date(filters.startDate) : undefined
                        }
                        onSelect={(date) =>
                          setFilters({
                            ...filters,
                            startDate: date
                              ? format(date, 'yyyy-MM-dd')
                              : undefined,
                          })
                        }
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        {filters.endDate ? format(new Date(filters.endDate), 'PP') : 'To'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.endDate ? new Date(filters.endDate) : undefined}
                        onSelect={(date) =>
                          setFilters({
                            ...filters,
                            endDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                          })
                        }
                        disabled={(date) =>
                          filters.startDate ? date < new Date(filters.startDate) : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minTotal || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, minTotal: e.target.value || undefined })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxTotal || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, maxTotal: e.target.value || undefined })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={filters.sortBy || ''}
                    onValueChange={(value) =>
                      setFilters({ ...filters, sortBy: value as InvoiceSearchParams['sortBy'] || undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoiceDate">Invoice Date</SelectItem>
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="total">Amount</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="customerName">Customer</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.sortDir || 'DESC'}
                    onValueChange={(value) =>
                      setFilters({ ...filters, sortDir: value as 'ASC' | 'DESC' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASC">Ascending</SelectItem>
                      <SelectItem value="DESC">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAdvancedSearch}
                className="w-full"
                disabled={isLoading}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
