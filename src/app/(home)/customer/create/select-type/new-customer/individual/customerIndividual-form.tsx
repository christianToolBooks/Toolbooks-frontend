// app/(home)/vendors/new/_components/vendor-form.tsx
"use client";

import * as React from "react";
import { CustomerIndividualFormProps } from "./_types/indivualPropsTypes";
import { BasicInfoToIndivualCustomer } from "./basicInfo";
import { Addresses } from "./Addresses";
import { Notes } from "../business/_components/notes";


export function CustomerIndividualForm({
  formData,
  onUpdateFormData,
  onAddAddress,
  onRemoveAddress,
  onUpdateAddress,
  onSubmit,
  onCancel,
  submitting,
  submitError,
  errors,
  setValue,
  register,
  watch,
}: CustomerIndividualFormProps & { phoneResetKey?: number }) {

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto w-full max-w-8xl">
        <form
          onSubmit={(e) => {
            onSubmit(e);
          }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <div className="space-y-6 lg:col-span-8">
            <BasicInfoToIndivualCustomer
              formData={formData}
              onUpdateFormData={onUpdateFormData}
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />

            <Addresses
              addresses={formData.addresses}
              onAddAddress={onAddAddress}
              onRemoveAddress={onRemoveAddress}
              onUpdateAddress={onUpdateAddress}
              setValue={setValue}
              errors={errors}
            />

            <Notes
              notes={formData.notes}
              onChange={(value) => onUpdateFormData({ notes: value })}
            />
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-6">
              <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/90 shadow-sm backdrop-blur-sm">
                <div className="px-5 py-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5C769D]">Addresses</span>
                      <span className="font-medium text-[#1E3A8A]">
                        {formData.addresses?.length || 0}
                      </span>
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-red-600 text-sm px-1">
                      Error: {submitError}
                    </p>
                  )}

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={onCancel}
                      className="w-1/2 cursor-pointer rounded-md border border-[#EFECE6] px-4 py-2 text-[#5C769D] transition-colors hover:bg-gray-50 hover:text-[#1E3A8A]"
                      disabled={!!submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 cursor-pointer rounded-md bg-[#1E3A8A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1E3A8A]/90 disabled:opacity-60"
                      disabled={!!submitting}
                    >
                      {submitting ? "Creating..." : "Create Vendor"}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
