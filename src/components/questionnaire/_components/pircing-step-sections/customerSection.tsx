import { Button } from "@/src/components/ui/button";
import { CustomerFormToPay } from "../pircing-step-sections/customer-form";
import { CardFormToPay } from "../pircing-step-sections/create-card-form";
import { typePayMethod } from "@/src/types/paymentMethods";
import { useCreateMethodPayForm } from "../../_hooks/useCreateMethodPayForm";
import { CreateACHForm } from "./create-ach-form";
import { tailChase } from "ldrs";
import { useSubscriptionFlow } from "../../_hooks/useSubscriptionFlow";
import { Edit, Trash2 } from "lucide-react";

interface CustomerSectionProps {
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
  customerForm: ReturnType<typeof useCreateMethodPayForm>;
  paymentType: typePayMethod;
}

export function CustomerSection({
  subscriptionFlow,
  customerForm,
  paymentType,
}: CustomerSectionProps) {
  const {
    hasCustomer,
    loadingCustomer,
    customerData,
    isEditing,
    toggleEdit,
    cancelEdit,
    onDelete,
    loading,
  } = customerForm;

  tailChase.register();

  if (loadingCustomer) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading Payee Information...
        </span>
      </div>
    );
  }
console.log("has customer: ", hasCustomer);

  if (hasCustomer && !isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">
            Billing information
          </h4>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={toggleEdit}
              disabled={loading}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-chart-1 hover:bg-chart-1/70 cursor-pointer"
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to delete this customer?")) {
                  onDelete();
                }
              }}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="text-sm font-medium">{customerData?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium">{customerData?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm font-medium">{customerData?.phone_number}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">City, State</p>
            <p className="text-sm font-medium">
              {customerData?.city}, {customerData?.state}
            </p>
          </div>
        </div>

        {paymentType === typePayMethod.CARD && (
          <div className="mt-6">
            <CardFormToPay
              onSelectCard={(id) => subscriptionFlow.setSelectedMethodId(id)}
            />
          </div>
        )}

        {paymentType === typePayMethod.ACH && (
          <div className="mt-6">
            <CreateACHForm
              customerId={customerForm.customerData?.payarc_customer_id ?? ""}
              onSelectACH={(id) => subscriptionFlow.setSelectedMethodId(id)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          {hasCustomer && isEditing
            ? "Edit Customer Information"
            : "Customer Information"}
        </h4>
        {hasCustomer && isEditing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={cancelEdit}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>

      <CustomerFormToPay
        i={0}
        data={customerForm.watch()}
        onAddressChange={(i, field, value) =>
          customerForm.setValue(field, value, { shouldValidate: true })
        }
        onInputChange={(field, value) =>
          customerForm.setValue(field, value, { shouldValidate: true })
        }
        getFieldError={(fieldPath) =>
          customerForm.formState.errors?.[
            fieldPath as keyof typeof customerForm.formState.errors
          ]?.message ?? null
        }
        setValue={customerForm.setValue}
        errors={customerForm.formState.errors}
        register={customerForm.register}
        watch={customerForm.watch}
      />

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          onClick={customerForm.submit}
          className="flex-1"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              {hasCustomer && isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              {hasCustomer && isEditing ? "Update Customer" : "Create Customer"}
            </>
          )}
        </Button>
      </div>

      {customerForm.hasCustomer && paymentType === typePayMethod.CARD && (
        <div className="mt-6">
          <CardFormToPay
            onSelectCard={(id) => subscriptionFlow.setSelectedMethodId(id)}
          />
        </div>
      )}

      {customerForm.hasCustomer && paymentType === typePayMethod.ACH && (
        <div className="mt-6">
          <CreateACHForm
            customerId={customerForm.customerData?.payarc_customer_id ?? ""}
            onSelectACH={(id) => subscriptionFlow.setSelectedMethodId(id)}
          />
        </div>
      )}
    </div>
  );
}
