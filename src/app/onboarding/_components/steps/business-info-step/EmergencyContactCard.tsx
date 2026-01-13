"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { FormInput } from "../../form-input";
import type { OnboardingEmergencyContact } from "@/src/types/questionnaire";
import { Phone } from "lucide-react";
import { PhoneUSField } from "../../inputPhoneToOnboarding";

type Props = {
  emergencyContact?: OnboardingEmergencyContact;
  onEmergencyContactChange: (data: Partial<OnboardingEmergencyContact>) => void;
  /** Deshabilita inputs mientras se hidrata (opcional) */
  disabled?: boolean;
};

export function EmergencyContactCard({ emergencyContact, onEmergencyContactChange, disabled = false }: Props) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Emergency Contact <span className="text-sm text-muted-foreground">(Optional)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="First Name"
            name="businessEmergencyContact.first_name"
            value={emergencyContact?.first_name ?? ""}
            onChange={(value) => onEmergencyContactChange({ first_name: value })}
            disabled={disabled}
            autofilled={!!emergencyContact?.first_name}
          />
          <FormInput
            label="Last Name"
            name="businessEmergencyContact.last_name"
            value={emergencyContact?.last_name ?? ""}
            onChange={(value) => onEmergencyContactChange({ last_name: value })}
            disabled={disabled}
            autofilled={!!emergencyContact?.last_name}
          />
          <FormInput
            label="Position or Relationship"
            name="businessEmergencyContact.relationship_or_position"
            value={emergencyContact?.relationship_or_position ?? ""}
            onChange={(value) => onEmergencyContactChange({ relationship_or_position: value })}
            disabled={disabled}
            autofilled={!!emergencyContact?.relationship_or_position}
          />
          <PhoneUSField
            label="Phone Number"
            valueE164={emergencyContact?.phone ?? ""}
            onChangeE164={(value) => onEmergencyContactChange({ phone: value })}
            disabled={disabled}
            autoFilled={!!emergencyContact?.phone}
          />
          <FormInput
            label="Email Address"
            name="businessEmergencyContact.email"
            type="email"
            value={emergencyContact?.email ?? ""}
            onChange={(value) => onEmergencyContactChange({ email: value })}
            disabled={disabled}
            autofilled={!!emergencyContact?.email}
          />
        </div>
      </CardContent>
    </Card>
  );
}
