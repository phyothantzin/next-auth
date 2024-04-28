import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "No-reply <onboarding@resend.dev>",
    to: email,
    subject: "Reset Password",
    html: `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "No-reply <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`,
  });
};
