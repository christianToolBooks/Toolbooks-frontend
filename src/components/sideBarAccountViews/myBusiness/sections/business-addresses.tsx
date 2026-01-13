"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { MapPin } from "lucide-react";
import type { Address } from "@/src/types/questionnaire";

interface BusinessAddressesProps {
  addresses?: Address[];
}

export function BusinessAddresses({ addresses = [] }: BusinessAddressesProps) {
  return (
    <>
      <div className="border-t border-neutral-200" />
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Business Addresses
          </CardTitle>
        </CardHeader>

        <CardContent>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No addresses available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex flex-col gap-3 rounded-xl border border-muted p-4 shadow-sm hover:bg-muted/10 transition"
                >
                  {/* Icon + Header */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-base text-foreground">
                      {addr.line1}
                    </h4>
                  </div>

                  {/* Line 2 */}
                  {addr.line2 && (
                    <p className="text-sm text-muted-foreground">
                      {addr.line2}
                    </p>
                  )}

                  {/* City / State */}
                  <div className="text-sm text-muted-foreground">
                    {addr.city && addr.state ? (
                      <p>
                        {addr.city}, {addr.state}
                      </p>
                    ) : addr.city ? (
                      <p>{addr.city}</p>
                    ) : addr.state ? (
                      <p>{addr.state}</p>
                    ) : null}
                  </div>

                  {/* ZIP */}
                  {addr.zip_code && (
                    <p className="text-sm text-muted-foreground">
                      ZIP Code: {addr.zip_code}
                    </p>
                  )}

                  {/* Country */}
                  {addr.country && (
                    <p className="text-sm text-muted-foreground uppercase">
                      {addr.country}
                    </p>
                  )}

                  <div className="border-t border-muted pt-3 text-xs text-muted-foreground">
                    Updated: {new Date(addr.updatedAt!).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
