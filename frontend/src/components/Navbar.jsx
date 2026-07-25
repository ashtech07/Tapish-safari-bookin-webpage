import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import NavbarBrand from "@/components/navbar/NavbarBrand";
import MobileNavDrawer from "@/components/navbar/MobileNavDrawer";

const LINKS = [
  { to: "/safari-booking", label: "Safari Booking" },
  { to: "/hotels", label: "Hotels" },
  { to: "/packages", label: "Packages" },
  { to: "/contact", label: "Contact" },
];

function DesktopNavLinks() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
          className={({ isActive }) =>
            cn(
              "text-sm font-medium text-white/90 hover:text-[#C8860A] transition-colors",
              isActive && "text-[#C8860A]"
            )
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Navbar({ transparentOnTop = true }) {
  const [scrolled, setScrolled] = useState(!transparentOnTop);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!transparentOnTop) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  return (
    <header
      data-testid="site-navbar"
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300 backdrop-blur-[2px]",
        scrolled ? "bg-[#1A2B1F]/95 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
        <NavbarBrand />
        <DesktopNavLinks />

        <div className="hidden md:block">
          <Link
            to="/safari-booking"
            data-testid="nav-book-now"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-semibold text-sm transition-colors"
          >
            Book Now
          </Link>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="md:hidden text-white p-2"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <MobileNavDrawer open={open} onClose={() => setOpen(false)} links={LINKS} />
    </header>
  );
}
