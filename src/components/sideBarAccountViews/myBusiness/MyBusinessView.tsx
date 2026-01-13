"use client"


import { Edit, RefreshCw, X } from "lucide-react"
import { Button } from "../../ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useBusinessProfile } from "./hooks/useBusinessProfile"
import { BusinessProfileHeader } from "./sections/business-profile-header"
import { ContactInformation } from "./sections/contact-information"
import { BusinessAddresses } from "./sections/business-addresses"

export function MyBusinessView() {
  const {handleUpdateBusinessProfile, handleUpdateContactsAndEmergency, getBusinessProfileComplete, loading, error, businessProfileComplete} = useBusinessProfile();
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

   useEffect(() => {
    getBusinessProfileComplete();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["businessProfile"] })
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <p>Loading business information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <p className="text-red-500">Error loading business information</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Business</h1>
          <p className="text-muted-foreground">Comprehensive view of your business information</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} disabled={isUpdating}>
          {isUpdating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : isEditing ? (
            <X className="h-4 w-4 mr-2" />
          ) : (
            <Edit className="h-4 w-4 mr-2" />
          )}
          {isUpdating ? "Saving..." : isEditing ? "Cancel" : "Edit Business"}
        </Button>
      </div>

      <BusinessProfileHeader
        data={businessProfileComplete ?? undefined}
        isEditing={isEditing}
        onSave={async (data) => {
          if (businessProfileComplete?.id) {
            setIsUpdating(true);
            await handleUpdateBusinessProfile(data, businessProfileComplete.id);
            setIsUpdating(false);
          }
        }}
      />

      <div className="bortder-t pt-6 space-y-6">
        <ContactInformation
          contacts={businessProfileComplete?.contacts}
          emergencyContact={businessProfileComplete?.emergencyContact}
          isEditing={isEditing}
          onSave={async (data) => {
            if (businessProfileComplete?.id) {
              setIsUpdating(true);
              await handleUpdateContactsAndEmergency(data, businessProfileComplete.id);
              setIsUpdating(false);
            }
          }}
        />
      </div>

      <div className="bortder-t pt-6 space-y-6">
        <BusinessAddresses
          addresses={businessProfileComplete?.addresses}
        />
      </div>
      <div className="text-sm text-muted-foreground border-t pt-4">
        <div className="flex flex-wrap gap-4">
          {businessProfileComplete?.createdAt && <p>Created: {new Date(businessProfileComplete.createdAt).toLocaleDateString()}</p>}
          {businessProfileComplete?.updatedAt && <p>Last Updated: {new Date(businessProfileComplete.updatedAt).toLocaleDateString()}</p>}
        </div>
      </div>
    </div>
  )   
}
