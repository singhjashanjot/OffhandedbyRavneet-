"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components";
import { formatPrice, formatDate } from "@/data/workshops";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/components/providers/AuthProvider";
import { createOfflineBooking } from "@/lib/actions/bookings";

declare global {
  interface Window { Razorpay: any; }
}

/* ========================================
   REGISTER PAGE — Refactored with new design
======================================== */

export default function RegisterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(1);
  const [countryCode, setCountryCode] = useState("+91");
  const [step, setStep] = useState<"register" | "payment" | "success">("register");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "offline">("online");
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    remarks: "",
  });

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Try fetching by slug first, then by ID
    const fetchWorkshop = async () => {
      // Try by slug first
      let { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("slug", params.id)
        .maybeSingle();

      // If not found by slug, try by ID
      if (!data && !error) {
        const idResult = await supabase
          .from("workshops")
          .select("*")
          .eq("id", params.id)
          .maybeSingle();
        
        data = idResult.data;
        error = idResult.error;
      }

      if (error || !data) {
        router.push("/workshops");
      } else {
        setWorkshop(data);
      }
      setLoading(false);
    };

    fetchWorkshop();
  }, [params.id, router]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-transparent min-h-screen pt-24 pb-20 flex items-center justify-center">
          <div className="animate-pulse text-neutral-400">Loading…</div>
        </main>
      </>
    );
  }

  if (!workshop) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      const form = document.querySelector("form");
      if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
    }

    // Move to payment step
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    setBookingError(null);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Payment gateway failed to load. Please refresh and try again.");

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId: workshop.id,
          tickets,
          paymentOption: paymentMethod === "offline" ? "partial" : "full",
          couponCode: couponApplied ? appliedCouponCode : undefined
        }),
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
        prefill: {
          name: formData.name || user?.user_metadata?.full_name || "",
          email: formData.email || user?.email || "",
          contact: formData.phone ? `${countryCode}${formData.phone}` : "",
        },
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
                workshopId: workshop.id,
                tickets,
                attendeeName: formData.name || user?.user_metadata?.full_name || "",
                attendeeEmail: formData.email || user?.email || "",
                attendeePhone: formData.phone ? `${countryCode}${formData.phone}` : undefined,
                couponCode: couponApplied ? appliedCouponCode : undefined,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed.");

            setBookingResult({ bookingId: verifyData.bookingId, totalAmount: orderData.amount / 100 });
            setIsProcessing(false);
            setStep("success");
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (err: any) {
            setBookingError(err.message || "Verification failed. Please contact support.");
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setBookingError("Payment was cancelled. You can try again.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res: any) => {
        setIsProcessing(false);
        setBookingError(`Payment failed: ${res.error?.description || "Please try again."}`);
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setBookingError(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleOfflineBooking = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setBookingError(null);

    try {
      const res = await createOfflineBooking({
        workshopId: workshop.id,
        tickets,
        attendeeName: formData.name || user?.user_metadata?.full_name || "",
        attendeeEmail: formData.email || user?.email || "",
        attendeePhone: formData.phone ? `${countryCode}${formData.phone}` : undefined,
        age: formData.age || undefined,
        remarks: formData.remarks || undefined,
        couponCode: couponApplied ? appliedCouponCode : undefined,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to create offline booking.");
      }

      setBookingResult({
        bookingId: res.bookingId,
        totalAmount: res.grandTotal,
        isOffline: true,
      });
      setIsProcessing(false);
      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setBookingError(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const timeDisplay = workshop.start_time
    ? `${workshop.start_time}${workshop.end_time ? ` – ${workshop.end_time}` : ""}`
    : "";

  // Format date nicely
  const formattedDate = formatDate(workshop.date);
  
  // Calculate max guests based on available slots
  const maxGuests = Math.min(workshop.available_slots || 10, 10);

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponInput.trim()) return;

    if (workshop?.coupon_code && couponInput.trim().toUpperCase() === workshop.coupon_code.toUpperCase()) {
      setDiscountPercent(workshop.coupon_discount_percent || 0);
      setAppliedCouponCode(workshop.coupon_code);
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setAppliedCouponCode("");
    setDiscountPercent(0);
    setCouponInput("");
    setCouponError(null);
  };

  const totalAmount = workshop.price * tickets;
  const discountAmount = couponApplied ? Math.round(totalAmount * (discountPercent / 100)) : 0;
  const taxAmount = 0;
  const grandTotal = totalAmount - discountAmount;

  // Success / Booking Confirmed view
  if (step === "success") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-transparent pt-32 pb-12 px-4 md:px-0 flex items-center justify-center">
          <div className="bg-[#F9F9E8] p-10 md:p-12 rounded-2xl border border-[#2c3627]/10 text-center max-w-lg w-full mx-4">
            <div className="w-20 h-20 bg-[#B2C0AD]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-[#2c3627] text-3xl md:text-4xl font-display font-light mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-[#2c3627]/70 mb-4 text-base leading-relaxed">
              Thank you
              {(formData.name || user?.user_metadata?.full_name) &&
                `, ${formData.name || user?.user_metadata?.full_name}`}
              ! Your booking for <strong>{workshop.title}</strong> has been confirmed.
            </p>
            {bookingResult && (
              <div className="bg-[#B2C0AD]/10 rounded-xl p-4 mb-6 text-sm text-left border border-[#2c3627]/5">
                {bookingResult.bookingId && (
                  <p className="text-[#2c3627]">
                    <strong>Booking ID:</strong> {bookingResult.bookingId.slice(0, 8)}...
                  </p>
                )}
                <p className="text-[#2c3627]">
                  <strong>Total Amount:</strong> {formatPrice(grandTotal)}
                </p>
                {paymentMethod === "offline" ? (
                  <>
                    <p className="text-[#2c3627]">
                      <strong>Paid Online (60%):</strong> {formatPrice(Math.round(grandTotal * 0.60))}
                    </p>
                    <p className="text-[#2c3627]">
                      <strong>Remaining (40% - Pay at Workshop):</strong> {formatPrice(grandTotal - Math.round(grandTotal * 0.60))}
                    </p>
                  </>
                ) : null}
                <p className="text-[#2c3627]">
                  <strong>Tickets:</strong> {tickets}
                </p>
                <p className="text-[#2c3627]">
                  <strong>Status:</strong>{" "}
                  <span className="text-green-700 font-semibold">Confirmed</span>
                </p>
              </div>
            )}
            <p className="text-sm text-[#2c3627]/40 mb-6">
              A confirmation email will be sent shortly.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-[#2c3627] hover:bg-[#2c3627]/90 text-white h-14 rounded-full font-bold text-base tracking-tight transition-all"
              >
                Back to Home
              </Link>
              <Link
                href="/workshops"
                className="w-full flex items-center justify-center gap-2 border border-[#2c3627]/20 text-[#2c3627] h-14 rounded-full font-bold text-base tracking-tight transition-all hover:bg-[#2c3627]/5"
              >
                Browse More Workshops
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Payment step view
  if (step === "payment") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-transparent pt-32 pb-12 px-4 md:px-0">
          <div className="max-w-[900px] mx-auto">
            {/* Back to registration */}
            <button
              onClick={() => setStep("register")}
              className="flex items-center gap-2 text-[#2c3627]/60 hover:text-[#2c3627] text-sm font-medium mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Registration
            </button>

            <div className="flex flex-col gap-3 text-center mb-12">
              <h1 className="text-[#2c3627] text-4xl md:text-5xl font-display font-light leading-tight tracking-tight">
                Complete Payment
              </h1>
              <p className="text-[#2c3627]/70 text-lg font-light leading-relaxed">
                Review your details and confirm your booking.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left: Order Summary + Attendee + Payment Summary */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Workshop Info */}
                <div className="rounded-xl p-6 border bg-[#F9F9E8] border-[#2c3627]/10">
                  <span className="text-[#B2C0AD] text-xs font-bold uppercase tracking-widest">Workshop</span>
                  <h3 className="text-[#2c3627] text-2xl font-display font-light leading-tight mt-1 mb-4">
                    {workshop.title}
                  </h3>
                  {workshop.image && (
                    <div className="w-full h-40 rounded-lg overflow-hidden relative mb-4">
                      <Image src={workshop.image} alt={workshop.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 text-sm text-[#2c3627]/70">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#B2C0AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formattedDate}</span>
                    </div>
                    {timeDisplay && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#B2C0AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{timeDisplay}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#B2C0AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{workshop.venue_name || workshop.location}</span>
                    </div>
                  </div>
                </div>

                {/* Attendee Info */}
                <div className="rounded-xl p-6 border bg-[#F9F9E8] border-[#2c3627]/10">
                  <span className="text-[#B2C0AD] text-xs font-bold uppercase tracking-widest">Attendee Details</span>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-[#2c3627]">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    {formData.phone && <p><strong>Phone:</strong> {countryCode}{formData.phone}</p>}
                    <p><strong>Guests:</strong> {tickets}</p>
                    {formData.remarks && <p><strong>Remarks:</strong> {formData.remarks}</p>}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="rounded-xl p-6 border bg-[#F9F9E8] border-[#2c3627]/10">
                  <h3 className="text-[#2c3627] text-lg font-bold mb-6">Payment Summary</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#2c3627]/60">{formatPrice(workshop.price)} × {tickets} {tickets === 1 ? "ticket" : "tickets"}</span>
                      <span className="font-medium text-[#2c3627]">{formatPrice(totalAmount)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-sm text-green-700 font-semibold">
                        <span>Discount ({discountPercent}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    {paymentMethod === "offline" && (
                      <div className="flex justify-between text-sm border-t border-[#2c3627]/5 pt-3">
                        <span className="text-[#2c3627]/60">60% Partial Payment (Due Now)</span>
                        <span className="font-medium text-[#2c3627]">{formatPrice(Math.round(grandTotal * 0.60))}</span>
                      </div>
                    )}
                    {paymentMethod === "offline" && (
                      <div className="flex justify-between text-xs text-[#2c3627]/60 italic">
                        <span>40% Remaining (Pay at Workshop)</span>
                        <span>{formatPrice(grandTotal - Math.round(grandTotal * 0.60))}</span>
                      </div>
                    )}
                    <div className="border-t border-[#2c3627]/10 pt-4 flex justify-between items-baseline">
                      <span className="text-[#2c3627] text-lg font-bold">Total Due Now</span>
                      <span className="text-[#2c3627] text-3xl font-black">
                        {formatPrice(paymentMethod === "offline" ? Math.round(grandTotal * 0.60) : grandTotal)}
                      </span>
                    </div>

                    {/* Coupon Code Input */}
                    <div className="border-t border-[#2c3627]/5 pt-4">
                      <label className="block text-xs font-semibold text-[#2c3627]/60 uppercase tracking-wider mb-2">
                        Have a Coupon?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError(null);
                          }}
                          disabled={couponApplied}
                          className="flex-1 px-3 py-2 border border-[#2c3627]/20 rounded-lg text-sm bg-white text-[#2c3627] focus:outline-none focus:ring-1 focus:ring-[#2c3627] uppercase disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponApplied || !couponInput.trim()}
                          className="px-4 py-2 bg-[#2c3627] text-white rounded-lg text-sm font-semibold hover:bg-[#2c3627]/90 disabled:opacity-50 transition-all"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-red-600 text-xs mt-1">{couponError}</p>}
                      {couponApplied && (
                        <div className="flex items-center justify-between mt-2 text-xs text-green-700 bg-green-50 border border-green-200/50 p-2 rounded-lg">
                          <span>Coupon <strong>{appliedCouponCode}</strong> applied!</span>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-red-500 hover:text-red-700 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Payment */}
              <div className="lg:col-span-7">
                <div className="bg-white/40 backdrop-blur-sm border border-[#2c3627]/10 rounded-xl p-8 shadow-sm">
                  <h2 className="text-[#2c3627] text-xl font-bold mb-6">Choose Payment Method</h2>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Pay Online Option */}
                    <label className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "bg-[#2c3627]/5 border-[#2c3627] ring-1 ring-[#2c3627]"
                        : "bg-white/50 border-[#2c3627]/10 hover:bg-[#2c3627]/5"
                    }`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")}
                          className="text-[#2c3627] focus:ring-[#2c3627] h-4 w-4"
                        />
                        <span className="text-sm font-bold text-[#2c3627]">Pay Online</span>
                      </div>
                      <span className="text-xs text-[#2c3627]/60 leading-relaxed">Pay securely via Cards, UPI, NetBanking, Wallets</span>
                    </label>

                    {/* Pay at Workshop Option */}
                    <label className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "offline"
                        ? "bg-[#2c3627]/5 border-[#2c3627] ring-1 ring-[#2c3627]"
                        : "bg-white/50 border-[#2c3627]/10 hover:bg-[#2c3627]/5"
                    }`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "offline"}
                          onChange={() => setPaymentMethod("offline")}
                          className="text-[#2c3627] focus:ring-[#2c3627] h-4 w-4"
                        />
                        <span className="text-sm font-bold text-[#2c3627]">Pay at Workshop (60% Partial)</span>
                      </div>
                      <span className="text-xs text-[#2c3627]/60 leading-relaxed">Pay 60% online now to secure booking, and 40% on arrival</span>
                    </label>
                  </div>

                  {paymentMethod === "online" ? (
                    <div className="mb-8 p-5 border border-[#2c3627]/10 rounded-xl bg-[#F9F9E8] text-center">
                      <span className="material-symbols-outlined text-3xl text-[#2c3627]/30 mb-2 block">credit_card</span>
                      <p className="text-[#2c3627]/70 text-sm leading-relaxed">
                        All payment methods — Cards, UPI, NetBanking, Wallets — are handled securely by <strong>Razorpay</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="mb-8 p-5 border border-[#2c3627]/10 rounded-xl bg-[#F9F9E8] text-center">
                      <span className="material-symbols-outlined text-3xl text-[#2c3627]/30 mb-2 block">storefront</span>
                      <p className="text-[#2c3627]/70 text-sm leading-relaxed">
                        Secure your spot today by making a <strong>60% partial payment of {formatPrice(Math.round(grandTotal * 0.60))} now</strong>. The remaining <strong>40% ({formatPrice(grandTotal - Math.round(grandTotal * 0.60))})</strong> can be paid via UPI or Cash when you arrive at the workshop.
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {bookingError && (
                    <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                      {bookingError}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-[#2c3627] text-white py-5 rounded-xl font-black text-lg tracking-wide hover:bg-[#2c3627]/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#2c3627]/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        {paymentMethod === "offline"
                          ? `Pay 60% Now: ${formatPrice(Math.round(grandTotal * 0.60))}`
                          : `Pay Online: ${formatPrice(grandTotal)}`}
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[#2c3627]/40 text-xs mt-6 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    {paymentMethod === "online" ? "Encrypted and secure transaction" : "Secure reservation verification"}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#2c3627]/5 rounded-lg border border-[#2c3627]/5">
                    <h4 className="text-[#2c3627] text-xs font-bold uppercase tracking-wider mb-1">Cancellation</h4>
                    <p className="text-[#2c3627]/60 text-xs leading-relaxed">Full refund if cancelled 48 hours before the event starts.</p>
                  </div>
                  <div className="p-4 bg-[#2c3627]/5 rounded-lg border border-[#2c3627]/5">
                    <h4 className="text-[#2c3627] text-xs font-bold uppercase tracking-wider mb-1">Need Help?</h4>
                    <p className="text-[#2c3627]/60 text-xs leading-relaxed">Contact us at hello@offhanded.com for assistance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Line art background pattern */}
      <style jsx>{`
        .line-art-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q 30 10 30 30 T 50 50' stroke='%23B2C0AD' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='80' cy='20' r='5' stroke='%23B2C0AD' stroke-width='0.5' fill='none'/%3E%3C/svg%3E");
        }
      `}</style>

      <main className="min-h-screen bg-transparent line-art-bg pt-32 pb-12 px-4 md:px-0">
        <div className="max-w-[1100px] mx-auto flex flex-col flex-1">
          
          {/* Centered Title */}
          <div className="flex flex-col gap-3 px-4 text-center mb-12">
            <h1 className="text-[#2c3627] text-4xl md:text-5xl font-display font-light leading-tight tracking-tight">
              Workshop Registration
            </h1>
            <p className="text-[#2c3627]/70 text-lg font-light leading-relaxed">
              Join our creative sanctuary. Please fill out your details to secure your spot.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Registration Form */}
            <div className="flex flex-col gap-8">
              <form onSubmit={handleSubmit} className="backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col gap-6 border border-white/50 bg-[#B2C0AD]/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[#2c3627] text-sm font-bold tracking-wide uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full rounded-lg focus:border-[#2c3627] focus:ring-1 focus:ring-[#2c3627] h-14 px-4 text-base transition-all bg-[#F9F9E8] border border-[#2c3627]/20 shadow-inner"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[#2c3627] text-sm font-bold tracking-wide uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-lg focus:border-[#2c3627] focus:ring-1 focus:ring-[#2c3627] h-14 px-4 text-base transition-all bg-[#F9F9E8] border border-[#2c3627]/20 shadow-inner"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Contact Number + Age — single row */}
                  <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <label htmlFor="phone" className="text-[#2c3627] text-sm font-bold tracking-wide uppercase">
                          Contact Number
                        </label>
                        <span className="text-[#B2C0AD] text-[10px] font-bold uppercase">Optional</span>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-24 flex-shrink-0 rounded-lg focus:border-[#2c3627] focus:ring-1 focus:ring-[#2c3627] h-14 px-2 text-xs transition-all bg-[#F9F9E8] border border-[#2c3627]/20 shadow-inner"
                        >
                          <option value="+91">IN +91</option>
                          <option value="+1">US +1</option>
                          <option value="+44">UK +44</option>
                          <option value="+971">AE +971</option>
                          <option value="+65">SG +65</option>
                          <option value="+61">AU +61</option>
                          <option value="+49">DE +49</option>
                          <option value="+33">FR +33</option>
                          <option value="+86">CN +86</option>
                          <option value="+81">JP +81</option>
                          <option value="+82">KR +82</option>
                        </select>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="98765 43210"
                          className="flex-1 min-w-0 rounded-lg focus:border-[#2c3627] focus:ring-1 focus:ring-[#2c3627] h-14 px-4 text-base transition-all bg-[#F9F9E8] border border-[#2c3627]/20 shadow-inner"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Age */}
                    <div className="flex flex-col gap-2 w-full md:w-28 flex-shrink-0">
                      <label htmlFor="age" className="text-[#2c3627] text-sm font-bold tracking-wide uppercase">
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        min="1"
                        max="120"
                        className="w-full rounded-lg focus:border-[#2c3627] focus:ring-1 focus:ring-[#2c3627] h-14 px-4 text-base transition-all bg-[#F9F9E8] border border-[#2c3627]/20 shadow-inner"
                        placeholder="25"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Number of Guests */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="tickets" className="text-[#2c3627] text-sm font-bold tracking-wide uppercase">
                    Number of Guests
                  </label>
                  <select
                    id="tickets"
                    name="tickets"
                    value={tickets}
                    onChange={(e) => setTickets(Number(e.target.value))}
                    className="w-full rounded-lg focus:border-[#2c3627] focus:ring-1 focus:ring-[#2c3627] h-14 px-4 text-base transition-all bg-[#F9F9E8] border border-[#2c3627]/20 shadow-inner"
                  >
                    <option value="1">Just me (1)</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    {maxGuests > 5 && <option value="6">6 People</option>}
                    {maxGuests > 6 && <option value="7">7 People</option>}
                    {maxGuests > 7 && <option value="8">8 People</option>}
                    {maxGuests > 8 && <option value="9">9 People</option>}
                    {maxGuests > 9 && <option value="10">10 People</option>}
                  </select>
                </div>

                {/* Special Requirements */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="remarks" className="text-[#2c3627] text-sm font-bold tracking-wide uppercase">
                    Special Requirements / Remarks
                  </label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    rows={4}
                    className="w-full rounded-lg focus:border-[#2c3627] focus:ring-1 focus:ring-[#2c3627] min-h-[120px] p-4 text-base transition-all resize-none bg-[#F9F9E8] border border-[#2c3627]/20 shadow-inner"
                    placeholder="Anything you want us to take care of? (e.g., medical issues, accessibility)"
                    value={formData.remarks}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </div>

            {/* Right Column: Summary & Pricing */}
            <div className="flex flex-col gap-8 lg:sticky lg:top-32">
              {/* Workshop Summary Card — Dynamic */}
              <div className="flex flex-col gap-6 rounded-xl p-6 shadow-sm border bg-[#F9F9E8] border-[#2c3627]/10">
                <div>
                  <span className="text-[#B2C0AD] text-xs font-bold uppercase tracking-widest">Selected Experience</span>
                  <h3 className="text-[#2c3627] text-2xl font-display font-light leading-tight mt-1">
                    {workshop.title}
                  </h3>
                </div>

                {/* Workshop Image */}
                <div className="w-full h-48 rounded-lg overflow-hidden relative">
                  {workshop.image ? (
                    <Image
                      src={workshop.image}
                      alt={workshop.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#B2C0AD]/30 to-[#B2C0AD]/60" />
                  )}
                </div>

                {/* Workshop Details */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2 text-[#2c3627]/70">
                    <svg className="w-5 h-5 text-[#B2C0AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{workshop.venue_name || workshop.location}</span>
                  </div>
                  {timeDisplay && (
                    <div className="flex items-center gap-2 text-[#2c3627]/70">
                      <svg className="w-5 h-5 text-[#B2C0AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{timeDisplay}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#2c3627]/70">
                    <svg className="w-5 h-5 text-[#B2C0AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2c3627]/70">
                    <svg className="w-5 h-5 text-[#B2C0AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm">Limited to {workshop.available_slots || 12} participants</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Proceed Section */}
              <div className="flex flex-col gap-6 p-6 rounded-xl border border-[#2c3627]/10 bg-white">
                <div className="flex flex-col">
                  <p className="text-[#2c3627]/60 text-sm">Investment per person</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#2c3627] text-4xl font-black">{formatPrice(workshop.price)}</span>
                    <span className="text-[#B2C0AD] text-sm font-medium">/ workshop</span>
                  </div>
                  <p className="text-[#B2C0AD] text-[11px] mt-1 font-medium">
                    Includes all materials, tools, and refreshments.
                  </p>
                  {tickets > 1 && (
                    <p className="text-[#2c3627] text-lg font-bold mt-3">
                      Total: {formatPrice(workshop.price * tickets)} ({tickets} {tickets === 1 ? "person" : "people"})
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  className="w-full flex items-center justify-center gap-3 bg-[#2c3627] hover:bg-[#2c3627]/90 text-white h-16 rounded-full font-bold text-lg tracking-tight transition-all shadow-lg hover:shadow-xl hover:shadow-[#2c3627]/20"
                >
                  <span>Proceed to Payment</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex flex-col items-center gap-4 py-12 opacity-50">
            <div className="flex gap-6 text-[#2c3627]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[#2c3627] text-xs font-medium uppercase tracking-[0.2em]">
              Crafted with intention at Offhanded Studio
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
