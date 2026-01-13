"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Separator } from "@/src/components/ui/separator"
import { Customer, UpdateCustomerForm, CreateCustomerContactInput, CreateCustomerAddressInput } from "@/src/types/customer"
import { updateCustomer, updateContactById, updateAddressById } from "@/src/lib/services/customersServices"
import { toast } from "sonner"
import { Loader2, Plus, X } from "lucide-react"

interface EditCustomerDialogProps {
  customer: Customer
  onRefresh?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ChangeTracker {
  customer: boolean
  contacts: Set<string>
  addresses: Set<string>
}

export function EditcustomerDialog({ customer, onRefresh, open, onOpenChange }: EditCustomerDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const isIndividual = customer.type === "individual"
  const [name, setName] = useState(customer.name || "")
  const [legalName, setLegalName] = useState(customer.legalName || "")
  const [email, setEmail] = useState(customer.email || "")
  const [phone, setPhone] = useState(customer.phone || "")
  const [paymentTerms, setPaymentTerms] = useState(customer.paymentTerms || "net_30")
  const [defaultCurrency, setDefaultCurrency] = useState(customer.defaultCurrency || "USD")
  const [notes, setNotes] = useState(customer.notes || "")
  const defaultAddress = customer.addresses?.[0]
  const [addressLine1, setAddressLine1] = useState(defaultAddress?.line1 || "")
  const [addressLine2, setAddressLine2] = useState(defaultAddress?.line2 || "")
  const [city, setCity] = useState(defaultAddress?.city || "")
  const [state, setState] = useState(defaultAddress?.state || "")
  const [postalCode, setPostalCode] = useState(defaultAddress?.postalCode || "")
  const [country, setCountry] = useState(defaultAddress?.country || "US")
  const [addressType, setAddressType] = useState(defaultAddress?.type || "billed_from")
  const [contacts, setContacts] = useState<CreateCustomerContactInput[]>(customer.contacts || [])

  useEffect(() => {
    if (isOpen) {
      setName(customer.name || "")
      setLegalName(customer.legalName || "")
      setEmail(customer.email || "")
      setPhone(customer.phone || "")
      setPaymentTerms(customer.paymentTerms || "net_30")
      setDefaultCurrency(customer.defaultCurrency || "USD")
      setNotes(customer.notes || "")

      const addr = customer.addresses?.[0]
      setAddressLine1(addr?.line1 || "")
      setAddressLine2(addr?.line2 || "")
      setCity(addr?.city || "")
      setState(addr?.state || "")
      setPostalCode(addr?.postalCode || "")
      setCountry(addr?.country || "US")
      setAddressType(addr?.type || "billed_from")

      setContacts(customer.contacts || [])
    }
  }, [isOpen, customer])

  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        name: "",
        email: "",
        phone: "",
        role: "",
        jobTitle: "",
        isPrimary: contacts.length === 0,
      },
    ])
  }

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  const handleContactChange = (index: number, field: keyof CreateCustomerContactInput, value: string | boolean) => {
    const newContacts = [...contacts]
    
    if (field === 'isPrimary' && value === true) {
      newContacts.forEach((c, i) => {
        c.isPrimary = i === index
      })
    } else {
      newContacts[index] = { ...newContacts[index], [field]: value }
    }
    
    setContacts(newContacts)
  }

  const detectChanges = (): ChangeTracker => {
    const changes: ChangeTracker = {
      customer: false,
      contacts: new Set<string>(),
      addresses: new Set<string>(),
    }

    if (
      name !== customer.name ||
      email !== customer.email ||
      phone !== customer.phone ||
      paymentTerms !== customer.paymentTerms ||
      defaultCurrency !== customer.defaultCurrency ||
      notes !== customer.notes ||
      (!isIndividual && legalName !== customer.legalName)
    ) {
      changes.customer = true
    }

    if (!isIndividual) {
      contacts.forEach((contact, index) => {
        const original = customer.contacts?.[index]
        if (!original) {
          if (contact.name && contact.email) {
            changes.contacts.add('new')
          }
        } else if (contact.id) {
          if (
            contact.name !== original.name ||
            contact.email !== original.email ||
            contact.phone !== original.phone ||
            contact.role !== original.role ||
            contact.jobTitle !== original.jobTitle ||
            contact.isPrimary !== original.isPrimary
          ) {
            changes.contacts.add(contact.id)
          }
        }
      })
    }

    const originalAddr = customer.addresses?.[0]
    if (originalAddr && originalAddr.id) {
      if (
        addressLine1 !== originalAddr.line1 ||
        addressLine2 !== originalAddr.line2 ||
        city !== originalAddr.city ||
        state !== originalAddr.state ||
        postalCode !== originalAddr.postalCode ||
        country !== originalAddr.country ||
        addressType !== originalAddr.type
      ) {
        changes.addresses.add(originalAddr.id)
      }
    }

    return changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const changes = detectChanges()
      if (changes.customer) {
        
        const customerData: UpdateCustomerForm = {
          name,
          email,
          phone,
          paymentTerms,
          defaultCurrency,
          notes,
          legalName: isIndividual ? "" : legalName,
          taxId: "",
          isActive: customer.isActive ?? true,
        }

        const response = await updateCustomer(customer.id!, customerData)

        if ("statusCode" in response && response.statusCode !== 200) {
          toast.error(response.message || "Failed to update customer")
          return
        }
        toast.success("Customer information updated")
      }

      if (!isIndividual && changes.contacts.size > 0) {
        const currentPrimaryIndex = customer.contacts?.findIndex(c => c.isPrimary) ?? -1
        const newPrimaryIndex = contacts.findIndex(c => c.isPrimary)
        
        if (currentPrimaryIndex !== -1 && 
            newPrimaryIndex !== -1 && 
            currentPrimaryIndex !== newPrimaryIndex) {
          
          const currentPrimaryContact = customer.contacts![currentPrimaryIndex]
          if (currentPrimaryContact.id) {
            await updateContactById(customer.id!, currentPrimaryContact.id, {
              ...currentPrimaryContact,
              isPrimary: false,
            })
          }
        }

        for (const contactId of changes.contacts) {
          if (contactId === 'new') continue // Skip new contacts for now
          
          const contact = contacts.find(c => c.id === contactId)
          if (!contact) continue
          const result = await updateContactById(customer.id!, contactId, {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            role: contact.role,
            jobTitle: contact.jobTitle,
            isPrimary: contact.isPrimary,
          })

          if ("statusCode" in result && result.statusCode !== 200) {
            console.error(`Failed to update contact ${contactId}`)
            toast.error(`Failed to update contact: ${contact.name}`)
          }
        }
        toast.success("Contacts updated")
      }

      if (changes.addresses.size > 0) {
        
        const originalAddr = customer.addresses?.[0]
        if (originalAddr && originalAddr.id) {
          
          const addressData: Partial<CreateCustomerAddressInput> = {
            type: addressType,
            line1: addressLine1,
            line2: addressLine2 || null,
            city,
            state,
            postalCode,
            country,
            isDefault: true,
          }

          const result = await updateAddressById(customer.id!, originalAddr.id, addressData)

          if ("statusCode" in result && result.statusCode !== 200) {
            toast.error(result.message || "Failed to update address")
            return
          }
          
          console.log('=== Address updated ===')
          toast.success("Address updated")
        }
      }

      // Si no hubo cambios
      if (!changes.customer && changes.contacts.size === 0 && changes.addresses.size === 0) {
        toast.info("No changes detected")
        setOpen(false)
        return
      }

      console.log('=== Update completed successfully ===')
      toast.success("Customer updated successfully")
      setOpen(false)
      
      if (onRefresh) {
        onRefresh()
      }
    } catch (error) {
      console.error("=== Error updating customer ===", error)
      toast.error("An error occurred while updating the customer")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {!isIndividual && (
                    <div className="space-y-2">
                      <Label htmlFor="legalName">Legal Name</Label>
                      <Input
                        id="legalName"
                        value={legalName}
                        onChange={(e) => setLegalName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select
                      value={paymentTerms}
                      onValueChange={(v) => setPaymentTerms(v as typeof paymentTerms)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net_15">Net 15</SelectItem>
                        <SelectItem value="net_30">Net 30</SelectItem>
                        <SelectItem value="net_60">Net 60</SelectItem>
                        <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="addressType">Address Type</Label>
                    <Select value={addressType} onValueChange={(v) => setAddressType(v as typeof addressType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="billed_from">Billed From</SelectItem>
                        <SelectItem value="shipped_from">Shipped From</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="line1">Address Line 1 *</Label>
                    <Input
                      id="line1"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="MX">Mexico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Business Contacts */}
              {!isIndividual && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Business Contacts</h3>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddContact}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Contact
                      </Button>
                    </div>

                    {contacts.map((contact, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Contact {index + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveContact(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) => handleContactChange(index, "name", e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              value={contact.email}
                              onChange={(e) => handleContactChange(index, "email", e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                              value={contact.phone}
                              onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Input
                              value={contact.role}
                              onChange={(e) => handleContactChange(index, "role", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label>Job Title</Label>
                            <Input
                              value={contact.jobTitle}
                              onChange={(e) => handleContactChange(index, "jobTitle", e.target.value)}
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={contact.isPrimary}
                              onChange={(e) => handleContactChange(index, "isPrimary", e.target.checked)}
                              className="h-4 w-4"
                            />
                            <Label>Primary Contact</Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}