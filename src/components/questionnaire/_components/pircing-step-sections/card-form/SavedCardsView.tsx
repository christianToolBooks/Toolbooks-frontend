import { Button } from "@/src/components/ui/button";
import { PaymentCardResponse } from "@/src/types/paymentMethods";
import { SavedCardDisplay } from "./SavedCardDisplay";

interface SavedCardsViewProps {
  cards: PaymentCardResponse[];
  selectedCardId: string | null;
  maxCards: number;
  hasMaxCards: boolean;
  deletingCardId: string | null;
  onCardSelect: (cardId: string) => void;
  onCardEdit: (card: PaymentCardResponse) => void;
  onCardDelete: (card: PaymentCardResponse) => void;
  onAddNewCard: () => void;
}

export function SavedCardsView({
  cards,
  selectedCardId,
  maxCards,
  hasMaxCards,
  deletingCardId,
  onCardSelect,
  onCardEdit,
  onCardDelete,
  onAddNewCard,
}: SavedCardsViewProps) {
  return (
    <div>
      <div className="flex justify-between md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h3 className="text-md font-semibold text-[#1E3A8A] flex items-center gap-2">
            Payment Details
          </h3>
          <p className="text-sm text-gray-600 mb-4 text-start">
            {cards.length === 1
              ? "Your saved payment method"
              : `Select a payment method (${cards.length}/${maxCards} cards)`}
          </p>
        </div>

        <div className="flex justify-center items-center">
          {!hasMaxCards ? (
            <Button
              type="button"
              variant="outline"
              onClick={onAddNewCard}
              disabled={!!deletingCardId}
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
            >
              + Add New Card
            </Button>
          ) : (
            <div className="text-sm text-gray-500 italic text-center">
              Maximum cards limit reached ({maxCards})
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-8">
        {cards.map((card) => (
          <SavedCardDisplay
            key={card.id}
            card={card}
            isSelected={selectedCardId === card.id}
            isDeleting={deletingCardId === card.id}
            onClick={() => onCardSelect(card.id)}
            // onEdit={() => onCardEdit(card)}
            onDelete={() => onCardDelete(card)}
          />
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">ℹ️ Tip:</span> Your default card will
          be automatically selected for payments. You can change which card is
          default by editing a card and checking &#34;Set as default payment
          method&#34;.
        </p>
      </div>
    </div>
  );
}
