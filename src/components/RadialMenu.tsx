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

interface RadialMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const RadialMenu = ({ isOpen, onClose }: RadialMenuProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      onClose();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
    onClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
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
  const radius = 160;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-500 animate-fade-in"
        onClick={onClose}
      />

      {/* Center glow effect */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 blur-3xl animate-pulse pointer-events-none" />

      {/* Menu Container */}
      <div className="relative">
        {/* Rotating ring decoration */}
        <div 
          className="absolute inset-0 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border-2 border-dashed border-primary/30 animate-spin pointer-events-none"
          style={{ animationDuration: '20s' }}
        />
        <div 
          className="absolute inset-0 w-[340px] h-[340px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border border-secondary/20 animate-spin pointer-events-none"
          style={{ animationDuration: '15s', animationDirection: 'reverse' }}
        />

        {/* Menu Items in Circle */}
        {allItems.map((item, index) => {
          const angle = (angleStep * index - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`
                absolute w-16 h-16 rounded-full 
                bg-gradient-to-br ${item.gradient}
                flex flex-col items-center justify-center gap-1
                shadow-xl shadow-black/20
                transition-all duration-500 ease-out
                hover:scale-125 hover:shadow-2xl hover:z-10
                group
                animate-scale-in
              `}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${index * 60}ms`,
                left: '50%',
                top: '50%',
                marginLeft: '-32px',
                marginTop: '-32px',
              }}
            >
              <Icon className="w-6 h-6 text-white drop-shadow-md" />
              
              {/* Label that appears on hover */}
              <span 
                className="
                  absolute -bottom-8 left-1/2 -translate-x-1/2
                  bg-card text-foreground text-xs font-semibold
                  px-3 py-1.5 rounded-full whitespace-nowrap
                  opacity-0 group-hover:opacity-100 
                  transform translate-y-2 group-hover:translate-y-0
                  transition-all duration-300
                  shadow-lg border border-border
                "
              >
                {item.label}
              </span>

              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          );
        })}

        {/* Center Close Button */}
        <button
          onClick={onClose}
          className="
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-20 h-20 rounded-full
            bg-gradient-to-br from-primary via-secondary to-accent
            flex items-center justify-center
            shadow-2xl shadow-primary/50
            transition-all duration-300
            hover:scale-110 hover:rotate-90
            z-20
            animate-scale-in
          "
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          
          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          
          <X className="w-8 h-8 text-primary-foreground relative z-10" />
        </button>
      </div>
    </div>
  );
};

export default RadialMenu;
