import { useRef, useState } from "react";
import { SparklesIcon } from "./Icons";

interface ProjectCardProps {
  icon: React.ReactNode;
  iconClass: string;
  origin: string;
  originColor: string;
  title: string;
  titleColor: string;
  description: string;
  aiDescription?: string;
  features: string[];
  link: string;
}

const ProjectCard = ({
  icon,
  iconClass,
  origin,
  originColor,
  title,
  titleColor,
  description,
  aiDescription,
  features,
  link,
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 8 degrees)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    // Calculate glow position
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    
    setTransform({ rotateX, rotateY, scale: 1.02 });
    setGlowPosition({ x: glowX, y: glowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setIsHovered(false);
  };

  // Extract color from originColor for glow
  const getGlowColor = () => {
    if (originColor.includes('sky')) return 'rgba(56, 189, 248, 0.4)';
    if (originColor.includes('orange')) return 'rgba(251, 146, 60, 0.4)';
    if (originColor.includes('cyan')) return 'rgba(34, 211, 238, 0.4)';
    return 'rgba(168, 85, 247, 0.4)';
  };

  return (
    <a
      ref={cardRef}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="service-card group flex flex-col h-full relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transition: isHovered 
          ? 'transform 0.1s ease-out' 
          : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Dynamic glow effect that follows cursor */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${getGlowColor()}, transparent 50%)`,
        }}
      />

      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.03) 45%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.03) 55%, transparent 60%)`,
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.7s ease-out, opacity 0.3s ease-out',
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${getGlowColor().replace('0.4', '0.3')}`,
        }}
      />

      {/* Icon with enhanced animation */}
      <div 
        className={`icon-box ${iconClass} mb-4 relative z-10`}
        style={{
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Icon glow pulse */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `0 0 30px ${getGlowColor()}`,
            animation: isHovered ? 'pulse-glow 2s ease-in-out infinite' : 'none',
          }}
        />
        <div className="relative z-10">{icon}</div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 relative z-10">
        <p 
          className={`text-xs font-medium mb-1 ${originColor} transition-all duration-300`}
          style={{
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          {origin}
        </p>
        <h3 
          className={`text-lg font-bold tracking-tight transition-all duration-300 mb-2 ${titleColor}`}
          style={{
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
            transitionDelay: '50ms',
          }}
        >
          {title}
        </h3>
        <p 
          className="text-sm leading-relaxed text-muted-foreground mb-3 transition-all duration-300"
          style={{
            transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
            transitionDelay: '100ms',
          }}
        >
          {description}
        </p>
        
        {/* AI Description with animated border */}
        {aiDescription && (
          <div 
            className="relative flex items-start gap-2 mb-4 p-2.5 rounded-lg bg-primary/5 overflow-hidden transition-all duration-300"
            style={{
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            {/* Animated border */}
            <div
              className="absolute inset-0 rounded-lg transition-opacity duration-500"
              style={{
                background: isHovered 
                  ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(251, 146, 60, 0.3), rgba(168, 85, 247, 0.3))'
                  : 'transparent',
                backgroundSize: '200% 100%',
                animation: isHovered ? 'gradient-shift 2s linear infinite' : 'none',
                padding: '1px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
            <SparklesIcon 
              className={`w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5 transition-transform duration-500 ${isHovered ? 'animate-sparkle-spin' : ''}`}
            />
            <p className="text-xs leading-relaxed text-primary/90">
              {aiDescription}
            </p>
          </div>
        )}
        
        {/* Features with staggered reveal */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className="rounded-full px-2.5 py-0.5 text-xs text-muted-foreground transition-all duration-300"
              style={{ 
                background: isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.05)", 
                border: isHovered ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(255, 255, 255, 0.08)",
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transitionDelay: `${index * 50}ms`,
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Explore link that appears on hover */}
        <div 
          className="mt-4 flex items-center gap-2 text-sm font-medium transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            color: getGlowColor().replace('0.4)', '1)'),
          }}
        >
          <span>Explore</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-300"
            style={{
              transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
            }}
          >
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
