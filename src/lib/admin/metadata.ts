import type { Metadata } from "next";

export const adminRobots: Metadata["robots"] = {
  index: false,
  follow: false,
};

export function createAdminMetadata(title: string): Metadata {
  return {
    title: `${title} | NomadIndex Admin`,
    robots: adminRobots,
  };
}
