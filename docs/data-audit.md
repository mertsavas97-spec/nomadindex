# NomadIndex Data Quality Report

**Audit date:** 2026-06-23  
**Scope:** 22 countries, 61 visa programs  
**Goal:** Internal consistency for launch — correct income periods, null unknowns, aligned country flags, metadata completeness.

---

## Executive summary

| Metric | Before | After |
|--------|--------|-------|
| Programs with `incomePeriod` | 0 | 61 |
| Programs with `lastReviewed` | 0 | 61 |
| Programs with explicit `sourceConfidence` | 0 | 61 |
| Annual income stored as monthly (critical) | 2 | 0 |
| Placeholder programs with invented fees/times | 23 | 0 |
| Country boolean flags mismatched vs program types | 14 | 0 |

**Critical fixes:** Thailand LTR (annual income), Italy Elective (annual income), Thailand DTV (removed unverified income/fee/time), Estonia e-Residency (reclassified verification), 14 country flags synced to tracked program types.

---

## Schema changes

### `VisaProgram` (`src/types/nomadindex.ts`)

| Field | Change |
|-------|--------|
| `incomePeriod` | **Added** — `"monthly" \| "annual" \| null` |
| `lastReviewed` | **Added** — ISO date of last internal audit |
| `sourceConfidence` | **Required** — was optional; now explicit on every record |
| `processingTime` | **Nullable** — `null` when unknown |

### `Country`

| Field | Change |
|-------|--------|
| `lastReviewed` | **Added** on all 22 countries |

### Code updates

- `src/lib/income.ts` — monthly equivalent helper for annual thresholds
- `src/lib/format.ts`, `src/lib/tools.ts`, `src/data/comparisons.ts` — use monthly equivalents for comparisons/tools
- UI displays `null` processing times as “Not specified”

---

## Priority program reviews

### Thailand LTR (`thailand-ltr`)

| Field | Before | After | Reason |
|-------|--------|-------|--------|
| `minIncome` | 80000 USD (treated as monthly) | 80000 USD | Value retained |
| `incomePeriod` | *(missing)* | `annual` | BOI LTR remote-worker category cites ~$80k/year |
| `summary` | Generic | Clarifies annual threshold by category | Accuracy |
| `sourceConfidence` | *(missing)* | `government` | ltr.boi.go.th |

**Monthly equivalent for tools:** ~$6,667/mo (estimate).

### Thailand DTV (`thailand-destination-visa`)

| Field | Before | After | Reason |
|-------|--------|-------|--------|
| `minIncome` | 3333 USD | `null` | Unverified; requirements set by consulate |
| `applicationFee` | 350 | `null` | Unverified |
| `processingTime` | "2–4 weeks" | `null` | Unverified |
| `summary` | Generic | Notes consulate-specific requirements | Accuracy |

### Italy Elective Residency (`italy-elective-residency`)

| Field | Before | After | Reason |
|-------|--------|-------|--------|
| `minIncome` | 31000 EUR (treated as monthly) | 31000 EUR | Value retained |
| `incomePeriod` | *(missing)* | `annual` | Consulates assess annual passive income |
| `summary` | Generic | Clarifies ~€31k/year figure | Accuracy |

**Monthly equivalent for tools:** ~€2,583/mo (estimate).

### Estonia e-Residency (`estonia-e-residency`)

| Field | Before | After | Reason |
|-------|--------|-------|--------|
| `type` | `other` | `other` (unchanged) | Correct — not immigration |
| `verificationStatus` | `verified` | `in-progress` | Product fee verified; not a visa pathway |
| `summary` | Generic | Explicitly not a residence permit | Prevent misclassification |
| `sourceConfidence` | *(missing)* | `official` | e-resident.gov.ee |

---

## Country flag corrections

Flags now reflect **tracked program types** in `visa-programs.ts` (not general country policy).

| Country | Field | Before | After |
|---------|-------|--------|-------|
| `portugal` | `hasFreelancerVisa` | true | **false** (no `freelancer`-type program) |
| `uae` | `hasStartupVisa` | true | **false** |
| `thailand` | `hasDigitalNomadVisa` | false | **true** (DTV) |
| `thailand` | `hasFreelancerVisa` | true | **false** |
| `thailand` | `hasStartupVisa` | true | **false** |
| `estonia` | `hasFreelancerVisa` | true | **false** |
| `germany` | `hasStartupVisa` | true | **false** |
| `italy` | `hasFreelancerVisa` | true | **false** |
| `greece` | `hasFreelancerVisa` | true | **false** |
| `malta` | `hasFreelancerVisa` | true | **false** |
| `hungary` | `hasFreelancerVisa` | true | **false** |
| `cyprus` | `hasFreelancerVisa` | true | **false** |
| `france` | `hasFreelancerVisa` | true | **false** |
| `ireland` | `hasFreelancerVisa` | true | **false** |
| `ireland` | `hasStartupVisa` | true | **false** |
| `uk` | `hasFreelancerVisa` | true | **false** |
| `singapore` | `hasStartupVisa` | true | **false** |

All 22 countries: added `lastReviewed: "2026-06-23"`.  
`thailand` summary updated to mention DTV.

---

## Placeholder programs — nullified unknowns

All programs with `verificationStatus: "placeholder"` had unverified numeric fields set to `null`:

| Slug | `applicationFee` | `processingTime` | `minIncome` |
|------|------------------|------------------|-------------|
| `portugal-startup-visa` | → null | → null | already null |
| `spain-startup-visa` | → null | → null | already null |
| `spain-freelancer` | → null | → null | already null |
| `uae-freelancer-permit` | → null | → null | already null |
| `thailand-smart-visa` | → null | → null | already null |
| `thailand-elite` | → null | → null | already null |
| `germany-opportunity-card` | → null | → null | already null |
| `greece-financial-independence` | → null | → null | **→ null** (was 3500) |
| `malta-global-residence` | → null | → null | already null |
| `malta-startup-visa` | → null | → null | already null |
| `netherlands-startup` | → null | → null | already null |
| `croatia-temporary-stay` | → null | → null | already null |
| `czech-startup` | → null | → null | already null |
| `hungary-guest-investor` | → null | → null | already null |
| `romania-freelancer` | → null | → null | already null |
| `cyprus-startup` | → null | → null | already null |
| `france-french-tech-visa` | → null | → null | already null |
| `ireland-stamp-0` | → null | → null | **→ null** (was 4167) |
| `canada-self-employed` | → null | → null | already null |
| `canada-open-work-permit` | → null | → null | already null |
| `australia-business-innovation` | → null | → null | already null |
| `new-zealand-entrepreneur` | → null | → null | already null |
| `singapore-tech-pass` | → null | → null | already null |
| `italy-startup-visa` | → null | → null | already null |

---

## All modified visa program records

Every program received: `incomePeriod`, `lastReviewed: "2026-06-23"`, `sourceConfidence`.

### Metadata-only (no value changes beyond new fields)

`portugal-d7`, `portugal-digital-nomad`, `portugal-golden-visa`, `spain-digital-nomad`, `spain-non-lucrative`, `uae-remote-work`, `uae-golden-visa`, `estonia-digital-nomad`, `estonia-startup-visa`, `germany-freelancer`, `germany-eu-blue-card`, `italy-digital-nomad`, `greece-digital-nomad`, `greece-golden-visa`, `malta-nomad-residence`, `netherlands-self-employed`, `netherlands-highly-skilled-migrant`, `croatia-digital-nomad`, `czech-freelancer`, `hungary-white-card`, `romania-digital-nomad`, `cyprus-digital-nomad`, `france-talent-passport`, `france-visitor-visa`, `ireland-critical-skills`, `uk-innovator-founder`, `uk-global-talent`, `uk-self-sponsorship`, `canada-startup-visa`, `australia-skilled-independent`, `australia-working-holiday`, `new-zealand-skilled-migrant`, `singapore-employment-pass`

### Value + metadata changes

| Slug | Changes |
|------|---------|
| `portugal-startup-visa` | `applicationFee`, `processingTime` → null |
| `spain-startup-visa` | `applicationFee`, `processingTime` → null |
| `spain-freelancer` | `applicationFee`, `processingTime` → null |
| `uae-freelancer-permit` | `applicationFee`, `processingTime` → null |
| `thailand-ltr` | `incomePeriod: annual`, summary updated |
| `thailand-smart-visa` | `applicationFee`, `processingTime` → null |
| `thailand-elite` | `applicationFee`, `processingTime` → null, summary updated |
| `thailand-destination-visa` | `minIncome`, `applicationFee`, `processingTime` → null, summary updated |
| `estonia-e-residency` | `verificationStatus` → in-progress, summary updated, `sourceConfidence: official` |
| `germany-opportunity-card` | `applicationFee`, `processingTime` → null |
| `italy-elective-residency` | `incomePeriod: annual`, summary updated |
| `italy-startup-visa` | `applicationFee`, `processingTime` → null |
| `greece-financial-independence` | `minIncome`, `applicationFee`, `processingTime` → null |
| `malta-global-residence` | `applicationFee`, `processingTime` → null |
| `malta-startup-visa` | `applicationFee`, `processingTime` → null |
| `netherlands-startup` | `applicationFee`, `processingTime` → null |
| `croatia-temporary-stay` | `applicationFee`, `processingTime` → null |
| `czech-startup` | `applicationFee`, `processingTime` → null |
| `hungary-guest-investor` | `applicationFee`, `processingTime` → null |
| `romania-freelancer` | `applicationFee`, `processingTime` → null |
| `cyprus-startup` | `applicationFee`, `processingTime` → null |
| `france-french-tech-visa` | `applicationFee`, `processingTime` → null |
| `ireland-stamp-0` | `minIncome`, `applicationFee`, `processingTime` → null |
| `canada-self-employed` | `applicationFee`, `processingTime` → null |
| `canada-open-work-permit` | `applicationFee`, `processingTime` → null |
| `australia-business-innovation` | `applicationFee`, `processingTime` → null |
| `new-zealand-entrepreneur` | `applicationFee`, `processingTime` → null |
| `singapore-tech-pass` | `applicationFee`, `processingTime` → null |

---

## Remaining known gaps (not blocking consistency)

1. **In-progress programs** — 35 programs retain estimated fees/times pending official verification.
2. **Thailand Elite** — membership pricing stored separately from visa fees; no fee field populated.
3. **e-Residency** — listed in visa directory as `type: other`; consider future UX filter to exclude non-immigration programs.
4. **Static FX in tools** — unchanged; documented in methodology.
5. **External verification** — this audit did not re-check government websites; values marked `in-progress` still need source confirmation.

---

## Files modified

| File | Purpose |
|------|---------|
| `src/types/nomadindex.ts` | Schema: `incomePeriod`, `lastReviewed`, nullable `processingTime`, required `sourceConfidence` |
| `src/data/countries.ts` | Country flags, `lastReviewed`, Thailand summary |
| `src/data/visa-programs.ts` | All program audit fixes |
| `src/data/visa-text-fields.ts` | Summary/taxNotes reference (text restoration) |
| `src/lib/income.ts` | Monthly equivalent helper |
| `src/lib/format.ts` | Income period display |
| `src/lib/tools.ts` | Tool calculations use monthly equivalents |
| `src/data/comparisons.ts` | Compare ranges use monthly equivalents |
| `src/lib/seo.ts` | FAQ income wording |
| `src/app/visas/[slug]/page.tsx` | Null processing time display |
| `src/components/visa-program-card.tsx` | Null processing time display |
| `src/components/tools/*` | Monthly income in calculators |
| `scripts/patch-data-audit.mjs` | Batch audit patch |
| `scripts/merge-visa-text.mjs` | Text field merge utility |

---

## Re-run audit

```bash
node scripts/patch-data-audit.mjs   # structural patch (use with care)
node scripts/merge-visa-text.mjs    # restore summaries from visa-text-fields.ts
npm run build                       # verify types and static generation
```
