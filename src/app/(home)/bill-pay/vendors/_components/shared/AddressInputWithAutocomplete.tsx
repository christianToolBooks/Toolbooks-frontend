"use client";

import { useEffect, useRef } from "react";
import { useAddressAutocomplete, AddressDetails } from "@/src/hooks/useAddressAutoComplete";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface AddressInputWithAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (details: AddressDetails) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function AddressInputWithAutocomplete({
  value,
  onChange,
  onAddressSelect,
  disabled = false,
  label = "Address Line 1",
  placeholder = "Start typing address...",
}: AddressInputWithAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { inputRef, isLoaded } = useAddressAutocomplete({
    onAddressSelect,
    onError: (error) => console.error("Address autocomplete error:", error),
  });

  // Asegurar que el dropdown sea clickeable
  useEffect(() => {
    if (!isLoaded) return;

    const ensureDropdownClickable = () => {
      const dropdowns = document.querySelectorAll('.pac-container');
      dropdowns.forEach((dropdown) => {
        const htmlDropdown = dropdown as HTMLElement;
        htmlDropdown.style.pointerEvents = 'auto';
        htmlDropdown.style.zIndex = '99999';
        
        // Asegurar que todos los items sean clickeables
        const items = htmlDropdown.querySelectorAll('.pac-item');
        items.forEach((item) => {
          const htmlItem = item as HTMLElement;
          htmlItem.style.pointerEvents = 'auto';
          htmlItem.style.cursor = 'pointer';
        });
      });
    };

    // Ejecutar inmediatamente y cada vez que el DOM cambie
    ensureDropdownClickable();
    
    const observer = new MutationObserver(ensureDropdownClickable);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => observer.disconnect();
  }, [isLoaded]);

  // Prevenir que eventos del contenedor interfieran
  useEffect(() => {
    if (!containerRef.current) return;

    const preventInterference = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.pac-container')) {
        e.stopPropagation();
      }
    };

    const container = containerRef.current;
    container.addEventListener('mousedown', preventInterference, true);
    container.addEventListener('click', preventInterference, true);

    return () => {
      container.removeEventListener('mousedown', preventInterference, true);
      container.removeEventListener('click', preventInterference, true);
    };
  }, []);

  return (
    <div ref={containerRef} className="space-y-1 relative">
      <Label className="text-xs sm:text-sm">
        {label}
        {isLoaded && (
          <span className="text-xs text-muted-foreground ml-2">
            (Start typing for suggestions)
          </span>
        )}
      </Label>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || !isLoaded}
        placeholder={isLoaded ? placeholder : "Loading Google Maps..."}
        className="text-sm"
        autoComplete="off"
        style={{ position: 'relative', zIndex: 1 }}
      />
      {!isLoaded && (
        <p className="text-xs text-amber-600">
          ⚠️ Google Maps is loading...
        </p>
      )}
    </div>
  );
}
