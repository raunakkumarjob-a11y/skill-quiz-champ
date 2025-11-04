import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle2, ArrowRight } from "lucide-react";

const benefits = [
  "Easy quiz creation and management dashboard",
  "Automated student notifications and reminders",
  "Transparent performance tracking and analytics",
  "Secure and reliable platform infrastructure",
  "Dedicated support for educational institutions",
  "Free onboarding and training for faculty"
];

const CollegeConnectSection = () => {
  return (
    <section id="connect" className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden border-2 hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-background to-muted/30">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 w-fit">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">For Educational Institutions</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Connect Your College with{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Skill Quiz Lab
                    </span>
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    We provide a comprehensive platform for colleges to conduct online quiz events easily. 
                    Connect with us to promote student engagement, enhance academic competition, and track skill growth.
                  </p>

                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group w-fit">
                    Connect College Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Right Content - Benefits */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-muted/50 to-background flex flex-col justify-center">
                  <h3 className="text-xl font-semibold mb-6 text-foreground">Why Partner With Us?</h3>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CollegeConnectSection;
