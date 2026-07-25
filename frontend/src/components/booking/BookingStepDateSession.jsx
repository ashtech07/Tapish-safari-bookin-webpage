import { Sunrise, Sunset, ArrowRight } from "lucide-react";
import { toast } from "sonner";

/**
 * Step 1 of the safari booking flow.
 * Handles date selection and morning/evening shift choice.
 */
export default function BookingStepDateSession({ date, setDate, shift, setShift, onContinue }) {
  const canProceed = date && shift;

  function handleContinue() {
    if (!canProceed) {
      toast.error("Select a date and session");
      return;
    }
    onContinue();
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm">
      <h2 className="font-serif text-2xl mb-2">Pick Your Date & Session</h2>
      <p className="text-sm text-stone-600 mb-5">
        Choose any future date for your safari, then pick a morning or evening shift.
      </p>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div data-testid="booking-calendar">
          <label className="text-sm font-medium block mb-2">Safari Date</label>
          <input
            type="date"
            data-testid="booking-date-input"
            min={new Date().toISOString().slice(0, 10)}
            value={date ? date.toISOString().slice(0, 10) : ""}
            onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
            className="w-full px-3 py-3 rounded-lg border border-stone-300 text-base focus:outline-none focus:ring-2 focus:ring-[#C8860A]/40"
          />
          {date && (
            <p className="mt-2 text-xs text-stone-500">
              Selected:{" "}
              <span className="font-medium text-[#1C1C1C]">
                {date.toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          )}
        </div>
        <div className="space-y-3">
          <ShiftButton
            testId="shift-morning"
            selected={shift === "morning"}
            onClick={() => setShift("morning")}
            Icon={Sunrise}
            title="Morning Safari"
            subtitle="6:00 – 10:30 AM (varies by season)"
          />
          <ShiftButton
            testId="shift-evening"
            selected={shift === "evening"}
            onClick={() => setShift("evening")}
            Icon={Sunset}
            title="Evening Safari"
            subtitle="2:00 – 7:00 PM (varies by season)"
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          data-testid="step1-continue"
          onClick={handleContinue}
          disabled={!canProceed}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-semibold disabled:opacity-50"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ShiftButton({ testId, selected, onClick, Icon, title, subtitle }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected ? "border-[#C8860A] bg-[#C8860A]/10" : "border-stone-200 hover:border-[#C8860A]/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-[#C8860A]" />
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-stone-600">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}
