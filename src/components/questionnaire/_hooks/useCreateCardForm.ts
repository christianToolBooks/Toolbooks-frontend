import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import { toast } from "sonner";
import {
  CreateCardToPay,
  PayarcCardSourceEnum,
  PaymentCardResponse,
  typePayMethod,
} from "@/src/types/paymentMethods";
import { useSubscription } from "../_hooks/useSubscription";
import {
  createCardToPaySchema,
  CreateCardToPayFormInput as T,
} from "../schemas/schemas";
import {
  getAllCardsToPay,
  updateCardToPay,
  deleteCardToPay,
} from "@/src/lib/services/methodsToPayService";
import { ErrorResponse } from "@/src/api/errorResponse";

export const useCreateCardForm = (
  onSuccess?: (card: PaymentCardResponse) => void
) => {
  const [loading, setLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [cardData, setCardData] = useState<PaymentCardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<PaymentCardResponse[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const { handleRegisterPaymentMethod } = useSubscription();

  const defaultValues: T = {
    payarc_card_source: PayarcCardSourceEnum.INTERNET,
    card_number: "",
    exp_month: "",
    exp_year: "",
    cvv: "",
    card_holder_name: "",
    is_default: false,
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(createCardToPaySchema) as Resolver<T>,
    defaultValues,
    mode: "onBlur",
  });

  const submitCard = async (data: T) => {
    setLoading(true);
    setError(null);

    try {
      const payload: CreateCardToPay = {
        ...data,
        payarc_card_source: PayarcCardSourceEnum.INTERNET,
        card_number: Number(data.card_number),
        cvv: data.cvv,
      };

      const res = await handleRegisterPaymentMethod(
        typePayMethod.CARD,
        payload
      );

      if (res?.data) {
        const newCard = res.data as unknown as PaymentCardResponse;
        setCardData(newCard);
        await handleGetCardsToPay();
        reset(defaultValues);
        toast.success("Card added successfully!");
        onSuccess?.(newCard);
      }
    } catch (err) {
      console.error("Error creating card:", err);
      toast.error("Failed to create card. Try again.");
      setError("Failed to create card");
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data: T, cardId: string) => {
    setLoading(true);
    setError(null);

    try {
      const payload: CreateCardToPay = {
        ...data,
        payarc_card_source: PayarcCardSourceEnum.INTERNET,
        card_number: Number(data.card_number),
        cvv: data.cvv,
      };

      if (payload.is_default) {
        const currentCard = cards.find((c) => c.id === cardId);
        const wasNotDefault = currentCard && !currentCard.is_default;

        if (wasNotDefault) {
          toast.info("This card will be set as your default payment method.");
        }
      }

      const res = await updateCardToPay(cardId, payload);

      if (res && "data" in res && res.data) {
        toast.success("Card updated successfully!");
        await handleGetCardsToPay();
        setIsEditing(false);
        setEditingCardId(null);
        reset(defaultValues);
      } else {
        const errorMsg =
          (res as ErrorResponse)?.message || "Failed to update card";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("❌ Error updating card:", err);
      toast.error("Failed to update card. Try again.");
      setError("Failed to update card");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (cardId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await deleteCardToPay(cardId);
      if (!res || (typeof res === 'object' && 'code' in res && res.code === 200)) {
        toast.success("Card deleted successfully!");
        await handleGetCardsToPay();
      } else if ("error" in res || "message" in res) {
        const errorMsg =
          (res as ErrorResponse)?.message || "Failed to delete card";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("❌ Error deleting card:", err);
      toast.error("Failed to delete card. Try again.");
      setError("Failed to delete card");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCardsToPay = async () => {
    setLoadingCards(true);
    setError(null);
    try {
      const res = await getAllCardsToPay();
      setCards(res as unknown as PaymentCardResponse[]);
    } catch (err) {
      console.error("❌ Error fetching cards:", err);
      setError("Failed to fetch cards");
    } finally {
      setLoadingCards(false);
    }
  };

  const startEditing = (card: PaymentCardResponse) => {
    setIsEditing(true);
    setEditingCardId(card.id);
    setValue("card_holder_name", card.card_holder_name || "");
    setValue("card_number", `****${card.last4}`);
    setValue("exp_month", card.exp_month?.toString().padStart(2, "0") || "");
    setValue("exp_year", card.exp_year?.toString() || "");
    setValue("cvv", "");
    setValue("is_default", card.is_default || false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingCardId(null);
    reset(defaultValues);
  };

  const handleFormSubmit = async (data: T) => {
    if (isEditing && editingCardId) {
      await onUpdate(data, editingCardId);
    } else {
      await submitCard(data);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(handleFormSubmit),
    handleGetCardsToPay,
    setValue,
    reset,
    watch,
    errors,
    loading,
    loadingCards,
    error,
    cardData,
    cards,
    isEditing,
    editingCardId,
    startEditing,
    cancelEditing,
    onDelete,
  };
};
