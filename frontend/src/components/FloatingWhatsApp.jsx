import { waLink } from "@/lib/api";

export default function FloatingWhatsApp({ message = "Hi! I want to book a Ranthambore safari." }) {
  return (
    <a
      data-testid="floating-whatsapp"
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-24 md:bottom-6 right-5 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white wa-pulse shadow-xl hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.36c-.27-.13-1.58-.78-1.83-.87-.25-.09-.42-.13-.6.14-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.13-1.14-.42-2.18-1.35-.81-.72-1.35-1.62-1.51-1.89-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.83-1.99-.22-.52-.45-.45-.62-.46l-.53-.01c-.18 0-.47.07-.71.34-.25.27-.94.92-.94 2.24 0 1.32.96 2.6 1.09 2.78.13.18 1.9 2.9 4.6 4.07.64.28 1.14.45 1.53.57.64.2 1.22.17 1.68.1.51-.08 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31zM16 5C9.92 5 5 9.92 5 16c0 1.94.51 3.77 1.4 5.36L5 27l5.86-1.36A10.9 10.9 0 0 0 16 27c6.08 0 11-4.92 11-11S22.08 5 16 5z"/>
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-black/80 text-white text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        Chat With Us — We Reply Instantly
      </span>
    </a>
  );
}
