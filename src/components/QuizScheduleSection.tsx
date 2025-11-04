import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  quiz_date: string;
  start_time: string;
  current_participants: number;
  colleges: { name: string };
  profiles: { full_name: string };
  isRegistered?: boolean;
}

const QuizScheduleSection = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, [user]);

  const fetchQuizzes = async () => {
    setLoading(true);
    
    // Fetch upcoming quizzes
    const { data: quizzesData, error: quizzesError } = await supabase
      .from("quizzes")
      .select(`
        id,
        title,
        quiz_date,
        start_time,
        current_participants,
        colleges(name),
        profiles(full_name)
      `)
      .eq("status", "scheduled")
      .gte("quiz_date", new Date().toISOString().split("T")[0])
      .order("quiz_date", { ascending: true })
      .limit(5);

    if (quizzesError) {
      console.error("Error fetching quizzes:", quizzesError);
      setLoading(false);
      return;
    }

    // If user is logged in, check registration status
    if (user && quizzesData) {
      const quizIds = quizzesData.map(q => q.id);
      const { data: registrations } = await supabase
        .from("quiz_registrations")
        .select("quiz_id")
        .eq("student_id", user.id)
        .in("quiz_id", quizIds);

      const registeredIds = new Set(registrations?.map(r => r.quiz_id) || []);
      
      setQuizzes(
        quizzesData.map(quiz => ({
          ...quiz,
          isRegistered: registeredIds.has(quiz.id)
        }))
      );
    } else {
      setQuizzes(quizzesData || []);
    }

    setLoading(false);
  };

  const handleRegister = async (quizId: string) => {
    if (!user) {
      toast.error("Please login to register for quizzes");
      return;
    }

    const { error } = await supabase
      .from("quiz_registrations")
      .insert({
        quiz_id: quizId,
        student_id: user.id,
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("You are already registered for this quiz");
      } else {
        toast.error("Failed to register: " + error.message);
      }
    } else {
      toast.success("Successfully registered for the quiz!");
      fetchQuizzes();
    }
  };

  if (loading) {
    return (
      <section id="schedule" className="py-20 bg-gradient-to-b from-background to-muted/30">
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
    <section id="schedule" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Quiz Schedule
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check out the latest quiz competitions and register to participate
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
                    {/* Quiz Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {quiz.colleges?.name || "College Name"}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{new Date(quiz.quiz_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-secondary" />
                          <span>{quiz.start_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span>{quiz.current_participants} registered</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Conducted by: <span className="font-medium text-foreground">{quiz.profiles?.full_name || "Faculty"}</span>
                      </p>
                    </div>

                    {/* Register Button */}
                    {quiz.isRegistered ? (
                      <Button disabled className="min-w-[150px]">
                        Already Registered
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRegister(quiz.id)}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group min-w-[150px]"
                      >
                        Register Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="border-2 hover:bg-primary hover:text-primary-foreground transition-all">
            View All Scheduled Quizzes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuizScheduleSection;
