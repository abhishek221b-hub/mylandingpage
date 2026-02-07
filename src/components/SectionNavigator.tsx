import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface SectionNavigatorProps {
  targetId: string;
  label?: string;
}

const SectionNavigator = ({ targetId, label }: SectionNavigatorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 py-8 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {label && (
        <span className="text-xs text-muted-foreground/60 uppercase tracking-widest font-medium">
          {label}
        </span>
      )}
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-110"
        aria-label={`Scroll to ${targetId}`}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)",
              animationDuration: "2s",
            }}
          />
        </div>
        
        {/* Inner gradient glow */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)",
          }}
        />
        
        {/* Animated chevrons */}
        <div className="relative flex flex-col items-center -space-y-2">
          <ChevronDown 
            size={18} 
            className="text-muted-foreground group-hover:text-orange-400 transition-all duration-300 animate-bounce-arrow opacity-40"
            style={{ animationDelay: "0ms" }}
          />
          <ChevronDown 
            size={18} 
            className="text-muted-foreground group-hover:text-orange-400 transition-all duration-300 animate-bounce-arrow opacity-70"
            style={{ animationDelay: "100ms" }}
          />
          <ChevronDown 
            size={18} 
            className="text-muted-foreground group-hover:text-orange-400 transition-all duration-300 animate-bounce-arrow"
            style={{ animationDelay: "200ms" }}
          />
        </div>
      </button>
      
      {/* Decorative line */}
      <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      
      <style>{`
        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        .animate-bounce-arrow {
          animation: bounce-arrow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SectionNavigator;
