"use server";

import { sendContactEnquiryEmail } from "@/lib/email";

interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/** Strip HTML tags and CRLF characters from user input */
function sanitizeInput(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/[\r\n]/g, "").trim();
}

export async function submitEnquiryAction(data: EnquiryInput) {
  try {
    if (!data.name || !data.email || !data.subject || !data.message) {
      return { success: false, error: "Missing required fields" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: "Invalid email address." };
    }

    // Enforce length limits
    if (data.name.length > 200) {
      return { success: false, error: "Name is too long." };
    }
    if (data.subject.length > 200) {
      return { success: false, error: "Subject is too long." };
    }
    if (data.message.length > 5000) {
      return { success: false, error: "Message is too long." };
    }

    // Sanitize inputs: strip HTML tags and CRLF
    const sanitisedData = {
      name: sanitizeInput(data.name),
      email: data.email.trim().toLowerCase(),
      phone: data.phone ? sanitizeInput(data.phone) : undefined,
      subject: sanitizeInput(data.subject),
      message: sanitizeInput(data.message),
    };

    const { error } = await sendContactEnquiryEmail(sanitisedData);

    if (error) {
      console.error("Resend API error sending contact enquiry email:", error);
      return { success: false, error: "Failed to send email. Please try again later." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit contact enquiry:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
