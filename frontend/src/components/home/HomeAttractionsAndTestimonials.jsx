import { Star, Quote } from "lucide-react";
import { useSiteImages } from "@/lib/siteImages";
import { ATTRACTIONS } from "@/lib/content";

const ATTRACTION_SLOT = {
  "Ranthambore Fort": "attraction_fort",
  "Trinetra Ganesh Temple": "attraction_temple",
};

const FEATURED_ATTRACTIONS = ATTRACTIONS.filter(
  (a) => a.name === "Ranthambore Fort" || a.name === "Trinetra Ganesh Temple"
);

/**
 * Featured tourist attractions section (Fort & Temple).
 */
export function HomeAttractions() {
  const { images } = useSiteImages();
  return (
    <section className="py-20 md:py-28 bg-[#F9F5EE]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs tracking-[0.3em] uppercase text-[#C8860A] mb-3">Around the Park</div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">Stories older than the tigers.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {FEATURED_ATTRACTIONS.map((a, i) => (
            <article
              key={a.name}
              data-testid={`attraction-${i}`}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:-translate-y-1 transition-transform"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={images[ATTRACTION_SLOT[a.name]] || a.img}
                  alt={`${a.name} — Ranthambore tourist attraction`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl mb-3">{a.name}</h3>
                <p className="text-base text-stone-600 leading-relaxed">{a.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Guest testimonials section. Consumes a list of reviews (id-keyed).
 */
export function HomeTestimonials({ reviews }) {
  return (
    <section className="py-20 md:py-28 bg-[#1A2B1F] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs tracking-[0.3em] uppercase text-[#C8860A] mb-3">From the Field</div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">What Our Guests Say</h2>
        </div>
        {reviews.length === 0 ? (
          <div className="text-center text-white/70 text-lg py-10" data-testid="no-reviews">
            Reviews coming soon
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((t, i) => (
              <TestimonialCard key={t.id || `${t.name}-${i}`} review={t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ review, index }) {
  const rating = Math.max(0, Math.min(5, Number(review.rating) || 5));
  const baseKey = review.id || `${review.name}-${index}`;

  return (
    <div data-testid={`testimonial-${index}`} className="bg-black/30 backdrop-blur p-8 rounded-2xl border border-white/10">
      <Quote className="w-7 h-7 text-[#C8860A] mb-3" />
      <p className="text-white/85 leading-relaxed text-[15px]">“{review.text}”</p>
      <div className="flex items-center gap-1 mt-5 text-[#C8860A]">
        {[...Array(rating)].map((_, j) => (
          <Star key={`${baseKey}-star-${j}`} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#C8860A] text-white font-serif text-lg flex items-center justify-center overflow-hidden">
          {review.photo ? (
            <img src={review.photo} alt={review.name} className="w-full h-full object-cover" />
          ) : (
            (review.name || "G")[0]
          )}
        </div>
        <div>
          <div className="text-sm font-semibold">{review.name}</div>
        </div>
        <span className="ml-auto text-[10px] uppercase tracking-wider bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
          Verified Guest
        </span>
      </div>
    </div>
  );
}
