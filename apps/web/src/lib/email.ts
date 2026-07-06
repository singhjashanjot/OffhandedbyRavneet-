/* ========================================
   EMAIL UTILITY — Powered by Resend
   Sends transactional emails for:
   - Customer booking confirmation
   - Owner new booking alert

   FROM address: configured via FROM_EMAIL env var
   To switch to custom domain, update FROM_EMAIL in .env.local
======================================== */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed — ${workshopTitle}</title>
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
              <p style="margin:0 0 8px 0;color:${BRAND.dark};font-size:18px;font-weight:600;">Hi ${firstName}!</p>
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
                    <h2 style="margin:0 0 20px 0;color:${BRAND.dark};font-size:22px;font-weight:400;line-height:1.3;">${workshopTitle}</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${workshopDate ? `
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8e8d8;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color:${BRAND.mutedText};font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:40%;">📅 Date</td>
                              <td style="color:${BRAND.dark};font-size:14px;font-weight:500;">${workshopDate}</td>
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
                              <td style="color:${BRAND.dark};font-size:14px;font-weight:500;">${workshopTime}</td>
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
                              <td style="color:${BRAND.dark};font-size:14px;font-weight:500;">${workshopVenue}</td>
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

  return resend.emails.send({
    from: FROM,
    to: customerEmail,
    replyTo: REPLY_TO,
    subject: `✅ Booking Confirmed — ${workshopTitle}`,
    html,
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

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Booking — ${workshopTitle}</title>
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
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${customerName}</td>
                </tr>
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Email</td>
                  <td style="padding:6px 0;"><a href="mailto:${customerEmail}" style="color:${BRAND.dark};font-size:14px;font-weight:600;">${customerEmail}</a></td>
                </tr>
                ${customerPhone ? `
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Phone</td>
                  <td style="padding:6px 0;"><a href="tel:${customerPhone}" style="color:${BRAND.dark};font-size:14px;font-weight:600;">${customerPhone}</a></td>
                </tr>` : ""}
              </table>

              <!-- Workshop Info -->
              <h3 style="margin:28px 0 16px 0;color:${BRAND.dark};font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:2px solid ${BRAND.sage};padding-bottom:8px;">Workshop Details</h3>
              <table width="100%" cellpadding="0" cellspacing="8">
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:35%;padding:6px 0;">Workshop</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${workshopTitle}</td>
                </tr>
                ${workshopDate ? `
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Date</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${workshopDate}</td>
                </tr>` : ""}
                ${workshopTime ? `
                <tr>
                  <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Time</td>
                  <td style="color:${BRAND.dark};font-size:14px;font-weight:600;padding:6px 0;">${workshopTime}</td>
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

  return resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    replyTo: REPLY_TO,
    subject: `💰 New Booking: ${workshopTitle} — ${formattedAmount} from ${customerName}`,
    html,
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
    <p style="margin:0 0 8px 0;color:#2c3627;font-size:18px;font-weight:600;">Hi ${firstName}!</p>
    <p style="margin:0 0 24px 0;color:#6b7a65;font-size:15px;line-height:1.7;">Your order has been confirmed and is being prepared. Here are your details:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F9E8;border:1px solid #e0e0d0;border-radius:12px;overflow:hidden;">
      <tr><td style="background-color:#2c3627;padding:14px 24px;">
        <p style="margin:0;color:#B2C0AD;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Order Details</p>
      </td></tr>
      <tr><td style="padding:24px;">
        <h2 style="margin:0 0 20px 0;color:#2c3627;font-size:20px;font-weight:400;">${productName}</h2>
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

  return resend.emails.send({
    from: FROM,
    to: customerEmail,
    replyTo: REPLY_TO,
    subject: `✅ Order Confirmed — ${productName}`,
    html,
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
      <tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:35%;padding:6px 0;">Name</td><td style="color:#2c3627;font-size:14px;font-weight:600;padding:6px 0;">${customerName}</td></tr>
      <tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Email</td><td style="padding:6px 0;"><a href="mailto:${customerEmail}" style="color:#2c3627;font-size:14px;font-weight:600;">${customerEmail}</a></td></tr>
      ${customerPhone ? `<tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:6px 0;">Phone</td><td style="padding:6px 0;"><a href="tel:${customerPhone}" style="color:#2c3627;font-size:14px;font-weight:600;">${customerPhone}</a></td></tr>` : ""}
    </table>
    <h3 style="margin:28px 0 16px 0;color:#2c3627;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:2px solid #B2C0AD;padding-bottom:8px;">Order Details</h3>
    <table width="100%" cellpadding="0" cellspacing="8">
      <tr><td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:35%;padding:6px 0;">Product</td><td style="color:#2c3627;font-size:14px;font-weight:600;padding:6px 0;">${productName}</td></tr>
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

  return resend.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    replyTo: REPLY_TO,
    subject: `🛍️ New Order: ${productName} — ${formattedAmount} from ${customerName}`,
    html,
  });
}
