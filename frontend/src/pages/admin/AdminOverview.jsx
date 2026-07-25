import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { CalendarDays, Clock, CheckCircle2, IndianRupee, MessageSquare, Phone, Package, RefreshCw } from "lucide-react";

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hrs ago`;
  return `${Math.floor(diff/86400)} d ago`;
}

const STATS = [
  { key: "total_bookings", title: "Total Bookings", Icon: CalendarDays, border: "border-l-black", iconColor: "text-stone-700" },
  { key: "pending", title: "Pending Confirmations", Icon: Clock, border: "border-l-[#C8860A]", iconColor: "text-[#C8860A]" },
  { key: "confirmed", title: "Confirmed Bookings", Icon: CheckCircle2, border: "border-l-green-600", iconColor: "text-green-600" },
  { key: "revenue", title: "Total Revenue", Icon: IndianRupee, border: "border-l-green-600", iconColor: "text-green-600", currency: true },
];

const STATS_ROW2 = [
  { key: "contact_inquiries", title: "Contact Inquiries", Icon: MessageSquare, border: "border-l-blue-500", iconColor: "text-blue-500" },
  { key: "callback_requests", title: "Callback Requests", Icon: Phone, border: "border-l-teal-500", iconColor: "text-teal-500" },
  { key: "package_inquiries", title: "Package Inquiries", Icon: Package, border: "border-l-purple-500", iconColor: "text-purple-500" },
];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setUpdating(true);
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } finally {
      setUpdating(false);
    }
    // api is a stable module import; setStats/setUpdating are stable setters
  }, []);

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 30000);
    return () => clearInterval(intervalId);
  }, [load]);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl">Dashboard Overview</h1>
          <p className="text-sm text-stone-500">Last updated: {stats?.last_updated ? new Date(stats.last_updated).toLocaleTimeString() : "—"}</p>
        </div>
        <button
          data-testid="admin-refresh"
          onClick={load}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-300 text-sm hover:bg-stone-50"
        ><RefreshCw className={`w-4 h-4 ${updating ? "animate-spin" : ""}`} /> Refresh</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s) => (
          <div key={s.key} data-testid={`stat-${s.key}`} className={`bg-white rounded-2xl p-5 border-l-4 ${s.border} border-y border-r border-stone-200 shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-stone-500">{s.title}</span>
              <s.Icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <div className="mt-2 font-serif text-3xl">
              {s.currency ? "₹" : ""}{stats ? (stats[s.key] ?? 0).toLocaleString("en-IN") : "—"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {STATS_ROW2.map((s) => (
          <div key={s.key} data-testid={`stat-${s.key}`} className={`bg-white rounded-2xl p-5 border-l-4 ${s.border} border-y border-r border-stone-200 shadow-sm`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-stone-500">{s.title}</span>
              <s.Icon className={`w-5 h-5 ${s.iconColor}`} />
            </div>
            <div className="mt-2 font-serif text-2xl">{stats ? (stats[s.key] ?? 0).toLocaleString("en-IN") : "—"}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-xs text-[#C8860A]">View All →</Link>
          </div>
          {stats?.recent_bookings?.length ? (
            <table className="w-full text-sm">
              <thead className="text-xs text-stone-500 text-left">
                <tr><th className="py-2">Ref</th><th>Name</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {stats.recent_bookings.map((b) => (
                  <tr key={b.ref} className="border-t border-stone-100">
                    <td className="py-2 font-medium">{b.ref}</td>
                    <td>{b.full_name}</td>
                    <td>{b.date}</td>
                    <td><StatusPill status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="text-sm text-stone-500 py-6 text-center">No recent bookings</div>}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl">Recent Inquiries</h3>
            <Link to="/admin/inquiries" className="text-xs text-[#C8860A]">View All →</Link>
          </div>
          {stats?.recent_inquiries?.length ? (
            <table className="w-full text-sm">
              <thead className="text-xs text-stone-500 text-left">
                <tr><th className="py-2">Type</th><th>Name</th><th>Time</th></tr>
              </thead>
              <tbody>
                {stats.recent_inquiries.map((q) => (
                  <tr key={q.id} className="border-t border-stone-100">
                    <td className="py-2"><TypeBadge type={q.type} /></td>
                    <td>{q.name}</td>
                    <td>{timeAgo(q.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="text-sm text-stone-500 py-6 text-center">No recent inquiries</div>}
        </div>
      </div>

      <div className="mt-8 inline-flex items-center gap-3 text-xs text-stone-600">
        <span className="w-2 h-2 rounded-full bg-green-500 live-dot" />
        Live Pulse Active <span>· Last synced: just now</span>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${map[status] || "bg-stone-100"}`}>{status}</span>;
}

function TypeBadge({ type }) {
  const map = {
    callback: "bg-teal-100 text-teal-800",
    contact: "bg-blue-100 text-blue-800",
    package: "bg-purple-100 text-purple-800",
    custom_package: "bg-purple-100 text-purple-800",
    hotel: "bg-amber-100 text-amber-800",
    tatkal_request: "bg-red-100 text-red-800",
  };
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${map[type] || "bg-stone-100"}`}>{type}</span>;
}
