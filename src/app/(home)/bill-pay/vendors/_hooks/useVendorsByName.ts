"use client"

import { getVendorByName } from "@/src/lib/services/vendorServices"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { VendorRecord } from "@/src/types/vendorsTypes"

export function useVendorByName() {
  const [searchTerm, setSearchTerm] = useState("")

  const query = useQuery({
    queryKey: ["vendorByName", searchTerm],
    queryFn: () => getVendorByName(searchTerm),
    enabled: !!searchTerm,
  })

  const normalizeSearchResults = (): VendorRecord[] => {
    const response = query.data
    if (!response) return []
    if ("statusCode" in response) return []

    const { data } = response
    if (!data) return []

    const results = Array.isArray(data) ? data : [data]

    return results.filter(
      (vendor): vendor is VendorRecord =>
        vendor !== null &&
        vendor !== undefined &&
        typeof vendor.id === "string" &&
        typeof vendor.name === "string",
    )
  }

  return {
    searchTerm,
    setSearchTerm,
    searchResults: normalizeSearchResults(),
    ...query,
  }
}
