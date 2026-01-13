import { Check } from "lucide-react";

interface ModuleFeaturesProps {
  features: string[];
}

export function ModuleFeatures({ features }: ModuleFeaturesProps) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        What&lsquo;s Included:
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
            <span className="text-gray-700 text-start">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
