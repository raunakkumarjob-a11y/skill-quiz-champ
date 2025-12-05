import { Users, Building2, Trophy } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  isVisible: boolean;
}

const AnimatedCounter = ({ end, suffix = "", duration = 2000, isVisible }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, isVisible]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const statItems = [
  { icon: Building2, label: "Active Colleges", value: 500, suffix: "+", gradient: "from-primary to-secondary" },
  { icon: Users, label: "Students Enrolled", value: 10000, suffix: "+", gradient: "from-secondary to-accent" },
  { icon: Trophy, label: "Quizzes Completed", value: 1000, suffix: "+", gradient: "from-accent to-primary" },
];

const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statItems.map((item, index) => (
            <div
              key={index}
              className={`group flex flex-col items-center p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                <item.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className={`text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                <AnimatedCounter end={item.value} suffix={item.suffix} isVisible={isVisible} />
              </h3>
              <p className="text-muted-foreground text-center font-medium text-lg">{item.label}</p>
              
              {/* Decorative gradient line */}
              <div className={`h-1 w-16 mt-4 rounded-full bg-gradient-to-r ${item.gradient} opacity-50 group-hover:w-24 transition-all duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
