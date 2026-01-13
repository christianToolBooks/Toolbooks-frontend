import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { GeneralInformationPageProps } from "./props";

export default function GeneralInformationPage({ data, onBusinessProfileChange, getFieldError }: GeneralInformationPageProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 ">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={data.businessProfile.business_name ?? ""}
              onChange={(e) =>
                onBusinessProfileChange(
                  "business_name",
                  e.target.value,
                  "businessProfile"
                )
              }
              placeholder="Enter your business name"
              required
              className={
                getFieldError("businessProfile.business_name")
                  ? "border-red-500"
                  : ""
              }
            />
            {getFieldError("businessProfile.business_name") && (
              <p className="text-sm text-red-500">
                {getFieldError("businessProfile.business_name")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Business Website</Label>
            <Input
              id="website"
              type="url"
              value={data.businessProfile.website ?? ""}
              onChange={(e) =>
                onBusinessProfileChange(
                  "website",
                  e.target.value,
                  "businessProfile"
                )
              }
              placeholder="https://yourwebsite.com"
              className={
                getFieldError("businessProfile.website") ? "border-red-500" : ""
              }
            />
            {getFieldError("businessProfile.website") && (
              <p className="text-sm text-red-500">
                {getFieldError("businessProfile.website")}
              </p>
            )}
          </div>
        </div>
    )
}
