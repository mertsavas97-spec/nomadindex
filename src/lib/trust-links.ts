/** Global E-E-A-T / trust navigation links. */
export const TRUST_FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/methodology", label: "Methodology" },
  { href: "/sources", label: "Sources" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export const TRUST_RELATED_LINKS = [
  ...TRUST_FOOTER_LINKS,
  { href: "/contact", label: "Contact" },
] as const;
