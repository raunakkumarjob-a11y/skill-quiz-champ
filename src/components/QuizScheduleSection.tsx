import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";

const upcomingQuizzes = [
  {
    title: "General Knowledge Championship 2025",
    college: "XYZ Engineering College",
    date: "15 Jan 2025",
    time: "10:00 AM IST",
    conductor: "Dr. Sharma (HOD - Computer Science)",
    participants: 150
  },
  {
    title: "Technical Skills Assessment",
    college: "ABC Institute of Technology",
    date: "18 Jan 2025",
    time: "2:00 PM IST",
    conductor: "Prof. Kumar (Director - Academics)",
    participants: 200
  },
  {
    title: "Current Affairs Quiz - January",
    college: "PQR University",
    date: "22 Jan 2025",
    time: "11:30 AM IST",
    conductor: "Dr. Patel (Dean - Student Affairs)",
    participants: 120
  }
];

const QuizScheduleSection = () => {
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
          {upcomingQuizzes.map((quiz, index) => (
            <Card 
              key={index} 
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
                      {quiz.college}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{quiz.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span>{quiz.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-accent" />
                        <span>{quiz.participants} registered</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Conducted by: <span className="font-medium text-foreground">{quiz.conductor}</span>
                    </p>
                  </div>

                  {/* Register Button */}
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group min-w-[150px]">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
