import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CollegeConnectSection from "@/components/CollegeConnectSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import StatsSection from "@/components/StatsSection";
import HostedQuizzesSection from "@/components/HostedQuizzesSection";
import QuizCalendarView from "@/components/QuizCalendarView";
import QuizImagesSection from "@/components/QuizImagesSection";
import EventMemoriesSection from "@/components/EventMemoriesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TestimonialForm from "@/components/TestimonialForm";
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
        <HostedQuizzesSection />
        <QuizCalendarView />
        <QuizImagesSection />
        <EventMemoriesSection />
        <TestimonialsSection />
        <TestimonialForm />
        <AdvantagesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
