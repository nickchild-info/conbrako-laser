"use client";

import { useState } from "react";
import { Truck, Loader2, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { formatPrice } from "@/data/products";
import {
  SA_PROVINCES,
  type ShippingQuote,
  getSimpleQuote,
  getMockShippingQuotes,
} from "@/lib/api/shipping";

interface ShippingCalculatorProps {
  onShippingSelect?: (quote: ShippingQuote) => void;
  selectedService?: string;
  productSize?: "small" | "medium" | "large" | "xl";
  quantity?: number;
}

export function ShippingCalculator({
  onShippingSelect,
  selectedService,
  productSize = "medium",
  quantity = 1,
}: ShippingCalculatorProps) {
  const [province, setProvince] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = async () => {
    if (!province) {
      setError("Please select a province");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try API first
      const response = await getSimpleQuote(province, productSize, quantity);
      setQuotes(response.quotes);
      setHasCalculated(true);

      // Auto-select standard shipping if no selection
      if (!selectedService && response.quotes.length > 0) {
        const standardQuote = response.quotes.find(
          (q) => q.service_type === "standard"
        );
        if (standardQuote && onShippingSelect) {
          onShippingSelect(standardQuote);
        }
      }
    } catch {
      // Fallback to mock data if API unavailable
      console.log("Using mock shipping data");
      const mockQuotes = getMockShippingQuotes(province);
      setQuotes(mockQuotes);
      setHasCalculated(true);

      // Auto-select standard shipping
      if (!selectedService && mockQuotes.length > 0) {
        const standardQuote = mockQuotes.find(
          (q) => q.service_type === "standard"
        );
        if (standardQuote && onShippingSelect) {
          onShippingSelect(standardQuote);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuote = (quote: ShippingQuote) => {
    if (onShippingSelect) {
      onShippingSelect(quote);
    }
  };

  const formatDeliveryDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-ZA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-soot border border-smoke p-4">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-ember" />
        <h3 className="font-display text-lg text-white-hot">
          Shipping Calculator
        </h3>
      </div>

      {/* Province and postal code inputs */}
      <div className="space-y-3 mb-4">
        <div>
          <label
            htmlFor="province"
            className="block text-sm text-stone mb-1.5"
          >
            Province
          </label>
          <select
            id="province"
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setHasCalculated(false);
            }}
            className="w-full bg-charcoal border border-steel-grey text-white-hot px-3 py-2 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember"
          >
            <option value="">Select province...</option>
            {SA_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="postal-code"
            className="block text-sm text-stone mb-1.5"
          >
            Postal Code (optional)
          </label>
          <input
            type="text"
            id="postal-code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="e.g. 2000"
            maxLength={4}
            className="w-full bg-charcoal border border-steel-grey text-white-hot px-3 py-2 focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember placeholder:text-steel-grey"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={handleCalculate}
          disabled={isLoading || !province}
          className="w-full"
          variant="secondary"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              {hasCalculated ? "Recalculate" : "Calculate Shipping"}
            </>
          )}
        </Button>
      </div>

      {/* Shipping options */}
      {hasCalculated && quotes.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-smoke">
          <p className="text-sm text-stone mb-3">Select delivery option:</p>
          {quotes.map((quote) => (
            <button
              key={quote.service_type}
              onClick={() => handleSelectQuote(quote)}
              className={`w-full text-left p-3 border transition-colors ${
                selectedService === quote.service_type
                  ? "border-ember bg-ember/10"
                  : "border-steel-grey hover:border-stone"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        selectedService === quote.service_type
                          ? "text-ember"
                          : "text-white-hot"
                      }`}
                    >
                      {quote.service_name}
                    </span>
                    {quote.service_type === "standard" && (
                      <span className="text-xs bg-smoke text-stone px-1.5 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-stone mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {quote.estimated_days === 1
                        ? "Next business day"
                        : `${quote.estimated_days} business days`}
                    </span>
                    <span className="text-steel-grey">
                      ({formatDeliveryDate(quote.estimated_days)})
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`font-bold ${
                      selectedService === quote.service_type
                        ? "text-ember"
                        : "text-white-hot"
                    }`}
                  >
                    {formatPrice(quote.price)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Info note */}
      <p className="text-xs text-steel-grey mt-4">
        Shipping rates are calculated based on your location. Final cost may vary slightly based on exact address.
      </p>
    </div>
  );
}

export default ShippingCalculator;
