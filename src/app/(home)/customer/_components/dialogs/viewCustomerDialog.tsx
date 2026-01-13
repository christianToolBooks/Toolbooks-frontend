"use client"
import { MailIcon, PhoneIcon, UserIcon, Building2, MapPin, Users, FileText, Calendar, DollarSign } from "lucide-react"
import { Customer } from "@/src/types/customer"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Separator } from "@/src/components/ui/separator"
import { Badge } from "@/src/components/ui/badge"
import { ScrollArea } from "@/src/components/ui/scroll-area"

interface ViewCandidateDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewCandidateDialog({ customer, open, onOpenChange }: ViewCandidateDialogProps) {
  const isIndividual = customer.type === "individual"
  const defaultAddress = customer.addresses?.find(addr => addr.isDefault) || customer.addresses?.[0]
  const allAddresses = customer.addresses || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isIndividual ? <UserIcon className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
            Customer Details
          </DialogTitle>
          <DialogDescription>
            Complete information about {customer.name}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Basic Information</h3>
                </div>
                <Badge variant={customer.isActive ? "default" : "secondary"}>
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</p>
                  <Badge variant="outline">{isIndividual ? "Individual" : "Business"}</Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</p>
                  <p className="text-sm font-medium">{customer.name || "N/A"}</p>
                </div>

                {!isIndividual && customer.legalName && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Legal Name</p>
                    <p className="text-sm font-medium">{customer.legalName}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Payment Terms
                  </p>
                  <p className="text-sm font-medium">{customer.paymentTerms?.replace('_', ' ').toUpperCase() || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Currency</p>
                  <p className="text-sm font-medium">{customer.defaultCurrency || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created At
                  </p>
                  <p className="text-sm font-medium">{customer.createdAt}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated At
                  </p>
                  <p className="text-sm font-medium">{customer.updatedAt}</p>
                </div>
              </div>

              {customer.notes && (
                <div className="space-y-1 pl-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Notes
                  </p>
                  <p className="text-sm text-muted-foreground">{customer.notes}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Contact Information</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="flex items-center gap-3">
                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium">{customer.email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone Number</p>
                    <p className="text-sm font-medium">{customer.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {defaultAddress && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Default Address</h3>
                    <Badge variant="outline" className="text-xs">{defaultAddress.type?.replace('_', ' ')}</Badge>
                  </div>

                  <div className="space-y-2 pl-6">
                    <p className="text-sm font-medium">{defaultAddress.line1}</p>
                    {defaultAddress.line2 && <p className="text-sm text-muted-foreground">{defaultAddress.line2}</p>}
                    <p className="text-sm text-muted-foreground">
                      {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{defaultAddress.country}</p>
                  </div>
                </div>
              </>
            )}

            {allAddresses.length > 1 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">All Addresses</h3>
                  </div>

                  <div className="space-y-3 pl-6">
                    {allAddresses.map((address, index) => (
                      <div key={address.id || index} className="p-3 border rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {address.type?.replace('_', ' ')}
                          </Badge>
                          {address.isDefault && <Badge className="text-xs">Default</Badge>}
                        </div>
                        <p className="text-sm font-medium">{address.line1}</p>
                        {address.line2 && <p className="text-sm text-muted-foreground">{address.line2}</p>}
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isIndividual && customer.contacts && customer.contacts.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Business Contacts</h3>
                  </div>

                  <div className="space-y-4 pl-6">
                    {customer.contacts.map((contact, index) => (
                      <div key={index} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{contact.name}</p>
                          {contact.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{contact.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="font-medium">{contact.phone}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Role</p>
                            <p className="font-medium">{contact.role || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Job Title</p>
                            <p className="font-medium">{contact.jobTitle || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

      </DialogContent>
    </Dialog>
  )
}