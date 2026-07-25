import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { waLink } from "@/lib/api";
import { useSiteImage } from "@/lib/siteImages";
import { HERO_IMG } from "@/lib/content";

/**
 * Homepage hero section with tiger image and primary CTAs.
 */
export default function HomeHero() {
  const heroImg = useSiteImage("hero_bg", HERO_IMG);

  return (
    <section
      data-testid="hero-section"
      className="relative -mt-[72px] pt-[72px] min-h-[100svh] flex items-center justify-center text-center text-white overflow-hidden"
    >
      <img
        src={heroImg}
        alt="Bengal tiger walking through golden grass at sunrise — Ranthambore National Park"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#C8860A]/40" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-5xl px-6 py-24 fade-up">
        <span className="inline-block text-xs sm:text-sm tracking-[0.32em] uppercase text-white/80 mb-6">
          Trusted Booking Partner
        </span>
        <h1 className="font-serif font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05]">
          The Tigers Are Waiting
        </h1>
        <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#C8860A] mt-4">
          Are You Ready For The Ultimate Wildlife Adventure?
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center justify-center">
          <Link
            to="/safari-booking"
            data-testid="hero-book-cta"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-bold text-sm uppercase tracking-wider transition-all hover:translate-y-[-2px]"
          >
            Book Your Safari Now <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#explore-zones"
            data-testid="hero-zones-cta"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/90 text-white font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
          >
            Explore Zones
          </a>
          <a
            href={waLink(
              "Hi! I'd like to book a Ranthambore safari. Please share availability and pricing."
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="hero-whatsapp-cta"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm uppercase tracking-wider transition-all hover:translate-y-[-2px]"
          >
            <svg viewBox="0 0 32 32" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d="M19.11 17.36c-.27-.13-1.58-.78-1.83-.87-.25-.09-.42-.13-.6.14-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.13-1.14-.42-2.18-1.35-.81-.72-1.35-1.62-1.51-1.89-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.83-1.99-.22-.52-.45-.45-.62-.46l-.53-.01c-.18 0-.47.07-.71.34-.25.27-.94.92-.94 2.24 0 1.32.96 2.6 1.09 2.78.13.18 1.9 2.9 4.6 4.07.64.28 1.14.45 1.53.57.64.2 1.22.17 1.68.1.51-.08 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31zM16 5C9.92 5 5 9.92 5 16c0 1.94.51 3.77 1.4 5.36L5 27l5.86-1.36A10.9 10.9 0 0 0 16 27c6.08 0 11-4.92 11-11S22.08 5 16 5z" />
            </svg>
            Book Via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
