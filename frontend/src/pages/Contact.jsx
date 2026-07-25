import { useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import FAQAccordion from "@/components/FAQAccordion";
import { CALL_NUMBER, WHATSAPP_DISPLAY, EMAIL_ADDRESS, OFFICE_ADDRESS, api, waLink } from "@/lib/api";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import HeroWhatsAppButton from "@/components/HeroWhatsAppButton";

const CARDS = [
  { Icon: Phone, label: "Call", value: CALL_NUMBER, sub: "Direct line to booking desk" },
  { Icon: MessageCircle, label: "WhatsApp", value: WHATSAPP_DISPLAY, sub: "Fastest reply, monitored daily" },
  { Icon: Mail, label: "Email", value: EMAIL_ADDRESS, sub: "Detailed itineraries and quotes" },
  { Icon: MapPin, label: "Office", value: OFFICE_ADDRESS, sub: "Open Mon–Sun, 6 AM – 9 PM" },
  { Icon: Clock, label: "Promise", value: "Under 30 minutes", sub: "During park hours, every day" },
];

export default function Contact() {
  return (
    <PublicLayout
      title="Contact Ranthambore Safari Curator — WhatsApp Safari Booking Help"
      description="Contact Ranthambore Safari Curator for safari booking help. WhatsApp replies in under 30 minutes during park hours 6 AM to 7 PM IST."
      transparentOnTop={false}
    >
      <section className="pt-32 pb-16 bg-[#1A2B1F] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl">Real humans, one message away.</h1>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">During park hours (6 AM – 7 PM IST) we reply on every channel inside 30 minutes.</p>
          <div className="mt-8 flex justify-center">
            <HeroWhatsAppButton testId="contact-hero-whatsapp" message="Hi! I have a question about a Ranthambore safari booking." />
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F9F5EE]">
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CARDS.map(({ Icon, label, value, sub }, i) => (
            <div key={label} data-testid={`contact-card-${i}`} className="bg-white p-5 rounded-2xl border border-stone-200 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1A2B1F] text-[#C8860A] flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase tracking-widest text-stone-500">{label}</div>
              <div className="mt-1 text-sm font-semibold break-all">{value}</div>
              <div className="text-xs text-stone-500 mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl overflow-hidden border border-stone-200 h-[400px]">
            <iframe
              data-testid="map-iframe"
              title="Ranthambore National Park map"
              src="https://www.google.com/maps?q=Ranthambore+National+Park+Sawai+Madhopur&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="py-20 bg-[#F9F5EE]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <FAQAccordion />
        </div>
      </section>
    </PublicLayout>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [dates, setDates] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!name || !email || !whatsapp) {
      toast.error("Name, email and WhatsApp are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/inquiries", {
        type: "contact",
        name, email, phone: whatsapp,
        message,
        context: { dates, summary: `Contact form · ${name}` },
      });
      toast.success("Message sent — we'll reply on WhatsApp.");
      setName(""); setEmail(""); setWhatsapp(""); setDates(""); setMessage("");
    } catch {
      toast.error("Could not send. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-[#F9F5EE] rounded-2xl p-6 md:p-8 border border-stone-200 space-y-4" data-testid="contact-form">
      <h2 className="font-serif text-2xl">Send Us a Note</h2>
      <input data-testid="contact-name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full Name" className="w-full px-3 py-2.5 rounded-lg border border-stone-300" />
      <input data-testid="contact-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2.5 rounded-lg border border-stone-300" />
      <input data-testid="contact-whatsapp" value={whatsapp} onChange={(e)=>setWhatsapp(e.target.value)} placeholder="WhatsApp Number" className="w-full px-3 py-2.5 rounded-lg border border-stone-300" />
      <input data-testid="contact-dates" value={dates} onChange={(e)=>setDates(e.target.value)} placeholder="Preferred Dates" className="w-full px-3 py-2.5 rounded-lg border border-stone-300" />
      <textarea data-testid="contact-message" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="How can we help?" className="w-full px-3 py-2.5 rounded-lg border border-stone-300 min-h-[120px]" />
      <button type="submit" disabled={loading} data-testid="contact-submit" className="w-full py-3.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-semibold disabled:opacity-60">
        {loading ? "Sending..." : "Send Message"}
      </button>
      <p className="text-xs text-stone-500">Your details are never sold or shared.</p>
    </form>
  );
}
