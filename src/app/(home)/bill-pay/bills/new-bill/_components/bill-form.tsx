"use client";

import * as React from "react";
import { BillFormFields } from "./bill-form-fields";
import { useBillForm } from "../hooks/useBillForm";
import { BillOptionSelector } from "./bill-option-selector";

export function BillForm() {
  const {
    isScanning,
    showForm,
    formData,
    selector,
    setSelectorOpen,
    handleSelectAccount,
    submitting,
    submitError,
    handleFileUpload,
    handleManualEntry,
    addLineItem,
    removeLineItem,
    updateLineItem,
    formatLineItemOnBlur, 
    updateFormData,
    handleSubmit,
    resetForm,
    getFieldError,
  } = useBillForm();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  if (!showForm) {
    return (
      <BillOptionSelector
        isScanning={isScanning}
        onFileUpload={handleFileUpload}
        onManualEntry={handleManualEntry}
      />
    );
  }

  return (
    <BillFormFields
      formData={formData}
      onUpdateFormData={updateFormData}
      onAddLineItem={addLineItem}
      onRemoveLineItem={removeLineItem}
      onUpdateLineItem={updateLineItem}
      onFormatLineItemOnBlur={formatLineItemOnBlur}
      onSubmit={onSubmit}
      onCancel={resetForm}
      selector={selector}
      onSelectorOpenChange={setSelectorOpen}
      onSelectAccount={handleSelectAccount}
      submitting={submitting}
      submitError={submitError || undefined}
      getFieldError={getFieldError}
    />
  );
}