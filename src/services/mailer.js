// /src/services/mailer.js
// Nodemailer wrapper with a single, unified sendEnquiryEmail() function.
// If SMTP env vars are missing, email sending is skipped but logged.

const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  NOTIFY_TO = "gopinath.print@gmail.com",
} = process.env;

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    console.warn("[mailer] SMTP not fully configured. Skipping email sends.");
    return null; // no-op mode
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

function htmlRow(k, v) {
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#555">${k}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600">${v ? String(v) : ""}</td>
  </tr>`;
}

function buildHtml(enq) {
  return `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
    <h2 style="margin:0 0 8px 0">New Enquiry Received</h2>
    <p style="margin:0 0 16px 0;color:#555">Sri Lakshmi Power Printers</p>
    <table style="border-collapse:collapse;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden">
      ${htmlRow("Name", enq.name)}
      ${htmlRow("Company", enq.company)}
      ${htmlRow("Email", enq.email)}
      ${htmlRow("Phone", enq.phone)}
      ${htmlRow("City", enq.city)}
      ${htmlRow("Service", enq.service)}
      ${htmlRow("Quantity", enq.quantity)}
      ${htmlRow("Notes", enq.notes)}
      ${htmlRow("Submitted", new Date(enq.createdAt || Date.now()).toLocaleString())}
    </table>
  </div>`;
}

async function sendEnquiryEmail(enq) {
  console.log("[Mailer] Preparing to send enquiry email...");

  const t = getTransporter();
  if (!t) {
    console.warn("[Mailer] Skipped sending email (SMTP not configured).");
    return;
  }

  const subject = `New Enquiry – ${enq.name || "Unknown"} – ${enq.service || "No Service"} x ${enq.quantity || "-"}`;

  try {
    const info = await t.sendMail({
      from: SMTP_FROM,
      to: NOTIFY_TO,
      subject,
      html: buildHtml(enq),
    });
    console.log("[Mailer] Email sent successfully. Message ID:", info.messageId);
  } catch (err) {
    console.error("[Mailer] Failed to send email:", err);
    throw err;
  }
}

module.exports = { sendEnquiryEmail };
