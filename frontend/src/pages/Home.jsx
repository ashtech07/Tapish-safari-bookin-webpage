import { useEffect, useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import CallbackWidget from "@/components/CallbackWidget";
import FAQAccordion from "@/components/FAQAccordion";
import { api } from "@/lib/api";
import { HERO_ALERTS } from "@/lib/content";

import HomeHero from "@/components/home/HomeHero";
import HomeServices from "@/components/home/HomeServices";
import HomeZones from "@/components/home/HomeZones";
import { HomeHowItWorks, HomeTatkalPromo } from "@/components/home/HomeHowAndTatkal";
import { HomeAttractions, HomeTestimonials } from "@/components/home/HomeAttractionsAndTestimonials";

function AlertTicker() {
  return (
    <div className="bg-[#111111] text-white py-3 overflow-hidden">
      <div className="ticker-track-fast">
        <span className="px-8 text-sm">{HERO_ALERTS}</span>
        <span className="px-8 text-sm">{HERO_ALERTS}</span>
        <span className="px-8 text-sm">{HERO_ALERTS}</span>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-xs tracking-[0.3em] uppercase text-[#C8860A] mb-3">FAQ</div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold">
            Everything You Want to Know About Ranthambore Safari
          </h2>
        </div>
        <FAQAccordion />
      </div>
    </section>
  );
}

export default function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api
      .get("/reviews")
      .then(({ data }) => setReviews(data || []))
      .catch(() => {});
  }, []);

  return (
    <PublicLayout
      title="Ranthambore Safari Booking — Book Tiger Safari Online | Ranthambore Safari Curator"
      description="Book Ranthambore Jeep Safari, Canter Safari and Tatkal Safari online. Best prices, instant WhatsApp confirmation. Trusted booking partner for Ranthambore National Park."
    >
      <HomeHero />
      <AlertTicker />
      <HomeServices />
      <HomeZones />
      <HomeHowItWorks />
      <HomeTatkalPromo />
      <HomeAttractions />
      <FAQSection />
      <HomeTestimonials reviews={reviews} />
      <CallbackWidget />
    </PublicLayout>
  );
}
