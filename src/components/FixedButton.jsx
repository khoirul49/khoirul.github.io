import Link from "./Link";

export default function FixedButton({ children, to = "/" }) {
  return (
    <Link
      to={to}
      aria-label="Go back"
      className="fixed top-2 -left-2 md:left-10 flex justify-center items-center rounded-full p-4 transition duration-300 ease-in-out z-50 transparent"
    >
      {children}
    </Link>
  );
}
