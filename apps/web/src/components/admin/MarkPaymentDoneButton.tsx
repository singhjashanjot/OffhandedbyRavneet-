"use client";

import React, { useState } from "react";
import { markPaymentAsDone } from "@/lib/actions/bookings";
import { useRouter } from "next/navigation";

export function MarkPaymentDoneButton({ paymentId }: { paymentId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkAsDone = async () => {
    if (!window.confirm("Are you sure you want to mark this payment as done? This will update the status to SUCCESS and reflect in purchases and revenue dashboard immediately.")) {
      return;
    }

    setLoading(true);
    const res = await markPaymentAsDone(paymentId);
    setLoading(false);

    if (!res.success) {
      alert("Error: " + res.error);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleMarkAsDone}
      disabled={loading}
      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
    >
      {loading ? (
        "Updating..."
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Mark Paid
        </>
      )}
    </button>
  );
}
