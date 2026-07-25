import { useSiteImage } from "@/lib/siteImages";
import { SEED_IMAGES } from "@/lib/seedDefaults";

export default function BrandLogo({ size = 36, className = "" }) {
  const logo = useSiteImage("logo", SEED_IMAGES.logo);
  return (
    <div
      className={`shrink-0 rounded-full bg-[#F9F5EE] overflow-hidden flex items-center justify-center ring-1 ring-[#C8860A]/40 ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={logo} alt="Ranthambore Safari Curator logo" className="w-full h-full object-cover" />
    </div>
  );
}
