import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PurposeSection from "@/components/PurposeSection";
import ProjectsSection from "@/components/ProjectsSection";
import LabSection from "@/components/LabSection";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import SectionTransition from "@/components/SectionTransition";
import ParallaxGlow from "@/components/ParallaxGlow";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading screen while assets initialize, then reveal
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Loading skeleton overlay */}
      {isLoading && <LoadingSkeleton />}

      {/* Background glow effect with parallax */}
      <ParallaxGlow />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      <Navbar />
      
      <SectionTransition immediate>
        <HeroSection />
      </SectionTransition>
      
      <SectionTransition>
        <PurposeSection />
      </SectionTransition>
      
      <SectionTransition>
        <ProjectsSection />
      </SectionTransition>
      
      <SectionTransition>
        <LabSection />
      </SectionTransition>
      
      <SectionTransition>
        <Footer />
      </SectionTransition>
    </main>
  );
};

export default Index;