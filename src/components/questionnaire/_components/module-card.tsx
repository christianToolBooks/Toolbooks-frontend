"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Check, X, Info } from "lucide-react";
import { useState } from "react";

interface ModuleCardProps {
  title: string;
  description: string;
  features: string[];
  price?: string;
  onAdd: () => void;
  onNotInterested: () => void;
  onNeedMoreInfo: () => void;
  isAdded?: boolean;
  children?: React.ReactNode;
}

export function ModuleCard({
  title,
  description,
  features,
  price,
  onAdd,
  onNotInterested,
  onNeedMoreInfo,
  isAdded = false,
  children,
}: ModuleCardProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <Card
      className={`border-2 transition-all ${isAdded ? "border-primary-500 bg-primary-50/30" : "border-gray-200"}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900">
              {title}
            </CardTitle>
            {price && (
              <div className="text-lg font-semibold text-primary-600 mt-1">
                {price}
              </div>
            )}
          </div>
          {isAdded && (
            <div className="flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
              <Check className="w-4 h-4" />
              Added
            </div>
          )}
        </div>
        <CardDescription className="mt-2 text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-gray-900">
              Key Features:
            </h4>
            {features.length > 6 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                {showMore ? "Show less" : "Show all"}
              </button>
            )}
          </div>
          <ul className="space-y-1.5">
            {(showMore ? features : features.slice(0, 6)).map(
              (feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <Check className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="flex-1 sm:flex-row space-y-2 pt-4 border-t">
          <div className="flex">
            <Button
              onClick={onAdd}
              disabled={isAdded}
              className="flex-1 bg-primary hover:bg-primary/80"
            >
              {isAdded ? "Module Added" : "Add this Module"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onNotInterested}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Not Interested
            </Button>
            <Button
              onClick={onNeedMoreInfo}
              variant="outline"
              className="flex-1"
            >
              <Info className="w-4 h-4 mr-1" />
              Need More Info
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
