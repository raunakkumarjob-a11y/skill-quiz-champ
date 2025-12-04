import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Quiz {
  id: string;
  title: string;
  quiz_date: string;
  start_time: string;
  status: string;
  colleges: { name: string } | null;
}

interface QuizDate {
  date: string;
  quizzes: Quiz[];
}

const QuizCalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [quizDates, setQuizDates] = useState<QuizDate[]>([]);
  const [selectedDateQuizzes, setSelectedDateQuizzes] = useState<QuizDate | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const found = quizDates.find(q => q.date === dateStr);
      setSelectedDateQuizzes(found || null);
    }
  }, [date, quizDates]);

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from("quizzes")
      .select(`
        id,
        title,
        quiz_date,
        start_time,
        status,
        colleges(name)
      `)
      .order("quiz_date", { ascending: true });

    if (error) {
      console.error("Error fetching quizzes:", error);
      return;
    }

    const grouped = data.reduce((acc: QuizDate[], quiz) => {
      const existing = acc.find(q => q.date === quiz.quiz_date);
      if (existing) {
        existing.quizzes.push(quiz);
      } else {
        acc.push({
          date: quiz.quiz_date,
          quizzes: [quiz]
        });
      }
      return acc;
    }, []);

    setQuizDates(grouped);
  };

  // Get dates by status
  const getDatesByStatus = (status: string) => {
    return quizDates
      .filter(q => q.quizzes.some(quiz => quiz.status === status))
      .map(q => new Date(q.date));
  };

  const completedDates = getDatesByStatus("completed");
  const scheduledDates = getDatesByStatus("scheduled");
  const runningDates = getDatesByStatus("running");

  const modifiers = {
    completed: completedDates,
    scheduled: scheduledDates,
    running: runningDates
  };

  const modifiersClassNames = {
    completed: "bg-green-500 text-white hover:bg-green-600",
    scheduled: "bg-yellow-500 text-white hover:bg-yellow-600",
    running: "bg-blue-500 text-white hover:bg-blue-600"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "scheduled":
        return "bg-yellow-500";
      case "running":
        return "bg-blue-500";
      default:
        return "bg-muted";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default" as const;
      case "scheduled":
        return "secondary" as const;
      case "running":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const getStatusCardStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50 dark:bg-green-950/20";
      case "scheduled":
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20";
      case "running":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950/20";
      default:
        return "border-muted";
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case "completed":
        return { title: "text-green-900 dark:text-green-100", sub: "text-green-700 dark:text-green-300" };
      case "scheduled":
        return { title: "text-yellow-900 dark:text-yellow-100", sub: "text-yellow-700 dark:text-yellow-300" };
      case "running":
        return { title: "text-blue-900 dark:text-blue-100", sub: "text-blue-700 dark:text-blue-300" };
      default:
        return { title: "text-foreground", sub: "text-muted-foreground" };
    }
  };

  return (
    <section id="calendar" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quiz{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Calendar Schedule
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View quiz schedule and availability
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Running</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted border rounded"></div>
              <span>Available</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="rounded-md border pointer-events-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateQuizzes && selectedDateQuizzes.quizzes.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateQuizzes.quizzes.map((quiz) => {
                    const styles = getStatusTextStyle(quiz.status);
                    return (
                      <div 
                        key={quiz.id} 
                        className={`p-4 border rounded-lg ${getStatusCardStyle(quiz.status)}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-semibold ${styles.title}`}>{quiz.title}</h4>
                          <Badge 
                            variant={getStatusBadgeVariant(quiz.status)}
                            className={`${getStatusColor(quiz.status)} text-white capitalize`}
                          >
                            {quiz.status}
                          </Badge>
                        </div>
                        {quiz.colleges?.name && (
                          <p className={`text-sm mt-1 ${styles.sub}`}>
                            College: {quiz.colleges.name}
                          </p>
                        )}
                        <p className={`text-sm mt-1 ${styles.sub}`}>
                          Time: {quiz.start_time}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-muted border rounded-full"></div>
                    <span className="text-sm font-medium text-muted-foreground">Available Slot</span>
                  </div>
                  <p className="text-muted-foreground">
                    {date ? "No quizzes scheduled for this date - slot available!" : "Select a date to view details"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuizCalendarView;
