"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  type BusinessProfileResponse,
  BusinessType,
  type EditableBusinessProfile,
} from "@/src/types/questionnaire";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  Save,
  Upload,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
interface BusinessProfileHeaderProps {
  data?: BusinessProfileResponse;
  isEditing?: boolean;
  onSave?: (data: EditableBusinessProfile) => Promise<void>;
}

export function BusinessProfileHeader({
  data,
  isEditing = false,
  onSave,
}: BusinessProfileHeaderProps) {
  const [editData, setEditData] = useState<EditableBusinessProfile>({
    business_name: data?.business_name ?? "",
    dba: data?.dba ?? "",
    logo_url: data?.logo_url ?? null,
    email: data?.email ?? "",
    website: data?.website ?? "",
    phone_number: data?.phone_number ?? "",
    companyProfile: {
      industry: data?.companyProfile?.industry ?? "",
      business_type:
        data?.companyProfile?.business_type ?? BusinessType.UNDEFINED,
      ein: data?.companyProfile?.ein ?? "",
      naics_code: data?.companyProfile?.naics_code ?? "",
      start_date: data?.companyProfile?.start_date ?? "",
      s_corp_election_date: data?.companyProfile?.s_corp_election_date ?? "",
      year_end_mmdd: data?.companyProfile?.year_end_mmdd ?? "",
      state_of_incorporation:
        data?.companyProfile?.state_of_incorporation ?? "",
      state_id_number: data?.companyProfile?.state_id_number ?? "",
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const handleInputChange = (
    field: keyof EditableBusinessProfile,
    value: EditableBusinessProfile[keyof EditableBusinessProfile]
  ) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (
    field: keyof EditableBusinessProfile["companyProfile"],
    value: EditableBusinessProfile["companyProfile"][keyof EditableBusinessProfile["companyProfile"]]
  ) => {
    setEditData((prev) => ({
      ...prev,
      companyProfile: {
        ...prev.companyProfile,
        [field]: value,
      },
    }));
  };
  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);

    try {
      await onSave(editData);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Card className="border-0 shadow-none bg-white">
      <CardContent className="p-2">
        {isEditing ? (
          <div className="space-y-6">
            {/* Logo Section */}
            <div className="flex flex-col items-start gap-3">
              <div className="w-20 h-20 bg-neutral-100 rounded-md flex items-center justify-center overflow-hidden border border-neutral-200">
                {editData.logo_url ? (
                  <Image
                    src={editData.logo_url || "/placeholder.svg"}
                    width={80}
                    height={80}
                    alt="Company Logo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-neutral-400" />
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-300 hover:bg-neutral-50 bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
            </div>

            <div className="border-t border-neutral-200" />

            {/* Business Info Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-chart-1 tracking-tight">
                  Business Information
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Core details about your company
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-neutral-700 text-xs font-semibold">
                    Business Name
                  </Label>
                  <Input
                    value={editData.business_name}
                    onChange={(e) =>
                      handleInputChange("business_name", e.target.value)
                    }
                    className="border-neutral-200 focus:border-neutral-400 text-sm h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-neutral-700 text-xs font-semibold">
                    DBA (Doing Business As)
                  </Label>
                  <Input
                    value={editData.dba}
                    onChange={(e) => handleInputChange("dba", e.target.value)}
                    className="border-neutral-200 focus:border-neutral-400 text-sm h-9"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200" />

            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-chart-1 tracking-tight">
                  Company Details
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Classification and business type
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-neutral-700 text-xs font-semibold">
                    Industry
                  </Label>
                  <Input
                    value={editData.companyProfile.industry}
                    onChange={(e) =>
                      handleNestedChange("industry", e.target.value)
                    }
                    className="border-neutral-200 focus:border-neutral-400 text-sm h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-neutral-700 text-xs font-semibold">
                    Business Type
                  </Label>
                  <Input
                    value={editData.companyProfile.business_type}
                    onChange={(e) =>
                      handleNestedChange("business_type", e.target.value)
                    }
                    className="border-neutral-200 focus:border-neutral-400 text-sm h-9"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200" />

            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-chart-1 tracking-tight">
                  Contact Information
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  How to reach your business
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-neutral-700 text-xs font-semibold">
                    Email Address
                  </Label>
                  <Input
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-neutral-200 focus:border-neutral-400 text-sm h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-neutral-700 text-xs font-semibold">
                    Phone Number
                  </Label>
                  <Input
                    value={editData.phone_number}
                    onChange={(e) =>
                      handleInputChange("phone_number", e.target.value)
                    }
                    className="border-neutral-200 focus:border-neutral-400 text-sm h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-neutral-700 text-xs font-semibold">
                    Website
                  </Label>
                  <Input
                    value={editData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="border-neutral-200 focus:border-neutral-400 text-sm h-9"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-200">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-200">
                  {data?.logo_url ? (
                    <Image
                      src={data.logo_url || "/placeholder.svg"}
                      width={80}
                      height={80}
                      alt="Company Logo"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-neutral-400" />
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-3 flex flex-col justify-center">
                <div>
                  <h1 className="text-2xl font-bold text-chart-1 tracking-tight leading-tight">
                    {data?.business_name}
                  </h1>
                  {data?.dba && (
                    <p className="text-sm text-neutral-600 mt-1 font-medium">
                      Also known as:{" "}
                      <span className="text-neutral-500">{data.dba}</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data?.companyProfile?.industry && (
                    <Badge
                      variant="secondary"
                      className="bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-2.5 py-0.5 text-xs font-medium"
                    >
                      {data.companyProfile.industry}
                    </Badge>
                  )}

                  {data?.companyProfile?.business_type && (
                    <Badge
                      variant="outline"
                      className="border-neutral-200 text-neutral-600 px-2.5 py-0.5 text-xs font-medium"
                    >
                      {data.companyProfile.business_type
                        .replace(/_/g, " ")
                        .toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-200" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(data?.email || data?.website || data?.phone_number) && (
                <div className="space-y-4 border-r border-neutral-200">
                  <h2 className="text-base font-bold text-chart-1">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data?.email && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Email
                          </span>
                        </div>
                        <p className="text-neutral-900 font-medium text-sm">
                          {data.email}
                        </p>
                      </div>
                    )}

                    {data?.phone_number && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Phone
                          </span>
                        </div>
                        <p className="text-neutral-900 font-medium text-sm">
                          {data.phone_number}
                        </p>
                      </div>
                    )}

                    {data?.website && (
                      <div className="space-y-1.5 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-neutral-400" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Website
                          </span>
                        </div>
                        <a
                          href={data.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-900 font-medium text-sm hover:text-neutral-600 transition-colors flex items-center gap-1"
                        >
                          {data.website}
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-4 border-r border-neutral-200">
                <div className="lg:col-span-1">
                  {(data?.companyProfile?.ein ||
                    data?.companyProfile?.naics_code ||
                    data?.companyProfile?.start_date) && (
                    <div className="space-y-4">
                      <h2 className="text-base font-bold text-chart-1">
                        Tax Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data?.companyProfile?.ein && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              EIN (Tax ID)
                            </p>
                            <p className="text-neutral-900 font-medium text-sm">
                              {data.companyProfile.ein}
                            </p>
                          </div>
                        )}

                        {data?.companyProfile?.naics_code && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              NAICS Code
                            </p>
                            <p className="text-neutral-900 font-medium text-sm">
                              {data.companyProfile.naics_code}
                            </p>
                          </div>
                        )}

                        {data?.companyProfile?.start_date && (
                          <div className="space-y-1.5 md:col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              Start Date
                            </p>
                            <p className="text-neutral-900 font-medium text-sm">
                              {data.companyProfile.start_date}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-1">
                {(data?.companyProfile?.state_of_incorporation ||
                  data?.companyProfile?.state_id_number ||
                  data?.companyProfile?.s_corp_election_date ||
                  data?.companyProfile?.year_end_mmdd) && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-chart-1">
                      Corporate Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {data?.companyProfile?.state_of_incorporation && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              State of Incorporation
                            </p>
                            <p className="text-neutral-900 font-medium text-sm">
                              {data.companyProfile.state_of_incorporation}
                            </p>
                          </div>
                        )}

                        {data?.companyProfile?.state_id_number && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              State ID Number
                            </p>
                            <p className="text-neutral-900 font-medium text-sm">
                              {data.companyProfile.state_id_number}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {data?.companyProfile?.s_corp_election_date && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              S-Corp Election Date
                            </p>
                            <p className="text-neutral-900 font-medium text-sm">
                              {data.companyProfile.s_corp_election_date}
                            </p>
                          </div>
                        )}

                        {data?.companyProfile?.year_end_mmdd && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              Fiscal Year End (MMDD)
                            </p>
                            <p className="text-neutral-900 font-medium text-sm">
                              {data.companyProfile.year_end_mmdd}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
