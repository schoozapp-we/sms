"use client";

import type React from "react";
import { useState } from "react";
import { Send } from "lucide-react";

type ContactEnquiryFormProps = {
  compact?: boolean;
  defaultTopic?: string;
};

const initialForm = {
  name: "",
  phone: "",
  email: "",
  topic: "",
  message: ""
};

export function ContactEnquiryForm({ compact = false, defaultTopic = "" }: ContactEnquiryFormProps) {
  const [form, setForm] = useState({ ...initialForm, topic: defaultTopic });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof initialForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.phone || !form.topic || !form.message) {
      setError("Name, phone, topic aur message required hai.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: compact ? "home" : "contact-page" })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Enquiry submit nahi ho payi.");
        return;
      }
      setStatus("Enquiry submit ho gayi. School office aapse contact karega.");
      setForm({ ...initialForm, topic: defaultTopic });
    } catch {
      setError("Server se connect nahi ho pa raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={compact ? "contactForm compactContactForm" : "contactForm"} onSubmit={onSubmit}>
      {error && <div className="errorBox">{error}</div>}
      {status && <div className="successBox">{status}</div>}
      <input aria-label="Name" placeholder="Your name" value={form.name} onChange={set("name")} />
      <input aria-label="Phone" placeholder="Phone number" value={form.phone} onChange={set("phone")} />
      {!compact && <input aria-label="Email" placeholder="Email address" value={form.email} onChange={set("email")} />}
      <input aria-label="Topic" placeholder="Class / enquiry topic" value={form.topic} onChange={set("topic")} />
      <textarea aria-label="Message" placeholder="Message" value={form.message} onChange={set("message")} />
      <button type="submit" disabled={loading}>
        <Send size={15} /> {loading ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
