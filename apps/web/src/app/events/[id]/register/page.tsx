"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components";
import { formatPrice, formatDate } from "@/data/workshops";
import { createBrowserClient } from "@supabase/ssr";

/* ========================================
   REGISTER PAGE — Refactored with new design
======================================== */

export default function RegisterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(1);
  const [countryCode, setCountryCode] = useState("+91");
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
        <main className="bg-[#fffff1] min-h-screen pt-24 pb-20 flex items-center justify-center">
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
      // Find the form and trigger native validation
      const form = document.querySelector("form");
      if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
    }

    const queryParams: Record<string, string> = {
      workshopId: workshop.id,
      tickets: tickets.toString(),
      name: formData.name,
      email: formData.email,
    };
    
    // Add phone only if provided
    if (formData.phone.trim()) {
      queryParams.phone = `${countryCode}${formData.phone}`;
    }

    // Add age and remarks if provided
    if (formData.age.trim()) {
      queryParams.age = formData.age;
    }
    if (formData.remarks.trim()) {
      queryParams.remarks = formData.remarks;
    }

    const query = new URLSearchParams(queryParams).toString();
    router.push(`/checkout?${query}`);
  };

  const timeDisplay = workshop.start_time
    ? `${workshop.start_time}${workshop.end_time ? ` – ${workshop.end_time}` : ""}`
    : "";

  // Format date nicely
  const formattedDate = formatDate(workshop.date);
  
  // Calculate max guests based on available slots
  const maxGuests = Math.min(workshop.available_slots || 10, 10);

  return (
    <>
      <Header />
      
      {/* Line art background pattern */}
      <style jsx>{`
        .line-art-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q 30 10 30 30 T 50 50' stroke='%23B2C0AD' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='80' cy='20' r='5' stroke='%23B2C0AD' stroke-width='0.5' fill='none'/%3E%3C/svg%3E");
        }
      `}</style>

      <main className="min-h-screen bg-[#fffff1] line-art-bg pt-32 pb-12 px-4 md:px-0">
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
                  <span>Proceed for Payment</span>
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
