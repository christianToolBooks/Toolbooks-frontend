/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { useCreateCardForm } from "../../_hooks/useCreateCardForm";
import { useEffect, useState } from "react";
import { PaymentCardResponse } from "@/src/types/paymentMethods";
import { BankAccountsSkeleton } from "../skeletons/bankAccountsSkeleton";
import { toast } from "sonner";
import { SavedCardsView } from "./card-form/SavedCardsView";
import { CardFormView } from "./card-form/CardFormView";
import { DeleteCardDialog } from "./card-form/DeleteCardDialog";

export function CardFormToPay({
  onSelectCard,
}: {
  onSelectCard?: (id: string) => void;
}) {
  const [focused, setFocused] = useState<"name" | "number" | "expiry" | "cvc" | "">("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [cardToDelete, setCardToDelete] = useState<PaymentCardResponse | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const MAX_CARDS = 4;

  const handleCardCreated = async () => {
    setShowForm(false);
    await form.handleGetCardsToPay();
  };

  const form = useCreateCardForm(handleCardCreated);
  const watchValues = form.watch();

  useEffect(() => {
    form.handleGetCardsToPay();
  }, []);

  useEffect(() => {
    if (form.cards && form.cards.length > 0) {
      const defaultCard = form.cards.find((card) => card.is_default);

      if (defaultCard && !selectedCardId) {
        setSelectedCardId(defaultCard.id);
        onSelectCard?.(defaultCard.id);
      } else if (!defaultCard && !selectedCardId && form.cards.length > 0) {
        const firstCard = form.cards[0];
        setSelectedCardId(firstCard.id);
        onSelectCard?.(firstCard.id);
      } else if (selectedCardId && !form.cards.find((c) => c.id === selectedCardId)) {
        const cardToSelect = defaultCard || form.cards[0];
        if (cardToSelect) {
          setSelectedCardId(cardToSelect.id);
          onSelectCard?.(cardToSelect.id);
        } else {
          setSelectedCardId(null);
        }
      }
    }
  }, [form.cards, selectedCardId, onSelectCard]);

  const hasSavedCards = form.cards && form.cards.length > 0;
  const hasMaxCards = form.cards && form.cards.length >= MAX_CARDS;

  const handleCardSelection = (cardId: string) => {
    setSelectedCardId(cardId);
    onSelectCard?.(cardId);
  };

  const handleEditCard = (card: PaymentCardResponse) => {
    form.startEditing(card);
    setShowForm(true);
  };

  const handleDeleteCard = async (card: PaymentCardResponse) => {
    setCardToDelete(card);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCard = async () => {
    if (!cardToDelete) return;
    const wasDefault = cardToDelete.is_default;
    const wasSelected = selectedCardId === cardToDelete.id;
    setDeletingCardId(cardToDelete.id);
    setShowDeleteDialog(false);

    try {
      await form.onDelete(cardToDelete.id);
      if (wasSelected) {
        setSelectedCardId(null);
        if (wasDefault) {
          toast.info("Default card deleted. Please select a new default card.");
        }
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card. Please try again.");
    } finally {
      setDeletingCardId(null);
      setCardToDelete(null);
    }
  };

  const cancelDeleteCard = () => {
    setShowDeleteDialog(false);
    setCardToDelete(null);
  };

  const handleAddNewCard = () => {
    form.cancelEditing();
    setShowForm(true);
  };

  const handleBackToCards = () => {
    form.cancelEditing();
    setShowForm(false);
  };

  if (form.loadingCards) {
    return (
      <div>
        <h3 className="text-md font-semibold text-[#1E3A8A] flex items-center gap-2">
          Payment Details
        </h3>
        <p className="text-sm text-gray-600 mb-4 text-start">
          Loading your saved payment method...
        </p>
        <Card className="mt-6 border-none shadow-none">
          <CardContent className="space-y-6">
            <BankAccountsSkeleton count={2} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasSavedCards && !showForm) {
    return (
      <>
        <SavedCardsView
          cards={form.cards}
          selectedCardId={selectedCardId}
          maxCards={MAX_CARDS}
          hasMaxCards={hasMaxCards}
          deletingCardId={deletingCardId}
          onCardSelect={handleCardSelection}
          onCardEdit={handleEditCard}
          onCardDelete={handleDeleteCard}
          onAddNewCard={handleAddNewCard}
        />

        <DeleteCardDialog
          isOpen={showDeleteDialog}
          isDeleting={deletingCardId !== null}
          cardLast4={cardToDelete?.last4 || "****"}
          isDefault={cardToDelete?.is_default || false}
          onClose={cancelDeleteCard}
          onConfirm={confirmDeleteCard}
        />
      </>
    );
  }

  return (
    <CardFormView
      register={form.register}
      errors={form.errors}
      watchValues={watchValues}
      focused={focused}
      isEditing={form.isEditing}
      hasMaxCards={hasMaxCards}
      maxCards={MAX_CARDS}
      hasSavedCards={hasSavedCards}
      loading={form.loading}
      onFocusChange={setFocused}
      onBackToCards={handleBackToCards}
      onSubmit={form.handleSubmit}
      onIsDefaultChange={(checked) => form.setValue("is_default", checked)}
    />
  );
}
