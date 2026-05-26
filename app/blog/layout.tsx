import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Shared chrome for all blog routes. (Cross-page nav links are a known
// follow-up — see audit; the navbar's section anchors target the home page.)
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
