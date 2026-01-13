import apiClient from "../axios";
import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { handleApiError } from "@/src/api/errorHandler";
import { OnboardingPayload, Questionnaire } from "@/src/types/questionnaire";

export type CreateQuestionnaireResponse = ApiResponse<Questionnaire>;
export type CreateOnboardingResponse = ApiResponse<OnboardingPayload>;

/**
 * POST /onboarding/get-started
 * Creates a new onboarding questionnaire
 */
export async function createQuestionnaire(
  data: Questionnaire
):  Promise<ApiResponse<Questionnaire> | ErrorResponse>  {
  try {
    const res = await apiClient.post<ApiResponse<Questionnaire>>(
      "onboarding/get-started",
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /business-profile/all
 * Retrieves the onboarding questionnaire data
 */
export async function getQuestionnaire():  Promise<ApiResponse<OnboardingPayload> | ErrorResponse>  {
  try {
    const res = await apiClient.get<ApiResponse<OnboardingPayload>>(
      "/business-profile/all"
    );
   
    if (!res.data) {
      console.warn("⚠️ No data returned from API");
      return {
        message: "No business profile found",
        statusCode: 404,
      };
    }

    return res.data;
  } catch (error) {
    console.error("❌ getQuestionnaire error:", error);
    return handleApiError(error);
  }
}

/**
 * POST /onboarding/complete-profile
 * Completes the onboarding process
 */
export async function createOnboarding(
  data: OnboardingPayload
): Promise<ApiResponse<OnboardingPayload> | ErrorResponse> {
  try {
    const res = await apiClient.post<ApiResponse<OnboardingPayload>>(
      "onboarding/complete-profile",
      data
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}
