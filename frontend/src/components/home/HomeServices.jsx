import { Compass, BedDouble, Package, Waves } from "lucide-react";
import { WHAT_WE_DO } from "@/lib/content";

const ICONS = { Compass, BedDouble, Package, Waves };

/**
 * "What We Do" services section on the homepage.
 */
export default function HomeServices() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs tracking-[0.3em] uppercase text-[#C8860A] mb-3">What We Do</div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">
            One concierge, every part of your jungle.
          </h2>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            We started as park guides ourselves. Today we run a careful booking service for people who want the wild without the queue.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHAT_WE_DO.map((s, i) => {
            const Icon = ICONS[s.icon] || Compass;
            return (
              <div
                key={s.title}
                data-testid={`service-card-${i}`}
                className="bg-[#F9F5EE] rounded-2xl p-8 border border-stone-200 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1A2B1F] text-[#C8860A] flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{s.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
