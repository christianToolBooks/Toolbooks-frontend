
export function getCardStyle(brand?: string) {
  const key = brand?.toUpperCase() || "DEFAULT";

  const styles: Record<string, { bg: string; text: string }> = {
    V: { bg: "from-blue-100 to-blue-300", text: "text-gray-800" },
    VISA: { bg: "from-blue-100 to-blue-300", text: "text-gray-800" },
    M: { bg: "from-orange-600 to-red-600", text: "text-white" },
    MC: { bg: "from-orange-600 to-red-600", text: "text-white" },
    MASTERCARD: { bg: "from-orange-600 to-red-600", text: "text-white" },
    A: { bg: "from-indigo-600 to-blue-700", text: "text-white" },
    X: { bg: "from-indigo-600 to-blue-700", text: "text-white" },
    AMERICANEXPRESS: { bg: "from-indigo-600 to-blue-700", text: "text-white" },
    D: { bg: "from-yellow-200 to-orange-300", text: "text-gray-800" },
    DISCOVER: { bg: "from-yellow-200 to-orange-300", text: "text-gray-800" },
    R: { bg: "from-gray-600 to-gray-800", text: "text-white" },
    DINERS: { bg: "from-gray-600 to-gray-800", text: "text-white" },
    J: { bg: "from-green-500 to-emerald-700", text: "text-white" },
    JCB: { bg: "from-green-500 to-emerald-700", text: "text-white" },
    DEBIT: { bg: "from-teal-500 to-teal-700", text: "text-white" },
    DEFAULT: { bg: "from-slate-800 to-slate-900", text: "text-white" },
  };

  return styles[key] || styles.DEFAULT;
}