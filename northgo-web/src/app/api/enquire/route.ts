import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(1).max(120),
  company: z.string().min(1).max(160),
  email: z.string().email().max(160),
  phone: z.string().max(60).optional().or(z.literal("")),
  service: z.string().max(80).optional(),
  tradeLane: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const data = parsed.data;
  const to = process.env.ENQUIRE_TO_EMAIL ?? "info.tpe@northgo.com";
  const from =
    process.env.ENQUIRE_FROM_EMAIL ?? "Northgo Website <onboarding@resend.dev>";

  if (!process.env.RESEND_API_KEY) {
    console.info("[enquire] captured (no RESEND_API_KEY)", data);
    return NextResponse.json({ ok: true, mode: "log" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `Northgo enquiry from ${data.name} (${data.company})`,
      text: [
        `Name: ${data.name}`,
        `Company: ${data.company}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "-"}`,
        `Service: ${data.service || "-"}`,
        `Trade lane: ${data.tradeLane || "-"}`,
        "",
        data.message,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true, mode: "email" });
  } catch (error) {
    console.error("[enquire] email failed", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
