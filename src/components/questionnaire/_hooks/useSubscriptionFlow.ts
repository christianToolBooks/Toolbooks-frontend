"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AddonCode,
  BankToPayTypeEnum,
  CreateSubscription,
  getPreviewQuote,
  PreviewSubscriptionResponse,
  termOptions,
  tiers,
  typePayMethod,
  CreateACHToPay,
  CreateCardToPay,
} from "@/src/types/paymentMethods";
import { getServiceLevelFromAmount } from "../_utils/questionnaire-logic";
import { useSubscription } from "./useSubscription";
import {
  getAllBankAccountsToPay,
  getAllCardsToPay,
} from "@/src/lib/services/methodsToPayService";

export function useSubscriptionFlow(initialExpense: string) {
  const [avgMonthlyExpenses, setAvgMonthlyExpenses] = useState(initialExpense);
  const [addons, setAddons] = useState<AddonCode[]>([]);
  const [term, setTerm] = useState<termOptions>(termOptions.MONTHLY);
  const [paymentType, setPaymentType] = useState<typePayMethod>(
    typePayMethod.CARD
  );
  const [employees, setEmployees] = useState(0);
  const [states, setStates] = useState(0);
  const [preview, setPreview] = useState<PreviewSubscriptionResponse | null>(
    null
  );
  const [bankAccounts, setBankAccounts] = useState<CreateACHToPay[]>([]);
  const [cards, setCards] = useState<CreateCardToPay[]>([]);
  const [isTrial, setIsTrial] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [typeBankACH, setTypeBankACH] = useState<BankToPayTypeEnum | undefined>();

  const { handleGetQuote, handleCreateSubscription, loading } = useSubscription();

  useEffect(() => {
    setAvgMonthlyExpenses(initialExpense);
  }, [initialExpense]);

  const tier = (() => {
    const serviceLevel = getServiceLevelFromAmount(parseFloat(avgMonthlyExpenses ?? "0"));
    const name = serviceLevel.name?.toLowerCase() || "";

    if (name.includes("essential")) return tiers.ESSENTIAL;
    if (name.includes("professional")) return tiers.PROFESSIONAL;
    if (name.includes("premium 1")) return tiers.PREMIUM1;
    if (name.includes("premium 2")) return tiers.PREMIUM2;
    if (name.includes("premium 3")) return tiers.PREMIUM3;

    return tiers.ENTERPRISE;
  })();

  const toggleAddon = (addon: AddonCode) => {
    const shouldIncludeMiCasa =
      tier === tiers.PREMIUM1 ||
      tier === tiers.PREMIUM2 ||
      tier === tiers.PREMIUM3 ||
      tier === tiers.ENTERPRISE;

    setAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };


  const getPreview = async (): Promise<boolean> => {

    try {
      const payload: getPreviewQuote = {
        tier,
        addons,
        term,
        employees,
        states,
      };

      const response = await handleGetQuote(payload);

      if (response === null) {
        toast.error("Failed to get preview");
        return false;
      }

      setPreview(response);
      toast.success("Quote generated successfully!");
      return true;
    } catch (error) {
      console.error("❌ Error getting preview:", error);
      toast.error("Failed to get subscription preview");
      return false;
    }
  };

  const createSubscription = async () => {
    if (!preview) {
      toast.info("You must preview your plan before creating a subscription.");
      return;
    }
    if (!selectedMethodId) {
      toast.warning("Please select a payment method first.");
      return;
    }

    const isPayrollConnect = addons.includes(AddonCode.PAYROLL_CONNECT);
    const isPayrollComplete = addons.includes(AddonCode.PAYROLL_COMPLETE);

    const body: CreateSubscription = {
      tier,
      addons,
      term,
      typePayMethod: paymentType,
      ...(paymentType === typePayMethod.CARD && { isTrial }),
    };

    if (isPayrollComplete && !isPayrollConnect) {
      body.employees = employees;
      body.states = states;
    }

    if (typeBankACH) {
      body.type_ach_bank = typeBankACH;
    }

    const res = await handleCreateSubscription(body, selectedMethodId);
    if (!res) return null;

    toast.success("Subscription created successfully! Welcome aboard!");
    return res;
  };

 
  const getBankAccounts = async () => {
    try {
      const res = await getAllBankAccountsToPay();

      if ("message" in res) {
        toast.error(res.message ?? "Failed to fetch bank accounts.");
        return;
      }

      setBankAccounts(res);
      toast.success("Bank accounts loaded successfully!");
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      toast.error("Unexpected error while fetching bank accounts.");
    }
  };


  const getCards = async () => {
    try {
      const res = await getAllCardsToPay();

      if ("message" in res) {
        toast.error(res.message ?? "Failed to fetch cards.");
        return;
      }
      setCards(res);
      toast.success("Cards loaded successfully!");
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error("Unexpected error while fetching cards.");
    }
  };

  return {
    tier,
    addons,
    term,
    paymentType,
    employees,
    states,
    preview,
    loading,
    bankAccounts,
    cards,
    isTrial,
    selectedMethodId,
    typeBankACH,
    toggleAddon,
    setTerm,
    setPaymentType,
    setEmployees,
    setStates,
    setIsTrial,
    setSelectedMethodId,
    setTypeBankACH,
    getPreview,
    getBankAccounts,
    getCards,
    createSubscription,
  };
}
