import Link from "next/link";

const DEFAULT_RECOVERY_LINKS = [
  { href: "/countries", label: "Country directory" },
  { href: "/visas", label: "Visa program directory" },
  { href: "/compare", label: "Compare countries" },
  { href: "/guides", label: "Guides & playbooks" },
  { href: "/tools", label: "Planning tools" },
] as const;

type ErrorRecoveryLinksProps = {
  links?: { href: string; label: string }[];
};

export function ErrorRecoveryLinks({
  links = [...DEFAULT_RECOVERY_LINKS],
}: ErrorRecoveryLinksProps) {
  return (
    <div className="surface-muted mt-12 w-full max-w-lg p-6 text-left">
      <p className="text-sm font-medium text-navy">You might also try</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="link-action text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
