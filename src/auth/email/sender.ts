"use server";
import {env} from "@/data/env/server";
import {Resend} from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Verify Your Email",
    text: `Your verification code is: ${code}`,
  });
}
