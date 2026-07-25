// Image slots managed via Admin > Image Manager.
// `key` is the storage key; `aspect` controls the crop frame ratio (W/H).
export const IMAGE_SLOTS = [
  { key: "logo", label: "Website Logo", aspect: 1 },
  { key: "hero_bg", label: "Hero Section Background", aspect: 16/9 },
  { key: "attraction_fort", label: "Ranthambore Fort attraction card", aspect: 4/3 },
  { key: "attraction_temple", label: "Trinetra Ganesh Temple attraction card", aspect: 4/3 },
  { key: "zone_1", label: "Zone 1", aspect: 4/3 },
  { key: "zone_2", label: "Zone 2", aspect: 4/3 },
  { key: "zone_3", label: "Zone 3", aspect: 4/3 },
  { key: "zone_4", label: "Zone 4", aspect: 4/3 },
  { key: "zone_5", label: "Zone 5", aspect: 4/3 },
  { key: "zone_6", label: "Zone 6", aspect: 4/3 },
  { key: "zone_7", label: "Zone 7", aspect: 4/3 },
  { key: "zone_8", label: "Zone 8", aspect: 4/3 },
  { key: "zone_9", label: "Zone 9", aspect: 4/3 },
  { key: "zone_10", label: "Zone 10", aspect: 4/3 },
  { key: "package_weekend_tiger_trail", label: "Weekend Tiger Trail Package", aspect: 4/3 },
  { key: "package_family_jungle_adventure", label: "Family Jungle Adventure Package", aspect: 4/3 },
  { key: "package_luxury_wildlife_retreat", label: "Luxury Wildlife Retreat Package", aspect: 4/3 },
  { key: "package_budget_explorer", label: "Budget Explorer Package", aspect: 4/3 },
  { key: "package_photography_safari", label: "Photography Safari Package", aspect: 4/3 },
  { key: "tatkal_bg", label: "Tatkal Section Background", aspect: 16/9 },
];

export const PACKAGE_SLOT_BY_NAME = {
  "Weekend Tiger Trail": "package_weekend_tiger_trail",
  "Family Jungle Adventure": "package_family_jungle_adventure",
  "Luxury Wildlife Retreat": "package_luxury_wildlife_retreat",
  "Budget Explorer": "package_budget_explorer",
  "Photography Safari": "package_photography_safari",
};
