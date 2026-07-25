import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { SAFARI_TIMINGS } from "@/lib/content";

/**
 * Collapsible reference table of Ranthambore safari timings by season.
 */
export default function SafariTimingsTable() {
  return (
    <Collapsible className="bg-white rounded-2xl border border-stone-200 p-6">
      <CollapsibleTrigger
        data-testid="timings-toggle"
        className="flex w-full justify-between items-center text-left font-serif text-lg"
      >
        Safari Timings (by Season)
        <ChevronDown className="w-5 h-5" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 text-left">Months</th>
                <th className="px-4 py-3 text-left">Morning Shift</th>
                <th className="px-4 py-3 text-left">Evening Shift</th>
              </tr>
            </thead>
            <tbody>
              {SAFARI_TIMINGS.map((t, i) => (
                <tr key={t.months} className={i % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"}>
                  <td className="px-4 py-3">{t.months}</td>
                  <td className="px-4 py-3">{t.morning}</td>
                  <td className="px-4 py-3">{t.evening}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
