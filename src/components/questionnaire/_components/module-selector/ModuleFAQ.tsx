import { HelpCircle } from "lucide-react";

interface ModuleFAQProps {
  faq: Array<{ question: string; answer: string }>;
}

export function ModuleFAQ({ faq }: ModuleFAQProps) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-blue-600" />
        Frequently Asked Questions
      </h3>
      <div className="space-y-6">
        {faq.map((item, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
            <p className="text-gray-600 text-sm">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
