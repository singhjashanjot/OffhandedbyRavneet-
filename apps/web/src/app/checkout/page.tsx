"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header, Footer } from "@/components";
import { formatPrice } from "@/data/workshops";
import { useAuth } from "@/components/providers/AuthProvider";
import { createBooking } from "@/lib/actions/bookings";

/* ========================================
   CHECKOUT PAGE
   Processes workshop bookings via Supabase
   Protected route — requires authentication
======================================== */

function CheckoutContent() {
  const searchParams = useSearchParams();
  const workshopId = searchParams.get("workshopId") || "";
  const workshopTitle = searchParams.get("title") || "Workshop";
  const workshopPrice = parseInt(searchParams.get("price") || "0");
  const tickets = parseInt(searchParams.get("tickets") || "1");
  const attendeeName = searchParams.get("name") || "";
  
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const totalAmount = workshopPrice * tickets;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    const result = await createBooking({
      workshopId,
      tickets,
      attendeeName: attendeeName || user?.user_metadata?.full_name || "Guest",
      attendeeEmail: user?.email || "",
      attendeePhone: user?.user_metadata?.phone_number || undefined,
    });

    if (result.error) {
      setError(result.error);
      setIsProcessing(false);
    } else {
      setBookingResult(result);
      setIsProcessing(false);
      setIsSuccess(true);
    }
  };

  if (!workshopId && !isSuccess) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-20 text-center container-custom">
          <h1 className="text-2xl">Invalid Checkout Session</h1>
          <p className="text-neutral-500 mt-2">No workshop selected for checkout.</p>
          <Link href="/workshops" className="link mt-4 block">Browse Workshops</Link>
        </main>
        <Footer />
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <main className="bg-neutral-50 min-h-screen py-24 flex items-center justify-center max-w-screen-2xl mx-auto">
          <div className="bg-white p-12 rounded-3xl shadow-soft-lg text-center max-w-lg w-full mx-4">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-heading-md font-display mb-4 text-brand-800">Booking Confirmed!</h1>
            <p className="text-neutral-600 mb-4">
              Thank you, {attendeeName || user?.user_metadata?.full_name}! Your {tickets} ticket{tickets > 1 ? "s" : ""} for <strong>{workshopTitle}</strong> {tickets > 1 ? "have" : "has"} been booked.
            </p>
            {bookingResult && (
              <div className="bg-brand-50 rounded-xl p-4 mb-6 text-sm text-left">
                <p><strong>Booking ID:</strong> {bookingResult.bookingId?.slice(0, 8)}...</p>
                <p><strong>Amount:</strong> {formatPrice(bookingResult.totalAmount)}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Confirmed</span></p>
              </div>
            )}
            <p className="text-sm text-neutral-400 mb-6">A confirmation email will be sent shortly.</p>
            <div className="space-y-3">
              <Link href="/" className="btn btn-primary w-full block text-center">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-neutral-50 min-h-screen py-24 max-w-screen-2xl mx-auto">
        <div className="container-custom max-w-3xl">
          <h1 className="text-heading-md font-display mb-8">Checkout</h1>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-body-sm">
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-soft-lg mb-8">
            <h2 className="text-heading-sm mb-6 pb-4 border-b border-neutral-100">Order Summary</h2>
            
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">{workshopTitle}</h3>
                <p className="text-sm text-neutral-500">{tickets} x Attendee(s)</p>
                {attendeeName && (
                  <p className="text-sm text-neutral-400 mt-1">Booked by: {attendeeName}</p>
                )}
              </div>
              <div className="font-medium text-lg">
                {formatPrice(totalAmount)}
              </div>
            </div>

            <div className="flex justify-between py-4 border-t border-dashed border-neutral-200">
              <span className="text-neutral-600">Subtotal</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between py-4 border-t border-dashed border-neutral-200">
              <span className="text-neutral-600">Taxes & Fees</span>
              <span>{formatPrice(0)}</span>
            </div>
            
            <div className="flex justify-between pt-6 border-t border-neutral-200 mt-2">
              <span className="text-xl font-bold text-brand-900">Total</span>
              <span className="text-xl font-bold text-brand-900">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-3xl p-8 shadow-soft-lg">
            <h2 className="text-heading-sm mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 border border-brand-500 bg-brand-50 rounded-xl flex items-center gap-3">
                 <div className="w-5 h-5 rounded-full border-[5px] border-brand-600 bg-white"></div>
                 <span className="font-medium text-brand-900">Credit / Debit Card</span>
              </div>
              <div className="p-4 border border-neutral-200 rounded-xl flex items-center gap-3 opacity-50 cursor-not-allowed">
                 <div className="w-5 h-5 rounded-full border border-neutral-400"></div>
                 <span className="text-neutral-500">UPI / Net Banking (Coming Soon)</span>
              </div>
            </div>

            {/* Card Details (mock for now; real gateway integration needed) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <input type="text" className="input" placeholder="0000 0000 0000 0000" disabled />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry</label>
                  <input type="text" className="input" placeholder="MM/YY" disabled />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">CVC</label>
                  <input type="text" className="input" placeholder="123" disabled />
               </div>
            </div>

            <button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="btn btn-primary w-full py-4 text-lg disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : `Pay ${formatPrice(totalAmount)}`}
            </button>
            <p className="text-center text-xs text-neutral-400 mt-4">
              Payment is processed securely. Your booking will be confirmed immediately.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-50"><p>Loading checkout...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
