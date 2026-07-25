import { Hotel as HotelIcon, Pencil, Trash2 } from "lucide-react";

/**
 * Read-only table of hotels shown in the admin panel.
 * Fires `onEdit`/`onDelete` callbacks on row-level actions.
 */
export default function HotelTable({ hotels, onEdit, onDelete }) {
  if (hotels.length === 0) {
    return (
      <div className="py-16 text-center">
        <HotelIcon className="w-12 h-12 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500 text-sm">No hotels added yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-widest">
          <tr>
            <th className="px-4 py-3">Hotel Name</th>
            <th className="px-4 py-3">Star Rating</th>
            <th className="px-4 py-3">Distance</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((h) => (
            <tr key={h.id} className="border-t border-stone-100">
              <td className="px-4 py-3 font-medium">{h.name}</td>
              <td className="px-4 py-3 text-[#C8860A]">
                {"★".repeat(Math.max(0, Math.min(5, Math.round(h.stars || 0))))}
              </td>
              <td className="px-4 py-3 text-stone-600">{h.distance}</td>
              <td className="px-4 py-3">
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-green-100 text-green-800">
                  Live
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button
                    data-testid={`edit-hotel-${h.id}`}
                    onClick={() => onEdit(h)}
                    className="p-1.5 rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    data-testid={`delete-hotel-${h.id}`}
                    onClick={() => onDelete(h)}
                    className="p-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
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
