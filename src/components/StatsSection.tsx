import { Users, Building2, Trophy } from "lucide-react";

const StatsSection = () => {


  const statItems = [
    { icon: Building2, label: "Active Colleges", value: "500+", color: "text-blue-500" },
    { icon: Users, label: "Students", value: "10K+", color: "text-green-500" },
    { icon: Trophy, label: "Quizzes Hosted", value: "1000+", color: "text-purple-500" },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-muted/50 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-8 rounded-2xl bg-card border-2 border-border hover:border-primary transition-all hover:shadow-lg"
            >
              <div className={`p-4 rounded-full bg-primary/10 mb-4`}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <h3 className="text-4xl font-bold mb-2">{item.value}</h3>
              <p className="text-muted-foreground text-center">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
