import { BusinessProfileResponse, EditableBusinessProfile, EditableContactsPayload, OnboardingFinancialOverview, OnboardingTaxReturnPreparation, PayrollSettings } from "@/src/types/questionnaire";
import { ApiResponse } from "./bankAccountService";
import { ErrorResponse } from "@/src/api/errorResponse";
import apiClient from "../axios";
import { handleApiError } from "@/src/api/errorHandler";

export async function getBusinessProfileCompleteService(): Promise<ApiResponse<BusinessProfileResponse> | ErrorResponse> {
  try {
    const response = await apiClient.get(`/business-profile/all`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export async function updateFinancialOverviewService(
  data: OnboardingFinancialOverview,
  financialOverviewId: string
): Promise<ApiResponse<OnboardingFinancialOverview> | ErrorResponse> {
  try {
    const response = await apiClient.patch(
      `/financial-overview/update/${financialOverviewId}`,
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateTaxReturnPreparationService(
  data: Partial<OnboardingTaxReturnPreparation>,
  taxReturnPreparationId: string
): Promise<ApiResponse<OnboardingTaxReturnPreparation> | ErrorResponse> {
  try {
    const response = await apiClient.patch(
      `/tax-return-preparation/update/${taxReturnPreparationId}`,
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updatePayrollModuleSettingsService(
  data: Partial<PayrollSettings>,
  businessProfileId: string
): Promise<ApiResponse<{ enabled: boolean }> | ErrorResponse> {
  try {
    const response = await apiClient.patch(
      `/payroll-settings/update/${businessProfileId}`,
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateBusinessAndCompanyProfileService(
  data: Partial<EditableBusinessProfile>,
  businessProfileId: string
): Promise<ApiResponse<EditableBusinessProfile> | ErrorResponse> {
  try {
    const response = await apiClient.patch(
      `/business-profile/update/${businessProfileId}`,
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateContactsAndEmergencyService(
  data: EditableContactsPayload,
  businessProfileId: string
): Promise<ApiResponse<EditableContactsPayload> | ErrorResponse> {
  try {
    const response = await apiClient.patch(
      `/business-profile/update/${businessProfileId}`,
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}