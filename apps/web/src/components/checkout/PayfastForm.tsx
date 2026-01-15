"use client";

import { useEffect, useRef } from "react";
import type { PayfastFormField } from "@/lib/api/types";

interface PayfastFormProps {
  payfastUrl: string;
  formFields: PayfastFormField[];
  autoSubmit?: boolean;
  onSubmit?: () => void;
}

/**
 * PayfastForm Component
 *
 * Renders a hidden form with Payfast payment fields and submits to Payfast.
 * The form uses POST method to redirect the user to Payfast's payment page.
 *
 * Usage:
 * 1. Call POST /api/v1/checkout/payfast with cart data
 * 2. Receive payfast_url and form_fields in response
 * 3. Render this component with the response data
 * 4. Form auto-submits or can be triggered manually
 */
export function PayfastForm({
  payfastUrl,
  formFields,
  autoSubmit = true,
  onSubmit,
}: PayfastFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    // Only auto-submit once
    if (autoSubmit && formRef.current && !hasSubmitted.current) {
      hasSubmitted.current = true;
      if (onSubmit) {
        onSubmit();
      }
      formRef.current.submit();
    }
  }, [autoSubmit, onSubmit]);

  const handleManualSubmit = () => {
    if (formRef.current && !hasSubmitted.current) {
      hasSubmitted.current = true;
      if (onSubmit) {
        onSubmit();
      }
      formRef.current.submit();
    }
  };

  return (
    <form
      ref={formRef}
      action={payfastUrl}
      method="POST"
      className="hidden"
      aria-hidden="true"
    >
      {formFields.map((field) => (
        <input
          key={field.name}
          type="hidden"
          name={field.name}
          value={field.value}
        />
      ))}
      {/* Fallback submit button (hidden but accessible) */}
      <button type="submit" onClick={handleManualSubmit}>
        Pay with Payfast
      </button>
    </form>
  );
}

/**
 * Hook to manage Payfast form state and submission
 */
export function usePayfastSubmit() {
  const submitPayfast = (payfastUrl: string, formFields: PayfastFormField[]) => {
    // Create a temporary form and submit it
    const form = document.createElement("form");
    form.method = "POST";
    form.action = payfastUrl;
    form.style.display = "none";

    formFields.forEach((field) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // Clean up after a short delay
    setTimeout(() => {
      document.body.removeChild(form);
    }, 100);
  };

  return { submitPayfast };
}

export default PayfastForm;
