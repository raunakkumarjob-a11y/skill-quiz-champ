import { useState } from "react";
import { 
  Home, 
  BookOpen, 
  Building2, 
  Calendar, 
  Info, 
  Phone, 
  LayoutDashboard, 
  Shield, 
  LogOut, 
  LogIn, 
  UserPlus,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  action: () => void;
  gradient: string;
}

const RadialMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
    setIsOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const baseMenuItems: MenuItem[] = [
    { icon: Home, label: "Home", action: () => scrollToSection("home"), gradient: "from-blue-500 to-cyan-400" },
    { icon: BookOpen, label: "Quizzes", action: () => scrollToSection("features"), gradient: "from-purple-500 to-pink-400" },
    { icon: Building2, label: "College", action: () => scrollToSection("connect"), gradient: "from-green-500 to-emerald-400" },
    { icon: Calendar, label: "Schedule", action: () => scrollToSection("schedule"), gradient: "from-orange-500 to-yellow-400" },
    { icon: Info, label: "About", action: () => scrollToSection("advantages"), gradient: "from-indigo-500 to-blue-400" },
    { icon: Phone, label: "Contact", action: () => scrollToSection("footer"), gradient: "from-rose-500 to-red-400" },
  ];

  const authMenuItems: MenuItem[] = user
    ? [
        { icon: LayoutDashboard, label: "Dashboard", action: () => handleNavigate("/dashboard"), gradient: "from-teal-500 to-cyan-400" },
        { icon: Shield, label: "Admin", action: () => handleNavigate("/admin"), gradient: "from-violet-500 to-purple-400" },
        { icon: LogOut, label: "Sign Out", action: handleSignOut, gradient: "from-red-500 to-rose-400" },
      ]
    : [
        { icon: LogIn, label: "Login", action: () => handleNavigate("/auth"), gradient: "from-blue-500 to-indigo-400" },
        { icon: UserPlus, label: "Register", action: () => handleNavigate("/auth"), gradient: "from-green-500 to-teal-400" },
      ];

  const allItems = [...baseMenuItems, ...authMenuItems];
  const itemCount = allItems.length;
  const angleStep = 360 / itemCount;
  const radius = 140;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Items */}
      <div className="relative">
        {allItems.map((item, index) => {
          const angle = (angleStep * index - 90) * (Math.PI / 180);
          const x = isOpen ? Math.cos(angle) * radius : 0;
          const y = isOpen ? Math.sin(angle) * radius : 0;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`
                absolute w-14 h-14 rounded-full 
                bg-gradient-to-br ${item.gradient}
                flex items-center justify-center
                shadow-lg shadow-primary/20
                transition-all duration-500 ease-out
                hover:scale-110 hover:shadow-xl
                ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
              `}
              style={{
                transform: `translate(${x}px, ${y}px) scale(${isOpen ? 1 : 0.3})`,
                transitionDelay: isOpen ? `${index * 50}ms` : `${(itemCount - index) * 30}ms`,
                left: '50%',
                top: '50%',
                marginLeft: '-28px',
                marginTop: '-28px',
              }}
              title={item.label}
            >
              <Icon className="w-6 h-6 text-white" />
              
              {/* Label tooltip */}
              <span 
                className={`
                  absolute -top-8 left-1/2 -translate-x-1/2
                  bg-card text-foreground text-xs font-medium
                  px-2 py-1 rounded-md whitespace-nowrap
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  shadow-md border border-border
                  transition-opacity duration-200
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-16 h-16 rounded-full
            bg-gradient-to-br from-primary via-secondary to-accent
            flex items-center justify-center
            shadow-2xl shadow-primary/40
            transition-all duration-500 ease-out
            hover:shadow-primary/60 hover:scale-105
            z-10
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
          style={{
            animation: isOpen ? 'none' : 'pulse 2s infinite',
          }}
        >
          {/* Glow ring */}
          <div 
            className={`
              absolute inset-0 rounded-full
              bg-gradient-to-br from-primary via-secondary to-accent
              animate-ping opacity-30
              ${isOpen ? 'hidden' : 'block'}
            `}
          />
          
          {/* Inner circle */}
          <div 
            className={`
              absolute inset-1 rounded-full
              bg-gradient-to-br from-primary to-secondary
              transition-all duration-300
            `}
          />
          
          {/* Icon */}
          <div className="relative z-10 transition-transform duration-300">
            {isOpen ? (
              <X className="w-7 h-7 text-primary-foreground" />
            ) : (
              <Menu className="w-7 h-7 text-primary-foreground" />
            )}
          </div>

          {/* Rotating border */}
          <div 
            className={`
              absolute inset-0 rounded-full border-2 border-dashed border-primary-foreground/30
              transition-all duration-1000
              ${isOpen ? 'animate-spin' : ''}
            `}
            style={{ animationDuration: '3s' }}
          />
        </button>
      </div>

      {/* Center glow effect when open */}
      {isOpen && (
        <div 
          className="absolute inset-0 w-16 h-16 rounded-full bg-primary/20 blur-xl animate-pulse pointer-events-none"
          style={{ left: '0', top: '0' }}
        />
      )}
    </div>
  );
};

export default RadialMenu;
