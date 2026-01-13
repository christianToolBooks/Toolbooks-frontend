"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Edit, Power, PowerOff, Plus, Search, Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

import { useGetVendors } from "../vendors/_hooks/getVendorsHook";
import { CreateVendorInput } from "@/src/types/vendorsTypes";
import VendorDetailsModal from "../vendors/modals/vendor-details-modal";
import { useVendorByName } from "../vendors/_hooks/useVendorsByName";
import { VendorsSkeletonTable } from "../vendors/_components/vendorsSkeletonTable";
import { useVendorDetails } from "../vendors/_hooks/useVendorDetails";
import { VendorRecord } from "@/src/types/vendorsTypes";

export function BillPayVendors() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState<VendorRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorsData, setVendorsData] = useState<VendorRecord[]>([]);
  const [vendorForStatusToggle, setVendorForStatusToggle] = useState<VendorRecord | null>(null);
  const [togglingStatusId, setTogglingStatusId] = useState<string | null>(null);

  const itemsPerPage = 10;
  const { vendors: allVendors, loading, refetch } = useGetVendors();

  useEffect(() => {
    if (allVendors) setVendorsData(allVendors);
  }, [allVendors]);

  const { searchTerm, setSearchTerm, searchResults, isLoading: loadingSearch } =
    useVendorByName();

  const vendors = searchTerm ? searchResults : vendorsData;

  const getStatusColor = (status: boolean) =>
    status
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  const totalPages = Math.ceil(vendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVendors = vendors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (vendor: VendorRecord) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleEditVendor = (vendor: VendorRecord) => {
    router.push(`/bill-pay/vendors/${vendor.id}/edit`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVendor(null);
  };

  const handleCreateVendor = () => {
    router.push("/bill-pay/vendors/create/select-type");
  };

  // Hook debe estar en el nivel superior del componente
  const vendorDetails = useVendorDetails({
    vendor: vendorForStatusToggle,
    startInEdit: false,
  });

  const handleToggleStatus = async (vendor: VendorRecord) => {
    setVendorForStatusToggle(vendor);
    setTogglingStatusId(vendor.id);
    
    const success = await vendorDetails.toggleVendorStatus(
      vendor.id,
      vendor.isActive || false
    );
    
    if (success) {
      setVendorsData((prev) =>
        prev.map((v) =>
          v.id === vendor.id ? { ...v, isActive: !v.isActive } : v
        )
      );
      await refetch();
    }
    
    setVendorForStatusToggle(null);
    setTogglingStatusId(null);
  };

  const handleStatusToggleClick = (vendor: VendorRecord) => {
    handleToggleStatus(vendor);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Vendors</h1>
          <p className="text-muted-foreground">
            Manage your vendor information and relationships
          </p>
        </div>
        <Button
          onClick={handleCreateVendor}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Legal Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingSearch || loading ? (
              <VendorsSkeletonTable />
            ) : paginatedVendors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  {searchTerm
                    ? "No vendors found matching your search"
                    : "No vendors available"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.legalName || "-"}</TableCell>
                  <TableCell>{vendor.email || "-"}</TableCell>
                  <TableCell>{vendor.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {vendor.type || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {togglingStatusId === vendor.id ? (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Updating...
                      </Badge>
                    ) : (
                      <Badge
                        className={getStatusColor(vendor.isActive || false)}
                      >
                        {vendor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={togglingStatusId === vendor.id}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(vendor)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleEditVendor(vendor)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(vendor)}
                          disabled={togglingStatusId === vendor.id}
                          className={
                            vendor.isActive
                              ? "text-orange-600 focus:text-orange-600"
                              : "text-green-600 focus:text-green-600"
                          }
                        >
                          {togglingStatusId === vendor.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : vendor.isActive ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, vendors.length)} of{" "}
            {vendors.length} vendors
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modal solo para View Details (sin modo edición) */}
      <VendorDetailsModal
        vendor={selectedVendor as CreateVendorInput}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
