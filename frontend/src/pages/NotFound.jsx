import { Link } from "react-router-dom";
import PublicLayout from "@/components/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout title="Lost in the Jungle — Ranthambore Safari Curator" description="Page not found." transparentOnTop={false}>
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-[#F9F5EE]">
        <div className="text-center max-w-xl">
          <img
            src="https://images.pexels.com/photos/15345428/pexels-photo-15345428.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Tiger lost in jungle"
            className="w-44 h-44 mx-auto rounded-full object-cover mb-8 ring-4 ring-[#C8860A]/40"
          />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">Lost in the Jungle?</h1>
          <p className="text-stone-600 mb-8">Let&apos;s get you back to safety.</p>
          <Link
            to="/"
            data-testid="notfound-home-btn"
            className="inline-flex items-center px-6 py-3 rounded-full bg-[#C8860A] hover:bg-[#a86f08] text-white font-semibold"
          >Go Home</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
