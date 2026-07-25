import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function Row({ k, v }) {
  return (
    <div className="flex justify-between border-b border-stone-100 py-1">
      <span className="text-stone-500">{k}</span>
      <span className="font-medium text-right">{String(v)}</span>
    </div>
  );
}

/**
 * Modal dialog rendering full details for a single booking.
 */
export default function BookingDetailModal({ booking, onClose }) {
  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Booking {booking?.ref}
          </DialogTitle>
        </DialogHeader>
        {booking && (
          <div className="text-sm space-y-2">
            <Row k="Status" v={booking.status} />
            <Row k="Name" v={booking.full_name} />
            <Row k="WhatsApp" v={booking.whatsapp} />
            <Row k="Email" v={booking.email} />
            <Row k="Date" v={`${booking.date} (${booking.shift})`} />
            <Row k="Vehicle" v={booking.vehicle} />
            <Row k="Zone" v={booking.zone} />
            <Row k="Nationality" v={booking.nationality} />
            <Row k="Guests" v={booking.guests} />
            <Row k="Per Person" v={`₹${booking.per_person?.toLocaleString("en-IN")}`} />
            <Row k="Total" v={`₹${booking.total?.toLocaleString("en-IN")}`} />
            <Row k="Add-ons" v={(booking.addons || []).join(", ") || "—"} />
            <Row
              k="ID Proof"
              v={`${booking.id_proof_type || "—"} ${booking.id_proof_number || ""}`}
            />
            <Row
              k="Emergency"
              v={`${booking.emergency_contact_name || "—"} ${booking.emergency_contact_number || ""}`}
            />
            <Row k="Created" v={booking.created_at} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
