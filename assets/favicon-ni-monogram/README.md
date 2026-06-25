# NI Monogram Favicon — Pending Approval

**Status:** Wired into live app (`icon.tsx`, `apple-icon.tsx`, `brand-icon.tsx`). Review SVGs stay in sync.

## Files

| File | Purpose |
|------|---------|
| `icon.svg` | Primary mark — navy `#042c53`, white NI |
| `icon-dark-chrome.svg` | Dark tab variant — navy `#0a3d6e` |
| `safari-pinned-tab.svg` | Monochrome SVG for macOS pinned tabs |
| `preview.html` | Local browser preview (open in browser) |

## Brand specs

- Background: `#042c53` (navy), 22% corner radius
- Mark: geometric sans **NI**, no serif, no accent dot
- Type weight: equivalent to bold sans at 32px canvas

## After approval

Implementation will update:

- `src/app/icon.tsx`
- `src/app/apple-icon.tsx`
- `src/lib/brand-icon.tsx`
- `src/app/manifest.ts` (if icon paths change)

No other assets removed until you confirm.
