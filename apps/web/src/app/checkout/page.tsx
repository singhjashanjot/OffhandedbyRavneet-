"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Header, Footer } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { createBooking } from "@/lib/actions/bookings";

/* ========================================
   CHECKOUT PAGE
   Handles both workshop bookings and product purchases
   Protected route — requires authentication
======================================== */

function CheckoutContent() {
  const searchParams = useSearchParams();

  // Workshop params
  const workshopId = searchParams.get("workshopId") || "";
  const workshopTitle = searchParams.get("title") || "";
  const workshopPrice = parseInt(searchParams.get("price") || "0");
  const tickets = parseInt(searchParams.get("tickets") || "1");
  const attendeeName = searchParams.get("name") || "";

  // Product params
  const productId = searchParams.get("productId") || "";
  const productTitle = searchParams.get("title") || "";
  const productPrice = parseInt(searchParams.get("price") || "0");

  const isProductCheckout = !!productId;
  const itemTitle = isProductCheckout ? productTitle : workshopTitle;
  const itemPrice = isProductCheckout ? productPrice : workshopPrice;
  const totalAmount = isProductCheckout ? itemPrice : itemPrice * tickets;
  const taxAmount = Math.round(totalAmount * 0.18); // 18% GST

  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    if (!isProductCheckout && workshopId) {
      // Workshop booking flow
      const result = await createBooking({
        workshopId,
        tickets,
        attendeeName:
          attendeeName || user?.user_metadata?.full_name || "Guest",
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
    } else {
      // Product purchase flow (placeholder — integrate payment gateway)
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setBookingResult({ orderId: crypto.randomUUID(), totalAmount: totalAmount + taxAmount });
      }, 1500);
    }
  };

  // No valid session
  if (!workshopId && !productId && !isSuccess) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-20 text-center container-custom">
          <h1 className="text-heading-md font-display font-light">
            Invalid Checkout Session
          </h1>
          <p className="text-neutral-500 mt-2">
            No item selected for checkout.
          </p>
          <Link href="/products" className="link mt-4 block">
            Browse Products
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-24 flex items-center justify-center max-w-screen-2xl mx-auto">
          <div className="bg-[#FFFFF5] p-12 rounded-3xl shadow-soft-lg text-center max-w-lg w-full mx-4">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-heading-md font-display font-light mb-4 text-brand-800">
              {isProductCheckout ? "Order Confirmed!" : "Booking Confirmed!"}
            </h1>
            <p className="text-neutral-600 mb-4">
              Thank you
              {(firstName || attendeeName || user?.user_metadata?.full_name) &&
                `, ${firstName || attendeeName || user?.user_metadata?.full_name}`}
              ! Your {isProductCheckout ? "order" : "booking"} for{" "}
              <strong>{itemTitle}</strong> has been confirmed.
            </p>
            {bookingResult && (
              <div className="bg-brand-50 rounded-xl p-4 mb-6 text-sm text-left">
                <p>
                  <strong>{isProductCheckout ? "Order ID" : "Booking ID"}:</strong>{" "}
                  {(bookingResult.orderId || bookingResult.bookingId)?.slice(0, 8)}...
                </p>
                <p>
                  <strong>Amount:</strong> ₹
                  {bookingResult.totalAmount?.toLocaleString("en-IN")}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600 font-semibold">Confirmed</span>
                </p>
              </div>
            )}
            <p className="text-sm text-neutral-400 mb-6">
              A confirmation email will be sent shortly.
            </p>
            <div className="space-y-3">
              <Link
                href={isProductCheckout ? "/products" : "/"}
                className="btn btn-primary w-full block text-center"
              >
                {isProductCheckout ? "Back to Shop" : "Back to Home"}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background-light">
      {/* Left Column: Shipping & Payment */}
      <main className="flex-1 px-6 py-12 lg:px-20 lg:py-16 max-w-3xl mx-auto w-full">
        {/* Mini header */}
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-neutral-900">
              offline_bolt
            </span>
            <h1 className="font-display text-heading-md font-black tracking-tighter uppercase italic text-neutral-900">
              Offhanded
            </h1>
          </Link>
          <Link
            href="/products"
            className="text-body-sm font-medium opacity-60 hover:opacity-100 flex items-center gap-1 transition-all text-neutral-900"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Return to Shop
          </Link>
        </header>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-body-sm">
            {error}
          </div>
        )}

        <section className="space-y-10">
          {/* Shipping Section */}
          <div>
            <h2 className="font-display text-heading-sm font-bold mb-6 flex items-center gap-2 text-neutral-900">
              <span className="material-symbols-outlined">local_shipping</span>
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900"
                  placeholder="Jane"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900"
                  placeholder="Doe"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900"
                  placeholder="123 Minimalist Way"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900"
                  placeholder="Design District"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900"
                  placeholder="110001"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-heading-sm font-bold flex items-center gap-2 text-neutral-900">
                <span className="material-symbols-outlined">payments</span>
                Payment Details
              </h2>
              <div className="flex gap-2 opacity-40">
                <span className="material-symbols-outlined">credit_card</span>
                <span className="material-symbols-outlined">
                  account_balance_wallet
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900"
                    placeholder="0000 0000 0000 0000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined opacity-40">
                    lock
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    CVV
                  </label>
                  <input
                    type="password"
                    className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900"
                    placeholder="***"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Complete Purchase Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-offhanded-deep text-white py-5 rounded-xl font-bold text-body-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Complete Purchase"}
            {!isProcessing && (
              <span className="material-symbols-outlined">arrow_forward</span>
            )}
          </button>
          <p className="text-center text-xs opacity-50 flex items-center justify-center gap-1 text-neutral-600">
            <span className="material-symbols-outlined text-xs">
              shield_lock
            </span>
            Secure SSL Encrypted Checkout
          </p>
        </section>
      </main>

      {/* Right Column: Order Summary */}
      <aside className="w-full lg:w-[450px] bg-offhanded-accent/30 p-8 lg:p-12 border-l border-offhanded-accent/50">
        <div className="lg:sticky lg:top-12">
          <h3 className="font-display text-heading-sm font-bold mb-8 text-neutral-900">
            Order Summary
          </h3>
          <div className="space-y-6">
            {/* Product Item */}
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-offhanded-accent rounded-xl overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-offhanded-accent/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-neutral-600">
                    inventory_2
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center flex-1">
                <h4 className="font-bold text-neutral-900">{itemTitle}</h4>
                {!isProductCheckout && tickets > 1 && (
                  <p className="text-body-sm opacity-60 italic text-neutral-600">
                    {tickets} Ticket{tickets > 1 ? "s" : ""}
                  </p>
                )}
                <p className="font-bold mt-2 text-neutral-900">
                  ₹{itemPrice?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t border-offhanded-deep/10 pt-6 space-y-4">
              <div className="flex justify-between text-body-sm">
                <span className="opacity-60 text-neutral-600">Subtotal</span>
                <span className="font-medium text-neutral-900">
                  ₹{totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="opacity-60 text-neutral-600">Shipping</span>
                <span className="font-medium text-neutral-900">
                  Calculated at next step
                </span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="opacity-60 text-neutral-600">Taxes</span>
                <span className="font-medium text-neutral-900">
                  ₹{taxAmount?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="pt-4 border-t border-offhanded-deep/20 flex justify-between items-baseline">
                <span className="text-body-lg font-bold text-neutral-900">
                  Total
                </span>
                <div className="text-right">
                  <span className="text-heading-md font-black text-neutral-900">
                    ₹{(totalAmount + taxAmount)?.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 text-neutral-600">
                    INR Included
                  </p>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-transparent border border-offhanded-deep/20 rounded-lg px-4 py-2 text-body-sm focus:ring-1 focus:ring-offhanded-deep outline-none text-neutral-900"
                  placeholder="Promo Code"
                />
                <button className="bg-offhanded-deep/10 text-offhanded-deep px-4 py-2 rounded-lg text-body-sm font-bold hover:bg-offhanded-deep/20 transition-all">
                  Apply
                </button>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-12 p-4 rounded-xl border border-offhanded-deep/10 bg-background-light/50">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-brand-600">
                  package_2
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-tighter text-neutral-900">
                    Carbon Neutral Delivery
                  </p>
                  <p className="text-[11px] opacity-60 leading-relaxed mt-1 text-neutral-600">
                    Offhanded offsets 100% of carbon emissions from every
                    shipment to protect our planet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-50">
          <p>Loading checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
