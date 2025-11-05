import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Shield } from "lucide-react";

const AdminPortal = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [requestsRes, usersRes, quizzesRes] = await Promise.all([
        supabase.from("college_connection_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("quizzes").select("*, colleges(name), profiles(full_name)").order("created_at", { ascending: false })
      ]);

      if (requestsRes.error) throw requestsRes.error;
      if (usersRes.error) throw usersRes.error;
      if (quizzesRes.error) throw quizzesRes.error;

      setConnectionRequests(requestsRes.data || []);
      setUsers(usersRes.data || []);
      setQuizzes(quizzesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("college_connection_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Request ${status}`);
      fetchData();
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update request");
    }
  };

  const updateQuizStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("quizzes")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Quiz marked as ${status}`);
      fetchData();
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error("Failed to update quiz status");
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      const { error } = await supabase.from("quizzes").delete().eq("id", id);
      if (error) throw error;
      toast.success("Quiz deleted");
      fetchData();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Portal</h1>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="requests">Connection Requests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>College Connection Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connectionRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.designation}</TableCell>
                        <TableCell>{request.college_name}</TableCell>
                        <TableCell>{request.location}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{request.email}</div>
                            <div className="text-muted-foreground">{request.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={request.status === 'approved' ? 'default' : request.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => updateRequestStatus(request.id, 'approved')}>
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateRequestStatus(request.id, 'rejected')}>
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge>{user.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <CardTitle>All Quizzes ({quizzes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Conductor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{quiz.colleges?.name || 'N/A'}</TableCell>
                        <TableCell>{quiz.profiles?.full_name || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(quiz.quiz_date).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {quiz.start_time} {quiz.end_time && `- ${quiz.end_time}`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {quiz.current_participants || 0}
                            {quiz.max_participants && ` / ${quiz.max_participants}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            quiz.status === 'completed' ? 'default' : 
                            quiz.status === 'ongoing' ? 'secondary' : 
                            quiz.status === 'cancelled' ? 'destructive' : 
                            'outline'
                          }>
                            {quiz.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {quiz.status === 'scheduled' && (
                              <Button size="sm" onClick={() => updateQuizStatus(quiz.id, 'ongoing')}>
                                Start Quiz
                              </Button>
                            )}
                            {quiz.status === 'ongoing' && (
                              <Button size="sm" onClick={() => updateQuizStatus(quiz.id, 'completed')}>
                                Complete
                              </Button>
                            )}
                            {(quiz.status === 'scheduled' || quiz.status === 'ongoing') && (
                              <Button size="sm" variant="outline" onClick={() => updateQuizStatus(quiz.id, 'cancelled')}>
                                Cancel
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => deleteQuiz(quiz.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
