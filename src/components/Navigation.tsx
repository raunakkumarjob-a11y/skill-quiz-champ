import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Skill Quiz Lab
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("home")} className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection("features")} className="text-foreground hover:text-primary transition-colors font-medium">
              Quizzes
            </button>
            <button onClick={() => scrollToSection("connect")} className="text-foreground hover:text-primary transition-colors font-medium">
              College Connect
            </button>
            <button onClick={() => scrollToSection("schedule")} className="text-foreground hover:text-primary transition-colors font-medium">
              Schedule Quiz
            </button>
            <button onClick={() => scrollToSection("advantages")} className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </button>
            <button onClick={() => scrollToSection("footer")} className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" onClick={handleDashboard}>
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/auth")}>
                  Login
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/auth")}
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              <button onClick={() => scrollToSection("home")} className="text-left px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all">
                Home
              </button>
              <button onClick={() => scrollToSection("features")} className="text-left px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all">
                Quizzes
              </button>
              <button onClick={() => scrollToSection("connect")} className="text-left px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all">
                College Connect
              </button>
              <button onClick={() => scrollToSection("schedule")} className="text-left px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all">
                Schedule Quiz
              </button>
              <button onClick={() => scrollToSection("advantages")} className="text-left px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all">
                About
              </button>
              <button onClick={() => scrollToSection("footer")} className="text-left px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-all">
                Contact
              </button>
              <div className="flex flex-col gap-2 px-4 pt-2">
                {user ? (
                  <>
                    <Button variant="outline" className="w-full" onClick={handleDashboard}>
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                      Login
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                      onClick={() => navigate("/auth")}
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
