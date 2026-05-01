import Link from "next/link";

export default function NotFound() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/publications", label: "Publications" },
    { href: "/resources", label: "Resources" },
    { href: "/beyond", label: "Beyond" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <section className="px-4 py-16 md:py-24 max-w-3xl mx-auto">
      <div className="surface-accent px-6 py-10 text-center md:px-10 md:py-14">
        <p className="eyebrow mb-3">404</p>
        <h1 className="display text-4xl font-bold tracking-tight mb-4 md:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mb-8 max-w-prose text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
          The page you tried to visit does not exist or has moved. Try one of the main sections
          below.
        </p>
        <ul className="flex flex-wrap justify-center gap-2 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
