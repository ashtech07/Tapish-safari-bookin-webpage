import { useState } from "react";
import { api, waLink } from "@/lib/api";
import { toast } from "sonner";
import { Phone, X } from "lucide-react";

export default function CallbackWidget() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/inquiries", {
        type: "callback",
        name,
        phone,
        context: { source: "homepage_widget" },
      });
      toast.success("Got it! We'll call you back shortly.");
      const wa = waLink(`Hi! Please call back ${name} on ${phone} about a Ranthambore safari.`);
      window.open(wa, "_blank");
      setName("");
      setPhone("");
      setOpen(false);
    } catch {
      toast.error("Couldn't submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      data-testid="callback-widget"
      className="hidden md:block fixed bottom-6 left-6 z-40 w-[320px] bg-white rounded-2xl shadow-2xl border border-[#C8860A]/30 overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3 bg-[#1A2B1F] text-white">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Phone className="w-4 h-4 text-[#C8860A]" /> Get a Free Call Back
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          data-testid="callback-widget-close"
          className="text-white/70 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={submit} className="p-5 space-y-3">
        <input
          data-testid="callback-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8860A]/40"
        />
        <input
          data-testid="callback-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8860A]/40"
        />
        <button
          data-testid="callback-submit"
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {loading ? "Sending..." : "Call Me Back"}
        </button>
      </form>
    </div>
  );
}
