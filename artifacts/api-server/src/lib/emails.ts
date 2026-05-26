import { Resend } from "resend";
import { getServerEnv } from "./env";

const env = getServerEnv();
const resend = new Resend(env.RESEND_API_KEY);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

type LeadNotificationInput = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  selectedService: string;
  budgetRange: string;
  message: string;
  source: string;
};

type ContactSubmissionInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
};

type NewsletterSubscriberInput = {
  email: string;
  source: string;
};

function wrapEmail(title: string, body: string): string {
  return `
    <div style="background:#0F0D0A;color:#F7F0E6;font-family:Inter,Arial,sans-serif;padding:32px">
      <div style="max-width:640px;margin:0 auto;background:#15110E;border:1px solid rgba(201,169,110,0.2);border-radius:20px;padding:32px">
        <p style="margin:0 0 12px;color:#C9A96E;letter-spacing:.2em;text-transform:uppercase;font-size:12px">Solora</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;font-weight:600">${escapeHtml(title)}</h1>
        ${body}
        <p style="margin:28px 0 0;color:rgba(247,240,230,0.45);font-size:12px">Automated notification from the Solora inquiry system.</p>
      </div>
    </div>
  `;
}

export function renderLeadNotificationEmail(data: LeadNotificationInput): { subject: string; html: string; text: string } {
  const subject = `New Solora inquiry from ${data.fullName}`;
  const html = wrapEmail(
    subject,
    `
      <div style="display:grid;gap:12px;font-size:14px;line-height:1.6">
        <p style="margin:0"><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
        <p style="margin:0"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p style="margin:0"><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
        <p style="margin:0"><strong>Company:</strong> ${escapeHtml(data.companyName || "—")}</p>
        <p style="margin:0"><strong>Service:</strong> ${escapeHtml(data.selectedService)}</p>
        <p style="margin:0"><strong>Budget:</strong> ${escapeHtml(data.budgetRange)}</p>
        <p style="margin:0"><strong>Source:</strong> ${escapeHtml(data.source)}</p>
        <div>
          <p style="margin:0 0 8px"><strong>Message</strong></p>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(201,169,110,0.16);border-radius:14px;padding:16px">${nl2br(data.message)}</div>
        </div>
      </div>
    `,
  );

  const text = [
    subject,
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Company: ${data.companyName || "—"}`,
    `Service: ${data.selectedService}`,
    `Budget: ${data.budgetRange}`,
    `Source: ${data.source}`,
    "Message:",
    data.message,
  ].join("\n");

  return { subject, html, text };
}

export function renderLeadConfirmationEmail(data: LeadNotificationInput): { subject: string; html: string; text: string } {
  const subject = "Thanks for reaching out to Solora";
  const html = wrapEmail(
    subject,
    `
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7">Hi ${escapeHtml(data.fullName)},</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7">Thanks for contacting Solora. We’ve received your inquiry about <strong>${escapeHtml(data.selectedService)}</strong> and will reach out soon.</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:rgba(247,240,230,0.8)">If you need to add anything before we reply, just respond to this email.</p>
    `,
  );

  const text = [
    subject,
    `Hi ${data.fullName},`,
    `Thanks for contacting Solora. We’ve received your inquiry about ${data.selectedService} and will reach out soon.`,
    "If you need to add anything before we reply, just respond to this email.",
  ].join("\n\n");

  return { subject, html, text };
}

export function renderContactNotificationEmail(data: ContactSubmissionInput): { subject: string; html: string; text: string } {
  const subject = `New Solora contact submission: ${data.subject}`;
  const html = wrapEmail(
    subject,
    `
      <div style="display:grid;gap:12px;font-size:14px;line-height:1.6">
        <p style="margin:0"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p style="margin:0"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p style="margin:0"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <p style="margin:0"><strong>Source:</strong> ${escapeHtml(data.source)}</p>
        <div>
          <p style="margin:0 0 8px"><strong>Message</strong></p>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(201,169,110,0.16);border-radius:14px;padding:16px">${nl2br(data.message)}</div>
        </div>
      </div>
    `,
  );

  const text = [
    subject,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${data.subject}`,
    `Source: ${data.source}`,
    "Message:",
    data.message,
  ].join("\n");

  return { subject, html, text };
}

export function renderContactConfirmationEmail(data: ContactSubmissionInput): { subject: string; html: string; text: string } {
  const subject = "We received your message";
  const html = wrapEmail(
    subject,
    `
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7">Hi ${escapeHtml(data.name)},</p>
      <p style="margin:0;font-size:14px;line-height:1.7">Thanks for reaching out. We’ve received your message and will get back to you soon.</p>
    `,
  );

  return {
    subject,
    html,
    text: `Hi ${data.name},\n\nThanks for reaching out. We’ve received your message and will get back to you soon.`,
  };
}

export function renderNewsletterNotificationEmail(email: string): { subject: string; html: string; text: string } {
  const subject = "New Solora newsletter subscriber";
  const html = wrapEmail(
    subject,
    `
      <p style="margin:0;font-size:14px;line-height:1.7"><strong>Email:</strong> ${escapeHtml(email)}</p>
    `,
  );

  return { subject, html, text: `${subject}\nEmail: ${email}` };
}

export async function sendBusinessEmail(message: {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  await resend.emails.send({
    from: env.BUSINESS_EMAIL,
    to: env.BUSINESS_EMAIL,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: message.replyTo,
  });
}

export async function sendCustomerEmail(message: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  await resend.emails.send({
    from: env.BUSINESS_EMAIL,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}