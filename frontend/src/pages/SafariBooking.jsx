import { useEffect, useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { api, waLink } from "@/lib/api";
import HeroWhatsAppButton from "@/components/HeroWhatsAppButton";
import { SAFARI_HERO_IMG, SAFARI_PRICES } from "@/lib/content";
import BookingStepDateSession from "@/components/booking/BookingStepDateSession";
import BookingStepSafariDetails from "@/components/booking/BookingStepSafariDetails";
import BookingStepVisitorDetails from "@/components/booking/BookingStepVisitorDetails";
import SafariTimingsTable from "@/components/booking/SafariTimingsTable";
import TatkalSection from "@/components/booking/TatkalSection";

const STEP_LABELS = ["Date & Session", "Safari Details", "Visitor Details"];

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-between" data-testid="booking-step-indicator">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className="flex-1 flex items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                done
                  ? "bg-green-600 text-white"
                  : active
                  ? "bg-[#C8860A] text-white"
                  : "bg-stone-200 text-stone-500"
              }`}
            >
              {n}
            </div>
            <span className={`ml-2 text-sm hidden sm:block ${active ? "font-semibold" : "text-stone-500"}`}>
              {label}
            </span>
            {n < 3 && <div className={`flex-1 h-[2px] mx-3 ${done ? "bg-green-600" : "bg-stone-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function BookingSuccess({ success }) {
  const ref = success.ref;
  const waMsg = waLink(`Hi, I'd like to book a safari. My booking reference is ${ref}.`);
  return (
    <PublicLayout
      title="Booking Received | Ranthambore Safari Curator"
      description="Your safari booking request has been received."
      transparentOnTop={false}
    >
      <section className="min-h-[80vh] flex items-center justify-center px-6 py-24 bg-[#F9F5EE]">
        <div className="max-w-xl text-center bg-white rounded-3xl p-10 shadow-xl border border-stone-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2">Request received!</h1>
          <p className="text-stone-600 mb-2">
            Our team will contact you on WhatsApp within 30 minutes to confirm your safari and share payment details.
          </p>
          <div className="my-6 p-4 rounded-xl bg-[#1A2B1F] text-white inline-block">
            <div className="text-xs uppercase tracking-wider text-[#C8860A]">Booking Reference</div>
            <div data-testid="booking-ref" className="font-serif text-2xl mt-1">{ref}</div>
          </div>
          <a
            data-testid="success-whatsapp"
            href={waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-4 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold transition-colors"
          >
            Continue on WhatsApp →
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}

function BookingHero() {
  return (
    <section className="relative -mt-[72px] pt-[72px] min-h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
      <img src={SAFARI_HERO_IMG} alt="Ranthambore Safari Jeep ready for tiger safari" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#C8860A]/40" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-4xl px-6 py-20">
        <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl">
          Book Your Ranthambore Safari — Simple. Fast. Confirmed.
        </h1>
        <p className="mt-4 text-white/85 text-lg">
          Three quick steps and a real human reply on WhatsApp. No payment taken on this website.
        </p>
        <div className="mt-8 flex justify-center">
          <HeroWhatsAppButton
            testId="safari-hero-whatsapp"
            message="Hi! I'd like to book a Ranthambore safari. Please share availability and pricing."
          />
        </div>
      </div>
    </section>
  );
}

export default function SafariBooking() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(null);
  const [shift, setShift] = useState(null);
  const [vehicle, setVehicle] = useState(SAFARI_PRICES[2].value); // gypsy default
  const [guests, setGuests] = useState(2);
  const [chambal, setChambal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedPrice = SAFARI_PRICES.find((p) => p.value === vehicle);

  useEffect(() => {
    if (window.location.hash === "#tatkal") {
      const el = document.getElementById("tatkal");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  async function submitBooking() {
    if (!fullName || !email || !whatsapp) {
      toast.error("Please fill name, WhatsApp number and email.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        date: date.toISOString().slice(0, 10),
        shift,
        vehicle: selectedPrice.type,
        guests,
        addons: chambal ? ["Chambal River Safari"] : [],
        full_name: fullName,
        email,
        whatsapp,
        is_tatkal: selectedPrice.tatkal || false,
      };
      const { data } = await api.post("/bookings", payload);
      setSuccess(data);
      toast.success("Booking request received!");
    } catch {
      toast.error("Could not submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) return <BookingSuccess success={success} />;

  return (
    <PublicLayout
      title="Book Ranthambore Safari Online — Jeep & Canter Safari | Ranthambore Safari Curator"
      description="Book Ranthambore Jeep Safari and Canter Safari online. Choose your zone, date and shift. WhatsApp confirmation in 30 minutes. Tatkal safari available."
    >
      <BookingHero />

      <section className="py-16 md:py-20 bg-[#F9F5EE]">
        <div className="max-w-3xl mx-auto px-5 md:px-6">
          <div className="space-y-8">
            <StepIndicator step={step} />

            {step === 1 && (
              <BookingStepDateSession
                date={date}
                setDate={setDate}
                shift={shift}
                setShift={setShift}
                onContinue={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <BookingStepSafariDetails
                vehicle={vehicle}
                setVehicle={setVehicle}
                guests={guests}
                setGuests={setGuests}
                chambal={chambal}
                setChambal={setChambal}
                onBack={() => setStep(1)}
                onContinue={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <BookingStepVisitorDetails
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                whatsapp={whatsapp}
                setWhatsapp={setWhatsapp}
                onBack={() => setStep(2)}
                onSubmit={submitBooking}
                submitting={submitting}
              />
            )}

            <SafariTimingsTable />
          </div>
        </div>
      </section>

      <TatkalSection />
    </PublicLayout>
  );
}
