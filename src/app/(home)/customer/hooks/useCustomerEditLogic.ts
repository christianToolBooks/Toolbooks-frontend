import { useState, useEffect } from "react";
import type { CreateCustomerAddressInput, CreateCustomerContactInput, Customer, UpdateCustomerForm } from "@/src/types/customer";
import { updateCustomer, putCustomerAsActive, putCustomerAsInactive, updateContactById, updateAddressById } from "@/src/lib/services/customersServices";
import { toast } from "sonner";
import { PaymentTerms } from "@/src/types/billPayTypes";

type EditableAddressFields = Omit<CreateCustomerAddressInput, 'id'  | 'createdAt' | 'updatedAt'>;

export function useCustomerEditLogic(customer: Customer | null) {
  const [formData, setFormData] = useState<Partial<UpdateCustomerForm> | null>(null);
  const [addresses, setAddresses] = useState<CreateCustomerAddressInput[]>([]);
  const [contacts, setContacts] = useState<CreateCustomerContactInput[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      console.log('=== useCustomerEditLogic: Setting initial data ===');
      console.log('Customer contacts:', customer.contacts);
      console.log('Customer addresses:', customer.addresses);
      
      setFormData({
        name: customer.name,
        legalName: customer.legalName,
        email: customer.email,
        phone: customer.phone,
        paymentTerms: customer.paymentTerms,
        defaultCurrency: customer.defaultCurrency,
        notes: customer.notes,
      });
      setAddresses(customer.addresses || []);
      setContacts(customer.contacts || []);
    }
  }, [customer]);

  const updateRoot = (field: keyof Customer, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addAddress = () => {
    const tempId = `temp-${Date.now()}`;
    const newAddress: CreateCustomerAddressInput = {
      id: tempId,
      type: "billed_from",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      isDefault: false, // Siempre false para nuevas direcciones
    };
    setAddresses(prev => [...prev, newAddress]);
  };

  const updateAddress = (index: number, field: keyof EditableAddressFields, value: string | boolean | number) => {
    setAddresses(prev => {
      const updated = [...prev];
      
      if (field === 'isDefault' && value === true) {
        return updated.map((addr, i) => {
          const shouldBeDefault = i === index;
          return {
            ...addr,
            isDefault: shouldBeDefault
          };
        });
      }
      
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeAddress = (index: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== index));
  };

  const updateContact = (
    index: number,
    field: keyof CreateCustomerContactInput,
    value: string | boolean
  ) => {
    setContacts(prev => {
      const updated = [...prev];
      
      if (field === 'isPrimary' && value === true) {
        console.log('=== useCustomerEditLogic: Setting primary contact ===');
        console.log('Index:', index);
        console.log('Total contacts:', updated.length);
        
        return updated.map((c, i) => {
          const shouldBePrimary = i === index;
          console.log(`Contact ${i}: isPrimary = ${shouldBePrimary}`);
          return {
            ...c,
            isPrimary: shouldBePrimary
          };
        });
      }
      
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addContact = () => {
    const tempId = `temp-${Date.now()}`;
    const newContact: CreateCustomerContactInput = {
      id: tempId,
      name: "",
      email: "",
      phone: "",
      role: "",
      jobTitle: "",
      isPrimary: false, // Siempre false para nuevos contactos
    };
    setContacts(prev => [...prev, newContact]);
  };

  const removeContact = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCustomerStatus = async (customerId: string, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      const response = currentStatus
        ? await putCustomerAsInactive(customerId, { isActive: false })
        : await putCustomerAsActive(customerId, { isActive: true });

      if ("code" in response && response.code === 200) {
        toast.success(currentStatus ? "Customer deactivated" : "Customer activated");
        return true;
      } else {
        toast.error(response.message || "Failed to update customer status");
        return false;
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (customerId: string) => {
    if (!formData) return false;

    setIsLoading(true);
    try {
      console.log('=== Starting save process ===');
      console.log('Contacts to process:', contacts);
      console.log('Addresses to process:', addresses);

      // 1. Actualizar CONTACTOS existentes secuencialmente
      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        
        if (contact.id && !contact.id.toString().startsWith('temp-')) {
          console.log(`=== Updating contact ${i} ===`);
          console.log('Contact ID:', contact.id);
          console.log('Contact isPrimary:', contact.isPrimary);
          
          try {
            const result = await updateContactById(customerId, contact.id, {
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              role: contact.role,
              jobTitle: contact.jobTitle,
              isPrimary: contact.isPrimary,
            });
            
            console.log(`=== Contact ${i} update result ===`, result);
            
            if ("statusCode" in result && result.statusCode !== 200) {
              console.error(`Failed to update contact ${i}:`, result.message);
              toast.error(`Failed to update contact: ${contact.name}`);
              return false;
            }
          } catch (error) {
            console.error(`Error updating contact ${i}:`, error);
            toast.error(`Error updating contact: ${contact.name}`);
            return false;
          }
        }
      }

      console.log('=== All contacts updated successfully ===');

      // 2. Actualizar ADDRESSES existentes secuencialmente
      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        
        if (address.id && !address.id.toString().startsWith('temp-')) {
          console.log(`=== Updating address ${i} ===`);
          console.log('Address ID:', address.id);
          console.log('Address isDefault:', address.isDefault);
          
          try {
            const result = await updateAddressById(customerId, address.id, {
              type: address.type,
              line1: address.line1,
              line2: address.line2,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
              isDefault: address.isDefault,
            });
            
            console.log(`=== Address ${i} update result ===`, result);
            
            if ("statusCode" in result && result.statusCode !== 200) {
              console.error(`Failed to update address ${i}:`, result.message);
              toast.error(`Failed to update address`);
              return false;
            }
          } catch (error) {
            console.error(`Error updating address ${i}:`, error);
            toast.error(`Error updating address`);
            return false;
          }
        }
      }

      console.log('=== All addresses updated successfully ===');

      // 3. Actualizar los datos básicos del customer
      const updateData: UpdateCustomerForm = {
        name: formData.name ?? "",
        email: formData.email ?? "",
        phone: formData.phone ?? "",
        taxId: formData.taxId ?? "",
        isActive: formData.isActive ?? true,
        legalName: formData.legalName ?? "",
        paymentTerms: formData.paymentTerms ?? PaymentTerms.NET_30,
        defaultCurrency: formData.defaultCurrency ?? "USD",
        notes: formData.notes ?? "",
      };

      console.log('=== Updating customer basic info ===');
      console.log('Update data:', updateData);

      const response = await updateCustomer(customerId, updateData);

      if ("statusCode" in response) {
        toast.error(response.message || "Failed to update customer");
        return false;
      }

      console.log('=== Customer saved successfully ===');
      toast.success("Customer updated successfully");
      return true;
    } catch (error) {
      console.error("=== Error updating customer ===");
      console.error("Error:", error);
      toast.error("An error occurred while updating");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    addresses,
    contacts,
    isLoading,
    updateRoot,
    addAddress,
    updateAddress,
    removeAddress,
    addContact,
    updateContact,
    removeContact,
    setAddresses,
    setContacts,
    toggleCustomerStatus,
    handleSave,
  };
}
