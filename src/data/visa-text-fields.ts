export const VISA_TEXT_FIELDS: Record<string, { summary: string; taxNotes: string }> = {
  "portugal-d7": {
    summary:
      "Residence visa for applicants with stable passive income such as pensions, dividends or rental yields — not salaried remote employment.",
    taxNotes:
      "NHR regime largely phased out for new applicants; standard Portuguese tax rules apply. Verify current NHR successor programs.",
  },
  "portugal-digital-nomad": {
    summary:
      "Temporary stay visa (D8) for remote workers employed or contracted outside Portugal. Minimum income is four times the Portuguese minimum wage (€3,680/mo in 2026).",
    taxNotes:
      "Tax residency may trigger after 183 days; foreign-sourced remote income treatment depends on tax residency status.",
  },
  "portugal-golden-visa": {
    summary:
      "Residence permit via qualifying investment routes; real estate path largely discontinued.",
    taxNotes:
      "Minimal stay requirements apply; investment thresholds vary by route.",
  },
  "portugal-startup-visa": {
    summary:
      "Residence for founders accepted into certified Portuguese incubators.",
    taxNotes:
      "Startup income taxed under standard corporate and personal rules.",
  },
  "spain-digital-nomad": {
    summary:
      "Residence authorization for remote workers with foreign employers or clients. Minimum income is 200% of the Spanish minimum interprofessional wage (~€2,763/mo in 2025).",
    taxNotes:
      "Beckham Law may apply for qualifying new residents; verify eligibility with a tax advisor.",
  },
  "spain-non-lucrative": {
    summary:
      "Long-stay visa for those with sufficient savings or passive income without local employment.",
    taxNotes:
      "Worldwide income may be taxable after becoming tax resident.",
  },
  "spain-startup-visa": {
    summary:
      "Residence for innovative business projects with economic interest for Spain.",
    taxNotes:
      "Corporate tax incentives may apply in certain regions.",
  },
  "spain-freelancer": {
    summary:
      "Residence via self-employment registration for freelancers and independent professionals.",
    taxNotes:
      "Social security contributions required from month one of activity.",
  },
  "uae-remote-work": {
    summary:
      "One-year virtual work residence permit for employees and self-employed remote workers.",
    taxNotes:
      "No personal income tax for most individuals; verify free-zone vs mainland rules.",
  },
  "uae-golden-visa": {
    summary:
      "Long-term residence for investors, entrepreneurs, skilled professionals and exceptional talent.",
    taxNotes:
      "No personal income tax; corporate rules vary by emirate and zone.",
  },
  "uae-freelancer-permit": {
    summary:
      "Free-zone freelancer license allowing independent work for international clients.",
    taxNotes:
      "Issued via free zones; mainland freelance rules differ.",
  },
  "thailand-ltr": {
    summary:
      "10-year visa for wealthy pensioners, remote workers and highly skilled professionals. Income thresholds vary by LTR category (often cited around $80,000 USD per year for remote workers).",
    taxNotes:
      "Foreign-sourced income tax exemption may apply for qualifying remote workers; verify BOI guidance.",
  },
  "thailand-smart-visa": {
    summary:
      "Four-year visa for executives, experts and entrepreneurs in targeted industries.",
    taxNotes:
      "Tax incentives may apply in qualifying sectors.",
  },
  "thailand-elite": {
    summary:
      "Paid membership program offering long-stay privileges. Membership fees are separate from visa application costs and do not grant work authorization on their own.",
    taxNotes:
      "Membership fee-based; separate work authorization required for employment.",
  },
  "thailand-destination-visa": {
    summary:
      "Five-year multiple-entry visa for remote workers and soft-power activities. Financial proof requires at least 500,000 THB in savings (typically 3 months of bank statements) — not a monthly income threshold.",
    taxNotes:
      "Remote work for foreign employers only; local employment requires separate work authorization.",
  },
  "estonia-digital-nomad": {
    summary:
      "Short-stay visa for location-independent workers with foreign income sources.",
    taxNotes:
      "183-day rule applies for tax residency; e-Residency does not grant immigration rights.",
  },
  "estonia-e-residency": {
    summary:
      "Digital identity for EU company formation and online business. Not a visa, residence permit or path to live in Estonia.",
    taxNotes:
      "Enables EU company setup; physical residency requires separate permits.",
  },
  "estonia-startup-visa": {
    summary:
      "Temporary residence for founders building startups accepted by certified commissaries.",
    taxNotes:
      "Standard Estonian corporate and personal tax rates apply.",
  },
  "germany-freelancer": {
    summary:
      "Residence for self-employed professionals with viable freelance business plans in Germany.",
    taxNotes:
      "Comprehensive social contributions and income tax apply.",
  },
  "germany-opportunity-card": {
    summary:
      "Points-based job-seeker permit for skilled workers seeking employment in Germany.",
    taxNotes:
      "Employment required to transition to work residence permit.",
  },
  "germany-eu-blue-card": {
    summary:
      "Work and residence permit for highly qualified non-EU professionals with job offers.",
    taxNotes:
      "Salary threshold updated annually; lower threshold for shortage occupations.",
  },
  "italy-digital-nomad": {
    summary:
      "Residence permit for highly skilled remote workers with foreign employers or clients.",
    taxNotes:
      "Flat-tax regime may be available for new residents; verify current thresholds.",
  },
  "italy-elective-residency": {
    summary:
      "Visa for those with stable passive income who will not work in Italy. Consulates typically assess annual passive income (often cited around €31,000/year for a single applicant).",
    taxNotes:
      "Local employment prohibited; worldwide income reporting may apply.",
  },
  "italy-startup-visa": {
    summary:
      "Simplified procedure for non-EU founders of innovative startups.",
    taxNotes:
      "Startup tax incentives available in qualifying cases.",
  },
  "greece-digital-nomad": {
    summary:
      "Residence permit for remote workers and self-employed professionals with foreign income.",
    taxNotes:
      "50% income tax discount may apply for qualifying new tax residents; verify eligibility.",
  },
  "greece-financial-independence": {
    summary:
      "Residence for individuals with sufficient stable income from abroad without local work.",
    taxNotes:
      "Foreign pension and investment income treatment varies.",
  },
  "greece-golden-visa": {
    summary:
      "Residence permit via qualifying real estate or investment routes.",
    taxNotes:
      "Investment thresholds updated in recent reforms; verify current minimums.",
  },
  "malta-nomad-residence": {
    summary:
      "One-year permit for remote workers employed or operating businesses abroad.",
    taxNotes:
      "10% nomad tax rate may apply for qualifying applicants.",
  },
  "malta-global-residence": {
    summary:
      "Tax residence for retirees and individuals with foreign-source income.",
    taxNotes:
      "15% flat tax on remitted foreign income for qualifying applicants.",
  },
  "malta-startup-visa": {
    summary:
      "Residence for founders of innovative startups meeting government criteria.",
    taxNotes:
      "Startup tax credits may be available.",
  },
  "netherlands-self-employed": {
    summary:
      "Permit for freelancers and entrepreneurs with points-based business assessments.",
    taxNotes:
      "30% ruling may apply for qualifying expat hires; freelancers taxed on worldwide income.",
  },
  "netherlands-startup": {
    summary:
      "One-year residence for founders partnering with approved Dutch facilitators.",
    taxNotes:
      "Must transition to self-employed or work permit after initial period.",
  },
  "netherlands-highly-skilled-migrant": {
    summary:
      "Work permit for employees of recognized sponsors meeting salary thresholds.",
    taxNotes:
      "30% ruling may reduce effective tax for qualifying expats.",
  },
  "croatia-digital-nomad": {
    summary:
      "Temporary stay for remote workers employed or self-employed outside Croatia.",
    taxNotes:
      "Foreign income may be exempt for nomad permit holders; verify current rules.",
  },
  "croatia-temporary-stay": {
    summary:
      "General temporary stay route that may cover remote workers depending on circumstances.",
    taxNotes:
      "Tax treatment depends on stay duration and income source.",
  },
  "czech-freelancer": {
    summary:
      "Trade license route for self-employed professionals with local business registration.",
    taxNotes:
      "Flat-rate or standard tax regimes available for self-employed.",
  },
  "czech-startup": {
    summary:
      "Employee card pathway for founders employed by qualifying Czech startups.",
    taxNotes:
      "Standard Czech income and social contribution rules apply.",
  },
  "hungary-white-card": {
    summary:
      "Residence permit for remote workers with income from abroad.",
    taxNotes:
      "Foreign-sourced income may be exempt; verify with Hungarian tax authority.",
  },
  "hungary-guest-investor": {
    summary:
      "Residence via qualifying investment in approved Hungarian funds.",
    taxNotes:
      "Investment thresholds subject to recent legislative changes.",
  },
  "romania-digital-nomad": {
    summary:
      "Long-stay visa for remote employees and freelancers with foreign income.",
    taxNotes:
      "Foreign income tax treatment depends on tax residency status.",
  },
  "romania-freelancer": {
    summary:
      "Residence for registered self-employed professionals operating in Romania.",
    taxNotes:
      "Micro-enterprise tax regime may apply for small businesses.",
  },
  "cyprus-digital-nomad": {
    summary:
      "Residence permit for remote workers employed or self-employed outside Cyprus.",
    taxNotes:
      "Non-dom tax regime may benefit qualifying new residents; capped at 500 permits.",
  },
  "cyprus-startup": {
    summary:
      "Facilitated residence for founders of innovative startups in Cyprus.",
    taxNotes:
      "IP box and corporate tax incentives available for qualifying companies.",
  },
  "france-talent-passport": {
    summary:
      "Multi-year permit for skilled employees, researchers, artists and business creators.",
    taxNotes:
      "Standard French progressive income tax applies.",
  },
  "france-visitor-visa": {
    summary:
      "Long-stay visitor visa for financially self-sufficient individuals not engaging in paid work in France. Income assessed against monthly net minimum wage benchmarks at consulate discretion.",
    taxNotes:
      "Sufficient savings or income must be demonstrated; local work prohibited.",
  },
  "france-french-tech-visa": {
    summary:
      "Fast-track residence for founders, employees and investors in French tech ecosystems.",
    taxNotes:
      "Facilitated procedure via certified French Tech partners.",
  },
  "ireland-critical-skills": {
    summary:
      "Work permit for highly skilled professionals in occupations with labour shortages.",
    taxNotes:
      "Standard Irish income tax and USC apply.",
  },
  "ireland-stamp-0": {
    summary:
      "Permission to remain for persons of independent means without recourse to public funds.",
    taxNotes:
      "Must demonstrate €50k+ annual income; no employment permitted.",
  },
  "uk-innovator-founder": {
    summary:
      "Visa for experienced founders with innovative, viable and scalable business ideas.",
    taxNotes:
      "UK income tax applies to UK-sourced income; endorsement required.",
  },
  "uk-global-talent": {
    summary:
      "Visa for leaders or potential leaders in academia, research, arts and digital technology.",
    taxNotes:
      "Endorsement from approved body required.",
  },
  "uk-skilled-worker": {
    summary:
      "Work visa for sponsored employees with eligible job offers from licensed UK employers.",
    taxNotes:
      "Salary threshold varies by occupation; health surcharge applies.",
  },
  "canada-self-employed": {
    summary:
      "Permanent residence for self-employed persons in cultural activities or athletics.",
    taxNotes:
      "Federal and provincial tax obligations apply upon residency.",
  },
  "canada-startup-visa": {
    summary:
      "Permanent residence for entrepreneurs with support from designated organizations.",
    taxNotes:
      "Settlement funds must be demonstrated.",
  },
  "canada-open-work-permit": {
    summary:
      "Temporary open work authorization for youth mobility and recent graduates.",
    taxNotes:
      "Not a direct path to permanent residence; may support CRS points.",
  },
  "australia-skilled-independent": {
    summary:
      "Points-tested permanent visa for skilled workers without employer sponsorship.",
    taxNotes:
      "Australian tax residency rules apply after settlement.",
  },
  "australia-business-innovation": {
    summary:
      "Provisional visa for entrepreneurs and investors meeting business innovation criteria.",
    taxNotes:
      "Significant business or investment thresholds apply by stream.",
  },
  "australia-working-holiday": {
    summary:
      "Temporary visa for young adults to work and travel; limited eligibility by nationality.",
    taxNotes:
      "Age limits apply (typically 18–30); not a long-term nomad route.",
  },
  "new-zealand-skilled-migrant": {
    summary:
      "Points-based residence visa for skilled workers with job offers or high points.",
    taxNotes:
      "NZ tax residency after 183 days in any 12-month period.",
  },
  "new-zealand-entrepreneur": {
    summary:
      "Visa for experienced business people establishing or purchasing businesses in NZ.",
    taxNotes:
      "Minimum capital investment required; business plan assessed.",
  },
  "singapore-employment-pass": {
    summary:
      "Work pass for foreign professionals, managers and executives meeting salary thresholds.",
    taxNotes:
      "Progressive resident tax rates; COMPASS points framework applies.",
  },
  "singapore-tech-pass": {
    summary:
      "Pass for established tech entrepreneurs, leaders or technical experts.",
    taxNotes:
      "Criteria include salary history, experience and company track record.",
  },
};
