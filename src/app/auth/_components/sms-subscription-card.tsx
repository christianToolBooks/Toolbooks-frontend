"use client";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";

interface SmsSubscriptionCardProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function SmsSubscriptionCard({
  checked = false,
  onCheckedChange,
  disabled = false,
}: SmsSubscriptionCardProps) {

  return (
    <>
      <div className="flex items-center justify-start gap-3 space-y-0.5 ">
        <Checkbox
          id="sms-subscription"
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="mt-0.5 border-muted-foreground"
        />
        <div className="flex-1">
          <Label
            htmlFor="sms-subscription"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I agree to receive Monthly Report via SMS
          </Label>
      
        </div>
      </div>

      
        <div className="space-y-3 pl-7">
          <div>
            <h3 className="text-xs font-semibold mb-2">
              SMS Subscription Details
            </h3>
          </div>

          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <span className="font-medium">Frequency:</span>
              <span className="text-muted-foreground">
                1 SMS/month (monthly report)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">Help:</span>
              <span className="text-muted-foreground">
                Text HELP for support
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">Stop:</span>
              <span className="text-muted-foreground">
                Text STOP to unsubscribe anytime
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">Rates:</span>
              <span className="text-muted-foreground">
                Standard carrier SMS rates apply
              </span>
            </li>
          </ul>

          <div className="pt-2 text-xs text-muted-foreground leading-relaxed">
            <p>
              By selecting this option, I agree to receive recurring SMS
              messages from RankTitan.AI. Message and data rates may apply.
              Consent is not a condition of purchase. Reply STOP to unsubscribe,
              HELP for support.
            </p>
            <p className="mt-2">
              See our{" "}
              <a
                href="/terms"
                className="text-primary hover:underline font-medium"
              >
                Terms and Conditions
              </a>
              .
            </p>
          </div>
        </div>
    </>
  );
}
