import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CalendarDays, Phone, Mail, Package, Zap, MessageSquare } from "lucide-react";

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hrs ago`;
  return `${Math.floor(diff/86400)} d ago`;
}

const KIND_META = {
  new_booking: { Icon: CalendarDays, color: "bg-amber-100 text-amber-700" },
  tatkal_request: { Icon: Zap, color: "bg-red-100 text-red-700" },
  callback: { Icon: Phone, color: "bg-teal-100 text-teal-700" },
  contact: { Icon: Mail, color: "bg-blue-100 text-blue-700" },
  package: { Icon: Package, color: "bg-purple-100 text-purple-700" },
  custom_package: { Icon: Package, color: "bg-purple-100 text-purple-700" },
  hotel: { Icon: MessageSquare, color: "bg-stone-100 text-stone-700" },
};

export default function AdminLiveFeed() {
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    const { data } = await api.get("/admin/live-feed");
    setItems(data.items || []);
    // api is a stable module import; setItems is a stable setter
  }, []);

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 7000);
    return () => clearInterval(intervalId);
  }, [load]);

  return (
    <div className="p-8 pb-24">
      <h1 className="font-serif text-3xl mb-1">〰️ Live Feed</h1>
      <p className="text-sm text-stone-500 mb-6">Real-time stream of all website activity</p>

      <div className="space-y-3 max-w-3xl">
        {items.length === 0 && <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-sm text-stone-500">Waiting for new activity...</div>}
        {items.map((it) => {
          const meta = KIND_META[it.kind] || KIND_META.contact;
          const Icon = meta.Icon;
          const itemKey = `${it.kind}-${it.created_at}-${it.name || ""}-${it.ref || ""}`;
          return (
            <div key={itemKey} data-testid={`feed-${itemKey}`} className="bg-white rounded-2xl p-5 border border-stone-200 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-stone-600"><span className="font-medium">{it.name || "Someone"}</span> submitted a form.</div>
                {it.detail && <div className="text-xs text-stone-500 mt-1">{it.detail}</div>}
              </div>
              <div className="text-xs text-stone-500 whitespace-nowrap">{timeAgo(it.created_at)}</div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-60 right-0 bg-white border-t border-stone-200 px-8 py-3 text-xs flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 live-dot" /> Watching for new activity...
      </div>
    </div>
  );
}
