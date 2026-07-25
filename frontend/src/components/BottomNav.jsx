import { NavLink } from "react-router-dom";
import { Home, Calendar, Hotel, Package, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/safari-booking", label: "Book Safari", icon: Calendar },
  { to: "/hotels", label: "Hotels", icon: Hotel },
  { to: "/packages", label: "Packages", icon: Package },
  { to: "/contact", label: "Contact", icon: Phone },
];

export default function BottomNav() {
  return (
    <nav
      data-testid="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#1A2B1F] border-t border-white/10"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center py-2.5 gap-0.5 text-[10px] text-white/70",
                  isActive && "text-[#C8860A]"
                )
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
