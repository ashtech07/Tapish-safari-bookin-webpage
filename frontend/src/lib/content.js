// Static content + media for Ranthambore Safari Curator
import { SEED_IMAGES } from "@/lib/seedDefaults";

export const HERO_IMG = "https://images.pexels.com/photos/15345428/pexels-photo-15345428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600";
export const SAFARI_HERO_IMG = "https://images.pexels.com/photos/25785873/pexels-photo-25785873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600";
export const HOTELS_HERO_IMG = "https://images.unsplash.com/photo-1780283574760-e8d7fd944da5?auto=format&fit=crop&w=1600&q=80";
export const PACKAGES_HERO_IMG = "https://images.unsplash.com/photo-1672490305147-2e791a7fbe0b?auto=format&fit=crop&w=1600&q=80";
export const TATKAL_JEEP_IMG = "https://images.pexels.com/photos/21701085/pexels-photo-21701085.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200";
export const ZONE_MAP_BG = "https://images.unsplash.com/photo-1599632740188-8a4f152a8342?auto=format&fit=crop&w=1600&q=80";

export const TICKER_DISCLAIMER = "⚠️ DISCLAIMER: This is a private safari facilitation service and a trusted booking partner. Not the official Rajasthan Forest Department website. Safari permits are subject to availability and government regulations.";

export const HERO_ALERTS = "⚠️ Zones 1–5 closed every Wednesday   🎟️ Tatkal seats just released for this weekend   🌅 Morning safari 70% booked for December   🐯 Tiger sighted three mornings in a row at Padam Talao   🚙 Private Gypsy bookings open for January";

export const SAFARI_PRICES = [
  { type: "Canter Safari", indian: 1600, foreigner: 3500, sub: "Shared Vehicle", value: "canter" },
  { type: "Premium Canter", indian: 2500, foreigner: 5000, sub: "Premium Shared", value: "premium_canter" },
  { type: "Gypsy Safari", indian: 2500, foreigner: 5000, sub: "Open Jeep", value: "gypsy" },
  { type: "Premium Gypsy", indian: 5000, foreigner: 8000, sub: "Premium Jeep", value: "premium_gypsy" },
  { type: "Tatkal Gypsy", indian: 30000, foreigner: 45000, sub: "Tatkal", value: "tatkal_gypsy", tatkal: true, total: true },
];

export const WHAT_WE_DO = [
  { icon: "Compass", title: "Safari Booking", text: "Gypsy, Canter, Tatkal, full-vehicle — every shift, every zone." },
  { icon: "BedDouble", title: "Hotel Booking", text: "Hand-vetted stays from forest homestays to ultra-luxury tents." },
  { icon: "Package", title: "Tour Packages", text: "Plug-and-play 2 to 5 night itineraries with safaris, stays and transfers." },
  { icon: "Waves", title: "Chambal River Safari", text: "Gharial, skimmer and river safari day trip on India's cleanest river." },
];

export const ZONES = [
  { id: 1, name: "Singh Dwar", wildlife: "Tigers, Sambar, Leopard", difficulty: "Easy" },
  { id: 2, name: "Jogi Mahal Loop", wildlife: "Tiger territory, Deer", difficulty: "Easy" },
  { id: 3, name: "Padam Talao", wildlife: "Tigers, Crocodiles, Deer", difficulty: "Easy" },
  { id: 4, name: "Lakarda", wildlife: "Sloth Bear, Tiger", difficulty: "Moderate" },
  { id: 5, name: "Anantpura", wildlife: "Tigers, Jackal", difficulty: "Moderate" },
  { id: 6, name: "Khandar Gate", wildlife: "Tigers, Hyena, Nilgai", difficulty: "Moderate" },
  { id: 7, name: "Chidikho", wildlife: "Tiger Transit Corridor", difficulty: "Hard" },
  { id: 8, name: "Balas", wildlife: "Leopard, Deer, Peafowl", difficulty: "Hard" },
  { id: 9, name: "Kuwalji", wildlife: "Crocodile, Tigers", difficulty: "Hard" },
  { id: 10, name: "Aantri", wildlife: "Resident Tigress, Sloth Bear", difficulty: "Hard" },
];

export const ZONE_IMAGES = [
  SEED_IMAGES.zone_1,
  SEED_IMAGES.zone_2,
  "https://images.unsplash.com/photo-1634831709344-d3e05b1a093a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1537616930345-1d330ad3e0a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1719163343629-e56de8fc6209?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1686648420191-3a4d35073fd6?auto=format&fit=crop&w=800&q=80",
  "https://images.pexels.com/photos/35972700/pexels-photo-35972700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=800",
  SEED_IMAGES.zone_8,
  SEED_IMAGES.zone_9,
  SEED_IMAGES.zone_10,
];

export const HOW_IT_WORKS = [
  { n: "01", title: "Pick Your Date", text: "Use our calendar with live colour-coded availability — green, yellow, red, and Tatkal orange." },
  { n: "02", title: "Choose Safari Type", text: "Gypsy or Canter, shared or private, plus zone preferences and any add-ons." },
  { n: "03", title: "Get Your Confirmation", text: "WhatsApp confirmation in 30 minutes, with pickup time, vehicle number and driver contact." },
];

export const ATTRACTIONS = [
  { name: "Ranthambore Fort", text: "A UNESCO-listed thousand-year hill fort with sweeping views over the dhok forest.", img: SEED_IMAGES.attraction_fort },
  { name: "Jogi Mahal", text: "An ochre hunting pavilion on the edge of Padam Talao, once the maharaja's retreat.", img: "https://images.unsplash.com/photo-1725990076174-a3448eb86e76?auto=format&fit=crop&w=900&q=80" },
  { name: "Padam Talao Lake", text: "The park's largest lake where tigers cross at dusk and crocodiles bask along the banks.", img: "https://images.unsplash.com/photo-1656828059237-add66db82a2b?auto=format&fit=crop&w=900&q=80" },
  { name: "Trinetra Ganesh Temple", text: "An eighth-century shrine inside the fort — India's oldest three-eyed Ganesha.", img: SEED_IMAGES.attraction_temple },
  { name: "Kachida Valley", text: "Rocky outcrops where sloth bears, leopards and tigers all roam.", img: "https://images.unsplash.com/photo-1694366454450-7979697bab21?auto=format&fit=crop&w=900&q=80" },
  { name: "Raj Bagh Ruins", text: "Ivy-eaten domes half-submerged by jungle — the most photogenic frame on a morning safari.", img: "https://images.unsplash.com/photo-1673429451048-08db61259eac?auto=format&fit=crop&w=900&q=80" },
];

export const FAQS = [
  { q: "What is the best time to visit Ranthambore National Park?", a: "October to June is the safari season. December to March offers the best weather. April to June has highest tiger sighting chances as animals gather near water." },
  { q: "How do I book a Ranthambore safari?", a: "Fill our booking form, share your details, and our team confirms on WhatsApp within 30 minutes. No advance payment on this website." },
  { q: "What is the difference between Gypsy and Canter safari?", a: "Gypsy is a 6-seater open jeep — private and closer to wildlife. Canter is a 20-seater open vehicle — more affordable and social." },
  { q: "What is Tatkal safari booking?", a: "Tatkal seats are released by the forest department exactly one day before the safari at premium pricing. It is the only option for same-day or next-day bookings." },
  { q: "Which zones are best for tiger sightings?", a: "Zones 1, 2 and 3 have the highest tiger sighting frequency. Zones 4 and 5 are excellent for sloth bears and leopards." },
  { q: "What are the safari timings in Ranthambore?", a: "Morning safari: 6:00 AM to 9:30 AM. Evening safari: 3:00 PM to 6:30 PM. Timings vary slightly by season." },
  { q: "Is Ranthambore Safari Curator the official government website?", a: "No. We are a private safari facilitation service and trusted booking partner. We are not affiliated with the Rajasthan Forest Department." },
  { q: "What should I wear on a Ranthambore safari?", a: "Wear earth tones — khaki, olive, brown. Avoid bright colours and white. Comfortable, covered clothing is recommended." },
  { q: "Are cameras and drones allowed inside the park?", a: "Still cameras are allowed. Drones are strictly prohibited inside Ranthambore National Park." },
  { q: "When is Ranthambore National Park closed?", a: "The park is closed every year from July 1 to September 30 for the monsoon season." },
  { q: "How do I reach Ranthambore from Delhi or Jaipur?", a: "From Delhi: 5 hours by train to Sawai Madhopur. From Jaipur: 2.5 hours by road or train. We can arrange transfers on request." },
  { q: "What is the refund policy if my safari is cancelled?", a: "100% refund if cancelled 48 hours before safari date. Contact us on WhatsApp for refund requests." },
];

export const TESTIMONIALS = [
  { quote: "Booked our Tatkal safari at 8 PM and had tickets by morning. Saw a tigress with two cubs at Padam Talao. Worth every rupee.", name: "Priya & Aakash", city: "Mumbai" },
  { quote: "The WhatsApp team answered in under five minutes every time. Zone 3 on the second morning gave us our tiger.", name: "Daniel R.", city: "Berlin" },
  { quote: "Travelling with kids — Ranthambore Safari Curator arranged a private Gypsy, a sweet driver and a hotel with a pool. Best trip of the year.", name: "The Mehta Family", city: "Ahmedabad" },
  { quote: "Smooth, professional, and honest about which zones were busy. We rebooked twice and got full support both times.", name: "Anjali S.", city: "Bengaluru" },
  { quote: "Their package included Chambal River safari — we saw gharials and skimmers. A perfect add-on to the tiger experience.", name: "Hugo & Marta", city: "Lisbon" },
  { quote: "Got a naturalist who was a former park ranger. His storytelling made the safari completely unforgettable.", name: "Vikram K.", city: "Delhi" },
];

export const HOTELS = [
  { name: "Dhok Tree Homestay", stars: 4.3, dist: "3.1km", amenities: ["Breakfast", "WiFi"], price: 1450, category: "budget", img: "https://images.unsplash.com/photo-1711707246899-cf0d1a5d0472?auto=format&fit=crop&w=900&q=80" },
  { name: "Saras Backpacker Lodge", stars: 4.1, dist: "4.4km", amenities: ["Breakfast", "WiFi"], price: 1850, category: "budget", combo: true, img: "https://images.unsplash.com/photo-1774280954999-9758f11f3d41?auto=format&fit=crop&w=900&q=80" },
  { name: "Khandar Courtyard Inn", stars: 4.4, dist: "2.6km", amenities: ["Pool", "Breakfast", "WiFi"], price: 3200, category: "standard", img: "https://images.unsplash.com/photo-1565214988145-8e826f79d8c2?auto=format&fit=crop&w=900&q=80" },
  { name: "Sariska View Resort", stars: 4.5, dist: "1.9km", amenities: ["Pool", "Breakfast", "WiFi"], price: 4500, category: "standard", combo: true, img: "https://images.unsplash.com/photo-1636484807510-bc2ffbaf3241?auto=format&fit=crop&w=900&q=80" },
  { name: "Padam Vilas Forest Lodge", stars: 4.7, dist: "1.4km", amenities: ["Pool", "Breakfast", "WiFi"], price: 7800, category: "deluxe", img: "https://images.unsplash.com/photo-1673429451048-08db61259eac?auto=format&fit=crop&w=900&q=80" },
  { name: "Aravalli Tigerstone Retreat", stars: 4.6, dist: "2.0km", amenities: ["Pool", "Breakfast", "WiFi"], price: 9500, category: "deluxe", combo: true, img: "https://images.unsplash.com/photo-1694366454450-7979697bab21?auto=format&fit=crop&w=900&q=80" },
  { name: "Sherbagh Royal Tents", stars: 4.9, dist: "0.9km", amenities: ["Pool", "Breakfast", "WiFi"], price: 18500, category: "luxury", img: "https://images.unsplash.com/photo-1780283574760-e8d7fd944da5?auto=format&fit=crop&w=900&q=80" },
  { name: "Khem Vilas Wilderness", stars: 4.8, dist: "1.6km", amenities: ["Pool", "Breakfast", "WiFi"], price: 26000, category: "luxury", combo: true, img: "https://images.unsplash.com/photo-1711707246899-cf0d1a5d0472?auto=format&fit=crop&w=900&q=80" },
  { name: "Aman-i-Khas Camp", stars: 5.0, dist: "1.1km", amenities: ["Pool", "Breakfast", "WiFi"], price: 95000, category: "ultra", img: "https://images.unsplash.com/photo-1774280954999-9758f11f3d41?auto=format&fit=crop&w=900&q=80" },
  { name: "Six Senses Ranthambore", stars: 5.0, dist: "3.4km", amenities: ["Pool", "Breakfast", "WiFi"], price: 72000, category: "ultra", combo: true, img: "https://images.unsplash.com/photo-1636484807510-bc2ffbaf3241?auto=format&fit=crop&w=900&q=80" },
];

export const PACKAGES = [
  { name: "Weekend Tiger Trail", badge: "Most Popular", duration: "2 Nights · 3 Days", features: ["Two Gypsy safaris", "Daily breakfast", "Budget hotel", "Transfers"], price: 12999, original: 16500, img: SEED_IMAGES.package_weekend_tiger_trail },
  { name: "Family Jungle Adventure", duration: "3 Nights · 4 Days", features: ["Four shared Gypsy safaris", "Kids activity kit", "Standard hotel with pool", "Fort tour"], price: 32500, original: 39000, img: "https://images.unsplash.com/photo-1672490305147-2e791a7fbe0b?auto=format&fit=crop&w=900&q=80" },
  { name: "Luxury Wildlife Retreat", badge: "Top-Rated", duration: "4 Nights · 5 Days", features: ["Four Gypsy safaris", "Luxury tented suite", "Expert naturalist", "All meals"], price: 119000, original: 145000, img: "https://images.unsplash.com/photo-1652885363231-b0cb27a13197?auto=format&fit=crop&w=900&q=80" },
  { name: "Budget Explorer", duration: "1 Night · 2 Days", features: ["One Canter safari", "Budget homestay", "Breakfast", "Local guide"], price: 3499, original: 4800, img: "https://images.unsplash.com/photo-1780283574760-e8d7fd944da5?auto=format&fit=crop&w=900&q=80" },
  { name: "Photography Safari", badge: "Pro Choice", duration: "3 Nights · 4 Days", features: ["Four morning private Gypsy safaris", "Photography naturalist", "Beanbag support", "Boutique tented camp"], price: 78500, original: 92000, img: SEED_IMAGES.package_photography_safari },
];

export const SAFARI_TIMINGS = [
  { months: "October", morning: "6:30 AM – 10:00 AM", evening: "2:30 PM – 6:00 PM" },
  { months: "November – January", morning: "7:00 AM – 10:30 AM", evening: "2:00 PM – 5:30 PM" },
  { months: "February – March", morning: "6:30 AM – 10:00 AM", evening: "2:30 PM – 6:00 PM" },
  { months: "April – May 15", morning: "6:00 AM – 9:30 AM", evening: "3:00 PM – 6:30 PM" },
  { months: "May 16 – June", morning: "6:00 AM – 9:30 AM", evening: "3:30 PM – 7:00 PM" },
];
