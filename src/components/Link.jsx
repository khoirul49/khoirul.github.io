// Router berbasis hash: "/about" → #/about, "#contact" (diawali #) dipakai apa adanya untuk anchor beranda.
export default function Link({ to, children, ...rest }) {
  const href = to.startsWith("#") ? to : `#${to}`;
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
