# Khoirul Anam | Portfolio

React + Vite + Tailwind CSS v4 + Framer Motion. Tampilan mengikuti portfolio Alvalens
(fullpage-snap di beranda, menu lingkaran, sidebar ikon, halaman About/Projects/Archive/Detail).

**Fitur baru**: 🤖 **AI ChatBot** terintegrasi dengan Google Gemini API (via Netlify Functions).

## Jalankan

```bash
npm install
npm run dev      # development (localhost:5173)
npm run build    # hasil build di folder dist/
```

### Development dengan Netlify Functions (untuk ChatBot AI)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Jalankan dev server + functions
netlify dev
```

> **Catatan**: ChatBot butuh `netlify dev` agar Netlify Functions jalan di local. Tanpa itu, chat akan error "AI service not configured".

## Edit konten

Semua teks ada di `src/data/content.js`: profil (nama, role, email, CV), teks tagline, bio,
kategori skill, proyek, kredensial EmailJS (tidak dipakai di tampilan saat ini), dan link sosial.
Bagian Experience, Education, dan Achievements di halaman About muncul otomatis begitu datanya diisi.

### Konfigurasi ChatBot AI

Knowledge base bot ada di **`shared/systemPrompt.js`** (variabel `SYSTEM_PROMPT`, dipakai bersama oleh Vercel dan Netlify). Edit di sana untuk:
- Menambah/kurangi info project, skill, pengalaman
- Mengubah gaya bahasa / personality bot
- Menambah aturan khusus (misal: jangan jawab pertanyaan sensitif)

## Foto & gambar (opsional, semua punya cadangan)

Taruh di `src/assets/photos/`:

| Nama file | Dipakai di |
| --- | --- |
| `profile.png` | foto utama; jadi cadangan untuk semua foto di bawah |
| `front` | hero beranda |
| `about` / `me2` | slide About di beranda & hero halaman About |
| `projects` | slide Projects di beranda & hero halaman Projects |
| `setup` | slide Get In Touch di beranda |
| `me1`, `me2`, `me3` | kolase "Who Am I?" |
| `me4`, `me5`, `me6` | strip foto Education |

Gambar proyek: `src/assets/projects/<slug>.jpg`; tambahan `<slug>-1.jpg`, `<slug>-2.jpg`, … tampil di halaman detail.

CV: taruh di `public/docs/cv.pdf` untuk tombol Download CV.

## Routing

Memakai hash (`#/about`, `#/projects`, `#/projects/<slug>`, `#/projects/archive`); anchor beranda
`#home`, `#about`, `#projects`, `#contact`. Jalan di hosting statis tanpa konfigurasi rewrite.

## Deploy ke Netlify (Recommended)

1. Push ke GitHub
2. Import project di Netlify
3. Build command: `npm run build` | Publish directory: `dist`
4. **Tambah Environment Variables** di Netlify Dashboard > Site Settings > Environment Variables:
   - `GEMINI_API_KEY` = API key dari [Google AI Studio](https://aistudio.google.com/app/apikey)
   - `GEMINI_MODEL` = `gemini-flash-latest` (opsional)
5. Deploy!

> **Penting**: Netlify Functions hanya jalan jika deploy lewat **Git (repo terhubung ke Netlify)** atau
> `netlify deploy --build --prod` dari root project. Upload folder `dist` (drag-and-drop) atau hosting
> statis seperti GitHub Pages **tidak** menjalankan function, sehingga `/.netlify/functions/chat` akan 404.

File `netlify.toml` sudah mengatur:
- Functions directory: `netlify/functions`
- SPA redirect (`/*` → `/index.html`)
- API redirect (`/api/*` → `/.netlify/functions/*`)

## Struktur ChatBot

```
src/components/ChatBot.jsx      # UI Component (floating button, chat window)
api/chat.js                     # Vercel Function (proxy ke Gemini API)
netlify/functions/chat.mjs      # Netlify Function (alternatif, endpoint sama: /api/chat)
shared/systemPrompt.js          # Knowledge base & kepribadian bot
vercel.json                     # Batas waktu function di Vercel
netlify.toml                    # Netlify config (build, functions, redirects)
.env.example                    # Template env vars
```

## Deploy ke Vercel (chatbot ikut jalan)

1. Vercel → project → **Settings → Git → Production Branch**: pilih `source` (branch berisi source code).
2. **Settings → Build & Development**: Framework **Vite**, Build command `npm run build`, Output `dist`.
3. **Settings → Environment Variables**: tambahkan `GEMINI_API_KEY` (dan opsional `GEMINI_MODEL`). Jangan isi `VITE_CHAT_API_URL`.
4. Redeploy. Chatbot memanggil `/api/chat` di domain yang sama, tanpa CORS.
