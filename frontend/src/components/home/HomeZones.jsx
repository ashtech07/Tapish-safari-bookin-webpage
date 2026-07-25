import { useSiteImages } from "@/lib/siteImages";
import { ZONES, ZONE_IMAGES, ZONE_MAP_BG } from "@/lib/content";

/**
 * Zone map section listing all 10 Ranthambore safari zones with images.
 */
export default function HomeZones() {
  const { images } = useSiteImages();

  return (
    <section
      id="explore-zones"
      className="relative py-20 md:py-28 bg-[#1A2B1F] text-white overflow-hidden"
    >
      <img
        src={ZONE_MAP_BG}
        alt="Aerial view of Ranthambore National Park forest"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs tracking-[0.3em] uppercase text-[#C8860A] mb-3">
            Ten Zones, Ten Stories
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">
            Your zone decides your tiger.
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Ranthambore is divided into ten safari zones — each a different mood, terrain, and resident wildlife. Zones 1 to 5 are classic, zones 6 to 10 are quieter and wilder.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {ZONES.map((z, i) => (
            <ZoneCard key={z.id} zone={z} image={images[`zone_${z.id}`] || ZONE_IMAGES[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoneCard({ zone, image }) {
  const difficultyClass =
    zone.difficulty === "Easy"
      ? "bg-green-500/20 text-green-200"
      : zone.difficulty === "Moderate"
      ? "bg-yellow-500/20 text-yellow-200"
      : "bg-red-500/20 text-red-200";

  return (
    <div
      data-testid={`zone-card-${zone.id}`}
      className="group bg-black/30 backdrop-blur rounded-2xl overflow-hidden border border-white/10 hover:border-[#C8860A] transition-colors"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={image}
          alt={`Ranthambore Zone ${zone.id} ${zone.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <span className="text-xs tracking-widest text-[#C8860A] uppercase">Zone {zone.id}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyClass}`}>
            {zone.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg">{zone.name}</h3>
        <p className="text-xs text-white/70 mt-1">{zone.wildlife}</p>
      </div>
    </div>
  );
}
