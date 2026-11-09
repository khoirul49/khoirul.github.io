import { useEffect, useState } from "react";

// Router berbasis hash (#/about) supaya jalan di hosting statis tanpa konfigurasi tambahan.
const read = () => {
  const hash = window.location.hash.replace(/^#/, "");
  return hash.startsWith("/") ? hash : "/";
};

export function useRoute() {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const onChange = () => setPath(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}
