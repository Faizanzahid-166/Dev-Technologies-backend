import { Resend } from "resend";
import VerificationEmail from "../email/VerificationEmail.js"; // now plain JS

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, name, verifyCode) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.NEXT_PUBLIC_APP_DOMAIN) {
    console.error("Email service not configured");
    console.log(`DEV OTP for ${email}: ${verifyCode}`);

    return { success: false, message: "Email service not configured" };
  }


  try {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/verify-otp?email=${encodeURIComponent(email)}`;

    const html = VerificationEmail({ name, otp: verifyCode, verifyUrl }); // simple JS function

    await resend.emails.send({
      from: `Blitz Nextus <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "Blitz Nextus Platform | Verification Code",
      html,
    });

    return { success: true, message: `Verification email sent to ${email}` };
  } catch (err) {
    console.error("Error sending verification email:", err.response?.data || err);
    return { success: false, message: "Failed to send verification email" };
  }
}
