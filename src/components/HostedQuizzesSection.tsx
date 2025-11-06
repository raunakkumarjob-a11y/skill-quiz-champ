import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Quiz {
  id: string;
  title: string;
  quiz_date: string;
  start_time: string;
  colleges: { 
    name: string;
    contact_email: string;
    location: string;
  };
}

const HostedQuizzesSection = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("quizzes")
      .select(`
        id,
        title,
        quiz_date,
        start_time,
        colleges(name, contact_email, location)
      `)
      .eq("status", "scheduled")
      .gte("quiz_date", new Date().toISOString().split("T")[0])
      .order("quiz_date", { ascending: true })
      .limit(5);

    if (error) {
      console.error("Error fetching quizzes:", error);
    } else {
      setQuizzes(data || []);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <section id="hosted-quizzes" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading quizzes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hosted-quizzes" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hosted Quizzes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore quizzes being hosted at colleges across the country
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {quizzes.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Upcoming Quizzes</h3>
              <p className="text-muted-foreground">Check back later for new quiz schedules</p>
            </Card>
          ) : (
            quizzes.map((quiz, index) => (
              <Card 
                key={quiz.id} 
                className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {quiz.title}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">{quiz.colleges?.name}</span>
                          {quiz.colleges?.location && (
                            <span className="text-muted-foreground">• {quiz.colleges.location}</span>
                          )}
                        </div>
                        
                        {quiz.colleges?.contact_email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-secondary" />
                            <a 
                              href={`mailto:${quiz.colleges.contact_email}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {quiz.colleges.contact_email}
                            </a>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm pt-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-accent" />
                            <span>{new Date(quiz.quiz_date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-secondary" />
                            <span>{quiz.start_time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            View All Hosted Quizzes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HostedQuizzesSection;
