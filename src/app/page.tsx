import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { ParticipationRegistrationSection } from "@/components/participation-registration-section";
import { ResearchMattersSection } from "@/components/research-matters-section";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">
        <HeroSection />
        <ResearchMattersSection />
        <ParticipationRegistrationSection />
      </main>
      <Footer />
    </div>
  );
}
