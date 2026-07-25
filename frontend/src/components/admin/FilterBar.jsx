import { Search } from "lucide-react";

/**
 * Filter tabs + search input used by the admin bookings/inquiries screens.
 *
 * `tabsTestId`, `tabTestIdPrefix`, `searchTestId` let callers preserve the
 * exact `data-testid` names their existing test suites depend on.
 */
export default function FilterBar({
  tabs,
  activeTab,
  onTabChange,
  query,
  onQueryChange,
  tabsTestId,
  tabTestIdPrefix,
  searchTestId,
  searchPlaceholder,
}) {
  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap" data-testid={tabsTestId}>
        {tabs.map((t) => (
          <button
            key={t.id}
            data-testid={`${tabTestIdPrefix}-${t.id}`}
            onClick={() => onTabChange(t.id)}
            className={`px-4 py-1.5 rounded-full text-sm border border-stone-200 ${
              activeTab === t.id ? `${t.color} font-semibold` : "bg-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          data-testid={searchTestId}
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-full border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8860A]/40"
        />
      </div>
    </>
  );
}
