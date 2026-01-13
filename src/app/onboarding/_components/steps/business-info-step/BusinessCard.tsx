"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { FormFileUpload } from "../../form-file-upload";
import { FormInput } from "../../form-input";
import type { OnboardingBusinessProfile } from "@/src/types/questionnaire";
import { PhoneUSField } from "../../inputPhoneToOnboarding";
import { uploadNewFile } from "@/src/lib/services/fileManagerServices";

type Props = {
  businessInfo: OnboardingBusinessProfile;
  onBusinessInfoChange: (data: Partial<OnboardingBusinessProfile>) => void;
  getFieldError: (field: string) => string | undefined;
  disabled?: boolean;
};

export function BusinessCard({
  businessInfo,
  onBusinessInfoChange,
  getFieldError,
  disabled = false,
}: Props) {
  const uploadLogo = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 5MB`
      );
    }
    const url = await uploadNewFile(file);
    return url;
  };

  const getLogoUrl = (): string | null => businessInfo.logo_url ?? null;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold text-foreground">
          Your Business
        </CardTitle>
        <div className="flex flex-col items-center">
          <FormFileUpload
            label="Logo"
            name="logo"
            value={getLogoUrl()} 
            onUpload={uploadLogo} 
            onChange={(url) => onBusinessInfoChange({ logo_url: url })} 
            accept="image/*"
            className="w-48"
            disabled={disabled}
            error={getFieldError("businessProfile.logo_url")}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Business Name"
            name="businessProfile.business_name"
            value={businessInfo.business_name ?? ""}
            onChange={(value) => onBusinessInfoChange({ business_name: value })}
            placeholder="Legal or official name of business"
            required={true}
            error={getFieldError("businessProfile.business_name")}
            disabled={disabled}
            autofilled={!!businessInfo.business_name}
          />
          <FormInput
            label="DBA (Doing Business As)"
            name="businessProfile.dba"
            value={businessInfo.dba ?? ""}
            onChange={(value) => onBusinessInfoChange({ dba: value })}
            placeholder="Doing Business As"
            required={false}
            disabled={disabled}
            autofilled={!!businessInfo.dba}
          />
          <FormInput
            label="Website"
            name="businessProfile.website"
            type="url"
            value={businessInfo.website ?? ""}
            onChange={(value) => onBusinessInfoChange({ website: value })}
            placeholder="https://example.com"
            required={false}
            error={getFieldError("businessProfile.website")}
            disabled={disabled}
            autofilled={!!businessInfo.website}
          />
          <PhoneUSField
            label="Business Phone"
            valueE164={businessInfo.phone_number ?? ""}
            onChangeE164={(value) =>
              onBusinessInfoChange({ phone_number: value })
            }
            placeholder="+1 415 555 0100"
            required={false}
            errorMsg={getFieldError("businessProfile.phone_number")}
            disabled={disabled}
            autoFilled={!!businessInfo.phone_number}
          />
          <FormInput
            label="Business Email"
            name="businessProfile.email"
            type="email"
            value={businessInfo.email ?? ""}
            onChange={(value) => onBusinessInfoChange({ email: value })}
            placeholder="info@business.com"
            required={true}
            error={getFieldError("businessProfile.email")}
            disabled={disabled}
            autofilled={!!businessInfo.email}
          />
        </div>
      </CardContent>
    </Card>
  );
}
