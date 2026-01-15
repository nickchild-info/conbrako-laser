"use client";

import { useState, useEffect } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { SA_PROVINCES } from "@/lib/api/shipping";
import type { CheckoutShippingAddress } from "@/lib/api/types";

interface AddressFormProps {
  onAddressChange: (address: CheckoutShippingAddress, isValid: boolean) => void;
  initialAddress?: Partial<CheckoutShippingAddress>;
  disabled?: boolean;
}

interface FormErrors {
  street?: string;
  suburb?: string;
  city?: string;
  province?: string;
  postal_code?: string;
}

export function AddressForm({
  onAddressChange,
  initialAddress,
  disabled = false,
}: AddressFormProps) {
  const [address, setAddress] = useState<CheckoutShippingAddress>({
    street: initialAddress?.street || "",
    suburb: initialAddress?.suburb || "",
    city: initialAddress?.city || "",
    province: initialAddress?.province || "",
    postal_code: initialAddress?.postal_code || "",
    country: "ZA",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Validate address and notify parent
  useEffect(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!address.street.trim()) {
      newErrors.street = "Street address is required";
      isValid = false;
    }

    if (!address.suburb.trim()) {
      newErrors.suburb = "Suburb is required";
      isValid = false;
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!address.province) {
      newErrors.province = "Province is required";
      isValid = false;
    }

    if (!address.postal_code || address.postal_code.length < 4) {
      newErrors.postal_code = "Valid postal code is required";
      isValid = false;
    }

    setErrors(newErrors);
    onAddressChange(address, isValid);
  }, [address, onAddressChange]);

  const handleChange = (field: keyof CheckoutShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
  };

  const showError = (field: keyof FormErrors) => {
    return touched.has(field) && errors[field];
  };

  const inputClassName = (field: keyof FormErrors) =>
    `w-full bg-charcoal border ${
      showError(field) ? "border-red-500" : "border-steel-grey"
    } text-white-hot px-3 py-2 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember placeholder:text-steel-grey disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-ember" />
        <h3 className="font-display text-lg text-white-hot">Delivery Address</h3>
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="street" className="block text-sm text-stone mb-1.5">
          Street Address <span className="text-ember">*</span>
        </label>
        <input
          type="text"
          id="street"
          value={address.street}
          onChange={(e) => handleChange("street", e.target.value)}
          onBlur={() => handleBlur("street")}
          placeholder="e.g. 123 Main Road"
          disabled={disabled}
          className={inputClassName("street")}
        />
        {showError("street") && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.street}
          </p>
        )}
      </div>

      {/* Suburb */}
      <div>
        <label htmlFor="suburb" className="block text-sm text-stone mb-1.5">
          Suburb <span className="text-ember">*</span>
        </label>
        <input
          type="text"
          id="suburb"
          value={address.suburb}
          onChange={(e) => handleChange("suburb", e.target.value)}
          onBlur={() => handleBlur("suburb")}
          placeholder="e.g. Sandton"
          disabled={disabled}
          className={inputClassName("suburb")}
        />
        {showError("suburb") && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.suburb}
          </p>
        )}
      </div>

      {/* City and Province row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm text-stone mb-1.5">
            City <span className="text-ember">*</span>
          </label>
          <input
            type="text"
            id="city"
            value={address.city}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={() => handleBlur("city")}
            placeholder="e.g. Johannesburg"
            disabled={disabled}
            className={inputClassName("city")}
          />
          {showError("city") && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="province" className="block text-sm text-stone mb-1.5">
            Province <span className="text-ember">*</span>
          </label>
          <select
            id="province"
            value={address.province}
            onChange={(e) => handleChange("province", e.target.value)}
            onBlur={() => handleBlur("province")}
            disabled={disabled}
            className={inputClassName("province")}
          >
            <option value="">Select province...</option>
            {SA_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {showError("province") && (
            <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.province}
            </p>
          )}
        </div>
      </div>

      {/* Postal Code */}
      <div className="max-w-[200px]">
        <label htmlFor="postal_code" className="block text-sm text-stone mb-1.5">
          Postal Code <span className="text-ember">*</span>
        </label>
        <input
          type="text"
          id="postal_code"
          value={address.postal_code}
          onChange={(e) =>
            handleChange(
              "postal_code",
              e.target.value.replace(/\D/g, "").slice(0, 4)
            )
          }
          onBlur={() => handleBlur("postal_code")}
          placeholder="e.g. 2000"
          maxLength={4}
          disabled={disabled}
          className={inputClassName("postal_code")}
        />
        {showError("postal_code") && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.postal_code}
          </p>
        )}
      </div>

      {/* Country (read-only) */}
      <p className="text-sm text-stone">
        Country: <span className="text-white-hot">South Africa</span>
      </p>
    </div>
  );
}

export default AddressForm;
