"use client";

import React, { useState } from "react";
import { resendBookingEmails } from "@/lib/actions/bookings";

export function ResendEmailButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleResend = async () => {
    if (!window.confirm("Re-send the confirmation email to the customer and the booking alert to you?")) {
      return;
    }
    setLoading(true);
    setResult(null);
    const res = await resendBookingEmails(bookingId);
    setLoading(false);
    setResult(res.success ? res.message || "Sent." : "Error: " + res.error);
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        onClick={handleResend}
        disabled={loading}
        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
      >
        {loading ? "Sending..." : "Resend Emails"}
      </button>
      {result && <span className="text-xs text-neutral-600">{result}</span>}
    </span>
  );
}
