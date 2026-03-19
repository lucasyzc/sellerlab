interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  DISCORD_WEBHOOK_URL?: string;
}

interface FeedbackPayload {
  type: "calculator_issue" | "contact" | "general";
  source: string;
  message: string;
  context?: Record<string, string>;
  contact?: { name?: string; email?: string };
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const COLORS: Record<string, number> = {
  calculator_issue: 0xdc2626,
  contact: 0x2563eb,
  general: 0x9333ea,
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

async function sendDiscord(env: Env, payload: FeedbackPayload) {
  if (!env.DISCORD_WEBHOOK_URL) return;

  const fields = [
    { name: "Type", value: payload.type, inline: true },
    { name: "Source", value: payload.source, inline: true },
  ];

  if (payload.contact?.name)
    fields.push({ name: "Name", value: payload.contact.name, inline: true });
  if (payload.contact?.email)
    fields.push({ name: "Email", value: payload.contact.email, inline: true });
  if (payload.context) {
    const contextStr = Object.entries(payload.context)
      .map(([k, v]) => `**${k}:** ${v}`)
      .join("\n");
    fields.push({ name: "Context", value: contextStr, inline: false });
  }

  await fetch(env.DISCORD_WEBHOOK_URL, {
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

async function saveToSupabase(env: Env, payload: FeedbackPayload) {
  const resp = await fetch(`${env.SUPABASE_URL}/rest/v1/feedbacks`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      type: payload.type,
      source: payload.source,
      message: payload.message,
      context: payload.context ?? null,
      contact: payload.contact ?? null,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    return { ok: false, error: text };
  }
  return { ok: true };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as FeedbackPayload;

    if (!body.message?.trim() || !body.type || !body.source) {
      return json({ ok: false, error: "Missing required fields." }, 400);
    }

    if (body.message.length > 2000) {
      return json(
        { ok: false, error: "Message too long (max 2000 characters)." },
        413
      );
    }

    const [, dbResult] = await Promise.allSettled([
      sendDiscord(env, body),
      saveToSupabase(env, body),
    ]);

    const dbFailed =
      dbResult.status === "rejected" ||
      (dbResult.status === "fulfilled" && !dbResult.value.ok);

    if (dbFailed) {
      const reason =
        dbResult.status === "rejected"
          ? String(dbResult.reason)
          : (dbResult.value as { ok: false; error: string }).error;
      console.error("Feedback DB save failed:", reason);
      return json({ ok: false, error: "Failed to save feedback." }, 502);
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "Internal server error." }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
