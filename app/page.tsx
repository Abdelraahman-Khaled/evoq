import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { FeaturedMenu } from "@/components/home/FeaturedMenu";

export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-gold-400 selection:text-black">
      <Navbar />
      <Hero />
      <Story />
      <FeaturedMenu />

      {/* Footer Placeholder */}
      <footer className="py-12 bg-neutral-950 border-t border-white/5 text-center text-white/40 text-sm">
        <p>© 2026 ÉVOQUÉ Restaurant. Park Inn by Radisson, Najran.</p>
      </footer>
    </main>
  );
}

