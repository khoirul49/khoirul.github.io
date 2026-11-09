/**
 * Vercel Serverless Function: Chat dengan Gemini API
 * Endpoint: POST /api/chat   (path yang sama juga jalan di Netlify lewat netlify.toml)
 *
 * Environment variables (Vercel → Settings → Environment Variables):
 * - GEMINI_API_KEY          (wajib)
 * - GEMINI_MODEL            (opsional, default: gemini-flash-latest)
 * - GEMINI_FALLBACK_MODELS  (opsional, dipisah koma)
 * - CHAT_DEBUG=1            (opsional, tampilkan penyebab error di chat; matikan setelah selesai)
 */
import { SYSTEM_PROMPT } from "../shared/systemPrompt.js";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const ATTEMPT_TIMEOUT_MS = 10000; // per percobaan
const TOTAL_BUDGET_MS = Number(process.env.CHAT_TOTAL_BUDGET_MS) || 25000; // total semua percobaan
const DEFAULT_FALLBACKS = ["gemini-3.1-flash-lite", "gemini-2.5-flash"];

const GENERATION_CONFIG = { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 2048 };
const SAFETY_SETTINGS = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
].map((category) => ({ category, threshold: "BLOCK_MEDIUM_AND_ABOVE" }));

function getModels() {
  const primary = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const fallbacks = (process.env.GEMINI_FALLBACK_MODELS || DEFAULT_FALLBACKS.join(","))
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return [primary, ...fallbacks.filter((m) => m !== primary)];
}

/** Gemini mewajibkan giliran user/model selang-seling dan diawali "user". */
function buildContents(history, userMessage) {
  const contents = [];
  const push = (role, text) => {
    const last = contents[contents.length - 1];
    if (last && last.role === role) last.parts[0].text += "\n" + text;
    else contents.push({ role, parts: [{ text }] });
  };

  (Array.isArray(history) ? history : []).slice(-6).forEach((msg) => {
    if (!msg || typeof msg.content !== "string" || !msg.content.trim()) return;
    const role = msg.role === "assistant" ? "model" : "user";
    if (contents.length === 0 && role === "model") return;
    push(role, msg.content.slice(0, 2000));
  });

  push("user", userMessage);
  return contents;
}

async function callGemini(model, contents, apiKey, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: GENERATION_CONFIG,
        safetySettings: SAFETY_SETTINGS,
      }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data?.error?.message || `Gemini HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }

    const candidate = data?.candidates?.[0];
    const text = (candidate?.content?.parts || []).map((p) => p.text || "").join("").trim();
    if (!text) {
      const err = new Error(
        data?.promptFeedback?.blockReason || candidate?.finishReason === "SAFETY"
          ? "SAFETY: respons diblokir"
          : "Respons kosong dari model"
      );
      err.status = candidate?.finishReason === "SAFETY" || data?.promptFeedback?.blockReason ? 400 : 503;
      throw err;
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

function describeError(error, msg) {
  if (error?.name === "AbortError" || /abort|timeout|timed out/i.test(msg))
    return { status: 504, text: "AI terlalu lama merespons, coba lagi sebentar lagi" };
  if (error?.status === 429 || /quota|RESOURCE_EXHAUSTED/i.test(msg))
    return { status: 429, text: "Kuota API habis, coba lagi nanti" };
  if (error?.status === 503 || /overloaded|high demand|unavailable/i.test(msg))
    return { status: 503, text: "Layanan AI sedang sibuk, coba lagi sebentar lagi" };
  if (/API_KEY|API key/i.test(msg)) return { status: 500, text: "Konfigurasi API tidak valid" };
  if (error?.status === 404 || /not found/i.test(msg))
    return { status: 500, text: "Model AI tidak ditemukan, periksa GEMINI_MODEL" };
  if (/SAFETY/i.test(msg)) return { status: 400, text: "Pesan tidak dapat diproses" };
  return { status: 500, text: "Terjadi kesalahan pada layanan AI" };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not configured");
    return res.status(500).json({ error: "AI service not configured. Please contact admin." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { message, history = [] } = body || {};
  if (!message || typeof message !== "string" || message.length > 2000) {
    return res.status(400).json({ error: "Invalid message" });
  }

  const contents = buildContents(history, message);
  const models = getModels();
  const startedAt = Date.now();
  let lastError = null;

  for (const model of models) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (remaining < 3000) break;

    try {
      const reply = await callGemini(model, contents, apiKey, Math.min(ATTEMPT_TIMEOUT_MS, remaining));
      if (model !== models[0]) console.log("Fallback model dipakai:", model);
      return res.status(200).json({ reply });
    } catch (err) {
      lastError = err;
      console.error("Gemini gagal:", { model, status: err?.status, message: err?.message });
      const m = String(err?.message || "");
      const retryable =
        [429, 500, 503, 404].includes(err?.status) ||
        /overloaded|high demand|unavailable|quota|RESOURCE_EXHAUSTED|not found|abort|timeout|timed out|kosong/i.test(m) ||
        err?.name === "AbortError";
      if (!retryable) break; // key salah, safety, dll: jangan ganti model
    }
  }

  const msg = String(lastError?.message || "");
  const { status, text } = describeError(lastError, msg);
  const debug = process.env.CHAT_DEBUG === "1" ? ` [debug: ${msg.slice(0, 300)}]` : "";
  return res.status(status).json({ error: text + debug });
}
