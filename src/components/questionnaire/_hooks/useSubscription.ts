import {
  cancelSubscription,
  createACH,
  createCard,
  createChargeACH,
  createChargeCard,
  createSubscription,
  getPreview,
  getSupscription,
  getSupscriptionResponse,
  manuallyRenewSubscription,
} from "@/src/lib/services/methodsToPayService";
import {
  CancelSubscription,
  CreateACHToPay,
  CreateCardToPay,
  CreateChargeACH,
  CreateChargeCard,
  CreateSubscription,
  getPreviewQuote,
  PreviewSubscriptionResponse,
  typePayMethod,
} from "@/src/types/paymentMethods";
import { ApiResponse } from "@/src/api/apiResponse";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] =
    useState<ApiResponse<CreateSubscription> | null>(null);
  const [gettingSubscription, setGettingSubscription] = useState<getSupscriptionResponse | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [renewalModalIsOpen, setRenewalModalIsOpen] = useState(false);

  const handleGetQuote = async (
    data: getPreviewQuote
  ): Promise<PreviewSubscriptionResponse | null> => {
    setLoading(true);
    try {
      const response = await getPreview(data);

      if ("message" in response) {
        toast.error(response.message ?? "Failed to get preview quote.");
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error getting preview quote:", error);
      toast.error("Unexpected error while getting preview quote.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async (
    data: CreateSubscription,
    method_id: string
  ): Promise<ApiResponse<CreateSubscription> | null> => {
    setLoading(true);
    try {
      const response = await createSubscription(method_id, data);

      if ("statusCode" in response || !response?.data) {
        toast.error(response.message ?? "Failed to create subscription.");
        return null;
      }

      setSubscription(response);
      return response;
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Unexpected error while creating subscription.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSubscription = async (): Promise<
    getSupscriptionResponse | null
  > => {
    setLoading(true);
    try {
      const response = await getSupscription();
      if (response && "message" in response && response.message === "Request processed successfully" && "data" in response && response.data) {
        setGettingSubscription(response);
        return response;
      }
      
      if (response && "statusCode" in response) {
        console.error(response.message ?? "Failed to get subscription.");
      }
      return null;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscription();
  }, []);

  const handleRenewSubscription = async (subscription_id: string, method_id: string) => {
    setLoading(true);
    try {
      const response = await manuallyRenewSubscription(subscription_id, method_id);
      if ("statusCode" in response) {
        toast.error(response.message ?? "Failed to renew subscription.");
        return;
      }
      toast.success("Subscription renewed successfully!");
    } catch (error) {
      console.error("Error renewing subscription:", error);
      toast.error("Unexpected error while renewing subscription.");
    } finally {
      setLoading(false);
      setRenewalModalIsOpen(false);
    }
  }

  const handleRegisterPaymentMethod = async (
    type: typePayMethod,
    data: CreateCardToPay | CreateACHToPay
  ): Promise<ApiResponse<CreateCardToPay | CreateACHToPay> | null> => {
    setLoading(true);
    try {
      const response =
        type === typePayMethod.CARD
          ? await createCard(data as CreateCardToPay)
          : await createACH(data as CreateACHToPay);
      if (!("data" in response)) {
        toast.error(response.message ?? "Failed to register payment method.");
        return null;
      }

      toast.success("Payment method registered successfully!");
      return response;
    } catch (error) {
      console.error("Error registering payment method:", error);
      toast.error("Unexpected error while registering payment method.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscription_id: string, data: CancelSubscription) => {
    setLoading(true);
    try {
      const response = await cancelSubscription(subscription_id, data);
      if ("statusCode" in response || !response?.data) {
        toast.error(response.message ?? "Failed to cancel subscription.");
        return;
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Unexpected error while canceling subscription.");
    } finally {
      setLoading(false);
      setModalIsOpen(false);
    }
  };

  const handleCharge = async (
    type: typePayMethod,
    data: CreateChargeCard | CreateChargeACH,
    method_id: string
  ): Promise<ApiResponse<CreateChargeCard | CreateChargeACH> | null> => {
    setLoading(true);
    try {
      const response =
        type === typePayMethod.CARD
          ? await createChargeCard(method_id, data as CreateChargeCard)
          : await createChargeACH(method_id, data as CreateChargeACH);

      if ("message" in response) {
        toast.error(response.message ?? "Failed to process charge.");
        return null;
      }

      toast.success("Charge completed successfully!");
      return response;
    } catch (error) {
      console.error("Error processing charge:", error);
      toast.error("Unexpected error while processing charge.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    subscription,
    gettingSubscription,
    modalIsOpen,
    renewalModalIsOpen,
    setModalIsOpen,
    setRenewalModalIsOpen,
    handleGetQuote,
    handleCreateSubscription,
    handleCancelSubscription,
    getSubscription,
    handleRegisterPaymentMethod,
    handleRenewSubscription,
    handleCharge,
  };
}
