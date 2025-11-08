import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ExternalLink, MapPin, Clock } from "lucide-react";

const CareerSection = () => {
  const jobs = [
    {
      id: 1,
      title: "Senior Quiz Developer",
      company: "EdTech Solutions",
      location: "Remote",
      type: "Full-time",
      link: "https://example.com/jobs/1"
    },
    {
      id: 2,
      title: "Educational Content Creator",
      company: "Quiz Masters Inc",
      location: "Bangalore, India",
      type: "Contract",
      link: "https://example.com/jobs/2"
    },
    {
      id: 3,
      title: "Platform Administrator",
      company: "Skill Quiz Lab",
      location: "Mumbai, India",
      type: "Full-time",
      link: "https://example.com/jobs/3"
    }
  ];

  return (
    <section id="career" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Career{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Opportunities
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our team and help shape the future of digital education
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {jobs.map((job, index) => (
            <Card 
              key={job.id}
              className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 font-medium">
                          {job.company}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-secondary" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => window.open(job.link, "_blank")}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group min-w-[150px]"
                  >
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={() => window.open("https://skilljobportal.netlify.app/", "_blank")}
          >
            View All Openings
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
