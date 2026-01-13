import { useState } from 'react';
import { CustomerActionsProps } from '../_components/customerActions';
import { putCustomerAsInactive, updateCustomer } from '@/src/lib/services/customersServices';
import { toast } from 'sonner';
import { UpdateCustomerForm } from '@/src/types/customer';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UseCustomerActionsInterface extends CustomerActionsProps {}

export default function UseCustomerActions({
  customer,
  onDeleteSuccess,
}: UseCustomerActionsInterface) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    if (!customer.id) {
      toast.error("Customer ID is missing.");
      setShowDeleteModal(false);
      setIsDeleting(false);
      return;
    }

    const res = await putCustomerAsInactive(customer.id, { isActive: false });

    if ("statusCode" in res && res.statusCode !== 200) {
      toast.warning(res.message);
      setShowDeleteModal(false);
      setIsDeleting(false);
      return;
    }

    toast.message(res.message);
    setShowDeleteModal(false);
    setIsDeleting(false);
    if (onDeleteSuccess) {
      onDeleteSuccess();
    }
  };

  const handleEdit = async (
    customerId: string,
    data: UpdateCustomerForm
  ) => {
    try{
      const response = await updateCustomer(customerId, data);

      if("code" in response && response.code == 200){
         toast.success(response.message || "Candidate updated successfully");
      } else {
        toast.error(response.message || "Failed to update candidate");
      }
    } catch (error){
      toast.error ("An error occurred while updating the customer");
      console.error("Update error: ", error);
      
    }
  };

  return {
    showDeleteModal,
    isDeleting,

    handleDelete,
    handleEdit,
    handleDeleteClick,
    handleCloseModal,
  };
}
