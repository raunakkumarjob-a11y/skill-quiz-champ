import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface QuizDate {
  date: string;
  quizzes: Array<{
    id: string;
    title: string;
    start_time: string;
    colleges: { name: string };
  }>;
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
        colleges(name)
      `)
      .eq("status", "scheduled")
      .gte("quiz_date", new Date().toISOString().split("T")[0])
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

  const modifiers = {
    booked: quizDates.map(q => new Date(q.date))
  };

  const modifiersClassNames = {
    booked: "bg-red-500 text-white hover:bg-red-600"
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
            View available and scheduled quiz dates
          </p>
          <div className="flex gap-4 justify-center mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Quiz Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Available Slot</span>
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
              {selectedDateQuizzes ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Quiz Scheduled (Slot Taken)</span>
                  </div>
                  {selectedDateQuizzes.quizzes.map((quiz) => (
                    <div key={quiz.id} className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <h4 className="font-semibold text-red-900 dark:text-red-100">{quiz.title}</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        College: {quiz.colleges?.name}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Time: {quiz.start_time}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Available Slot</span>
                  </div>
                  <p className="text-muted-foreground">
                    {date ? "No quizzes scheduled for this date" : "Select a date to view details"}
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
