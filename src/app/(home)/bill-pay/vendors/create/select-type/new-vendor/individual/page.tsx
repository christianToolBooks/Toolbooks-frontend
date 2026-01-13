"use client";

import { toast } from "sonner";
import { VendorIndividualForm } from "../_components/vendorIndividual-form";
import { useCreateIndividualVendorForm } from "./hooks/useCreateIndividualVendorForm";
import { useRouter } from "next/navigation";

export default function IndividualVendorPage() {
    const router = useRouter();
    const {
    setValue,
    watch,
    errors,
    loading,
    submitError,
    phoneResetKey, 
    onUpdateFormData,
    onAddAddress,
    onRemoveAddress,
    onUpdateAddress,
    // submit
    onSubmit,
    resetForm,
    register,

  } = useCreateIndividualVendorForm({
    onSuccess: () => {
      resetForm();
      toast.success("Vendor created successfully");
        router.push("/bill-pay/vendors");
    },
    onError: () => {
      toast.error("Error creating vendor: " + submitError);
    },
  });

  const formData = watch();
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">Create Individual Vendor</h1>
        <p className="text-[#5C769D]">
          Add a new individual vendor to your system with contact and address information
        </p>
      </div>

      <VendorIndividualForm
        watch={watch}
        register={register}
        formData={formData}
        errors={errors}
        setValue={setValue}
        phoneResetKey={phoneResetKey} 
        onUpdateFormData={onUpdateFormData}
        onAddAddress={onAddAddress}
        onRemoveAddress={onRemoveAddress}
        onUpdateAddress={onUpdateAddress}
        onSubmit={onSubmit}
        onCancel={resetForm}
        submitting={loading}
        submitError={submitError}
      />
    </div>
  );
}