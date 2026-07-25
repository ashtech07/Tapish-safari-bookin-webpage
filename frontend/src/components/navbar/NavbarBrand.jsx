import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useSiteImage } from "@/lib/siteImages";
import { SEED_IMAGES } from "@/lib/seedDefaults";

/**
 * Ranthambore Safari Curator brand mark used in the navbar.
 */
export default function NavbarBrand() {
  const logo = useSiteImage("logo", SEED_IMAGES.logo);

  return (
    <Link to="/" data-testid="logo-link" className="flex items-center gap-3">
      {logo ? (
        <img
          src={logo}
          alt="Ranthambore Safari Curator logo"
          className="w-10 h-10 rounded-full object-cover shadow-md"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#C8860A] flex items-center justify-center shadow-md">
          <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
      )}
      <div className="leading-tight">
        <div className="font-serif text-white text-lg sm:text-xl font-bold">
          Ranthambore Safari Curator
        </div>
        <div className="text-[10px] tracking-[0.28em] text-[#C8860A] uppercase">
          Ranthambore
        </div>
      </div>
    </Link>
  );
}
