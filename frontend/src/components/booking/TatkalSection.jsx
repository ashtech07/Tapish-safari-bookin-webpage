import { useState } from "react";
import { toast } from "sonner";
import { api, waLink } from "@/lib/api";

const TATKAL_FEATURES = [
  { t: "Window Opens", d: "9:30 AM sharp, one day before safari" },
  { t: "Higher Pricing", d: "Tatkal carries premium government fees" },
  { t: "We Monitor It", d: "We grab your seat the second it opens" },
];

/**
 * Tatkal (last-minute) safari booking section.
 * Encapsulates its own form state and submission logic.
 */
export default function TatkalSection() {
  const [tDate, setTDate] = useState("");
  const [tName, setTName] = useState("");
  const [tWa, setTWa] = useState("");
  const [tGuests, setTGuests] = useState(2);
  const [tSubmitting, setTSubmitting] = useState(false);

  async function submitTatkal(e) {
    e.preventDefault();
    if (!tDate || !tName || !tWa) {
      toast.error("Please fill all Tatkal fields.");
      return;
    }
    setTSubmitting(true);
    try {
      await api.post("/inquiries", {
        type: "tatkal_request",
        name: tName,
        phone: tWa,
        message: `Tatkal request for ${tGuests} guest(s) on ${tDate}`,
        context: {
          date: tDate,
          guests: tGuests,
          summary: `Tatkal request · ${tGuests} guests · ${tDate}`,
        },
      });
      const wa = waLink(
        `Tatkal request: ${tName}, ${tGuests} guests on ${tDate}. WhatsApp: ${tWa}`
      );
      window.open(wa, "_blank");
      toast.success("Tatkal request submitted!");
      setTDate("");
      setTName("");
      setTWa("");
      setTGuests(2);
    } catch {
      toast.error("Could not submit Tatkal request.");
    } finally {
      setTSubmitting(false);
    }
  }

  return (
    <section id="tatkal" className="py-20 md:py-24 bg-[#1A2B1F] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#E63946] mb-3 bg-[#E63946]/10 px-3 py-1 rounded-full border border-[#E63946]/40">
            URGENT · Tatkal Safari
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">
            Same-Day Safari — Tatkal Booking
          </h2>
          <p className="mt-3 text-white/75 max-w-2xl mx-auto">
            The forest department releases Tatkal seats exactly one day before each safari at 9:30 AM. These are the only seats available for today or tomorrow bookings.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {TATKAL_FEATURES.map((c) => (
            <div key={c.t} className="bg-black/30 rounded-2xl p-6 border border-white/10">
              <div className="text-[#C8860A] uppercase text-xs tracking-widest mb-2">{c.t}</div>
              <p className="text-white/85 text-sm">{c.d}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
            <h3 className="font-serif text-xl mb-3">Tatkal Booking</h3>
            <p className="text-sm text-white/85">
              Last-minute Tatkal seats released by the forest department exactly one day before each safari. Share your details and we will secure your spot the second the window opens.
            </p>
            <p className="text-xs text-white/60 mt-4">
              Tatkal · 6-seater open Gypsy · zone allocated on the day.
            </p>
          </div>
          <form onSubmit={submitTatkal} className="bg-white text-[#1C1C1C] rounded-2xl p-6 space-y-3" data-testid="tatkal-form">
            <h3 className="font-serif text-xl">Tatkal Request</h3>
            <input type="date" data-testid="tatkal-date" value={tDate} onChange={(e) => setTDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-stone-300" />
            <input data-testid="tatkal-name" placeholder="Your Name" value={tName} onChange={(e) => setTName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-stone-300" />
            <input data-testid="tatkal-whatsapp" placeholder="WhatsApp Number" value={tWa} onChange={(e) => setTWa(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-stone-300" />
            <input data-testid="tatkal-guests" type="number" min="1" placeholder="Number of Guests" value={tGuests} onChange={(e) => setTGuests(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-stone-300" />
            <button
              type="submit"
              data-testid="tatkal-submit"
              disabled={tSubmitting}
              className="tatkal-blink w-full mt-2 py-3.5 rounded-full bg-[#E63946] text-white font-bold uppercase tracking-wider text-sm disabled:opacity-60"
            >
              {tSubmitting ? "Submitting..." : "Submit Tatkal Request Now"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
