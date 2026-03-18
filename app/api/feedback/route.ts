import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

interface FeedbackPayload {
  type: "calculator_issue" | "contact" | "general";
  source: string;
  message: string;
  context?: Record<string, string>;
  contact?: { name?: string; email?: string };
}

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 3;
const ipTimestamps = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipTimestamps.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  ipTimestamps.set(ip, timestamps);
  return false;
}

const COLORS: Record<FeedbackPayload["type"], number> = {
  calculator_issue: 0xdc2626,
  contact: 0x2563eb,
  general: 0x9333ea,
};

async function sendDiscord(payload: FeedbackPayload) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const fields = [
    { name: "Type", value: payload.type, inline: true },
    { name: "Source", value: payload.source, inline: true },
  ];

  if (payload.contact?.name) {
    fields.push({ name: "Name", value: payload.contact.name, inline: true });
  }
  if (payload.contact?.email) {
    fields.push({ name: "Email", value: payload.contact.email, inline: true });
  }
  if (payload.context) {
    const contextStr = Object.entries(payload.context)
      .map(([k, v]) => `**${k}:** ${v}`)
      .join("\n");
    fields.push({ name: "Context", value: contextStr, inline: false });
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: `New Feedback: ${payload.type.replace("_", " ")}`,
          description: payload.message,
          color: COLORS[payload.type] ?? 0x6b7280,
          fields,
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });
}

async function saveToSupabase(payload: FeedbackPayload) {
  const { error } = await getSupabaseAdmin().from("feedbacks").insert({
    type: payload.type,
    source: payload.source,
    message: payload.message,
    context: payload.context ?? null,
    contact: payload.contact ?? null,
  });
  if (error) console.error("Supabase insert error:", error);
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as FeedbackPayload;

    if (!body.message?.trim() || !body.type || !body.source) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (body.message.length > 2000) {
      return NextResponse.json(
        { ok: false, error: "Message too long (max 2000 characters)." },
        { status: 400 }
      );
    }

    await Promise.allSettled([sendDiscord(body), saveToSupabase(body)]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
