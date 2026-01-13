import { useState, useCallback, useEffect } from "react";

export function useItemEditing<T extends { id?: string }>(
  item: T,
  index: number,
  editingIndex: number | null,
  localItems: T[],
  setLocalItems: (items: T[]) => void,
  setEditingIndex: (index: number | null) => void
) {
  const [editingData, setEditingData] = useState<T | null>(null);
  const isNewItem = !item.id || item.id.toString().startsWith('temp-');
  const isEditing = editingIndex === index;

  useEffect(() => {
    if (isEditing) {
      setEditingData({ ...item });
    } else {
      setEditingData(null);
    }
  }, [isEditing, item]);

  const startEdit = useCallback(() => {
    setEditingIndex(index);
    setEditingData({ ...item });
  }, [index, item, setEditingIndex]);

  const cancelEdit = useCallback(() => {
    if (isNewItem) {
      const updated = localItems.filter((_, i) => i !== index);
      setLocalItems(updated);
    }
    setEditingIndex(null);
    setEditingData(null);
  }, [isNewItem, index, localItems, setLocalItems, setEditingIndex]);

  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setEditingData((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    []
  );

  return {
    editingData,
    isNewItem,
    isEditing,
    startEdit,
    cancelEdit,
    updateField,
    setEditingData,
  };
}
