import { useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import { PACKAGES, PACKAGES_HERO_IMG } from "@/lib/content";
import { Check, ArrowRight } from "lucide-react";
import { api, waLink } from "@/lib/api";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HeroWhatsAppButton from "@/components/HeroWhatsAppButton";
import { useSiteImages } from "@/lib/siteImages";
import { PACKAGE_SLOT_BY_NAME } from "@/lib/imageSlots";

export default function Packages() {
  return (
    <PublicLayout
      title="Ranthambore Tour Packages — Safari + Stay Combos | Ranthambore Safari Curator"
      description="Ranthambore tour packages from ₹3,499 per person. Safaris, stays and transfers included. Budget to luxury packages available."
    >
      <section className="relative -mt-[72px] pt-[72px] min-h-[55vh] flex items-center justify-center text-center text-white overflow-hidden">
        <img src={PACKAGES_HERO_IMG} alt="Aerial view of Ranthambore tour packages" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#C8860A]/40" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-4xl px-6 py-16">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl">Your Perfect Ranthambore Story</h1>
          <p className="mt-4 text-white/85 text-lg max-w-2xl mx-auto">Five tested itineraries or a blank canvas we sketch with you on WhatsApp.</p>
          <div className="mt-8 flex justify-center">
            <HeroWhatsAppButton testId="packages-hero-whatsapp" message="Hi! I'd like to book a Ranthambore tour package. Please share details." />
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9F5EE]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {PACKAGES.map((p, i) => (
            <PackageCard key={p.name} pkg={p} idx={i} />
          ))}
        </div>
      </section>

      <CustomPackage />
    </PublicLayout>
  );
}

function PackageCard({ pkg, idx }) {
  const { images } = useSiteImages();
  const img = images[PACKAGE_SLOT_BY_NAME[pkg.name]] || pkg.img;
  const [loading, setLoading] = useState(false);
  async function book() {
    setLoading(true);
    try {
      await api.post("/inquiries", {
        type: "package",
        name: "Package Booking — pending guest details",
        message: `Interested in ${pkg.name} · ${pkg.duration}`,
        context: { package: pkg.name, price: pkg.price, summary: `Package interest · ${pkg.name}` },
      });
      const wa = waLink(`Hi! I'd like to book the "${pkg.name}" package (${pkg.duration}).`);
      window.open(wa, "_blank");
      toast.success("Opening WhatsApp...");
    } catch {
      toast.error("Couldn't submit. Try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <article data-testid={`package-card-${idx}`} className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
      <div className="relative h-52">
        <img src={img} alt={`${pkg.name} package — Ranthambore Tour`} className="w-full h-full object-cover" />
        {pkg.badge && <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-[#C8860A] text-white px-2.5 py-1 rounded-full">{pkg.badge}</span>}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-2xl">{pkg.name}</h3>
        <div className="text-xs text-stone-500 mt-1 uppercase tracking-wider">{pkg.duration}</div>
        <ul className="mt-4 space-y-2 text-sm text-stone-700">
          {pkg.features.map((f) => (
            <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-[#C8860A] mt-0.5" />{f}</li>
          ))}
        </ul>
        <div className="mt-5 flex items-end justify-end">
          <button
            data-testid={`package-book-${idx}`}
            onClick={book}
            disabled={loading}
            className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-sm font-semibold disabled:opacity-60"
          >{loading ? "..." : "Book This Package"} <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    </article>
  );
}

function CustomPackage() {
  const [dates, setDates] = useState("");
  const [travellers, setTravellers] = useState("");
  const [budget, setBudget] = useState("");
  const [requirements, setRequirements] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please enter name and phone.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/inquiries", {
        type: "custom_package",
        name, phone,
        message: `Travel: ${dates} · ${travellers} travellers · Budget ${budget} · Notes: ${requirements}`,
        context: { dates, travellers, budget, requirements, summary: "Custom package builder" },
      });
      const wa = waLink(`Custom package request: Name ${name}, Phone ${phone}, Travel ${dates}, Travellers ${travellers}, Budget ${budget}. Notes: ${requirements}`);
      window.open(wa, "_blank");
      toast.success("Sent to WhatsApp.");
      setDates(""); setTravellers(""); setBudget(""); setRequirements(""); setName(""); setPhone("");
    } catch {
      toast.error("Couldn't submit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">Can&apos;t Find What You&apos;re Looking For? Build Your Own.</h2>
        </div>
        <form onSubmit={submit} className="bg-[#F9F5EE] rounded-2xl p-6 md:p-8 border border-stone-200 grid sm:grid-cols-2 gap-4" data-testid="custom-package-form">
          <input placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)} className="px-3 py-2.5 rounded-lg border border-stone-300" data-testid="custom-name" />
          <input placeholder="Phone / WhatsApp" value={phone} onChange={(e)=>setPhone(e.target.value)} className="px-3 py-2.5 rounded-lg border border-stone-300" data-testid="custom-phone" />
          <input placeholder="Travel Dates" value={dates} onChange={(e)=>setDates(e.target.value)} className="px-3 py-2.5 rounded-lg border border-stone-300" data-testid="custom-dates" />
          <input type="number" min="1" placeholder="Number of Travellers" value={travellers} onChange={(e)=>setTravellers(e.target.value)} className="px-3 py-2.5 rounded-lg border border-stone-300" data-testid="custom-travellers" />
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="sm:col-span-2" data-testid="custom-budget"><SelectValue placeholder="Budget Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="under_5k">Under ₹5,000 / person</SelectItem>
              <SelectItem value="5k_15k">₹5,000 – ₹15,000 / person</SelectItem>
              <SelectItem value="15k_40k">₹15,000 – ₹40,000 / person</SelectItem>
              <SelectItem value="40k_plus">₹40,000+ / person</SelectItem>
            </SelectContent>
          </Select>
          <textarea
            placeholder="Special requirements (children, dietary, photography focus, etc.)"
            value={requirements}
            onChange={(e)=>setRequirements(e.target.value)}
            className="sm:col-span-2 px-3 py-2.5 rounded-lg border border-stone-300 min-h-[100px]"
            data-testid="custom-requirements"
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="custom-submit"
            className="sm:col-span-2 py-3.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-semibold disabled:opacity-60"
          >{loading ? "Sending..." : "Send to WhatsApp"}</button>
        </form>
      </div>
    </section>
  );
}
