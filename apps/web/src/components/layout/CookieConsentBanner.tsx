"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Settings, Check } from "lucide-react";

type CookieConsent = {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
};

const COOKIE_CONSENT_KEY = "koosdoos_cookie_consent";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
    timestamp: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(stored) as CookieConsent;
        setConsent(parsed);
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = { ...newConsent, timestamp: Date.now() };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  };

  const acceptEssential = () => {
    saveConsent({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
  };

  const savePreferences = () => {
    saveConsent(consent);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="max-w-4xl mx-auto">
        {!showSettings ? (
          <div className="bg-charcoal border border-smoke shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-soot border border-smoke flex-shrink-0" aria-hidden="true">
                <Cookie className="h-6 w-6 text-ember" />
              </div>
              <div className="flex-1">
                <h3 id="cookie-consent-title" className="font-display text-lg text-white-hot mb-2">
                  We Value Your Privacy
                </h3>
                <p id="cookie-consent-description" className="text-stone text-sm mb-4">
                  We use cookies to enhance your browsing experience, remember your cart,
                  and understand how you use our site. By clicking "Accept All", you consent
                  to all cookies. You can also customise your preferences.{" "}
                  <Link href="/pages/privacy" className="text-ember hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ember">
                    Learn more
                  </Link>
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2 bg-ember hover:bg-flame text-white-hot font-medium text-sm uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white-hot focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={acceptEssential}
                    className="px-6 py-2 bg-soot hover:bg-smoke border border-smoke text-white-hot font-medium text-sm uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-6 py-2 bg-transparent hover:bg-soot border border-smoke text-stone hover:text-white-hot font-medium text-sm uppercase tracking-wide transition-colors inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                    aria-expanded={showSettings}
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Customise
                  </button>
                </div>
              </div>
              <button
                onClick={acceptEssential}
                className="text-stone hover:text-white-hot transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                aria-label="Close cookie banner and accept essential cookies only"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-charcoal border border-smoke shadow-lg p-6" role="group" aria-labelledby="cookie-settings-title">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Cookie className="h-6 w-6 text-ember" aria-hidden="true" />
                <h3 id="cookie-settings-title" className="font-display text-lg text-white-hot">
                  Cookie Preferences
                </h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-stone hover:text-white-hot transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                aria-label="Close settings and go back"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start justify-between gap-4 p-4 bg-soot border border-smoke">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display text-white-hot">Essential Cookies</h4>
                    <span className="text-xs bg-ember/20 text-ember px-2 py-0.5 uppercase tracking-wide">
                      Required
                    </span>
                  </div>
                  <p className="text-stone text-sm">
                    Required for the website to function properly. Includes shopping cart and checkout functionality.
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-6 bg-ember/20 border border-ember" role="checkbox" aria-checked="true" aria-label="Essential cookies enabled" aria-disabled="true">
                  <Check className="h-4 w-4 text-ember" aria-hidden="true" />
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 bg-soot border border-smoke">
                <div className="flex-1">
                  <h4 id="functional-label" className="font-display text-white-hot mb-1">Functional Cookies</h4>
                  <p id="functional-desc" className="text-stone text-sm">
                    Remember your preferences like language and region to enhance your experience.
                  </p>
                </div>
                <button
                  onClick={() => setConsent({ ...consent, functional: !consent.functional })}
                  className={`w-10 h-6 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                    consent.functional
                      ? "bg-ember/20 border-ember"
                      : "bg-soot border-smoke hover:border-stone"
                  }`}
                  role="switch"
                  aria-checked={consent.functional}
                  aria-labelledby="functional-label"
                  aria-describedby="functional-desc"
                >
                  {consent.functional && <Check className="h-4 w-4 text-ember mx-auto" aria-hidden="true" />}
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 bg-soot border border-smoke">
                <div className="flex-1">
                  <h4 id="analytics-label" className="font-display text-white-hot mb-1">Analytics Cookies</h4>
                  <p id="analytics-desc" className="text-stone text-sm">
                    Help us understand how visitors use our site so we can make improvements.
                  </p>
                </div>
                <button
                  onClick={() => setConsent({ ...consent, analytics: !consent.analytics })}
                  className={`w-10 h-6 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                    consent.analytics
                      ? "bg-ember/20 border-ember"
                      : "bg-soot border-smoke hover:border-stone"
                  }`}
                  role="switch"
                  aria-checked={consent.analytics}
                  aria-labelledby="analytics-label"
                  aria-describedby="analytics-desc"
                >
                  {consent.analytics && <Check className="h-4 w-4 text-ember mx-auto" aria-hidden="true" />}
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 bg-soot border border-smoke">
                <div className="flex-1">
                  <h4 id="marketing-label" className="font-display text-white-hot mb-1">Marketing Cookies</h4>
                  <p id="marketing-desc" className="text-stone text-sm">
                    Used to show you relevant ads across other websites. Only with your consent.
                  </p>
                </div>
                <button
                  onClick={() => setConsent({ ...consent, marketing: !consent.marketing })}
                  className={`w-10 h-6 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember ${
                    consent.marketing
                      ? "bg-ember/20 border-ember"
                      : "bg-soot border-smoke hover:border-stone"
                  }`}
                  role="switch"
                  aria-checked={consent.marketing}
                  aria-labelledby="marketing-label"
                  aria-describedby="marketing-desc"
                >
                  {consent.marketing && <Check className="h-4 w-4 text-ember mx-auto" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={savePreferences}
                className="px-6 py-2 bg-ember hover:bg-flame text-white-hot font-medium text-sm uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white-hot focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              >
                Save Preferences
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-2 bg-soot hover:bg-smoke border border-smoke text-white-hot font-medium text-sm uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                Accept All
              </button>
              <Link
                href="/pages/privacy"
                className="px-6 py-2 bg-transparent hover:bg-soot border border-smoke text-stone hover:text-white-hot font-medium text-sm uppercase tracking-wide transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
