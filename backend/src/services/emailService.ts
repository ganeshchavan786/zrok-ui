// backend/src/services/emailService.ts
import nodemailer from 'nodemailer';
import { logger } from '../utils/index';

const BASE_URL = process.env.BASE_DOMAIN ? `https://${process.env.BASE_DOMAIN}` : 'http://localhost:3555';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInviteEmail(email: string, inviteToken: string): Promise<void> {
  const link = `${BASE_URL}/register?invite=${inviteToken}&email=${encodeURIComponent(email)}`;

  await transport.sendMail({
    from: `"zrokui" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "You're invited to zrokui",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
          <span style="background:#7c3aed;color:#fff;padding:6px 10px;border-radius:8px;font-size:18px;font-weight:bold">⚡</span>
          <span style="font-size:20px;font-weight:bold;color:#09090b">zrokui</span>
        </div>
        <h2 style="color:#09090b;margin:0 0 8px">You've been invited!</h2>
        <p style="color:#52525b;margin:0 0 24px">Click the button below to create your account and start tunneling.</p>
        <a href="${link}" style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Create account →
        </a>
        <p style="color:#a1a1aa;font-size:12px;margin-top:24px">
          Or copy this link: <a href="${link}" style="color:#7c3aed">${link}</a><br>
          This invite expires in 7 days.
        </p>
      </div>
    `,
  });

  logger.info(`Invite email sent to ${email}`);
}

export async function sendWelcomeEmail(email: string): Promise<void> {
  await transport.sendMail({
    from: `"zrokui" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to zrokui!',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="color:#09090b">Welcome to zrokui ⚡</h2>
        <p style="color:#52525b">Get started in seconds:</p>
        <pre style="background:#f4f4f5;padding:16px;border-radius:8px;font-size:13px">
npm install -g zrokui-cli
zrokui login --token YOUR_TOKEN
zrokui http 3000</pre>
        <p style="color:#52525b">Get your token from the <a href="${BASE_URL}/tokens" style="color:#7c3aed">API Tokens</a> page.</p>
      </div>
    `,
  });
}
