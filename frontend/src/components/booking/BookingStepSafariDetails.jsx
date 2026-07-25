import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { SAFARI_PRICES } from "@/lib/content";

/**
 * Step 2 of the safari booking flow.
 * Handles vehicle type, guest count and add-ons.
 */
export default function BookingStepSafariDetails({
  vehicle,
  setVehicle,
  guests,
  setGuests,
  chambal,
  setChambal,
  onBack,
  onContinue,
}) {
  const canProceed = vehicle && guests > 0;

  function handleContinue() {
    if (!canProceed) {
      toast.error("Complete safari details");
      return;
    }
    onContinue();
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
      <h2 className="font-serif text-2xl">Safari Details</h2>

      <div>
        <div className="text-sm font-medium mb-2">Vehicle Type</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {SAFARI_PRICES.map((p) => (
            <button
              key={p.value}
              data-testid={`vehicle-${p.value}`}
              onClick={() => setVehicle(p.value)}
              className={`text-left p-4 rounded-xl border transition-all ${
                vehicle === p.value
                  ? "border-[#C8860A] bg-[#C8860A]/10"
                  : "border-stone-200 hover:border-[#C8860A]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.type}</div>
                {p.tatkal && (
                  <span className="text-[10px] uppercase tracking-wider bg-[#E63946]/10 text-[#E63946] px-2 py-0.5 rounded-full">
                    Tatkal
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-600 mt-1">{p.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Guests</label>
        <div className="inline-flex items-center gap-3 border rounded-full px-2 py-1 border-stone-300">
          <button
            data-testid="guests-minus"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="w-8 h-8 rounded-full border border-stone-300 hover:border-[#C8860A] flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold" data-testid="guests-count">
            {guests}
          </span>
          <button
            data-testid="guests-plus"
            onClick={() => setGuests(guests + 1)}
            className="w-8 h-8 rounded-full border border-stone-300 hover:border-[#C8860A] flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={chambal} onCheckedChange={setChambal} data-testid="addon-chambal" />
        Add Chambal River Safari
      </label>

      <div className="flex justify-between">
        <button onClick={onBack} className="text-sm text-stone-600 hover:text-[#C8860A]">
          ← Back
        </button>
        <button
          data-testid="step2-continue"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-semibold"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
