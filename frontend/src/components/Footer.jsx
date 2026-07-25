import { Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { WHATSAPP_DISPLAY, CALL_NUMBER, EMAIL_ADDRESS, OFFICE_ADDRESS } from "@/lib/api";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#C8860A] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="font-serif text-xl font-bold">Ranthambore Safari Curator</div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Independent safari booking concierge for Ranthambore National Park. Real humans, instant WhatsApp confirmations.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li><Link to="/safari-booking" className="hover:text-[#C8860A]">Safari Booking</Link></li>
            <li><Link to="/hotels" className="hover:text-[#C8860A]">Hotels</Link></li>
            <li><Link to="/packages" className="hover:text-[#C8860A]">Packages</Link></li>
            <li><Link to="/contact" className="hover:text-[#C8860A]">Contact</Link></li>
            <li><Link to="/#faq" className="hover:text-[#C8860A]">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-4">Contact</h4>
          <ul className="space-y-3 text-white/70 text-sm">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#C8860A]" />{CALL_NUMBER}</li>
            <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#C8860A]" />{WHATSAPP_DISPLAY}</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#C8860A]" />{EMAIL_ADDRESS}</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#C8860A] mt-0.5" />{OFFICE_ADDRESS}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row gap-3 justify-between text-xs text-white/50">
          <span>Disclaimer: Ranthambore Safari Curator is a private safari facilitation service. Not the official Rajasthan Forest Department website.</span>
          <span>© 2026 Ranthambore Safari Curator. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
