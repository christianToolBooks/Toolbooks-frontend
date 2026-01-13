import { handleApiError } from "@/src/api/errorHandler";
import apiClient from "../axios";
import { ApiResponse } from "@/src/api/apiResponse";
import {
  CancelSubscription,
  CreateACHToPay,
  CreateCardToPay,
  CreateChargeACH,
  CreateChargeCard,
  CreateCustomerToPay,
  CreateSubscription,
  getPreviewQuote,
  PreviewSubscriptionResponse,
  SubscriptionResponse,
} from "@/src/types/paymentMethods";
import { ErrorResponse } from "@/src/api/errorResponse";

export type GetPreviewResponse = ApiResponse<PreviewSubscriptionResponse>;

export async function getPreview(
  data: getPreviewQuote
): Promise<GetPreviewResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<GetPreviewResponse>(
      `/subscriptions/preview`,
      data
    );
    return res.data.data as unknown as GetPreviewResponse;
  } catch (error) {
    return handleApiError(error);
  }
}

export type CreateSubscriptionResponse = ApiResponse<CreateSubscription>;

export async function createSubscription(
  method_id: string,
  data: CreateSubscription
): Promise<CreateSubscriptionResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<CreateSubscriptionResponse>(
      `/subscriptions/create/paymethod/${method_id}`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export type getSupscriptionResponse = ApiResponse<SubscriptionResponse>;

export async function getSupscription(): Promise<
  getSupscriptionResponse | ErrorResponse
> {
  try {
    const res = await apiClient.get<getSupscriptionResponse>(
      `/subscriptions/active`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function manuallyRenewSubscription (
  subscription_id: string,
  method_id: string
): Promise<getSupscriptionResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<getSupscriptionResponse>(
      `/subscriptions/renew/subscription/${subscription_id}/paymethod/${method_id}`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function activeSuspendSubscription (
  subscription_id: string,
  action: 'suspend' | 'activate',
  data: CreateSubscription )
  : Promise<CreateSubscription | ErrorResponse> {
  try {
    const res = await apiClient.post<CreateSubscription>(
      `/subscriptions/${action}/subscription/${subscription_id}`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export type CancelSubscriptionResponse = ApiResponse<CancelSubscription>;

export async function cancelSubscription (
  subscription_id: string,
  data: CancelSubscription
): Promise<CancelSubscriptionResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<CancelSubscriptionResponse>(
      `/subscriptions/cancel/${subscription_id}`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export type CreateCardResponse = ApiResponse<CreateCardToPay>;

export async function createCard(
  data: CreateCardToPay
): Promise<CreateCardResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<CreateCardResponse>(
      `/payarc-card/create`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export type CreateACHResponse = ApiResponse<CreateACHToPay>;

export async function createACH(
  data: CreateACHToPay
): Promise<CreateACHResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<CreateACHResponse>(
      `/payarc-bank-account/create`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export type ChargeCardResponse = ApiResponse<CreateChargeCard>;

export async function createChargeCard(
  method_id: string,
  data: CreateChargeCard
): Promise<ChargeCardResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<ChargeCardResponse>(
      `/payarc-charge/create-card-charge/${method_id}`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateCardToPay(
  method_id: string,
  data: CreateCardToPay
): Promise<ChargeCardResponse | ErrorResponse> {
  try {
    const res = await apiClient.patch<ChargeCardResponse>(
      `/payarc-card/update-card/${method_id}`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteCardToPay(
  method_id: string
): Promise<ApiResponse<{ message: string }> | ErrorResponse | void> {
  try {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/payarc-card/delete/${method_id}`
    );
    return res.data;
  } catch (error) {
    console.error("Error in deleteCardToPay:", error);
    return handleApiError(error);
  }
}

export type ChargeACHResponse = ApiResponse<CreateChargeACH>;

export async function createChargeACH(
  method_id: string,
  data: CreateChargeACH
): Promise<ChargeACHResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<ChargeACHResponse>(
      `/payarc-charge/create-ach-charge/${method_id}`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getAllBankAccountsToPay(): Promise<
  ApiResponse<CreateACHToPay[]> | ErrorResponse
> {
  try {
    const res = await apiClient.get<ApiResponse<CreateACHToPay[]>>(
      `/payarc-bank-account/get-all`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getAllCardsToPay(): Promise<
  ApiResponse<CreateCardToPay[]> | ErrorResponse
> {
  try {
    const res = await apiClient.get<ApiResponse<CreateCardToPay[]>>(
      `/payarc-card/get-all`
    );
    return res.data.data as unknown as ApiResponse<CreateCardToPay[]>;
  } catch (error) {
    return handleApiError(error);
  }
}

export type CreateCustomerToPayResponse = ApiResponse<CreateCustomerToPay>;

export async function createCustomerToPay(
  data: CreateCustomerToPay
): Promise<CreateCustomerToPayResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<CreateCustomerToPayResponse>(
      `/payarc-customer/create`,
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCustomerToPay(): Promise<
  ApiResponse<CreateCustomerToPay> | ErrorResponse
> {
  try {
    const res = await apiClient.get<ApiResponse<CreateCustomerToPay>>(
      `/payarc-customer/get`
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateCustomerToPay(
  data: CreateCustomerToPay,
  customerId: string
): Promise<CreateCustomerToPayResponse | ErrorResponse> {
  try {
    const res = await apiClient.patch<CreateCustomerToPayResponse>(
      `/payarc-customer/update/${customerId}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    return handleApiError(error);
  }
}

export async function deleteCustomerToPay(
  customerId: string
): Promise<ApiResponse<{ message: string }> | ErrorResponse | void> {
  try {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/payarc-customer/delete/${customerId}`
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    return handleApiError(error);
  }
}