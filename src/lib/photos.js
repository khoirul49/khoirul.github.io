// Foto bersifat opsional. Taruh di src/assets/photos/ dengan nama:
//   profile  → foto utama (dipakai di mana-mana bila foto lain belum ada)
//   front    → foto hero beranda          me1…me6 → foto halaman About
//   about    → foto bagian About di beranda   setup → foto bagian Contact di beranda
//   projects → foto bagian Projects di beranda
// Gambar proyek: src/assets/projects/<slug>.jpg (+ <slug>-1.jpg, <slug>-2.jpg, … untuk detail).
const photoFiles = import.meta.glob("../assets/photos/*.{webp,jpg,jpeg,png}", {
  eager: true,
  import: "default",
});
const projectFiles = import.meta.glob("../assets/projects/*.{webp,jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

const byName = (files) =>
  Object.fromEntries(
    Object.entries(files).map(([path, url]) => [
      path.split("/").pop().replace(/\.[^.]+$/, "").toLowerCase(),
      url,
    ]),
  );

export const photos = byName(photoFiles);
export const projectImages = byName(projectFiles);

// Ambil foto pertama yang ada; urutan = prioritas.
export const pickPhoto = (...names) => {
  for (const n of names) if (photos[n]) return photos[n];
  return undefined;
};

// Semua gambar sebuah proyek: <slug>, lalu <slug>-1, <slug>-2, …
export const imagesOf = (slug) => {
  const list = [];
  if (projectImages[slug]) list.push(projectImages[slug]);
  Object.keys(projectImages)
    .filter((k) => new RegExp(`^${slug}-\\d+$`).test(k))
    .sort((a, b) => parseInt(a.split("-").pop()) - parseInt(b.split("-").pop()))
    .forEach((k) => list.push(projectImages[k]));
  return list;
};
