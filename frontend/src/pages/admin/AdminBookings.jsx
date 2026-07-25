import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import BookingsTable from "@/components/admin/BookingsTable";
import BookingDetailModal from "@/components/admin/BookingDetailModal";
import FilterBar from "@/components/admin/FilterBar";

const TABS = [
  { id: "all", label: "All", color: "bg-stone-200 text-stone-800" },
  { id: "pending", label: "Pending", color: "bg-amber-100 text-amber-800" },
  { id: "confirmed", label: "Confirmed", color: "bg-green-100 text-green-800" },
  { id: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/bookings");
      setBookings(data);
    } catch {
      toast.error("Could not load bookings.");
    }
    // api is a stable module import; setBookings is a stable setter
  }, []);

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 30000);
    return () => clearInterval(intervalId);
  }, [load]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (tab !== "all" && b.status !== tab) return false;
      if (
        q &&
        !`${b.full_name} ${b.ref} ${b.email}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [bookings, tab, q]);

  const setStatus = useCallback(
    async (ref, status) => {
      try {
        await api.patch(`/admin/bookings/${ref}/status`, { status });
        toast.success(`Booking ${status}`);
        load();
      } catch {
        toast.error("Could not update status.");
      }
    },
    [load]
  );

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-3xl">Bookings</h1>
        <span className="text-xs px-3 py-1 rounded-full bg-white border border-stone-200">
          {bookings.length} bookings total
        </span>
      </div>

      <FilterBar
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        query={q}
        onQueryChange={setQ}
        tabsTestId="bookings-tabs"
        tabTestIdPrefix="booking-tab"
        searchTestId="bookings-search"
        searchPlaceholder="Search name or ref..."
      />

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <BookingsTable bookings={filtered} onSetStatus={setStatus} onView={setView} />
      </div>

      <BookingDetailModal booking={view} onClose={() => setView(null)} />
    </div>
  );
}
