"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";

const FEEDBACK_ENDPOINT =
  process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT || "/api/feedback";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "General Inquiry");

    try {
      trackEvent("CtaClicked", {
        tool_id: "contact",
        page_type: "contact",
        cta_id: "contact_submit",
      });

      const resp = await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          source: "contact-page",
          message: String(data.get("message") || ""),
          context: {
            Subject: subject,
          },
          contact: {
            name: String(data.get("name") || ""),
            email,
          },
        }),
      });
      if (!resp.ok) throw new Error();

      if (email) {
        trackEvent("EmailCaptured", {
          tool_id: "contact",
          page_type: "contact",
          capture_source: "contact_form",
          has_email: true,
        });
      }

      trackEvent("LeadSubmitted", {
        tool_id: "contact",
        page_type: "contact",
        lead_source: "contact-page",
        subject,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="container">
      <article className="legal-page">
        <h1>Contact Us</h1>
        <p style={{ fontSize: 16, color: "var(--color-text-secondary)", marginBottom: 32 }}>
          Have questions, feedback, or found an error? We&apos;d love to hear
          from you. Fill out the form below or email us directly.
        </p>

        {status === "success" ? (
          <div className="card" style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
            <h2 style={{ margin: "0 0 8px" }}>Thank You!</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Your message has been sent successfully. We&apos;ll get back to
              you within 1–2 business days.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="btn btn-primary"
              style={{ marginTop: 16 }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}
          >
            {status === "error" && (
              <div style={{ color: "#dc2626", fontSize: 14, padding: "8px 12px", background: "#fef2f2", borderRadius: "var(--radius-sm)" }}>
                Failed to send message. Please try again or email us directly at{" "}
                <a href={BRAND.supportMailto} style={{ color: "var(--color-primary)" }}>
                  {BRAND.supportEmail}
                </a>
              </div>
            )}

            <div>
              <label htmlFor="contact-name" className="form-label">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                className="input"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="form-label">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-subject" className="form-label">
                Subject
              </label>
              <select id="contact-subject" name="subject" className="input">
                <option value="General Inquiry">General Inquiry</option>
                <option value="Bug Report">Bug Report / Fee Error</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Partnership">Partnership / Business</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="form-label">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                className="input"
                rows={6}
                placeholder="Tell us what's on your mind..."
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", padding: "12px 32px" }}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        <section style={{ marginTop: 48 }}>
          <h2>Other Ways to Reach Us</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16,
              marginTop: 16,
            }}
          >
            <div className="card">
              <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Email</h3>
              <a href={BRAND.supportMailto} style={{ color: "var(--color-primary)", fontSize: 14 }}>
                {BRAND.supportEmail}
              </a>
            </div>
            <div className="card">
              <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Response Time</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>
                We typically respond within 1–2 business days.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}

