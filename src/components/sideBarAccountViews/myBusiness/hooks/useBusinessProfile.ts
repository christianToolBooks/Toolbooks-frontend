import { getBusinessProfileCompleteService, updateBusinessAndCompanyProfileService, updateContactsAndEmergencyService, updateFinancialOverviewService } from "@/src/lib/services/businessProfileService"
import { BusinessProfileResponse, EditableBusinessProfile, EditableContactsPayload, OnboardingFinancialOverview } from "@/src/types/questionnaire"
import { set } from "date-fns"
import { se, tr } from "date-fns/locale"
import { useState } from "react"
import { toast } from "sonner"

export const useBusinessProfile = () => {
    const [ loading, setLoading] = useState(false)
    const [ error, setError] = useState<string | null>(null)
    const [ businessProfileComplete, setBusinessProfileComplete ] = useState<BusinessProfileResponse | null>(null)

    const getBusinessProfileComplete = async () => {
        setLoading(true)
        setError(null)

        try{
            const response = await getBusinessProfileCompleteService();
            if ('statusCode' in response) {
                setError(response.message || "An error occurred")
                toast.error(response.message || "An error occurred, please try again.")
                return null
            }
            setBusinessProfileComplete(response.data);
            return response.data
        } catch (error) {
            setError("An error occurred, please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateFinancialOverview = async (data: OnboardingFinancialOverview, financialOverviewId: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await updateFinancialOverviewService(data, financialOverviewId);
            if ('statusCode' in response) {
                setError(response.message || "An error occurred")
                toast.error(response.message || "An error occurred, please try again.")
                return null
            }
            toast.success("Financial overview updated successfully")
            return response.data
        } catch (error) {
            setError("An error occurred, please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateBusinessProfile = async (data: Partial<EditableBusinessProfile>, businessProfileId: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await updateBusinessAndCompanyProfileService(data, businessProfileId);
            if ('statusCode' in response) {
                setError(response.message || "An error occurred")
                toast.error(response.message || "An error occurred, please try again.")
                return null
            }
        } catch (error) {
            setError("An error occurred, please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateContactsAndEmergency = async (data: EditableContactsPayload, businessProfileId: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await updateContactsAndEmergencyService(data, businessProfileId);
            if ('statusCode' in response) {
                setError(response.message || "An error occurred")
                toast.error(response.message || "An error occurred, please try again.")
                return null
            }
        } catch (error) {
            setError("An error occurred, please try again.")
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        businessProfileComplete,
        handleUpdateFinancialOverview,
        handleUpdateBusinessProfile,
        handleUpdateContactsAndEmergency,
        getBusinessProfileComplete
    }
}