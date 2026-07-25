import { useMemo, useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import { HOTELS_HERO_IMG } from "@/lib/content";
import { Star, MapPin, ArrowRight, Wifi, Coffee, Waves, Snowflake, Car, Utensils, Plane, Sparkles } from "lucide-react";
import { waLink } from "@/lib/api";
import HeroWhatsAppButton from "@/components/HeroWhatsAppButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHotels } from "@/lib/hotelsStore";

const AMENITY_ICON = {
  WiFi: Wifi,
  Pool: Waves,
  "Breakfast Included": Coffee,
  AC: Snowflake,
  Parking: Car,
  Restaurant: Utensils,
  Spa: Sparkles,
  "Airport Transfer": Plane,
};

export default function Hotels() {
  const { hotels } = useHotels();
  const [open, setOpen] = useState(null);

  // Memoize a stable hotel list with computed keys so we don't
  // recompute or rebuild identities on every render.
  const hotelList = useMemo(
    () => hotels.map((h, i) => ({
      ...h,
      _key: h.id || `${h.name}-${i}`,
      _idx: i,
    })),
    [hotels]
  );

  const openImages = useMemo(
    () => (open ? [open.image1, open.image2].filter(Boolean) : []),
    [open]
  );

  return (
    <PublicLayout
      title="Hotels Near Ranthambore National Park — Best Stays | Ranthambore Safari Curator"
      description="Handpicked stays near Ranthambore National Park gate. Book safari and hotel together."
    >
      <section className="relative -mt-[72px] pt-[72px] min-h-[55vh] flex items-center justify-center text-center text-white overflow-hidden">
        <img src={HOTELS_HERO_IMG} alt="Luxury jungle resort near Ranthambore National Park" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#C8860A]/40" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-4xl px-6 py-16">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl">Sleep Where the Jungle Breathes</h1>
          <p className="mt-4 text-white/85 text-lg max-w-2xl mx-auto">From mud-walled homestays to canvas suites with butlers — every property here is one we have vetted personally.</p>
          <div className="mt-8 flex justify-center">
            <HeroWhatsAppButton testId="hotels-hero-whatsapp" message="Hi! I'd like to book a hotel near Ranthambore. Please share availability." />
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9F5EE]">
        <div className="max-w-7xl mx-auto px-6">
          {hotels.length === 0 ? (
            <div className="text-center py-16" data-testid="hotels-empty">
              <p className="font-serif text-2xl sm:text-3xl text-stone-700">Hotels coming soon — check back shortly</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelList.map((h) => {
                const i = h._idx;
                return (
                <article key={h._key} data-testid={`hotel-card-${i}`} className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    {h.image1 ? <img src={h.image1} alt={`${h.name} near Ranthambore`} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-lg leading-tight">{h.name}</h3>
                      <span className="inline-flex items-center gap-1 text-sm font-medium shrink-0"><Star className="w-4 h-4 fill-[#C8860A] text-[#C8860A]" />{h.stars}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-500 mt-1"><MapPin className="w-3 h-3" />{h.distance}</div>
                    {h.description && <p className="text-sm text-stone-600 mt-2 leading-relaxed line-clamp-3">{h.description}</p>}
                    <div className="flex gap-3 mt-3 text-stone-600 flex-wrap">
                      {(h.amenities || []).map((a) => {
                        const Icon = AMENITY_ICON[a];
                        return Icon ? <Icon key={a} className="w-4 h-4" /> : <span key={a} className="text-[10px] uppercase tracking-wider text-stone-500">{a}</span>;
                      })}
                    </div>
                    <div className="mt-auto pt-4 flex items-center gap-2">
                      <button data-testid={`hotel-view-${i}`} onClick={() => setOpen(h)} className="flex-1 px-4 py-2 rounded-full border border-stone-300 text-sm font-medium hover:border-[#C8860A]">View Details</button>
                      <a
                        data-testid={`hotel-book-${i}`}
                        href={waLink(`Hi! I'd like to book ${h.name} near Ranthambore National Park.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-sm font-semibold transition-colors"
                      >Book Now <ArrowRight className="w-4 h-4" /></a>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {open && <>
            <DialogHeader><DialogTitle className="font-serif text-2xl">{open.name}</DialogTitle></DialogHeader>
            {openImages.length > 0 && (
              <div className={`grid ${openImages.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2 mb-4`}>
                {openImages.map((src, i) => (
                  <img key={src} src={src} alt={`${open.name} ${i+1}`} className="w-full h-48 object-cover rounded-lg" />
                ))}
              </div>
            )}
            <div className="text-sm text-stone-700 space-y-2">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#C8860A]" />{open.distance} · <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[#C8860A] text-[#C8860A]" />{open.stars}</span></div>
              {open.description && <p className="leading-relaxed">{open.description}</p>}
              {(open.amenities || []).length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-widest text-stone-500 mt-3 mb-1">Amenities</div>
                  <div className="flex flex-wrap gap-2">
                    {open.amenities.map((a) => <span key={a} className="px-3 py-1 rounded-full bg-stone-100 text-xs">{a}</span>)}
                  </div>
                </div>
              )}
            </div>
            <a
              href={waLink(`Hi! I'd like to book ${open.name} near Ranthambore National Park.`)}
              target="_blank" rel="noopener noreferrer"
              className="block text-center w-full mt-5 py-3 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-semibold"
            >Book on WhatsApp</a>
          </>}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
