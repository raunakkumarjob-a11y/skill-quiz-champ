import { Card, CardContent } from "@/components/ui/card";
import { Building2, GraduationCap, Users, CheckCircle } from "lucide-react";

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

const AdvantagesSection = () => {
  return (
    <section id="advantages" className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${advantage.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-center mb-6 group-hover:text-primary transition-colors">
                    {advantage.title}
                  </h3>

                  <div className="space-y-3">
                    {advantage.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
