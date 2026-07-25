import { CalendarDays, Check, X, Eye } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function StatusPill({ status }) {
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
        STATUS_STYLES[status] || "bg-stone-100"
      }`}
    >
      {status}
    </span>
  );
}

/**
 * Bookings table used by the admin bookings screen.
 * Fires callbacks for status change and detail view.
 */
export default function BookingsTable({ bookings, onSetStatus, onView }) {
  if (bookings.length === 0) {
    return (
      <div className="py-16 text-center">
        <CalendarDays className="w-12 h-12 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500 text-sm">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-widest">
          <tr>
            <th className="px-4 py-3">Ref</th>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Date & Shift</th>
            <th className="px-4 py-3">Details</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.ref} className="border-t border-stone-100">
              <td className="px-4 py-3 font-medium">{b.ref}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{b.full_name}</div>
                <div className="text-xs text-stone-500">{b.whatsapp}</div>
              </td>
              <td className="px-4 py-3">
                <div>{b.date}</div>
                <div className="text-xs text-stone-500 capitalize">{b.shift}</div>
              </td>
              <td className="px-4 py-3 text-xs">
                {b.vehicle} · Zone {b.zone} · {b.guests}g
              </td>
              <td className="px-4 py-3 font-semibold">
                ₹{(b.total || 0).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">
                <StatusPill status={b.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button
                    data-testid={`confirm-${b.ref}`}
                    onClick={() => onSetStatus(b.ref, "confirmed")}
                    className="p-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                    title="Confirm"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    data-testid={`cancel-${b.ref}`}
                    onClick={() => onSetStatus(b.ref, "cancelled")}
                    className="p-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    data-testid={`view-${b.ref}`}
                    onClick={() => onView(b)}
                    className="p-1.5 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
