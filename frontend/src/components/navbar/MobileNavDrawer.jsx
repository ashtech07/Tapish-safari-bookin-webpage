import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

/**
 * Full-screen mobile navigation drawer.
 * Rendered via portal to avoid clipping by the header's backdrop-blur.
 */
export default function MobileNavDrawer({ open, onClose, links }) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      data-testid="mobile-drawer"
      className="fixed inset-0 z-[100] bg-[#1A2B1F] text-white flex flex-col overflow-y-auto"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <span className="font-serif text-xl">Menu</span>
        <button
          data-testid="mobile-menu-close"
          onClick={onClose}
          aria-label="Close menu"
          className="p-2"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 flex flex-col px-6 py-8 gap-5 text-2xl font-serif">
        <Link to="/" onClick={onClose}>Home</Link>
        {links.map((l) => (
          <Link key={l.to} to={l.to} onClick={onClose}>
            {l.label}
          </Link>
        ))}
        <Link
          to="/safari-booking"
          onClick={onClose}
          className="mt-4 inline-flex justify-center px-6 py-3 rounded-full bg-[#C8860A] text-white text-base"
        >
          Book Now
        </Link>
      </nav>
    </div>,
    document.body
  );
}
