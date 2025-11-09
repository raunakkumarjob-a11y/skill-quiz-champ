import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Shield, Upload, Image as ImageIcon } from "lucide-react";

const AdminPortal = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { user } = useAuth();
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isMemoryDialogOpen, setIsMemoryDialogOpen] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    event_date: "",
  });

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
      const [requestsRes, usersRes, quizzesRes, memoriesRes, testimonialsRes] = await Promise.all([
        supabase.from("college_connection_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("quizzes").select("*, colleges(name), profiles(full_name)").order("created_at", { ascending: false }),
        supabase.from("event_memories").select("*").order("created_at", { ascending: false }),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false })
      ]);

      if (requestsRes.error) throw requestsRes.error;
      if (usersRes.error) throw usersRes.error;
      if (quizzesRes.error) throw quizzesRes.error;
      if (memoriesRes.error) throw memoriesRes.error;
      if (testimonialsRes.error) throw testimonialsRes.error;

      setConnectionRequests(requestsRes.data || []);
      setUsers(usersRes.data || []);
      setQuizzes(quizzesRes.data || []);
      setMemories(memoriesRes.data || []);
      setTestimonials(testimonialsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    if (status !== "approved") {
      try {
        // Get request details for rejection email
        const { data: request } = await supabase
          .from("college_connection_requests")
          .select("*")
          .eq("id", id)
          .single();

        // Update status
        const { error } = await supabase
          .from("college_connection_requests")
          .update({ status })
          .eq("id", id);

        if (error) throw error;

        // Send rejection email if rejected
        if (status === "rejected" && request) {
          await supabase.functions.invoke("send-rejection-email", {
            body: {
              to: request.email,
              name: request.name,
              collegeName: request.college_name,
              reason: "After review, we cannot approve this request at this time.",
            },
          });
          toast.success("Request rejected and notification sent");
        } else {
          toast.success(`Request ${status}`);
        }
        
        fetchData();
      } catch (error) {
        console.error("Error updating request:", error);
        toast.error("Failed to update request");
      }
      return;
    }

    // Handle approval with auto-credential generation via edge function
    try {
      const { data, error } = await supabase.functions.invoke("approve-college-request", {
        body: { requestId: id },
      });

      if (error) throw error;

      if (data?.credentials) {
        toast.success(
          `Request approved! Credentials sent to user.\nEmail: ${data.credentials.email}\nPassword: ${data.credentials.password}`,
          { duration: 15000 }
        );
      } else {
        toast.success("Request approved successfully!");
      }
      
      fetchData();
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request: " + (error as Error).message);
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

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    try {
      if (currentRole === 'admin') {
        // Remove admin role
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");

        if (error) throw error;
        toast.success("Admin role removed");
      } else {
        // Add admin role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });

        if (error) throw error;
        toast.success("User promoted to admin");
      }
      fetchData();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedQuiz || !imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      // Delete old image if exists
      if (selectedQuiz.image_url) {
        const oldFileName = selectedQuiz.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('quiz-images').remove([oldFileName]);
        }
      }

      // Upload new image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('quiz-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('quiz-images')
        .getPublicUrl(filePath);

      // Update quiz with new image URL
      const { error: updateError } = await supabase
        .from("quizzes")
        .update({ image_url: publicUrl })
        .eq("id", selectedQuiz.id);

      if (updateError) throw updateError;

      toast.success("Image uploaded successfully");
      setIsUploadDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setSelectedQuiz(null);
      fetchData();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const deleteQuizImage = async (quiz: any) => {
    if (!quiz.image_url) return;

    try {
      const fileName = quiz.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('quiz-images').remove([fileName]);
      }

      const { error } = await supabase
        .from("quizzes")
        .update({ image_url: null })
        .eq("id", quiz.id);

      if (error) throw error;

      toast.success("Image deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleMemoryUpload = async () => {
    if (!imageFile || !newMemory.title) {
      toast.error("Please provide title and select an image");
      return;
    }

    try {
      // Upload image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-memories')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-memories')
        .getPublicUrl(filePath);

      // Insert memory record
      const { error: insertError } = await supabase
        .from("event_memories")
        .insert({
          title: newMemory.title,
          description: newMemory.description || null,
          event_date: newMemory.event_date || null,
          image_url: publicUrl,
          uploaded_by: user?.id,
        });

      if (insertError) throw insertError;

      toast.success("Memory uploaded successfully");
      setIsMemoryDialogOpen(false);
      setNewMemory({ title: "", description: "", event_date: "" });
      setImageFile(null);
      setImagePreview(null);
      fetchData();
    } catch (error) {
      console.error("Error uploading memory:", error);
      toast.error("Failed to upload memory");
    }
  };

  const deleteMemory = async (memory: any) => {
    try {
      // Delete image from storage
      const fileName = memory.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('event-memories').remove([fileName]);
      }

      // Delete memory record
      const { error } = await supabase
        .from("event_memories")
        .delete()
        .eq("id", memory.id);

      if (error) throw error;

      toast.success("Memory deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting memory:", error);
      toast.error("Failed to delete memory");
    }
  };

  const updateTestimonialStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Testimonial ${status} successfully`);
      fetchData();
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast.error("Failed to update testimonial");
    }
  };

  const deleteTestimonial = async (id: string, imageUrl: string | null) => {
    try {
      if (imageUrl) {
        const fileName = imageUrl.split("/").pop();
        if (fileName) {
          await supabase.storage.from("testimonial-images").remove([fileName]);
        }
      }

      const { error } = await supabase.from("testimonials").delete().eq("id", id);

      if (error) throw error;

      toast.success("Testimonial deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
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
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="requests">Connection Requests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="memories">Event Memories</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
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
                      <TableHead>Actions</TableHead>
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
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant={user.role === 'admin' ? 'destructive' : 'default'}
                            onClick={() => toggleAdminRole(user.id, user.role)}
                          >
                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          </Button>
                        </TableCell>
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
                      <TableHead>Image</TableHead>
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
                        <TableCell>
                          {quiz.image_url ? (
                            <img 
                              src={quiz.image_url} 
                              alt={quiz.title} 
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedQuiz(quiz);
                                setIsUploadDialogOpen(true);
                              }}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              {quiz.image_url ? 'Update' : 'Add'} Image
                            </Button>
                            {quiz.image_url && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => deleteQuizImage(quiz)}
                              >
                                Remove Image
                              </Button>
                            )}
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

          <TabsContent value="memories">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Event Memories ({memories.length})</CardTitle>
                  <Button onClick={() => setIsMemoryDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Memory
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {memories.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No memories uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memories.map((memory) => (
                      <Card key={memory.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <img 
                            src={memory.image_url} 
                            alt={memory.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold mb-1">{memory.title}</h3>
                            {memory.description && (
                              <p className="text-sm text-muted-foreground mb-2">{memory.description}</p>
                            )}
                            {memory.event_date && (
                              <p className="text-xs text-muted-foreground mb-3">
                                {new Date(memory.event_date).toLocaleDateString()}
                              </p>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deleteMemory(memory)}
                              className="w-full"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <CardTitle>Testimonials ({testimonials.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell className="font-medium">{testimonial.name}</TableCell>
                        <TableCell className="max-w-md">
                          <p className="truncate">{testimonial.message}</p>
                        </TableCell>
                        <TableCell>
                          {testimonial.image_url && (
                            <img 
                              src={testimonial.image_url} 
                              alt={testimonial.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={testimonial.status === 'approved' ? 'default' : 'secondary'}>
                            {testimonial.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(testimonial.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {testimonial.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                              >
                                Approve
                              </Button>
                            )}
                            {testimonial.status === 'approved' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateTestimonialStatus(testimonial.id, 'pending')}
                              >
                                Unpublish
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteTestimonial(testimonial.id, testimonial.image_url)}
                            >
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

        {/* Memory Upload Dialog */}
        <Dialog open={isMemoryDialogOpen} onOpenChange={setIsMemoryDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Event Memory</DialogTitle>
              <DialogDescription>
                Add photos from your events and competitions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memory-title">Title *</Label>
                <Input
                  id="memory-title"
                  placeholder="Event name"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory-description">Description</Label>
                <Input
                  id="memory-description"
                  placeholder="Brief description"
                  value={newMemory.description}
                  onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory-date">Event Date</Label>
                <Input
                  id="memory-date"
                  type="date"
                  value={newMemory.event_date}
                  onChange={(e) => setNewMemory({ ...newMemory, event_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memory-image">Image *</Label>
                <Input
                  id="memory-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {imagePreview && (
                <div>
                  <Label>Preview</Label>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-h-60 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleMemoryUpload}
                  disabled={!imageFile || !newMemory.title}
                  className="flex-1"
                >
                  Upload
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsMemoryDialogOpen(false);
                    setNewMemory({ title: "", description: "", event_date: "" });
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quiz Image Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Quiz Image</DialogTitle>
              <DialogDescription>
                Add or update the image for "{selectedQuiz?.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedQuiz?.image_url && !imagePreview && (
                <div>
                  <Label>Current Image</Label>
                  <img 
                    src={selectedQuiz.image_url} 
                    alt="Current" 
                    className="w-full max-h-60 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="quiz-image">Select New Image</Label>
                <Input
                  id="quiz-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {imagePreview && (
                <div>
                  <Label>Preview</Label>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-h-60 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleImageUpload}
                  disabled={!imageFile}
                  className="flex-1"
                >
                  Upload
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsUploadDialogOpen(false);
                    setImageFile(null);
                    setImagePreview(null);
                    setSelectedQuiz(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPortal;
