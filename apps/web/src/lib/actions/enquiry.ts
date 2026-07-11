"use server";

import { sendContactEnquiryEmail } from "@/lib/email";

interface EnquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitEnquiryAction(data: EnquiryInput) {
  try {
    if (!data.name || !data.email || !data.subject || !data.message) {
      return { success: false, error: "Missing required fields" };
    }

    const { error } = await sendContactEnquiryEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });

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
