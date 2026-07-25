import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import FilterBar from "@/components/admin/FilterBar";
import InquiriesTable from "@/components/admin/InquiriesTable";

const TABS = [
  { id: "all", label: "All", color: "bg-stone-200 text-stone-800" },
  { id: "contact", label: "Contact", color: "bg-blue-100 text-blue-800" },
  { id: "callback", label: "Callback", color: "bg-teal-100 text-teal-800" },
  { id: "package", label: "Package", color: "bg-purple-100 text-purple-800" },
];

function matchesTab(inquiry, tab) {
  if (tab === "all") return true;
  if (tab === "package") return ["package", "custom_package"].includes(inquiry.type);
  return inquiry.type === tab;
}

function matchesQuery(inquiry, q) {
  if (!q) return true;
  const hay = `${inquiry.name} ${inquiry.email || ""} ${inquiry.phone || ""}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

export default function AdminInquiries() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    const { data } = await api.get("/admin/inquiries");
    setItems(data);
    // api is a stable module import; setItems is a stable setter
  }, []);

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 30000);
    return () => clearInterval(intervalId);
  }, [load]);

  const filtered = useMemo(
    () => items.filter((i) => matchesTab(i, tab) && matchesQuery(i, q)),
    [items, tab, q]
  );

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-3xl">Inquiries</h1>
        <span className="text-xs px-3 py-1 rounded-full bg-white border border-stone-200">
          {items.length} inquiries total
        </span>
      </div>

      <FilterBar
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        query={q}
        onQueryChange={setQ}
        tabsTestId="inquiry-tabs"
        tabTestIdPrefix="inquiry-tab"
        searchTestId="inquiry-search"
        searchPlaceholder="Search name, email, phone..."
      />

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <InquiriesTable inquiries={filtered} />
      </div>
    </div>
  );
}
