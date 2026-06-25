export const PRIMARY_NAV_LINKS = [
  { href: "/countries", label: "Countries" },
  { href: "/visas", label: "Visas" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/guides", label: "Guides" },
] as const;

export const FOOTER_LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { href: "/countries", label: "Countries" },
      { href: "/visas", label: "Visa programs" },
      { href: "/compare", label: "Compare" },
      { href: "/tools", label: "Tools" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/countries", label: "Country directory" },
      { href: "/visas", label: "Visa directory" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/about", label: "About" },
      { href: "/editorial-policy", label: "Editorial policy" },
      { href: "/methodology", label: "Methodology" },
      { href: "/sources", label: "Sources" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
