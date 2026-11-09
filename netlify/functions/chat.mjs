/**
 * Netlify Function: Chat with Gemini API
 *
 * Deploy: netlify deploy --prod
 * Local dev: netlify dev
 *
 * Environment variables needed in Netlify:
 * - GEMINI_API_KEY: Your Google AI Studio API key
 * - GEMINI_MODEL: (optional) Model name, default: gemini-flash-latest
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Read env vars at request time (not module load time)
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const reply = (statusCode, payload, extra = {}) => ({
  statusCode,
  headers: { ...JSON_HEADERS, ...extra },
  body: JSON.stringify(payload),
});

// Netlify memotong function di ~30 dtk; batasi panggilan Gemini lebih awal
// supaya pengunjung dapat pesan error yang jelas, bukan 504 kosong.
const GEMINI_TIMEOUT_MS = 10000; // per percobaan
const TOTAL_BUDGET_MS = 25000;   // total semua percobaan

// Model cadangan dicoba berurutan jika model utama sibuk (503), kena limit (429)
// atau sudah tidak tersedia (404). Bisa diganti lewat GEMINI_FALLBACK_MODELS
// (pisahkan dengan koma).
const DEFAULT_FALLBACKS = ["gemini-3.1-flash-lite", "gemini-2.5-flash"];

function getConfig() {
  const primary = process.env.GEMINI_MODEL || "gemini-flash-latest";
  const fallbacks = (process.env.GEMINI_FALLBACK_MODELS || DEFAULT_FALLBACKS.join(","))
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return {
    model: primary,
    models: [primary, ...fallbacks.filter((m) => m !== primary)],
    apiKey: process.env.GEMINI_API_KEY,
  };
}

// System prompt - defines the bot's personality and knowledge
const SYSTEM_PROMPT = `Kamu adalah asisten AI pribadi milik M. Khoirul Anam, S.Kom (Full Stack Software Engineer).

TUGASMU:
- Jawab pertanyaan pengunjung portfolio tentang Khoirul: skill, project, pengalaman, pendidikan, kontak, dll.
- Gunakan bahasa Indonesia yang santai, ramah, dan profesional.
- Jika tidak tahu jawabannya, jujur saja dan arahkan ke kontak/LinkedIn/GitHub.
- JANGAN mengada-ada informasi yang tidak ada di konteks.

KONTEKS PORTFOLIO:
- Nama: M. Khoirul Anam, S.Kom
- Brand: Khoirul Anam
- Role: Full Stack Software Engineer
- Email: akhoirul029@gmail.com
- Lokasi: Surabaya, Indonesia
- Pendidikan: S.Kom di KH. Abdul Wahab Hasbullah University (2013-2017)
- Pengalaman:
  * Freelance Web Developer & AI Consultant (Sep 2023 - Jul 2025): 15+ project (LMS, e-commerce, ERP), client retention 70-80%, AI mental health dengan Gemini API + RAG
  * PT Kebun Tebu Mas (Apr-Oct 2018): SRS Operator, administrasi data, MySQL, reporting
  * PT Pos Indonesia (Aug-Sep 2015): Magang, barcode scanning, MySQL, network, web app backup
  * KPRI Muncul (Aug-Sep 2014): Magang, bookkeeping, data entry, database, computer support
- Skills Utama:
  * Frontend: React.js, Next.js, TailwindCSS, Shadcn/UI, Redux, Zustand, TanStack Query, TypeScript, JavaScript
  * Backend: Laravel, Node.js, NestJS, Spring Boot, Flask, PHP, Python, Java, Golang
  * Database: MySQL, PostgreSQL, MongoDB, Redis, Prisma ORM, Hibernate
  * AI: Gemini API, RAG Pipelines, Few-shot Prompting, Fine-tuning
  * DevOps: Docker, CI/CD (GitHub Actions), GCP, AWS, Azure, Linux/VPS, Sentry
  * Tools: Git, GitHub, VS Code, Figma, Canva, Adobe Illustrator, Postman, Claude Code, Codex, Copilot
  * Admin: Microsoft Office, MySQL Management, Data Analysis, SEO, Graphic Design, Google AdSense, Android Servicing
- Project Terpilih:
  * Aplikasi Absensi (Featured) - Website absensi kehadiran
  * Aplikasi Sistem Antrian - Website profesional branding perusahaan
  * Landing Page - High conversion landing page
  * Dashboard Blog - Penulisan artikel SEO
- Sosial Media: GitHub (khoirul49), LinkedIn (m-khoirul-anam), Instagram (@anam01213)
- CV: Tersedia di /docs/cv.pdf

GAYA JAWAB:
- Singkat, padat, easy to read
- Pakai emoji secukupnya (😊, 🚀, 💡, dll)
- Bullet points untuk list
- Jika tanya detail teknis, jelaskan singkat tawarkan diskusi lebih lanjut
- Selalu akhiri dengan tawaran bantuan lanjutan`;

/**
 * Convert message history to Gemini format.
 * Gemini mewajibkan giliran user/model selang-seling dan diawali "user",
 * jadi pesan sapaan bot di awal dibuang dan role yang berurutan digabung.
 */
function buildContents(history, userMessage) {
  const contents = [];

  const push = (role, text) => {
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += "\n" + text;
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  };

  (Array.isArray(history) ? history : []).slice(-6).forEach((msg) => {
    if (!msg || typeof msg.content !== "string" || !msg.content.trim()) return;
    const role = msg.role === "assistant" ? "model" : "user";
    if (contents.length === 0 && role === "model") return; // harus mulai dari user
    push(role, msg.content.slice(0, 2000));
  });

  push("user", userMessage);
  return contents;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        ...JSON_HEADERS,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed" }, { Allow: "POST" });
  }

  const config = getConfig();
  if (!config.apiKey) {
    console.error("GEMINI_API_KEY not configured");
    return reply(500, { error: "AI service not configured. Please contact admin." });
  }

  try {
    const { message, history = [] } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string" || message.length > 2000) {
      return reply(400, { error: "Invalid message" });
    }

    const genAI = new GoogleGenerativeAI(config.apiKey);
    const contents = buildContents(history, message);
    const startedAt = Date.now();

    const generationConfig = { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 2048 };
    const safetySettings = [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ];

    let replyText = null;
    let lastError = null;

    for (const modelName of config.models) {
      const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);
      if (remaining < 3000) break; // sisa waktu terlalu sedikit

      try {
        const model = genAI.getGenerativeModel(
          { model: modelName, systemInstruction: SYSTEM_PROMPT, generationConfig, safetySettings },
          { timeout: Math.min(GEMINI_TIMEOUT_MS, remaining) }
        );
        const result = await model.generateContent({ contents });
        replyText = result.response.text();
        if (modelName !== config.model) console.log("Fallback model dipakai:", modelName);
        break;
      } catch (err) {
        lastError = err;
        console.error("Gemini gagal:", { model: modelName, status: err?.status, message: err?.message });
        const m = String(err?.message || "");
        const retryable =
          [429, 500, 503, 404].includes(err?.status) ||
          /overloaded|high demand|unavailable|quota|RESOURCE_EXHAUSTED|not found|abort|timeout|timed out/i.test(m) ||
          err?.name === "AbortError";
        if (!retryable) throw err; // key salah, safety, dll: jangan ganti model
      }
    }

    if (replyText === null) throw lastError || new Error("Tidak ada model yang tersedia");

    return reply(200, { reply: replyText });
  } catch (error) {
    console.error("Gemini API error:", {
      model: config.model,
      name: error?.name,
      status: error?.status,
      message: error?.message,
    });

    const msg = String(error?.message || "");
    let errorMessage = "Terjadi kesalahan pada layanan AI";
    let status = 500;
    if (error?.name === "AbortError" || /abort|timeout|timed out/i.test(msg)) {
      errorMessage = "AI terlalu lama merespons, coba lagi sebentar lagi";
      status = 504;
    } else if (error?.status === 429 || /quota|RESOURCE_EXHAUSTED|429/i.test(msg)) {
      errorMessage = "Kuota API habis, coba lagi nanti";
    } else if (error?.status === 503 || /overloaded|unavailable|503/i.test(msg)) {
      errorMessage = "Layanan AI sedang sibuk, coba lagi sebentar lagi";
      status = 503;
    } else if (/API_KEY|API key/i.test(msg)) errorMessage = "Konfigurasi API tidak valid";
    else if (error?.status === 404 || /not found/i.test(msg)) errorMessage = "Model AI tidak ditemukan, periksa GEMINI_MODEL";
    else if (/SAFETY/i.test(msg)) errorMessage = "Pesan tidak dapat diproses";

    // Mode debug: set CHAT_DEBUG=1 di Netlify untuk melihat penyebab asli di chat.
    // Matikan lagi setelah selesai agar detail error tidak terlihat pengunjung.
    if (process.env.CHAT_DEBUG === "1") {
      errorMessage += ` [debug: ${msg.slice(0, 300)}]`;
    }

    return reply(status, { error: errorMessage });
  }
}