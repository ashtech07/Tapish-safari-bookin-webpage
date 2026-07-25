import { ArrowRight } from "lucide-react";

/**
 * Step 3 of the safari booking flow.
 * Collects visitor name, email and WhatsApp number.
 */
export default function BookingStepVisitorDetails({
  fullName,
  setFullName,
  email,
  setEmail,
  whatsapp,
  setWhatsapp,
  onBack,
  onSubmit,
  submitting,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
      <h2 className="font-serif text-2xl">Visitor Details</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          data-testid="visitor-name"
          placeholder="Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/40"
        />
        <input
          data-testid="visitor-whatsapp"
          type="tel"
          placeholder="WhatsApp Number"
          required
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/40"
        />
        <input
          data-testid="visitor-email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="sm:col-span-2 px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/40"
        />
      </div>
      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="text-sm text-stone-600 hover:text-[#C8860A]">
          ← Back
        </button>
        <button
          data-testid="submit-booking"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-semibold disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Booking Request"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-stone-500">
        No payment taken on this website. Our team confirms on WhatsApp within 30 minutes.
      </p>
    </div>
  );
}
