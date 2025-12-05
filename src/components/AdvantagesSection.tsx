import { Card, CardContent } from "@/components/ui/card";
import { Building2, GraduationCap, Users, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const advantages = [
  {
    icon: Building2,
    title: "For Colleges",
    color: "from-primary to-secondary",
    benefits: [
      "Easy to conduct and manage quizzes",
      "Transparent performance tracking",
      "Enhance academic competition culture",
      "Build digital learning ecosystem"
    ]
  },
  {
    icon: GraduationCap,
    title: "For Students",
    color: "from-secondary to-accent",
    benefits: [
      "Practice and improve skills anytime",
      "Compete with other college students",
      "Instant results and ranking",
      "Track personal progress and growth"
    ]
  },
  {
    icon: Users,
    title: "For Faculty / HOD / Director",
    color: "from-accent to-primary",
    benefits: [
      "Simplify quiz creation and scheduling",
      "Send automatic emails to participants",
      "Track participation reports",
      "Monitor student performance trends"
    ]
  }
];

const AdvantageCard = ({ advantage, index }: { advantage: typeof advantages[0]; index: number }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const Icon = advantage.icon;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className="group h-full hover:shadow-2xl transition-all duration-500 border-2 border-border hover:border-primary/50 bg-card/80 backdrop-blur-sm overflow-hidden relative">
        {/* Background gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${advantage.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        <CardContent className="p-8 relative">
          <div className={`w-20 h-20 bg-gradient-to-br ${advantage.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mx-auto shadow-xl`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-center mb-8 group-hover:text-primary transition-colors">
            {advantage.title}
          </h3>

          <div className="space-y-4">
            {advantage.benefits.map((benefit, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-3 transition-all duration-500 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150 + idx * 100 + 200}ms` }}
              >
                <div className={`p-1 rounded-full bg-gradient-to-br ${advantage.color}`}>
                  <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
                </div>
                <span className="text-muted-foreground leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdvantagesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section id="advantages" className="py-24 bg-gradient-to-br from-muted/30 via-background to-primary/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Benefits for{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Everyone
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Skill Quiz Lab provides value to all stakeholders in the educational ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <AdvantageCard key={index} advantage={advantage} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
