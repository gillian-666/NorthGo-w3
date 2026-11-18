import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteEnquiry,
  enquiryStatuses,
  getEnquiry,
  updateEnquiry,
} from "@/lib/enquiries";
import { requireAdmin } from "@/lib/require-admin";

type Props = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  company: z.string().min(1).max(160).optional(),
  email: z.string().email().max(160).optional(),
  phone: z.string().max(60).optional().or(z.literal("")),
  service: z.string().max(80).optional().or(z.literal("")),
  tradeLane: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(1).max(5000).optional(),
  status: z.enum(enquiryStatuses).optional(),
  notes: z.string().max(5000).optional(),
});

export async function GET(_request: Request, { params }: Props) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const item = await getEnquiry(id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PATCH(request: Request, { params }: Props) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const patch = {
    ...parsed.data,
    phone: parsed.data.phone === "" ? undefined : parsed.data.phone,
    service: parsed.data.service === "" ? undefined : parsed.data.service,
    tradeLane: parsed.data.tradeLane === "" ? undefined : parsed.data.tradeLane,
  };

  const item = await updateEnquiry(id, patch);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: Props) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const ok = await deleteEnquiry(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
