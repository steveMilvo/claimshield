export type CategoryGroup = "personal" | "commercial";

export const CATEGORIES: Record<string, { label: string; group: CategoryGroup }> = {
  // Personal
  auto: { label: "Auto / Motor", group: "personal" },
  home: { label: "Home / Property", group: "personal" },
  renters: { label: "Renters", group: "personal" },
  travel: { label: "Travel", group: "personal" },
  health: { label: "Health / Medical", group: "personal" },
  pet: { label: "Pet", group: "personal" },
  // Commercial
  business: { label: "Business / Commercial", group: "commercial" },
  restaurant: { label: "Restaurant / hospitality", group: "commercial" },
  "food-truck": { label: "Food truck", group: "commercial" },
  "food-business": { label: "Food business / catering", group: "commercial" },
  builder: { label: "Builder / Construction", group: "commercial" },
  trades: { label: "Tradies / contractor", group: "commercial" },
  "public-liability": { label: "Public liability", group: "commercial" },
  "professional-indemnity": { label: "Professional indemnity", group: "commercial" },
  "workers-comp": { label: "Workers compensation", group: "commercial" },
  "commercial-property": { label: "Commercial property", group: "commercial" },
  "commercial-motor": { label: "Commercial motor / fleet", group: "commercial" },
  "business-interruption": { label: "Business interruption", group: "commercial" },
  cyber: { label: "Cyber liability", group: "commercial" },
  farm: { label: "Farm / agricultural", group: "commercial" },
  "marine-cargo": { label: "Marine / cargo", group: "commercial" },
};

export function categoryLabel(c: string): string {
  return CATEGORIES[c]?.label ?? c;
}

export function categoryGroup(c: string): CategoryGroup {
  return CATEGORIES[c]?.group ?? "personal";
}

export function isCommercial(c: string): boolean {
  return categoryGroup(c) === "commercial";
}
