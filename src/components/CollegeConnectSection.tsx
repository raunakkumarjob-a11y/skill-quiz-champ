import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const benefits = [
  "Easy quiz creation and management dashboard",
  "Automated student notifications and reminders",
  "Transparent performance tracking and analytics",
  "Secure and reliable platform infrastructure",
  "Dedicated support for educational institutions",
  "Free onboarding and training for faculty"
];

const CollegeConnectSection = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    college_name: "",
    location: "",
    reason: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("college_connection_requests")
        .insert([formData]);

      if (error) throw error;

      toast.success("Request submitted successfully! We'll contact you soon.");
      setOpen(false);
      setFormData({
        name: "",
        designation: "",
        college_name: "",
        location: "",
        reason: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group w-fit">
                        Connect College Now
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>College Connection Request</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="designation">Designation *</Label>
                          <Input
                            id="designation"
                            required
                            placeholder="e.g., Professor, HOD, Dean"
                            value={formData.designation}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="college_name">College Name *</Label>
                          <Input
                            id="college_name"
                            required
                            value={formData.college_name}
                            onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            required
                            placeholder="City, State"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="reason">Why do you want to connect? *</Label>
                          <Textarea
                            id="reason"
                            required
                            rows={4}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
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
