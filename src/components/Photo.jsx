// Gambar pengganti next/image. Tanpa `src`, hanya kotak abu-abu (latar wadahnya) yang tampil.
export default function Photo({ src, alt = "", className = "", fill = false, ...rest }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={`${fill ? "absolute inset-0 w-full h-full" : ""} ${className}`}
      {...rest}
    />
  );
}
