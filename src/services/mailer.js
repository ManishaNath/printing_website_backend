// D:\GITHUB\printing_website_backend\src\services\mailer.js
// Nodemailer wrapper. If SMTP env is missing, this becomes a no-op.
// Why: Netlify must be able to bundle without secrets; avoid throwing.

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

async function sendNewEnquiryEmail(enq) {
  const t = getTransporter();
  if (!t) return; // no-op when SMTP not set
  const subject = `New Enquiry – ${enq.name} – ${enq.service} x ${enq.quantity}`;
  await t.sendMail({
    from: SMTP_FROM,
    to: NOTIFY_TO,
    subject,
    html: buildHtml(enq),
  });
}
async function sendEnquiryNotification(data) {
  console.log("[Mailer] Preparing to send enquiry email:", data);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.NOTIFY_TO,
      subject: `New Enquiry: ${data.service || "No Service"}`,
      text: JSON.stringify(data, null, 2),
    });
    console.log("[Mailer] Email sent successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("[Mailer] Failed to send email:", err);
    throw err;
  }
}
module.exports = { sendNewEnquiryEmail, sendEnquiryNotification };

