export type CountryHeroImage = {
  src: string;
  alt: string;
  /** Tailwind object-position utility value for responsive crop tuning */
  objectPosition: string;
};

const COUNTRY_HERO_IMAGES: Record<string, CountryHeroImage> = {
  portugal: {
    src: "/images/countries/portugal.jpg",
    alt: "Lisbon hillside rooftops and the Tagus River under soft morning light, Portugal",
    objectPosition: "70% center",
  },
  spain: {
    src: "/images/countries/spain.jpg",
    alt: "Barcelona cityscape with Mediterranean light and distinctive urban architecture, Spain",
    objectPosition: "72% center",
  },
  uae: {
    src: "/images/countries/uae.jpg",
    alt: "Dubai skyline and waterfront across calm Gulf waters at golden hour, UAE",
    objectPosition: "75% center",
  },
  thailand: {
    src: "/images/countries/thailand.jpg",
    alt: "Bangkok skyline with temple spires and the Chao Phraya River at dusk, Thailand",
    objectPosition: "70% center",
  },
  estonia: {
    src: "/images/countries/estonia.jpg",
    alt: "Tallinn old town rooftops and Baltic Sea harbor in soft Nordic daylight, Estonia",
    objectPosition: "68% center",
  },
  germany: {
    src: "/images/countries/germany.jpg",
    alt: "Berlin riverfront with modern and historic architecture under overcast light, Germany",
    objectPosition: "72% center",
  },
  italy: {
    src: "/images/countries/italy.jpg",
    alt: "Florence riverfront with terracotta rooftops and Tuscan hills, Italy",
    objectPosition: "70% center",
  },
  greece: {
    src: "/images/countries/greece.jpg",
    alt: "Athens Acropolis viewed across urban rooftops with Aegean light, Greece",
    objectPosition: "72% center",
  },
  malta: {
    src: "/images/countries/malta.jpg",
    alt: "Valletta limestone bastions and Grand Harbour in warm Mediterranean light, Malta",
    objectPosition: "70% center",
  },
  netherlands: {
    src: "/images/countries/netherlands.jpg",
    alt: "Amsterdam canal houses and waterways under soft Dutch sky, Netherlands",
    objectPosition: "68% center",
  },
  croatia: {
    src: "/images/countries/croatia.jpg",
    alt: "Dubrovnik old town walls and Adriatic coastline in clear daylight, Croatia",
    objectPosition: "75% center",
  },
  "czech-republic": {
    src: "/images/countries/czech-republic.jpg",
    alt: "Prague historic rooftops and river bridges in gentle morning light, Czech Republic",
    objectPosition: "70% center",
  },
  hungary: {
    src: "/images/countries/hungary.jpg",
    alt: "Budapest Parliament and Danube riverfront at blue hour, Hungary",
    objectPosition: "72% center",
  },
  romania: {
    src: "/images/countries/romania.jpg",
    alt: "Bucharest boulevard with eclectic architecture and tree-lined streets, Romania",
    objectPosition: "70% center",
  },
  cyprus: {
    src: "/images/countries/cyprus.jpg",
    alt: "Limassol Mediterranean coastline with palm-lined promenade, Cyprus",
    objectPosition: "72% center",
  },
  france: {
    src: "/images/countries/france.jpg",
    alt: "Paris Haussmann rooftops and Seine riverfront in soft editorial light, France",
    objectPosition: "70% center",
  },
  ireland: {
    src: "/images/countries/ireland.jpg",
    alt: "Dublin Georgian streetscape and coastal green hills under cloudy Irish light, Ireland",
    objectPosition: "68% center",
  },
  uk: {
    src: "/images/countries/uk.jpg",
    alt: "London Thames riverfront with Westminster skyline in muted editorial light, United Kingdom",
    objectPosition: "72% center",
  },
  canada: {
    src: "/images/countries/canada.jpg",
    alt: "Vancouver harbor with mountains and glass towers in crisp Pacific light, Canada",
    objectPosition: "70% center",
  },
  australia: {
    src: "/images/countries/australia.jpg",
    alt: "Sydney Harbour with Opera House sails and waterfront in golden afternoon light, Australia",
    objectPosition: "75% center",
  },
  "new-zealand": {
    src: "/images/countries/new-zealand.jpg",
    alt: "Auckland harbor with volcanic hills and sailboats under clear sky, New Zealand",
    objectPosition: "70% center",
  },
  singapore: {
    src: "/images/countries/singapore.jpg",
    alt: "Singapore Marina Bay skyline and tropical waterfront gardens at dusk, Singapore",
    objectPosition: "72% center",
  },
};

export function getCountryHeroImage(slug: string): CountryHeroImage | null {
  return COUNTRY_HERO_IMAGES[slug] ?? null;
}
