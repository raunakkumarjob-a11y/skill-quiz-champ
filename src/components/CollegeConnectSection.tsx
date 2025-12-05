import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
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
    <section id="connect" className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div 
          ref={sectionRef}
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          }`}
        >
          <Card className="overflow-hidden border-2 border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-background to-muted/30 relative">
                  {/* Decorative element */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  
                  <div className="relative">
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
                    
                    <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                      We provide a comprehensive platform for colleges to conduct online quiz events easily. 
                      Connect with us to promote student engagement and enhance academic competition.
                    </p>

                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all group w-fit shadow-lg hover:shadow-primary/25 hover:scale-105">
                          <Sparkles className="mr-2 h-5 w-5" />
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
                </div>

                {/* Right Content - Benefits */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-muted/50 to-background flex flex-col justify-center relative">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
                  
                  <div className="relative">
                    <h3 className="text-xl font-bold mb-8 text-foreground flex items-center gap-2">
                      <span className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
                      Why Partner With Us?
                    </h3>
                    <div className="space-y-4">
                      {benefits.map((benefit, index) => (
                        <div 
                          key={index} 
                          className={`flex items-start gap-3 transition-all duration-500 ${
                            isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                          }`}
                          style={{ transitionDelay: `${index * 100 + 300}ms` }}
                        >
                          <div className="p-1 rounded-full bg-secondary/20">
                            <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                          </div>
                          <span className="text-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
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
