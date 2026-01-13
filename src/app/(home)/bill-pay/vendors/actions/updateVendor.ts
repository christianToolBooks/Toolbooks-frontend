import { updateVendorById } from "@/src/lib/services/vendorServices";
import { CreateVendorInput } from "@/src/types/vendorsTypes";
import { toast } from "sonner";

export const handleUpdateVendor = async (
  id: string,
  data: Partial<CreateVendorInput>
) => {
  try {
    const response = await updateVendorById(id, data);

    if (response ) {
      toast.success( "Vendor updated successfully");
    } else {
      toast.error( "Failed to update vendor");
    }
  } catch (error) {
    toast.error("An error occurred while updating the vendor");
    console.error("Update error:", error);
  }
}