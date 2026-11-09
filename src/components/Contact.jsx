import { useState } from "react";
import emailjs from "@emailjs/browser";
import { emailjsConfig, socials } from "../data/content";

const field =
  "w-full rounded-md border border-line bg-white/70 px-4 py-3 text-ink placeholder:text-mute/70 focus:border-steel focus:outline-none";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    emailjs
      .send(emailjsConfig.serviceId, emailjsConfig.templateId, form, emailjsConfig.publicKey)
      .then(() => {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => setStatus("error"));
  };

  return (
    <section id="contact" className="border-t border-line py-24">
      <div className="container-page grid gap-14 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold md:text-5xl">Get in touch</h2>
          <p className="mt-5 max-w-md leading-relaxed text-mute">
            Have a project in mind? Whether it’s a landing page, company profile, or full web app, send me a message and I’ll get back to you.
          </p>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-baseline justify-between gap-4 py-4 transition-colors hover:text-steel"
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="truncate text-sm text-mute">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-mute">Name</span>
            <input name="name" value={form.name} onChange={onChange} required autoComplete="name" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-mute">Email</span>
            <input type="email" name="email" value={form.email} onChange={onChange} required autoComplete="email" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-mute">Message</span>
            <textarea name="message" rows="5" value={form.message} onChange={onChange} required className={field} />
          </label>
          <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          <p role="status" aria-live="polite" className="min-h-6 text-sm">
            {status === "success" && <span className="text-steel">Message sent. Thank you!</span>}
            {status === "error" && (
              <span className="text-red-700">The message couldn’t be sent. Check your connection and try again.</span>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
