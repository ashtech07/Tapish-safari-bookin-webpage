import { TICKER_DISCLAIMER } from "@/lib/content";

export default function Ticker() {
  const text = `${TICKER_DISCLAIMER}     `;
  return (
    <div
      data-testid="disclaimer-ticker"
      className="w-full overflow-hidden bg-[#111111] text-white text-xs sm:text-sm py-2"
      role="region"
      aria-label="Disclaimer ticker"
    >
      <div className="ticker-track">
        <span className="px-6 tracking-wide">{text}</span>
        <span className="px-6 tracking-wide">{text}</span>
        <span className="px-6 tracking-wide">{text}</span>
        <span className="px-6 tracking-wide">{text}</span>
      </div>
    </div>
  );
}
