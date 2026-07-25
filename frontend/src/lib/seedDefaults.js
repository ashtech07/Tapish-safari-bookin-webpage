// One-time snapshot of the Admin Panel data (logo, site images, hotel listings)
// as it existed on 2026-07-11. These are used ONLY as fallback/default values —
// every place that reads them prefers live data from the database first, and
// only falls back to these when the database has no value yet (e.g. a fresh
// deploy before the Admin Panel has been used, or a slot that was never set).
//
// The Admin Panel + database continue to work exactly as before: uploading a
// new logo, editing site images, or adding/editing/deleting hotels updates the
// database, and the site prefers that over these defaults.
//
// Do not hand-edit the asset files in `src/assets/seed/` — they are a direct
// export of what was in the database. If you want new defaults, re-export
// from the Admin Panel's data via the same process instead of editing by hand.

import logo from "@/assets/seed/images/logo.jpg";
import attractionFort from "@/assets/seed/images/attraction_fort.jpg";
import attractionTemple from "@/assets/seed/images/attraction_temple.jpg";
import zone1 from "@/assets/seed/images/zone_1.jpg";
import zone2 from "@/assets/seed/images/zone_2.jpg";
import zone8 from "@/assets/seed/images/zone_8.jpg";
import zone9 from "@/assets/seed/images/zone_9.jpg";
import zone10 from "@/assets/seed/images/zone_10.jpg";
import packageWeekendTigerTrail from "@/assets/seed/images/package_weekend_tiger_trail.jpg";
import packagePhotographySafari from "@/assets/seed/images/package_photography_safari.jpg";

export const SEED_IMAGES = {
  logo,
  attraction_fort: attractionFort,
  attraction_temple: attractionTemple,
  zone_1: zone1,
  zone_2: zone2,
  zone_8: zone8,
  zone_9: zone9,
  zone_10: zone10,
  package_weekend_tiger_trail: packageWeekendTigerTrail,
  package_photography_safari: packagePhotographySafari,
};

import tajSawai1 from "@/assets/seed/hotels/taj-sawai-ranthambore-1.jpg";
import tajSawai2 from "@/assets/seed/hotels/taj-sawai-ranthambore-2.jpg";
import sherBagh1 from "@/assets/seed/hotels/suj-n-sher-bagh-ranthambore-1.jpg";
import sherBagh2 from "@/assets/seed/hotels/suj-n-sher-bagh-ranthambore-2.jpg";
import tigerDen1 from "@/assets/seed/hotels/tiger-den-resort-1.jpg";
import tigerDen2 from "@/assets/seed/hotels/tiger-den-resort-2.jpg";
import kothi1 from "@/assets/seed/hotels/ranthambore-kothi-1.jpg";
import kothi2 from "@/assets/seed/hotels/ranthambore-kothi-2.jpg";
import khemVilas1 from "@/assets/seed/hotels/khem-vilas-ranthambore-1.jpg";
import khemVilas2 from "@/assets/seed/hotels/khem-vilas-ranthambore-2.jpg";
import tigress1 from "@/assets/seed/hotels/the-tigress-resort-1.jpg";
import tigress2 from "@/assets/seed/hotels/the-tigress-resort-2.jpg";
import baghVilla1 from "@/assets/seed/hotels/ranthambore-bagh-villa-1.jpg";
import baghVilla2 from "@/assets/seed/hotels/ranthambore-bagh-villa-2.jpg";

export const SEED_HOTELS = [
  {
    id: "d7b88508-543b-4e7b-b803-7083c6517347",
    created_at: "2026-07-11T19:46:17.578252+00:00",
    name: "Taj Sawai Ranthambore",
    stars: 5,
    distance: "5.5 Km",
    description: "Nestled in the heart of the wilderness in Ranthambore, Taj Sawai, Ranthambore is a captivating haven where lush greenery engages your senses and a symbolic red carpet gracefully unfurls to welcome you. Close to the renowned Ranthambhore National Park, our luxury hotel in Ranthambore seamlessly merges enduring charm with modern aesthetics, where crisp, contemporary lines and balanced geometric shapes create an environment for heritage, nature and allure to coexist in perfect harmony. ",
    amenities: [],
    image1: tajSawai1,
    image2: tajSawai2,
  },
  {
    id: "7619a377-33f3-47ae-b13c-5841cd0d4d12",
    created_at: "2026-07-11T19:44:57.622622+00:00",
    name: "SUJÁN Sher Bagh, Ranthambore",
    stars: 5,
    distance: "6.9 Km",
    description: "SUJÁN Sher Bagh is a from which you can explore Ranthambhore’s forest, with the mighty fort that lends its name to the reserve rising majestically at the heart of it. With ruins of palaces, cenotaphs and follies dotted around the jungle there is nowhere quite like it for a safari. Our drivers and guides have a combined experience of 150 years and counting and will interpret the landscape, its wildlife and history for you on what has been, for many, a life-changing experience.",
    amenities: [],
    image1: sherBagh1,
    image2: sherBagh2,
  },
  {
    id: "da748d3b-d7e2-4b64-a7df-ff58c1888ca1",
    created_at: "2026-07-11T19:43:32.512770+00:00",
    name: "Tiger Den Resort",
    stars: 4,
    distance: "4.9 Km",
    description: "Tiger Den Resort â€“ inspired by nature and its charismatic beauty ensures your comfort by providing ethnic interiors for you to enjoy the tranquil surroundings. Crossing the hills and the deciduous trees, close to the endless horizons, taking wheels to the heart of the pristine forest; Beast, Experience immortal bliss and behold peace in your body, mind and soul. You will really hum the famous line by Robert Frost:",
    amenities: [],
    image1: tigerDen1,
    image2: tigerDen2,
  },
  {
    id: "f1cb2602-0458-41ea-b70b-40a36ad3d6f6",
    created_at: "2026-07-11T19:41:31.263343+00:00",
    name: "Ranthambore Kothi",
    stars: 4,
    distance: "5.5 Km",
    description: "Stay at the majestic Ranthambhore Kothi to begin your journey of this historic and large home while you are in Ranthambore National Park. With 44 well-appointed, tastefully decorated rooms and a lot of privacy and interiors that will bring you back to the British era with its big size rooms and architecture, with all contemporary conveniences, set amidst rich flora and fauna, surrounded by lush greenery and comforts spread across 14,400 sq. m.",
    amenities: [],
    image1: kothi1,
    image2: kothi2,
  },
  {
    id: "c8c97c9c-3479-41f1-af12-5f2cc8f38d6d",
    created_at: "2026-07-11T19:39:05.833411+00:00",
    name: "Khem Vilas Ranthambore",
    stars: 4,
    distance: "7.1 Km",
    description: "Khem Villas is established on land we purchased in 1989. We planted indigenous trees and created small water bodies and have since converted this vast, open grassland into a natural habitat. Today, it is not uncommon to see jackals, jungle cats, hyenas, desert fox, and crocodiles, within the grasslands and around your luxury campstead. It has also become a bird watcher's paradise.",
    amenities: [],
    image1: khemVilas1,
    image2: khemVilas2,
  },
  {
    id: "7a214309-d149-46bd-9cad-72caf760ed29",
    created_at: "2026-07-11T19:37:06.891965+00:00",
    name: "The Tigress Resort",
    stars: 4,
    distance: "6.3 Km",
    description: "the resort that promises premium luxuries of a heritage style abode adjacent to the Ranthambore National Park. It is imperative to feel comfortable & luxurious amidst wilderness. But, when you choose to plan your wildlife adventures with the tastefully designed resort- The Tigress Ranthambore, you'll have an unforgettable experience ensuring peace of mind.",
    amenities: [],
    image1: tigress1,
    image2: tigress2,
  },
  {
    id: "f20454d6-3c97-41f8-a5ed-563342a171bd",
    created_at: "2026-07-11T19:34:44.738992+00:00",
    name: "Ranthambore Bagh Villa",
    stars: 3,
    distance: "6 Km",
    description: "Ranthambore Bagh Villa, is villa type resort; this is situated in Sawai Madhopur at Ranthambore Road, close to Ranthambore National Park. We focus to provide our guests rest and relaxation. Hence guests can enjoy the comforts of living far from the demands of a busy schedule & hectic lifestyle. We have 17 villas with all modern amenities, restaurant, swimming pool & beautiful lush green garden.\nDesign and comfort are perfectly combined here, because we care about your well-being – all the materials used for room decoration are environment friendly, and your individual climate control can be adjusted accurately by degree.\nOur friendly and professional staff will efficiently be at your service in the best discretionary manner to provide your comfortable staying.",
    amenities: [],
    image1: baghVilla1,
    image2: baghVilla2,
  },
];
