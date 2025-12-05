import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  message: string;
  image_url: string | null;
  created_at: string;
}

const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100 rotate-0" : "translate-y-12 opacity-0 rotate-2"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="group h-full hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden relative">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        
        <CardContent className="pt-8 pb-6 px-6 relative">
          {/* Quote icon */}
          <div className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors">
            <Quote className="h-12 w-12" />
          </div>

          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-14 w-14 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
              <AvatarImage src={testimonial.image_url || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg font-semibold">
                {testimonial.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{testimonial.name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(testimonial.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>
          
          <p className="text-foreground leading-relaxed italic">
            "{testimonial.message}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching testimonials:", error);
      return;
    }

    setTestimonials(data || []);
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 px-4 bg-gradient-to-b from-secondary/10 via-background to-primary/5 overflow-hidden">
      <div className="container mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary-foreground text-sm font-medium rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read reviews from our amazing community of educators and students
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
