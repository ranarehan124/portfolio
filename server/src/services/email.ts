import nodemailer from 'nodemailer';
import { SMTP } from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: SMTP.host,
  port: SMTP.port,
  secure: false,
  auth: {
    user: SMTP.user,
    pass: SMTP.pass,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(
  options: SendMailOptions,
): Promise<void> {
  if (!SMTP.user || !SMTP.pass) {
    console.warn('[Email] SMTP credentials not configured');
    return;
  }

  await transporter.sendMail({
    from: SMTP.from,
    to: options.to || SMTP.to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  await sendMail({
    to: SMTP.to,
    subject: `Portfolio Contact: ${data.subject}`,
    replyTo: data.email,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  });
}