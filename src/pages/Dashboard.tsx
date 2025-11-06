import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Users, Trophy, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface College {
  id: string;
  name: string;
}

interface Quiz {
  id: string;
  title: string;
  quiz_date: string;
  start_time: string;
  status: string;
  colleges: { name: string };
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    college_id: "",
    quiz_date: "",
    start_time: "",
    end_time: "",
    max_participants: "",
  });

  useEffect(() => {
    fetchColleges();
    fetchQuizzes();
  }, []);

  const fetchColleges = async () => {
    const { data, error } = await supabase
      .from("colleges")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Error fetching colleges:", error);
    } else {
      setColleges(data || []);
    }
  };

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
      .eq("conducted_by", user?.id)
      .order("quiz_date", { ascending: false });

    if (error) {
      console.error("Error fetching quizzes:", error);
    } else {
      setQuizzes(data || []);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuiz.title || !newQuiz.college_id || !newQuiz.quiz_date || !newQuiz.start_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("quizzes").insert({
      title: newQuiz.title,
      description: newQuiz.description,
      college_id: newQuiz.college_id,
      conducted_by: user?.id,
      quiz_date: newQuiz.quiz_date,
      start_time: newQuiz.start_time,
      end_time: newQuiz.end_time || null,
      max_participants: newQuiz.max_participants ? parseInt(newQuiz.max_participants) : null,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Failed to create quiz: " + error.message);
    } else {
      toast.success("Quiz created successfully!");
      setIsDialogOpen(false);
      setNewQuiz({
        title: "",
        description: "",
        college_id: "",
        quiz_date: "",
        start_time: "",
        end_time: "",
        max_participants: "",
      });
      fetchQuizzes();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground">Manage your quizzes and view schedules</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                  <p className="text-2xl font-bold">{quizzes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">
                    {quizzes.filter((q) => q.status === "scheduled").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ongoing</p>
                  <p className="text-2xl font-bold">
                    {quizzes.filter((q) => q.status === "ongoing").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {quizzes.filter((q) => q.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quiz Schedule Management</CardTitle>
                <CardDescription>Create and manage your quiz schedules</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Quiz</DialogTitle>
                    <DialogDescription>Fill in the details to schedule a new quiz</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateQuiz} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Quiz Title *</Label>
                      <Input
                        id="title"
                        placeholder="General Knowledge Championship 2025"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the quiz..."
                        value={newQuiz.description}
                        onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="college">College *</Label>
                      <Select value={newQuiz.college_id} onValueChange={(value) => setNewQuiz({ ...newQuiz, college_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select college" />
                        </SelectTrigger>
                        <SelectContent>
                          {colleges.map((college) => (
                            <SelectItem key={college.id} value={college.id}>
                              {college.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quiz_date">Quiz Date *</Label>
                        <Input
                          id="quiz_date"
                          type="date"
                          value={newQuiz.quiz_date}
                          onChange={(e) => setNewQuiz({ ...newQuiz, quiz_date: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="start_time">Start Time *</Label>
                        <Input
                          id="start_time"
                          type="time"
                          value={newQuiz.start_time}
                          onChange={(e) => setNewQuiz({ ...newQuiz, start_time: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="end_time">End Time (Optional)</Label>
                        <Input
                          id="end_time"
                          type="time"
                          value={newQuiz.end_time}
                          onChange={(e) => setNewQuiz({ ...newQuiz, end_time: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max_participants">Max Participants (Optional)</Label>
                        <Input
                          id="max_participants"
                          type="number"
                          min="1"
                          placeholder="100"
                          value={newQuiz.max_participants}
                          onChange={(e) => setNewQuiz({ ...newQuiz, max_participants: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-secondary" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Quiz"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {quizzes.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No quizzes created yet. Create your first quiz!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {quiz.colleges?.name} • {new Date(quiz.quiz_date).toLocaleDateString()} • {quiz.start_time}
                      </p>
                    </div>
                     <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          quiz.status === "scheduled"
                            ? "bg-secondary/10 text-secondary"
                            : quiz.status === "ongoing"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {quiz.status}
                      </span>
                      <div className="flex gap-2">
                        {quiz.status === "scheduled" && (
                          <>
                            <Button size="sm" onClick={async () => {
                              const { error } = await supabase.from("quizzes").update({ status: "ongoing" }).eq("id", quiz.id);
                              if (error) toast.error("Failed to start quiz");
                              else { toast.success("Quiz started"); fetchQuizzes(); }
                            }}>
                              Start
                            </Button>
                            <Button size="sm" variant="outline" onClick={async () => {
                              const { error } = await supabase.from("quizzes").update({ status: "cancelled" }).eq("id", quiz.id);
                              if (error) toast.error("Failed to cancel quiz");
                              else { toast.success("Quiz cancelled"); fetchQuizzes(); }
                            }}>
                              Cancel
                            </Button>
                          </>
                        )}
                        {quiz.status === "ongoing" && (
                          <Button size="sm" onClick={async () => {
                            const { error } = await supabase.from("quizzes").update({ status: "completed" }).eq("id", quiz.id);
                            if (error) toast.error("Failed to complete quiz");
                            else { toast.success("Quiz completed"); fetchQuizzes(); }
                          }}>
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={async () => {
                          const { error } = await supabase.from("quizzes").delete().eq("id", quiz.id);
                          if (error) toast.error("Failed to delete quiz");
                          else { toast.success("Quiz deleted"); fetchQuizzes(); }
                        }}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
