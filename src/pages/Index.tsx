import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import PersonalProjectsSection from "@/components/PersonalProjectsSection";
import UtilityToolsSection from "@/components/UtilityToolsSection";
import LuxeDivider from "@/components/LuxeDivider";
import Footer from "@/components/Footer";
import LayeredBackdrop from "@/components/LayeredBackdrop";
import FloatingParticles from "@/components/FloatingParticles";
import SectionTransition from "@/components/SectionTransition";
import ParallaxGlow from "@/components/ParallaxGlow";
import SpaceLoader from "@/components/SpaceLoader";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Space-themed particle-accelerator boot screen (fades itself out) */}
      {isLoading && <SpaceLoader onDone={() => setIsLoading(false)} />}

      {/* Layered graphics stack — nebula, stars, aurora, grid floor */}
      <LayeredBackdrop />

      {/* Background glow effect with parallax */}
      <ParallaxGlow />

      {/* Floating particles */}
      <FloatingParticles />

      <Navbar />

      <SectionTransition immediate>
        <HeroSection />
      </SectionTransition>

      <SectionTransition>
        <ProjectsSection />
      </SectionTransition>

      {/* Quiet hairline hand-off — light sweep + breathing gem */}
      <LuxeDivider />

      <SectionTransition>
        <UtilityToolsSection />
      </SectionTransition>

      <LuxeDivider />

      <SectionTransition>
        <PersonalProjectsSection />
      </SectionTransition>

      <SectionTransition>
        <Footer />
      </SectionTransition>
    </main>
  );
};

export default Index;