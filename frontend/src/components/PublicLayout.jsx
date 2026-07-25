import { useEffect } from "react";
import Ticker from "@/components/Ticker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BottomNav from "@/components/BottomNav";

export default function PublicLayout({ children, transparentOnTop = true, title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", description);
    }
  }, [title, description]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1C1C1C]">
      <Ticker />
      <Navbar transparentOnTop={transparentOnTop} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <BottomNav />
    </div>
  );
}
