import { Card, CardContent } from "@/components/ui/card";
import { Trophy, LayoutDashboard, Calendar, Mail, TrendingUp, Award } from "lucide-react";

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

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Modern Education
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to conduct engaging quiz competitions and enhance student learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
