import { GraduationCap, Menu } from "lucide-react";
import { useState } from "react";
import RadialMenu from "./RadialMenu";

const Navigation = () => {
  const [isRadialOpen, setIsRadialOpen] = useState(false);

  return (
    <>
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

            {/* Toggle Button in Header */}
            <button
              onClick={() => setIsRadialOpen(!isRadialOpen)}
              className={`
                relative w-12 h-12 rounded-full
                bg-gradient-to-br from-primary via-secondary to-accent
                flex items-center justify-center
                shadow-lg shadow-primary/30
                transition-all duration-300 ease-out
                hover:shadow-primary/50 hover:scale-105
                ${isRadialOpen ? 'rotate-90' : 'rotate-0'}
              `}
            >
              {/* Pulse ring */}
              <div 
                className={`
                  absolute inset-0 rounded-full
                  bg-gradient-to-br from-primary to-secondary
                  animate-ping opacity-20
                  ${isRadialOpen ? 'hidden' : 'block'}
                `}
              />
              
              <Menu className="w-6 h-6 text-primary-foreground relative z-10" />
            </button>
          </div>
        </div>
      </nav>

      {/* Radial Menu - Opens in Center */}
      <RadialMenu isOpen={isRadialOpen} onClose={() => setIsRadialOpen(false)} />
    </>
  );
};

export default Navigation;
