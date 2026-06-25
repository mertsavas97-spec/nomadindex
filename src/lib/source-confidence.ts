import type { SourceConfidence, VerificationStatus, VisaProgram } from "@/types/nomadindex";

const GOVERNMENT_HOST_PATTERNS = [
  /\.gov(\.[a-z]{2})?$/i,
  /\.gov\./i,
  /^gov\./i,
  /\.gob\./i,
  /\.go\.th$/i,
  /\.gouv\./i,
  /immigration/i,
  /homeaffairs/i,
  /esteri\.it/i,
  /migrationsverket/i,
  /ind\.nl/i,
  /boi\.go\.th/i,
  /mbr\.gov/i,
  /uscis\.gov/i,
  /canada\.ca/i,
  /homeoffice\.gov/i,
  /immi\.gov/i,
];

function isGovernmentHost(hostname: string): boolean {
  return GOVERNMENT_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

export function getSourceConfidenceForUrl(
  url: string,
  verificationStatus?: VerificationStatus
): SourceConfidence {
  if (verificationStatus === "placeholder") {
    return "estimated";
  }

  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return verificationStatus === "verified" ? "secondary" : "estimated";
  }

  const isGov = isGovernmentHost(hostname);

  if (verificationStatus === "verified" && isGov) {
    return "official";
  }

  if (isGov) {
    return "government";
  }

  if (verificationStatus === "in-progress") {
    return "secondary";
  }

  if (verificationStatus === "verified") {
    return "secondary";
  }

  return "estimated";
}

export function getSourceConfidence(program: VisaProgram): SourceConfidence {
  if (program.sourceConfidence) {
    return program.sourceConfidence;
  }

  return getSourceConfidenceForUrl(
    program.officialSourceUrl,
    program.verificationStatus
  );
}

export function getWorstSourceConfidence(
  levels: SourceConfidence[]
): SourceConfidence {
  const rank: Record<SourceConfidence, number> = {
    estimated: 0,
    secondary: 1,
    government: 2,
    official: 3,
  };

  return levels.reduce((worst, level) =>
    rank[level] < rank[worst] ? level : worst
  );
}

export function getSourceConfidenceForPrograms(
  programs: VisaProgram[],
  url: string
): SourceConfidence {
  const matching = programs.filter((program) => program.officialSourceUrl === url);

  if (matching.length === 0) {
    return getSourceConfidenceForUrl(url);
  }

  return getWorstSourceConfidence(matching.map(getSourceConfidence));
}
