import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-4 py-16 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-[var(--color-fg-muted)] mb-8">
        The page you tried to visit doesn't exist (or moved). Try one of the sections below.
      </p>
      <ul className="flex flex-wrap justify-center gap-4 text-sm">
        <li>
          <Link href="/" className="underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/projects" className="underline">
            Projects
          </Link>
        </li>
        <li>
          <Link href="/publications" className="underline">
            Publications
          </Link>
        </li>
        <li>
          <Link href="/resources" className="underline">
            Resources
          </Link>
        </li>
        <li>
          <Link href="/hobbies" className="underline">
            Hobbies
          </Link>
        </li>
        <li>
          <Link href="/contact" className="underline">
            Contact
          </Link>
        </li>
      </ul>
    </section>
  );
}
