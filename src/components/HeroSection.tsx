import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, GraduationCap, Briefcase, Code2, Trophy, Sparkles } from "lucide-react";
import ThreeBackground from "./ThreeBackground";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* 3D Background */}
      <ThreeBackground />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full mb-8 animate-fade-in backdrop-blur-sm">
            <Code2 className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Where Knowledge Meets Competition
            </span>
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
          </div>

          {/* Main Headline with Gradient */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            <span className="block text-foreground mb-2">Empower Students with</span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Smart Quiz Competitions
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-50" />
            </span>
          </h1>

          {/* Enhanced Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-foreground">Skill Quiz Lab</span> empowers colleges to conduct 
            <span className="text-primary font-medium"> digital quizzes effortlessly</span> – managed by 
            HODs, Directors & Faculty to enhance learning and boost student skills through 
            <span className="text-secondary font-medium"> competitive challenges</span>.
          </p>

          {/* CTA Buttons - Redesigned */}
          <div className="flex flex-wrap gap-4 justify-center items-center mb-16">
            {/* Primary CTA */}
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-primary/25 hover:scale-105 group"
              onClick={() => window.open("https://quizappresultportal.vercel.app/", "_blank")}
            >
              <Trophy className="mr-2 h-5 w-5" />
              View Results
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Secondary CTAs */}
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-lg px-6 py-6 rounded-xl backdrop-blur-sm transition-all hover:scale-105"
              onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Quiz Schedule
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-secondary/30 hover:border-secondary hover:bg-secondary/10 text-lg px-6 py-6 rounded-xl backdrop-blur-sm transition-all hover:scale-105"
              onClick={() => document.getElementById('images')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <GraduationCap className="mr-2 h-5 w-5 text-secondary" />
              Gallery
            </Button>

            <Button
              size="lg"
              className="bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-all text-lg px-6 py-6 rounded-xl shadow-lg hover:shadow-accent/25 hover:scale-105"
              onClick={() => window.open('https://careerlink-suite.vercel.app/', '_blank')}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Career Portal
            </Button>
          </div>

          {/* Stats Cards - Redesigned */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: "500+", label: "Active Colleges", gradient: "from-primary to-secondary" },
              { value: "10K+", label: "Students Enrolled", gradient: "from-secondary to-accent" },
              { value: "1000+", label: "Quizzes Completed", gradient: "from-accent to-primary" }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.label}
                </div>
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-5 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-5 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
    </section>
  );
};

export default HeroSection;
