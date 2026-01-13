"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  PositionTitle,
  type Address,
  type BusinessProfile,
  type Contact,
} from "@/src/types/questionnaire";
import {
  FieldErrors,
  UseFormSetValue,
  UseFormRegister,
  UseFormWatch,
  FieldPath,
} from "react-hook-form";
import { BusinessInfoStepProps } from "./props";
import { Separator } from "@/src/components/ui/separator";
import GeneralInformationPage from "./general-information";
import { AddressRow } from "../addressesRow";
import PrimaryContact from "./primary-contact";


export function BusinessInfoStep({
  data,
  onBusinessProfileChange,
  onAddressChange,
  onContactChange,
  onAddAddress,
  onRemoveAddress,
  getFieldError,
  setValue,
  register,
  watch,
}: BusinessInfoStepProps) {
  const contact = data.contacts[0] || {};

  return (
    <Card>
      <CardContent className="space-y-8 pt-6">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-primary mb-1">
            Take a Few Minutes to Tell Us About Your Business and Bookkeeping
            Requirements
          </h2>
          <p className="text-md text-primary max-w-3xl mx-auto">
            And Get Your Personalized ToolBooks Service Profile and Monthly Fee
            Proposal
          </p>
        </div>
<Separator className="mb-8" />
        <GeneralInformationPage
        data={data}
        getFieldError={getFieldError}
        onBusinessProfileChange={onBusinessProfileChange}
        />
        <div className="space-y-4">
          <h3 className="flex justify-start text-lg font-medium text-primary">
            Primary Address
          </h3>
          <Separator className="mb-1" />
          {data.businessAddress.map((addr, i) => (
            <AddressRow
              key={i}
              i={i}
              addr={addr}
              onAddressChange={onAddressChange}
              getFieldError={getFieldError}
              setValue={setValue}
              onRemoveAddress={onRemoveAddress}
            />
          ))}
        </div>
          <PrimaryContact
          data={data}
          getFieldError={getFieldError}
          onContactChange={onContactChange}
          register={register}
          watch={watch}
          setValue={setValue}
          
          />
      </CardContent>
    </Card>
  );
}
