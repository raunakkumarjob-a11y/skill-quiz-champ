import { Card, CardContent } from "@/components/ui/card";
import { Trophy, LayoutDashboard, Calendar, Mail, TrendingUp, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Trophy,
    title: "Online Quiz Competition",
    description: "Students can participate in quizzes organized by their college and compete with peers.",
    gradient: "from-primary to-secondary"
  },
  {
    icon: LayoutDashboard,
    title: "College Dashboard",
    description: "HODs and Directors can create, manage, and monitor all quizzes from one place.",
    gradient: "from-secondary to-accent"
  },
  {
    icon: Calendar,
    title: "Schedule System",
    description: "Colleges can schedule upcoming quizzes and notify students automatically.",
    gradient: "from-accent to-primary"
  },
  {
    icon: Mail,
    title: "TestMail Feature",
    description: "Send test confirmation emails to participants and HODs after registration.",
    gradient: "from-primary to-accent"
  },
  {
    icon: TrendingUp,
    title: "Skill Improvement Hub",
    description: "Practice section for students to improve skills with unlimited mini quizzes.",
    gradient: "from-secondary to-primary"
  },
  {
    icon: Award,
    title: "Result & Ranking",
    description: "Automatically evaluate and display top scorers and overall college performance.",
    gradient: "from-accent to-secondary"
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="group h-full hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        <CardContent className="p-6 relative">
          <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {feature.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const FeaturesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Our Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Modern Education
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to conduct engaging quiz competitions and enhance student learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
