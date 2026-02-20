"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components";
import { upcomingWorkshops, formatPrice, formatDate } from "@/data/workshops";

export default function RegisterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const workshop = upcomingWorkshops.find((w) => w.id === params.id);
  const [tickets, setTickets] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  if (!workshop) {
    notFound(); 
    return null; /* Client component needs return even after notFound trigger */
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save to context/state management
    // Navigate to checkout
    const query = new URLSearchParams({
      workshopId: workshop.id,
      tickets: tickets.toString(),
      name: formData.name,
      email: formData.email,
    }).toString();
    
    router.push(`/checkout?${query}`);
  };

  return (
    <>
      <Header />
      <main className="bg-neutral-50 min-h-screen pt-24 pb-20">
        <div className="container-custom max-w-4xl">
          <Link href={`/events/${workshop.id}`} className="text-sm text-neutral-500 hover:text-brand-600 mb-6 inline-block">
            ← Back to Event
          </Link>

          <div className="bg-white rounded-3xl overflow-hidden shadow-soft-lg grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Summary */}
            <div className="bg-brand-50 p-8 md:p-10 flex flex-col h-full">
              <h1 className="text-heading-md font-display text-brand-900 mb-6">Registration</h1>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 shadow-sm">
                <Image
                  src={workshop.image}
                  alt={workshop.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-xl font-medium mb-2">{workshop.title}</h2>
              <div className="text-sm text-neutral-600 space-y-1 mb-6">
                <p>📅 {formatDate(workshop.date)}</p>
                <p>⏰ {workshop.time}</p>
                <p>📍 {workshop.venue}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-brand-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-600">Price per person</span>
                  <span className="font-medium">{formatPrice(workshop.price)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-brand-800">
                  <span>Total</span>
                  <span>{formatPrice(workshop.price * tickets)}</span>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="p-8 md:p-10">
              <h3 className="text-heading-sm mb-6">Your Details</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-neutral-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="input"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="input"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-neutral-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="tickets" className="text-sm font-medium text-neutral-700">Number of Guests</label>
                  <div className="flex items-center space-x-4">
                    <button 
                      type="button" 
                      onClick={() => setTickets(Math.max(1, tickets - 1))}
                      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                    >
                      -
                    </button>
                    <span className="text-xl font-medium w-8 text-center">{tickets}</span>
                    <button 
                      type="button" 
                      onClick={() => setTickets(Math.min(10, tickets + 1))}
                      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-accent w-full mt-4">
                  Proceed to Payment
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
