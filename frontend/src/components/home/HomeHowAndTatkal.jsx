import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HOW_IT_WORKS } from "@/lib/content";
import { useSiteImage } from "@/lib/siteImages";

/**
 * "How It Works" 3-step process section.
 */
export function HomeHowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">
            From idea to e-ticket in minutes.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS.map((s, i) => (
            <div
              key={s.n}
              data-testid={`how-step-${i}`}
              className="relative bg-[#F9F5EE] rounded-2xl p-8 border border-stone-200"
            >
              <div className="font-serif text-6xl text-[#C8860A]/80 mb-3">{s.n}</div>
              <h3 className="font-serif text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Tatkal (last-minute) safari promotional section on the homepage.
 */
export function HomeTatkalPromo() {
  const tatkalBg = useSiteImage("tatkal_bg");
  return (
    <section className="relative py-20 md:py-28 bg-[#1A2B1F] text-white overflow-hidden">
      {tatkalBg && (
        <img src={tatkalBg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      )}
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#E63946] mb-3 bg-[#E63946]/10 px-3 py-1 rounded-full border border-[#E63946]/40">
          Tatkal · Last-Minute
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-5">
          Plans change. Tigers don&apos;t wait.
        </h2>
        <p className="text-white/80 leading-relaxed mb-6">
          The forest department releases Tatkal seats exactly one day before each safari. We monitor the window in real time and grab them the second they open.
        </p>
        <ul className="space-y-3 text-white/80 text-sm mb-8 inline-block text-left">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#C8860A] mt-0.5" />
            Window opens 9:30 AM, one day before your shift
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#C8860A] mt-0.5" />
            Higher fees, but the only way to book within 24 hours
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#C8860A] mt-0.5" />
            We hold a Tatkal queue position for you the moment you submit
          </li>
        </ul>
        <div>
          <Link
            to="/safari-booking#tatkal"
            data-testid="tatkal-cta"
            className="tatkal-blink inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E63946] text-white font-bold text-sm uppercase tracking-wider"
          >
            Check Tatkal Availability <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
