// app/(home)/vendors/new/page.tsx  (o donde corresponda)
"use client";

import { useCreateBusinessVendorForm } from "@/src/app/(home)/bill-pay/hooks/useCreateBusinessVendorForm";
import { toast } from "sonner";
import { VendorBusinessForm } from "../_components/vendorBusiness-form";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
  const {
    setValue,
    watch,
    errors,
    loading,
    submitError,
    phoneResetKey,
    onUpdateFormData,
    onAddContact,
    onRemoveContact,
    onUpdateContact,
    onAddAddress,
    onRemoveAddress,
    onUpdateAddress,
    // submit
    onSubmit,
    resetForm,
    register,
  } = useCreateBusinessVendorForm({
    onSuccess: () => {
      resetForm();
      toast.success("Business Vendor created successfully");
        router.push("/bill-pay/vendors");
    },
    onError: () => {
      toast.error("Error creating Business Vendor: " + submitError);
    },
  });

  const formData = watch();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">
          Create Business Vendor
        </h1>
        <p className="text-[#5C769D]">
          Add a new business vendor to your system with contact and address
          information.
        </p>
      </div>

      <VendorBusinessForm
        watch={watch}
        register={register}
        formData={formData}
        errors={errors}
        setValue={setValue}
        phoneResetKey={phoneResetKey}
        onUpdateFormData={onUpdateFormData}
        onAddContact={onAddContact}
        onRemoveContact={onRemoveContact}
        onUpdateContact={onUpdateContact}
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
