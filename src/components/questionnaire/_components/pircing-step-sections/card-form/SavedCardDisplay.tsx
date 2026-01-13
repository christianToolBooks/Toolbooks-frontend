import { Button } from "@/src/components/ui/button";
import { Check, Edit, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { PaymentCardResponse } from "@/src/types/paymentMethods";
import { getCardStyle } from "../../../_utils/getCardBackground";

const CARD_BRAND_LOGOS: Record<string, string> = {
  V: "/cards/visa.svg",
  VISA: "/cards/visa.svg",
  M: "/cards/mastercard.svg",
  MC: "/cards/mastercard.svg",
  MASTERCARD: "/cards/mastercard.svg",
  A: "/cards/americanexpress.svg",
  X: "/cards/americanexpress.svg",
  AMERICANEXPRESS: "/cards/americanexpress.svg",
  D: "/cards/discover.svg",
  DISCOVER: "/cards/discover.svg",
  R: "/cards/diners.svg",
  DINERS: "/cards/diners.svg",
  J: "/cards/jbc.svg",
};

interface SavedCardDisplayProps {
  card: PaymentCardResponse;
  isSelected: boolean;
  isDeleting: boolean;
  onClick: () => void;
//   onEdit: () => void;
  onDelete: () => void;
}

export function SavedCardDisplay({
  card,
  isSelected,
  isDeleting,
  onClick,
//   onEdit,
  onDelete,
}: SavedCardDisplayProps) {
  const cardBrand = card?.brand || "";
  const logoSrc = CARD_BRAND_LOGOS[cardBrand.toUpperCase()] || CARD_BRAND_LOGOS.V;
  const { bg, text } = getCardStyle(card?.brand);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isSelected ? "shadow-lg shadow-chart-1 rounded-3xl" : "hover:scale-101"
      } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      {isSelected && !isDeleting && (
        <div className="absolute -top-2 -right-2 z-10 bg-chart-1 rounded-full p-1">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl z-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-chart-1" />
            <span className="text-sm font-medium text-gray-700">Deleting...</span>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          disabled={isDeleting}
        >
          <Edit className="h-4 w-4 text-gray-700" />
        </Button> */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white cursor-pointer active:scale-95 transform transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-chart-1" />
        </Button>
      </div>

      <div
        className={`relative bg-gradient-to-br ${bg} ${text} rounded-2xl p-6 shadow-xl aspect-[1.586/1] transition-all duration-500 cursor-pointer`}
        onClick={onClick}
      >
        <div className="absolute top-6 right-6">
          <Image
            src={logoSrc}
            alt="Card brand"
            width={60}
            height={40}
            className="object-contain"
          />
        </div>
        <div className="mt-8 mb-8">
          <Image
            src="/cards/chip.svg"
            alt="Card chip"
            width={68}
            height={52}
            className="object-contain"
          />
        </div>

        <div className="mb-6">
          <p className="text-xl font-mono tracking-wider">
            **** **** **** {card?.last4}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs uppercase mb-1">Card Holder</p>
            <p className="text-sm font-medium uppercase">
              {card?.card_holder_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase mb-1">Expires</p>
            <p className="text-sm font-mono">
              {card?.exp_month?.toString().padStart(2, "0")}/{card?.exp_year}
            </p>
          </div>
        </div>

        {card.is_default && (
          <div className="absolute bottom-2 left-2">
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
              Default
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
