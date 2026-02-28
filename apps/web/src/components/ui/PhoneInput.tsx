"use client";

import React from "react";

/* ========================================
   PHONE INPUT COMPONENT
   Phone number input with country code selector
======================================== */

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

// Popular countries for selection
const COUNTRY_CODES = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
];

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  required = false,
  placeholder = "98765 43210",
  className = "",
}: PhoneInputProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Country Code Selector */}
      <select
        value={countryCode}
        onChange={(e) => onCountryCodeChange(e.target.value)}
        className="input w-32 flex-shrink-0"
        aria-label="Country code"
      >
        {COUNTRY_CODES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.code}
          </option>
        ))}
      </select>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="input flex-1"
        aria-label="Phone number"
      />
    </div>
  );
}
