import { GraduationCap, Mail, Linkedin, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="bg-gradient-to-br from-card to-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Skill Quiz Lab
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Where Knowledge Meets Competition. Empowering students and colleges with smart quiz competitions and skill development.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:worktracker75@gmail.com" className="hover:text-primary transition-colors">
                worktracker75@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection("home")} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("features")} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("connect")} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  College Connect
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("schedule")} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Schedule
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal & Social</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <a href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="mailto:worktracker75@gmail.com" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/skill-quiz-lab/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-all">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Skill Quiz Lab. All rights reserved.</p>
            <p>
              Developed with ❤️ by{" "}
              <span className="font-semibold text-foreground">Raunak Kumar</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
