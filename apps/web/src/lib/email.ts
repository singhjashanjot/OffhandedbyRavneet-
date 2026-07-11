/* ========================================
   EMAIL UTILITY — Powered by Resend
   Sends transactional emails for:
   - Customer booking confirmation
   - Owner new booking alert

   FROM address: configured via FROM_EMAIL env var
   To switch to custom domain, update FROM_EMAIL in .env.local
======================================== */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

const FROM = `${process.env.FROM_NAME || "Offhanded by Ravneet"} <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`;
const REPLY_TO = process.env.REPLY_TO_EMAIL || process.env.OWNER_EMAIL || "";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

/* ── Shared brand styles ─────────────────────────────────────── */
const BRAND = {
  dark: "#2c3627",
  sage: "#B2C0AD",
  cream: "#fffff1",
  lightCream: "#F9F9E8",
  mutedText: "#6b7a65",
};

/* ── HTML escaping to prevent injection in email bodies ──────── */
function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Strip CRLF characters from email header values to prevent header injection */
function sanitizeHeaderValue(str: string): string {
  if (!str) return "";
  return String(str).replace(/[\r\n]/g, "");
}

/* ================================================================
   1. CUSTOMER BOOKING CONFIRMATION EMAIL
================================================================ */

interface CustomerEmailData {
  customerName: string;
  customerEmail: string;
  workshopTitle: string;
  workshopDate: string;
  workshopTime: string;
  workshopVenue: string;
  tickets: number;
  amountPaid: number;
  bookingId: string;
}

export async function sendBookingConfirmationToCustomer(data: CustomerEmailData) {
  const {
    customerName,
    customerEmail,
    workshopTitle,
    workshopDate,
    workshopTime,
    workshopVenue,
    tickets,
    amountPaid,
    bookingId,
  } = data;

  const shortBookingId = bookingId.slice(0, 8).toUpperCase();
  const formattedAmount = `₹${amountPaid.toLocaleString("en-IN")}`;
  const firstName = customerName.split(" ")[0];
  const safeWorkshopTitle = escapeHtml(workshopTitle);
  const safeWorkshopDate = escapeHtml(workshopDate);
  const safeWorkshopTime = escapeHtml(workshopTime);
  const safeWorkshopVenue = escapeHtml(workshopVenue);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed — ${safeWorkshopTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4e8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.dark};padding:36px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <p style="margin:0 0 4px 0;color:${BRAND.sage};font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:600;">Offhanded by Ravneet</p>
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:300;letter-spacing:-0.5px;">Booking Confirmed 🎉</h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="background-color:${BRAND.cream};padding:40px 40px 0 40px;">
              <p style="margin:0 0 8px 0;color:${BRAND.dark};font-size:18px;font-weight:600;">Hi ${escapeHtml(firstName)}!</p>
              <p style="margin:0;color:${BRAND.mutedText};font-size:15px;line-height:1.7;">
                Your spot is officially reserved. We can't wait to have you join us. Here are your complete booking details:
              </p>
            </td>
          </tr>

          <!-- Workshop Card -->
          <tr>
            <td style="background-color:${BRAND.cream};padding:28px 40px 0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.lightCream};border:1px solid #e0e0d0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="background-color:${BRAND.dark};padding:14px 24px;">
                    <p style="margin:0;color:${BRAND.sage};font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Workshop Details</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;">
                    <h2 style="margin:0 0 20px 0;color:${BRAND.dark};font-size:22px;font-weight:400;line-height:1.3;">${safeWorkshopTitle}</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${workshopDate ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8e8d8;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:${BRAND.mutedText};font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:40%;">📅 Date</td>
                              <td style="color:${BRAND.dark};font-size:14px;font-weight:500;">${safeWorkshopDate}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>` : ""}
                      ${workshopTime ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8e8d8;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:${BRAND.mutedText};font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:40%;">⏰ Time</td>
                              <td style="color:${BRAND.dark};font-size:14px;font-weight:500;">${safeWorkshopTime}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>` : ""}
                      ${workshopVenue ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8e8d8;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:${BRAND.mutedText};font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:40%;">📍 Venue</td>
                              <td style="color:${BRAND.dark};font-size:14px;font-weight:500;">${safeWorkshopVenue}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>` : ""}
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8e8d8;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:${BRAND.mutedText};font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:40%;">🎟️ Tickets</td>
                              <td style="color:${BRAND.dark};font-size:14px;font-weight:500;">${tickets} ${tickets === 1 ? "person" : "people"}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:${BRAND.mutedText};font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:40%;">💳 Amount Paid</td>
                              <td style="color:${BRAND.dark};font-size:16px;font-weight:700;">${formattedAmount}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Booking ID Badge -->
          <tr>
            <td style="background-color:${BRAND.cream};padding:20px 40px 0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.sage}22;border:1px solid ${BRAND.sage};border-radius:8px;">
                <tr>
                  <td style="padding:14px 20px;">
                    <p style="margin:0;color:${BRAND.mutedText};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Booking Reference</p>
                    <p style="margin:4px 0 0 0;color:${BRAND.dark};font-size:18px;font-weight:700;letter-spacing:2px;">#${shortBookingId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td style="background-color:${BRAND.cream};padding:28px 40px 0 40px;">
              <h3 style="margin:0 0 14px 0;color:${BRAND.dark};font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">What to Expect</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;">
                    <p style="margin:0;color:${BRAND.mutedText};font-size:14px;line-height:1.6;">✅ &nbsp;All materials and tools are provided — just bring yourself</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <p style="margin:0;color:${BRAND.mutedText};font-size:14px;line-height:1.6;">✅ &nbsp;Refreshments will be served during the session</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <p style="margin:0;color:${BRAND.mutedText};font-size:14px;line-height:1.6;">✅ &nbsp;Please arrive 10 minutes before the session starts</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <p style="margin:0;color:${BRAND.mutedText};font-size:14px;line-height:1.6;">✅ &nbsp;Wear comfortable clothes you don't mind getting a little messy</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="background-color:${BRAND.cream};padding:32px 40px 0 40px;text-align:center;">
              <p style="margin:0 0 16px 0;color:${BRAND.mutedText};font-size:14px;">Questions? We're here to help.</p>
              <a href="mailto:${OWNER_EMAIL}" style="display:inline-block;background-color:${BRAND.dark};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Contact Us</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.lightCream};padding:32px 40px;border-radius:0 0 16px 16px;border-top:1px solid #e0e0d0;margin-top:32px;text-align:center;">
              <p style="margin:0 0 6px 0;color:${BRAND.dark};font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Offhanded by Ravneet</p>
              <p style="margin:0 0 6px 0;color:${BRAND.mutedText};font-size:12px;">${OWNER_EMAIL}</p>
              <p style="margin:16px 0 0 0;color:#b0b0a0;font-size:11px;line-height:1.6;">
                You received this email because you booked a workshop at Offhanded by Ravneet.<br/>
                Please do not reply to this email — use the contact button above instead.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  const text = `Hi ${firstName}!

Your spot is officially reserved for "${workshopTitle}". We can't wait to have you join us.

Booking Reference: #${shortBookingId}
Date: ${workshopDate}
Time: ${workshopTime}
Venue: ${workshopVenue}
Tickets: ${tickets} ${tickets === 1 ? "person" : "people"}
Amount Paid: ${formattedAmount}

What to Expect:
- All materials and tools are provided — just bring yourself
- Refreshments will be served during the session
- Please arrive 10 minutes before the session starts
- Wear comfortable clothes you don't mind getting a little messy

Questions? We're here to help. You can reach us at ${OWNER_EMAIL}.

Offhanded by Ravneet`;

  return resend.emails.send({
    from: FROM,
    to: customerEmail,
    replyTo: REPLY_TO,
    subject: sanitizeHeaderValue(`✅ Booking Confirmed — ${workshopTitle}`),
    html,
    text,
  });
}

/* ================================================================
   2. OWNER NEW BOOKING ALERT EMAIL
================================================================ */

interface OwnerAlertData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  workshopTitle: string;
  workshopDate: string;
  workshopTime: string;
  tickets: number;
  amountPaid: number;
  bookingId: string;
}

export async function sendNewBookingAlertToOwner(data: OwnerAlertData) {
  if (!OWNER_EMAIL) return;

  const {
    customerName,
    customerEmail,
    customerPhone,
    workshopTitle,
    workshopDate,
    workshopTime,
    tickets,
    amountPaid,
    bookingId,
  } = data;

  const shortBookingId = bookingId.slice(0, 8).toUpperCase();
  const formattedAmount = `₹${amountPaid.toLocaleString("en-IN")}`;
  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const safeCustName = escapeHtml(customerName);
  const safeCustEmail = escapeHtml(customerEmail);
  const safeCustPhone = customerPhone ? escapeHtml(customerPhone) : "";
  const safeWsTitle = escapeHtml(workshopTitle);
  const safeWsDate = escapeHtml(workshopDate);
  const safeWsTime = escapeHtml(workshopTime);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Booking — ${safeWsTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f0e0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f0e0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.dark};padding:28px 40px;border-radius:16px 16px 0 0;">
              <p style="margin:0 0 4px 0;color:${BRAND.sage};font-size:10px;letter-spacing:4px;text-transform:uppercase;font-weight:600;">Offhanded — Admin Alert</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:400;">💰 New Booking Received!</h1>
              <p style="margin:6px 0 0 0;color:${BRAND.sage};font-size:12px;">${now} IST</p>
            </td>
          </tr>

          <!-- Amount Banner -->
          <tr>
            <td style="background-color:${BRAND.sage};padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:${BRAND.dark};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Payment Received</p>
              <p style="margin:0;color:${BRAND.dark};font-size:36px;font-weight:800;">${formattedAmount}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px;">

              <!-- Customer Info -->
              <h3 style="margin:0 0 16px 0;color:${BRAND.dark};font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:2px solid ${BRAND.sage};padding-bottom:8px;">Customer Details</h3>
              <table width="100%" cellpadding="0" cellspacing="8">
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:35%;padding:6px 0;">Name</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${safeCustName}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Email</td>
                  <td style="padding:6px 0;"><a href="mailto:${safeCustEmail}" style="color:${BRAND.dark};font-size:14px;font-weight:600;">${safeCustEmail}</a></td>
                </tr>
                ${customerPhone ? `
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Phone</td>
                  <td style="padding:6px 0;"><a href="tel:${safeCustPhone}" style="color:${BRAND.dark};font-size:14px;font-weight:600;">${safeCustPhone}</a></td>
                </tr>` : ""}
              </table>

              <!-- Workshop Info -->
              <h3 style="margin:28px 0 16px 0;color:${BRAND.dark};font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:2px solid ${BRAND.sage};padding-bottom:8px;">Workshop Details</h3>
              <table width="100%" cellpadding="0" cellspacing="8">
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:35%;padding:6px 0;">Workshop</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${safeWsTitle}</td>
                </tr>
                ${workshopDate ? `
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Date</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${safeWsDate}</td>
                </tr>` : ""}
                ${workshopTime ? `
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Time</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${safeWsTime}</td>
                </tr>` : ""}
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Tickets</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${tickets} ${tickets === 1 ? "person" : "people"}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Booking ID</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:700;padding:6px 0;letter-spacing:2px;">#${shortBookingId}</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.lightCream};padding:20px 40px;border-radius:0 0 16px 16px;text-align:center;border-top:1px solid #e0e0d0;">
              <p style="margin:0;color:#b0b0a0;font-size:11px;">This is an automated alert from your Offhanded booking system.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  const text = `New Booking Received!

Amount Paid: ${formattedAmount}
Date/Time: ${now} IST

Customer Details:
- Name: ${customerName}
- Email: ${customerEmail}
${customerPhone ? `- Phone: ${customerPhone}\n` : ""}
Workshop Details:
- Workshop: ${workshopTitle}
- Date: ${workshopDate}
- Time: ${workshopTime}
- Tickets: ${tickets} ${tickets === 1 ? "person" : "people"}
- Booking ID: #${shortBookingId}

Automated alert from your Offhanded booking system.`;

  return resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    replyTo: REPLY_TO,
    subject: sanitizeHeaderValue(`💰 New Booking: ${workshopTitle} — ${formattedAmount} from ${customerName}`),
    html,
    text,
  });
}

/* ================================================================
   3. CUSTOMER PRODUCT ORDER CONFIRMATION EMAIL
================================================================ */

interface ProductCustomerEmailData {
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  amountPaid: number;
  orderId: string;
}

export async function sendProductConfirmationToCustomer(data: ProductCustomerEmailData) {
  const { customerName, customerEmail, productName, quantity, amountPaid, orderId } = data;
  const shortOrderId = orderId.slice(0, 8).toUpperCase();
  const formattedAmount = `₹${amountPaid.toLocaleString("en-IN")}`;
  const firstName = customerName.split(" ")[0];
  const safeProductName = escapeHtml(productName);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background-color:#f4f4e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4e8;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background-color:#2c3627;padding:36px 40px;border-radius:16px 16px 0 0;text-align:center;">
    <p style="margin:0 0 4px 0;color:#B2C0AD;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:600;">Offhanded by Ravneet</p>
    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:300;">Order Confirmed 🎉</h1>
  </td></tr>
  <tr><td style="background-color:#fffff1;padding:40px;">
    <p style="margin:0 0 8px 0;color:#2c3627;font-size:18px;font-weight:600;">Hi ${escapeHtml(firstName)}!</p>
    <p style="margin:0 0 24px 0;color:#6b7a65;font-size:15px;line-height:1.7;">Your order has been confirmed and is being prepared. Here are your details:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9E8;border:1px solid #e0e0d0;border-radius:12px;overflow:hidden;">
      <tr><td style="background-color:#2c3627;padding:14px 24px;">
        <p style="margin:0;color:#B2C0AD;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Order Details</p>
      </td></tr>
      <tr><td style="padding:24px;">
        <h2 style="margin:0 0 20px 0;color:#2c3627;font-size:20px;font-weight:400;">${safeProductName}</h2>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;border-bottom:1px solid #e8e8d8;">
            <table width="100%"><tr>
              <td style="color:#6b7a65;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:40%;">📦 Quantity</td>
              <td style="color:#2c3627;font-size:14px;font-weight:500;">${quantity}</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:8px 0;">
            <table width="100%"><tr>
              <td style="color:#6b7a65;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:40%;">💳 Amount Paid</td>
              <td style="color:#2c3627;font-size:16px;font-weight:700;">${formattedAmount}</td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#B2C0AD22;border:1px solid #B2C0AD;border-radius:8px;margin-top:20px;">
      <tr><td style="padding:14px 20px;">
        <p style="margin:0;color:#6b7a65;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Order Reference</p>
        <p style="margin:4px 0 0 0;color:#2c3627;font-size:18px;font-weight:700;letter-spacing:2px;">#${shortOrderId}</p>
      </td></tr>
    </table>
    <p style="margin:28px 0 16px 0;color:#6b7a65;font-size:14px;text-align:center;">Questions about your order?</p>
    <div style="text-align:center;"><a href="mailto:${OWNER_EMAIL}" style="display:inline-block;background-color:#2c3627;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Contact Us</a></div>
  </td></tr>
  <tr><td style="background-color:#F9F9E8;padding:24px 40px;border-radius:0 0 16px 16px;border-top:1px solid #e0e0d0;text-align:center;">
    <p style="margin:0;color:#2c3627;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Offhanded by Ravneet</p>
    <p style="margin:8px 0 0 0;color:#b0b0a0;font-size:11px;">You received this because you placed an order at Offhanded by Ravneet.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = `Hi ${firstName}!

Your order has been confirmed and is being prepared.

Order Details:
- Product: ${productName}
- Quantity: ${quantity}
- Amount Paid: ${formattedAmount}
- Order Reference: #${shortOrderId}

Questions about your order? Contact us at ${OWNER_EMAIL}.

Offhanded by Ravneet`;

  return resend.emails.send({
    from: FROM,
    to: customerEmail,
    replyTo: REPLY_TO,
    subject: sanitizeHeaderValue(`✅ Order Confirmed — ${productName}`),
    html,
    text,
  });
}

/* ================================================================
   4. OWNER PRODUCT ORDER ALERT EMAIL
================================================================ */

interface ProductOwnerAlertData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  quantity: number;
  amountPaid: number;
  orderId: string;
}

export async function sendProductAlertToOwner(data: ProductOwnerAlertData) {
  if (!OWNER_EMAIL) return;
  const { customerName, customerEmail, customerPhone, productName, quantity, amountPaid, orderId } = data;
  const shortOrderId = orderId.slice(0, 8).toUpperCase();
  const formattedAmount = `₹${amountPaid.toLocaleString("en-IN")}`;
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const safeProdCustName = escapeHtml(customerName);
  const safeProdCustEmail = escapeHtml(customerEmail);
  const safeProdCustPhone = customerPhone ? escapeHtml(customerPhone) : "";
  const safeProdName = escapeHtml(productName);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>New Order</title></head>
<body style="margin:0;padding:0;background-color:#f0f0e0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f0e0;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background-color:#2c3627;padding:28px 40px;border-radius:16px 16px 0 0;">
    <p style="margin:0 0 4px 0;color:#B2C0AD;font-size:10px;letter-spacing:4px;text-transform:uppercase;font-weight:600;">Offhanded — Admin Alert</p>
    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:400;">🛍️ New Product Order!</h1>
    <p style="margin:6px 0 0 0;color:#B2C0AD;font-size:12px;">${now} IST</p>
  </td></tr>
  <tr><td style="background-color:#B2C0AD;padding:20px 40px;text-align:center;">
    <p style="margin:0 0 4px 0;color:#2c3627;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Payment Received</p>
    <p style="margin:0;color:#2c3627;font-size:36px;font-weight:800;">${formattedAmount}</p>
  </td></tr>
  <tr><td style="background-color:#ffffff;padding:36px 40px;">
    <h3 style="margin:0 0 16px 0;color:#2c3627;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:2px solid #B2C0AD;padding-bottom:8px;">Customer Details</h3>
    <table width="100%" cellpadding="0" cellspacing="8">
      <tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:35%;padding:6px 0;">Name</td><td style="color:#2c3627;font-size:14px;font-weight:600;padding:6px 0;">${safeProdCustName}</td></tr>
      <tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Email</td><td style="padding:6px 0;"><a href="mailto:${safeProdCustEmail}" style="color:#2c3627;font-size:14px;font-weight:600;">${safeProdCustEmail}</a></td></tr>
      ${customerPhone ? `<tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Phone</td><td style="padding:6px 0;"><a href="tel:${safeProdCustPhone}" style="color:#2c3627;font-size:14px;font-weight:600;">${safeProdCustPhone}</a></td></tr>` : ""}
    </table>
    <h3 style="margin:28px 0 16px 0;color:#2c3627;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:2px solid #B2C0AD;padding-bottom:8px;">Order Details</h3>
    <table width="100%" cellpadding="0" cellspacing="8">
      <tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:35%;padding:6px 0;">Product</td><td style="color:#2c3627;font-size:14px;font-weight:600;padding:6px 0;">${safeProdName}</td></tr>
      <tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Quantity</td><td style="color:#2c3627;font-size:14px;font-weight:600;padding:6px 0;">${quantity}</td></tr>
      <tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Order ID</td><td style="color:#2c3627;font-size:14px;font-weight:700;padding:6px 0;letter-spacing:2px;">#${shortOrderId}</td></tr>
    </table>
  </td></tr>
  <tr><td style="background-color:#F9F9E8;padding:20px 40px;border-radius:0 0 16px 16px;text-align:center;border-top:1px solid #e0e0d0;">
    <p style="margin:0;color:#b0b0a0;font-size:11px;">Automated alert from your Offhanded order system.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = `New Product Order Received!

Amount Paid: ${formattedAmount}
Date/Time: ${now} IST

Customer Details:
- Name: ${customerName}
- Email: ${customerEmail}
${customerPhone ? `- Phone: ${customerPhone}\n` : ""}
Order Details:
- Product: ${productName}
- Quantity: ${quantity}
- Order ID: #${shortOrderId}

Automated alert from your Offhanded order system.`;

  return resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    replyTo: REPLY_TO,
    subject: sanitizeHeaderValue(`🛍️ New Order: ${productName} — ${formattedAmount} from ${customerName}`),
    html,
    text,
  });
}

/* ================================================================
   5. CUSTOMER WELCOME EMAIL
   Triggered on successful user signup / account creation
================================================================ */

export async function sendWelcomeEmail(customerEmail: string, customerName: string) {
  const firstName = customerName ? customerName.split(" ")[0] : "there";
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to the Offhanded Family 🎨</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4e8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Top Decorative Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="https://res.cloudinary.com/daoho0jwj/image/upload/v1771541977/android-chrome-512x512_jskgfx.png" alt="Offhanded Logo" style="width:72px;height:72px;border-radius:50%;display:block;" />
              <p style="margin:8px 0 0 0;color:${BRAND.dark};font-size:12px;letter-spacing:4px;text-transform:uppercase;font-weight:600;">Offhanded by Ravneet</p>
            </td>
          </tr>

          <!-- Main Email Container -->
          <tr>
            <td style="background-color:${BRAND.cream};padding:40px;border-radius:16px;border:1px solid #e0e0d0;box-shadow:0 4px 12px rgba(0,0,0,0.02);">
              
              <!-- Title -->
              <h1 style="margin:0 0 16px 0;color:${BRAND.dark};font-size:26px;font-weight:350;line-height:1.3;letter-spacing:-0.5px;text-align:center;">
                Welcome to our creative escape ✨
              </h1>

              <!-- Greeting -->
              <p style="margin:0 0 16px 0;color:${BRAND.dark};font-size:16px;font-weight:600;">Hi ${escapeHtml(firstName)},</p>
              
              <!-- Introduction -->
              <p style="margin:0 0 24px 0;color:${BRAND.mutedText};font-size:15px;line-height:1.7;">
                We are absolutely thrilled to welcome you to the Offhanded creative community. 
                Offhanded is a sanctuary for slow, tactile, and immersive craft experiences. 
                Whether you're getting your hands dirty on a pottery wheel, blending textures on a raw canvas, or learning bento cake decoration, 
                our studio is a place to step away from the digital noise, clear your mind, and make something beautiful.
              </p>

              <!-- Creative Core Pillar Highlights (Cards Grid) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:15px;background-color:${BRAND.lightCream};border-radius:8px;border-left:4px solid ${BRAND.dark};">
                    <h3 style="margin:0 0 4px 0;color:${BRAND.dark};font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🏺 Immersive Workshops</h3>
                    <p style="margin:0;color:${BRAND.mutedText};font-size:13.5px;line-height:1.5;">
                      Join us for guided pottery classes, canvas texturing, gold foil painting, punch needle workshops, and bento cake decoration. 
                      No art experience is ever required—just bring your curiosity!
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="height:12px;"></td>
                </tr>
                <tr>
                  <td style="padding:15px;background-color:${BRAND.lightCream};border-radius:8px;border-left:4px solid ${BRAND.sage};">
                    <h3 style="margin:0 0 4px 0;color:${BRAND.dark};font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🎨 Handcrafted Products</h3>
                    <p style="margin:0;color:${BRAND.mutedText};font-size:13.5px;line-height:1.5;">
                      We are curating a selection of premium, hand-built studio ceramic items, creative art kits, and tools designed to keep your creative flame alive at home.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <div style="text-align:center;padding:12px 0 24px 0;">
                <p style="margin:0 0 16px 0;color:${BRAND.mutedText};font-size:14px;">Ready to find your creative flow?</p>
                <a href="https://www.offhandedbyravneet.com/workshops" style="display:inline-block;background-color:${BRAND.dark};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;box-shadow:0 4px 10px rgba(44,54,39,0.15);">
                  Explore Upcoming Workshops
                </a>
              </div>

              <!-- Quote divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e8e8d8;padding-top:24px;margin-top:12px;">
                <tr>
                  <td align="center">
                    <p style="margin:0;color:${BRAND.mutedText};font-style:italic;font-size:14px;line-height:1.6;max-width:420px;text-align:center;">
                      "Art is not a luxury, it is a way of seeing. It is an act of stepping back and finding peace in creation."
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <p style="margin:0 0 6px 0;color:${BRAND.dark};font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Offhanded by Ravneet</p>
              <p style="margin:0 0 16px 0;color:${BRAND.mutedText};font-size:11px;">Jalandhar, Punjab, India</p>
              
              <!-- Social Links -->
              <table align="center" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="https://instagram.com/offhandedbyravneet" style="color:${BRAND.dark};font-size:12px;text-decoration:none;font-weight:500;">Instagram</a>
                  </td>
                  <td style="color:${BRAND.mutedText};font-size:12px;">•</td>
                  <td style="padding:0 8px;">
                    <a href="https://www.offhandedbyravneet.com" style="color:${BRAND.dark};font-size:12px;text-decoration:none;font-weight:500;">Website</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#b0b0a0;font-size:11px;line-height:1.6;">
                You are receiving this email because you signed up to join the Offhanded community.<br/>
                If you did not make this request, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;

  const text = `Hi ${firstName},

We are absolutely thrilled to welcome you to the Offhanded creative community. 

Offhanded is a sanctuary for slow, tactile, and immersive craft experiences. Whether you're getting your hands dirty on a pottery wheel, blending textures on a raw canvas, or learning bento cake decoration, our studio is a place to step away from the digital noise, clear your mind, and make something beautiful.

Creative Pillars:
1. Immersive Workshops: Guided pottery classes, canvas texturing, gold foil painting, punch needle workshops, and bento cake decoration.
2. Handcrafted Products: Premium, hand-built studio ceramic items, creative art kits, and tools.

Ready to find your creative flow? Explore upcoming workshops: https://www.offhandedbyravneet.com/workshops

"Art is not a luxury, it is a way of seeing. It is an act of stepping back and finding peace in creation."

Best regards,
Offhanded by Ravneet
Jalandhar, Punjab, India
Instagram: https://instagram.com/offhandedbyravneet
Website: https://www.offhandedbyravneet.com`;

  return resend.emails.send({
    from: FROM,
    to: customerEmail,
    replyTo: REPLY_TO,
    subject: "Welcome to the Offhanded Creative Family! 🎨✨",
    html,
    text,
  });
}

/* ================================================================
   6. CONTACT ENQUIRY EMAIL
   Triggered when someone submits the contact form
================================================================ */

interface ContactEnquiryData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactEnquiryEmail(data: ContactEnquiryData) {
  const { name, email, phone, subject, message } = data;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : "";
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Contact Enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4e8;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4e8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e0e0d0;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#2c3627;padding:24px 30px;color:#ffffff;">
              <h2 style="margin:0;font-size:20px;font-weight:400;">New Contact Enquiry 📧</h2>
              <p style="margin:4px 0 0 0;font-size:12px;opacity:0.8;">Received at ${now} IST</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <table width="100%" cellpadding="0" cellspacing="8" style="font-size:14px;color:#2c3627;">
                <tr>
                  <td style="width:30%;font-weight:bold;color:#6b7a65;">Name:</td>
                  <td>${safeName}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;color:#6b7a65;">Email:</td>
                  <td><a href="mailto:${safeEmail}" style="color:#2c3627;text-decoration:none;">${safeEmail}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="font-weight:bold;color:#6b7a65;">Phone:</td>
                  <td><a href="tel:${safePhone}" style="color:#2c3627;text-decoration:none;">${safePhone}</a></td>
                </tr>` : ""}
                <tr>
                  <td style="font-weight:bold;color:#6b7a65;">Subject:</td>
                  <td>${safeSubject}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;color:#6b7a65;vertical-align:top;">Message:</td>
                  <td style="white-space:pre-wrap;line-height:1.6;">${safeMessage}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `New Contact Enquiry Received!
  
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ""}
Subject: ${subject}
Message:
${message}
`;

  // Always send enquiries to offhandedbyravneet@gmail.com
  return resend.emails.send({
    from: FROM,
    to: "offhandedbyravneet@gmail.com",
    replyTo: email,
    subject: sanitizeHeaderValue(`📧 Contact Enquiry: ${subject} from ${name}`),
    html,
    text,
  });
}

