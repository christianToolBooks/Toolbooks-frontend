import { useMemo, useCallback } from "react";

interface PrimaryItem {
  isPrimary?: boolean;
  isDefault?: boolean;
}

export function usePrimaryLogic<T extends PrimaryItem>(
  items: T[],
  currentIndex: number,
  field: "isPrimary" | "isDefault" = "isPrimary"
) {
  const hasPrimary = useMemo(
    () => items.some((item, i) => i !== currentIndex && item[field]),
    [items, currentIndex, field]
  );

  const isPrimaryDisabled = useMemo(
    () => hasPrimary && !items[currentIndex]?.[field],
    [hasPrimary, items, currentIndex, field]
  );

  const updatePrimary = useCallback(
    (
      value: boolean,
      setItems: (items: T[]) => void,
      onFieldChange?: (index: number, field: string, value: boolean) => void
    ) => {
      if (value && !isPrimaryDisabled) {
        const updatedItems = items.map((item, i) => ({
          ...item,
          [field]: i === currentIndex,
        }));

        setItems(updatedItems);

        if (onFieldChange) {
          updatedItems.forEach((item, i) => {
            onFieldChange(i, field, item[field] || false);
          });
        }
      }
    },
    [items, currentIndex, field, isPrimaryDisabled]
  );

  return {
    hasPrimary,
    isPrimaryDisabled,
    updatePrimary,
  };
}
