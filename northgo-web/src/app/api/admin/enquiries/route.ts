import { NextResponse } from "next/server";
import { z } from "zod";
import {
  addEnquiry,
  enquiryStatuses,
  listEnquiries,
  type EnquiryStatus,
} from "@/lib/enquiries";
import { requireAdmin } from "@/lib/require-admin";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  company: z.string().min(1).max(160),
  email: z.string().email().max(160),
  phone: z.string().max(60).optional().or(z.literal("")),
  service: z.string().max(80).optional().or(z.literal("")),
  tradeLane: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(1).max(5000),
  status: z.enum(enquiryStatuses).optional(),
  notes: z.string().max(5000).optional(),
});

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam && enquiryStatuses.includes(statusParam as EnquiryStatus)
      ? (statusParam as EnquiryStatus)
      : undefined;

  const items = await listEnquiries(200, status);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const data = parsed.data;
  const item = await addEnquiry({
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone || undefined,
    service: data.service || undefined,
    tradeLane: data.tradeLane || undefined,
    message: data.message,
    delivery: "log",
    status: data.status || "new",
    notes: data.notes || "",
  });

  return NextResponse.json({ item }, { status: 201 });
}
