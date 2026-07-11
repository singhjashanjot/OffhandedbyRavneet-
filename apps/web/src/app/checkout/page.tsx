"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header, Footer } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const workshopId = searchParams.get("workshopId") || "";
  const workshopTitle = searchParams.get("title") || "";
  const tickets = parseInt(searchParams.get("tickets") || "1");
  const attendeeName = searchParams.get("name") || "";
  const productId = searchParams.get("productId") || "";
  const productTitle = searchParams.get("title") || "";

  const isProductCheckout = !!productId;
  const isWorkshopCheckout = !!workshopId && !isProductCheckout;
  const itemTitle = isProductCheckout ? productTitle : workshopTitle;

  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Payment gateway failed to load. Please refresh and try again.");

      const body = isWorkshopCheckout
        ? { workshopId, tickets }
        : { productId, quantity: 1 };

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order.");

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Offhanded",
        description: orderData.description,
        order_id: orderData.orderId,
        prefill: orderData.prefill,
        theme: { color: "#2c3627" },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: orderData.paymentId,
                workshopId: isWorkshopCheckout ? workshopId : undefined,
                tickets: isWorkshopCheckout ? tickets : undefined,
                attendeeName: attendeeName || user?.user_metadata?.full_name || "",
                attendeeEmail: user?.email || "",
                productId: isProductCheckout ? productId : undefined,
                quantity: isProductCheckout ? 1 : undefined,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed.");

            setBookingResult({
              bookingId: verifyData.bookingId,
              totalAmount: orderData.amount / 100,
            });
            setIsSuccess(true);
          } catch (err: any) {
            setError(err.message || "Verification failed. Please contact support.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError("Payment was cancelled. You can try again.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setIsProcessing(false);
        setError(`Payment failed: ${response.error?.description || "Unknown error. Please try again."}`);
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  if (!workshopId && !productId && !isSuccess) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-20 text-center container-custom">
          <h1 className="text-heading-md font-display font-light">Invalid Checkout Session</h1>
          <p className="font-sans text-neutral-500 mt-2">No item selected for checkout.</p>
          <Link href="/products" className="link mt-4 block">Browse Products</Link>
        </main>
        <Footer />
      </>
    );
  }

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
            <p className="font-sans text-neutral-600 mb-4">
              Thank you
              {(firstName || attendeeName || user?.user_metadata?.full_name) &&
                `, ${firstName || attendeeName || user?.user_metadata?.full_name}`}
              ! Your {isProductCheckout ? "order" : "booking"} for{" "}
              <strong>{itemTitle}</strong> has been confirmed.
            </p>
            {bookingResult && (
              <div className="bg-brand-50 rounded-xl p-4 mb-6 text-sm font-sans text-left">
                <p><strong>{isProductCheckout ? "Order ID" : "Booking ID"}:</strong>{" "}{bookingResult.bookingId?.slice(0, 8)}...</p>
                <p><strong>Amount:</strong> ₹{bookingResult.totalAmount?.toLocaleString("en-IN")}</p>
                <p><strong>Status:</strong>{" "}<span className="text-green-600 font-semibold">Confirmed ✓</span></p>
              </div>
            )}
            <p className="font-sans text-sm text-neutral-400 mb-6">A confirmation email will be sent shortly.</p>
            <div className="flex flex-col gap-3">
              <Link href={isProductCheckout ? "/products" : "/"} className="btn btn-primary w-full block text-center">
                {isProductCheckout ? "Back to Shop" : "Back to Home"}
              </Link>
              <button
                type="button"
                onClick={() => alert("Please contact at offhandedbyravneet@gmail.com or +91 9855801521")}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-red-200/60 text-red-700 h-14 rounded-full font-bold text-base tracking-tight transition-all hover:bg-red-50"
              >
                Request Cancellation
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background-light">
      <main className="flex-1 px-6 py-12 lg:px-20 lg:py-16 max-w-3xl mx-auto w-full">
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-neutral-900">offline_bolt</span>
            <h1 className="font-display text-heading-md font-black tracking-tighter uppercase italic text-neutral-900">Offhanded</h1>
          </Link>
          <Link href={isWorkshopCheckout ? "/workshops" : "/products"} className="font-sans text-body-sm font-medium opacity-60 hover:opacity-100 flex items-center gap-1 transition-all text-neutral-900">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {isWorkshopCheckout ? "Back to Workshops" : "Return to Shop"}
          </Link>
        </header>

        {error && (
          <div className="font-sans mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-body-sm">
            {error}
          </div>
        )}

        <section className="space-y-10">
          {isProductCheckout && (
            <div>
              <h2 className="font-display text-heading-sm font-bold mb-6 flex items-center gap-2 text-neutral-900">
                <span className="material-symbols-outlined">local_shipping</span>
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider opacity-70">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900" placeholder="Jane" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider opacity-70">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900" placeholder="Doe" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider opacity-70">Street Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900" placeholder="123 Minimalist Way" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider opacity-70">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900" placeholder="Design District" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider opacity-70">Postal Code</label>
                  <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="rounded-lg px-4 py-3 focus:ring-1 focus:ring-offhanded-deep outline-none border border-offhanded-accent bg-transparent transition-all text-neutral-900" placeholder="110001" />
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-heading-sm font-bold flex items-center gap-2 text-neutral-900">
                <span className="material-symbols-outlined">payments</span>
                Payment
              </h2>
              <div className="flex gap-2 items-center opacity-60">
                <span className="material-symbols-outlined">lock</span>
                <span className="font-sans text-xs text-neutral-600">Secured by Razorpay</span>
              </div>
            </div>
            <div className="rounded-xl border border-offhanded-accent/50 bg-offhanded-accent/10 p-6 text-center text-neutral-600 font-sans text-body-sm">
              <span className="material-symbols-outlined text-2xl mb-2 block opacity-40">credit_card</span>
              All payment methods (Cards, UPI, NetBanking, Wallets) are handled securely by Razorpay.
            </div>
          </div>

          <button
            id="pay-now-btn"
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-offhanded-deep text-white py-5 rounded-xl font-sans font-bold text-body-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                {isWorkshopCheckout ? "Confirm & Pay" : "Complete Purchase"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
          <p className="font-sans text-center text-xs opacity-50 flex items-center justify-center gap-1 text-neutral-600">
            <span className="material-symbols-outlined text-xs">shield_lock</span>
            256-bit SSL Encrypted · Secured by Razorpay
          </p>
        </section>
      </main>

      <aside className="w-full lg:w-[450px] bg-offhanded-accent/30 p-8 lg:p-12 border-l border-offhanded-accent/50">
        <div className="lg:sticky lg:top-12">
          <h3 className="font-display text-heading-sm font-bold mb-8 text-neutral-900">Order Summary</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-offhanded-accent rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-neutral-600">inventory_2</span>
              </div>
              <div className="flex flex-col justify-center flex-1">
                <h4 className="font-sans font-bold text-neutral-900">{itemTitle}</h4>
                {!isProductCheckout && tickets > 1 && (
                  <p className="font-sans text-body-sm opacity-60 italic text-neutral-600">{tickets} Tickets</p>
                )}
              </div>
            </div>
            <div className="border-t border-offhanded-deep/10 pt-6">
              <p className="font-sans text-body-sm text-neutral-500 text-center">
                Final amount will be confirmed at checkout.
              </p>
            </div>
            <div className="mt-10 p-4 rounded-xl border border-offhanded-deep/10 bg-background-light/50">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-brand-600">
                  {isWorkshopCheckout ? "verified_user" : "package_2"}
                </span>
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-tighter text-neutral-900">
                    {isWorkshopCheckout ? "Secure Booking" : "Carbon Neutral Delivery"}
                  </p>
                  <p className="font-sans text-[11px] opacity-60 leading-relaxed mt-1 text-neutral-600">
                    {isWorkshopCheckout
                      ? "Your spot is reserved instantly upon payment. All materials and refreshments included."
                      : "Offhanded offsets 100% of carbon emissions from every shipment."}
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <p className="font-sans">Loading checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}