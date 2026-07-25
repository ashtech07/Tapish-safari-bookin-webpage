import { MessageSquare, Phone } from "lucide-react";

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} d ago`;
}

const TYPE_STYLES = {
  callback: "bg-teal-100 text-teal-800",
  contact: "bg-blue-100 text-blue-800",
  package: "bg-purple-100 text-purple-800",
  custom_package: "bg-purple-100 text-purple-800",
  hotel: "bg-amber-100 text-amber-800",
  tatkal_request: "bg-red-100 text-red-800",
};

function TypeBadge({ type }) {
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
        TYPE_STYLES[type] || "bg-stone-100"
      }`}
    >
      {type}
    </span>
  );
}

/**
 * Table of inquiries shown in the admin panel.
 */
export default function InquiriesTable({ inquiries }) {
  if (inquiries.length === 0) {
    return (
      <div className="py-16 text-center">
        <MessageSquare className="w-12 h-12 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500 text-sm">No inquiries found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-left text-xs text-stone-500 uppercase tracking-widest">
          <tr>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Sender</th>
            <th className="px-4 py-3">Message / Context</th>
            <th className="px-4 py-3">Received</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((i) => (
            <tr key={i.id} className="border-t border-stone-100">
              <td className="px-4 py-3">
                <TypeBadge type={i.type} />
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold">{i.name}</div>
                {(i.phone || i.email) && (
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    {i.phone && (
                      <>
                        <Phone className="w-3 h-3" />
                        {i.phone}
                      </>
                    )}
                    {i.email && <span className="ml-2">{i.email}</span>}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 max-w-md">
                {i.message ? (
                  <span>{i.message}</span>
                ) : (
                  <span className="text-stone-400 italic">No message provided</span>
                )}
              </td>
              <td className="px-4 py-3 text-stone-500">{timeAgo(i.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
