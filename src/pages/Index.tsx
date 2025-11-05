import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CollegeConnectSection from "@/components/CollegeConnectSection";
import QuizScheduleSection from "@/components/QuizScheduleSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CollegeConnectSection />
        <QuizScheduleSection />
        <AdvantagesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
