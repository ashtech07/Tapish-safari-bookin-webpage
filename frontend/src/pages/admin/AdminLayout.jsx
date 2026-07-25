import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, MessageSquare, Activity, LogOut, DollarSign, Star, ImageIcon, Hotel } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/image-manager", label: "Image Manager", icon: ImageIcon },
  { to: "/admin/hotels", label: "Hotels", icon: Hotel },
  { to: "/admin/live-feed", label: "Live Feed", icon: Activity },
];

const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000;

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("rtc_admin_token");
    if (!token) {
      navigate("/admin", { replace: true });
      return;
    }
    // session expiry
    let lastTouch = Number(sessionStorage.getItem("rtc_admin_touch") || Date.now());
    sessionStorage.setItem("rtc_admin_touch", String(Date.now()));
    const interval = setInterval(() => {
      const touched = Number(sessionStorage.getItem("rtc_admin_touch") || 0);
      if (Date.now() - touched > SESSION_TIMEOUT_MS) {
        sessionStorage.removeItem("rtc_admin_token");
        sessionStorage.removeItem("rtc_admin_touch");
        navigate("/admin", { replace: true });
      }
    }, 30000);
    const handler = () => sessionStorage.setItem("rtc_admin_touch", String(Date.now()));
    window.addEventListener("click", handler);
    window.addEventListener("keydown", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("click", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [navigate]);

  function logout() {
    sessionStorage.removeItem("rtc_admin_token");
    sessionStorage.removeItem("rtc_admin_touch");
    navigate("/admin", { replace: true });
  }

  return (
    <div className="min-h-screen flex bg-[#F0EDE8]">
      <aside data-testid="admin-sidebar" className="w-60 bg-[#1A2B1F] text-white flex flex-col">
        <div className="px-5 py-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-[#C8860A]/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#C8860A]" />
          </div>
          <div className="font-serif text-base leading-tight">
            Ranthambore Safari<br />Curator
          </div>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              data-testid={`admin-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-5 py-3 text-sm border-l-4 border-transparent text-white/80 hover:bg-white/5",
                isActive && "border-[#C8860A] bg-white/5 text-white"
              )}
            >
              <Icon className="w-4 h-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 text-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 live-dot" /> Live · Auto-refreshes
          </div>
          <button
            data-testid="admin-logout"
            onClick={logout}
            className="flex items-center gap-2 text-white/70 hover:text-white"
          ><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
