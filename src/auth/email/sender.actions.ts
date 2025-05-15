import nodemailer, {Transporter} from "nodemailer";
import {env} from "@/data/env/server";
import {generateVerificationToken} from "./generator.actions";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.GOOGLE_EMAILER_USER,
    pass: env.GOOGLE_EMAILER_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("Error with mail transporter:", error);
});

export async function sendVerificationEmailByToken(id: string, email: string) {
  const token = await generateVerificationToken(id);
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
  try {
    await transporter.sendMail({
      from: '"FiiSportiv" <turcanud9999@gmail.com>',
      to: email,
      subject: "Verify Your Email",
      html: `
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendVerificationEmailByCode(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: '"FiiSportiv" <turcanud9999@gmail.com>',
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Please use the following 6-digit code to verify your email address:</p>
          <div style="background: #f4f4f4; padding: 10px; margin: 20px 0; 
                     font-size: 24px; letter-spacing: 2px; text-align: center;">
            <strong>${code}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #888; font-size: 12px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
