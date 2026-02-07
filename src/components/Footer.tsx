import { useState, useRef } from "react";
import { EmailIcon, LinkedInIcon, GitHubIcon, InstagramIcon } from "./Icons";
import AnimateOnScroll from "./AnimateOnScroll";

const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ctaRef = useRef<HTMLDivElement>(null);

  const socialLinks = [
    { icon: <EmailIcon />, href: "mailto:hello@abhishek221b.app", label: "Email", color: "rgba(168, 85, 247, 0.5)" },
    { icon: <LinkedInIcon />, href: "https://linkedin.com/in/a-sengupta-gpm", label: "LinkedIn", color: "rgba(59, 130, 246, 0.5)" },
    { icon: <GitHubIcon />, href: "https://github.com/abhishek221b", label: "GitHub", color: "rgba(255, 255, 255, 0.3)" },
    { icon: <InstagramIcon />, href: "https://instagram.com/abhishek221b", label: "Instagram", color: "rgba(236, 72, 153, 0.5)" },
  ];

  const navLinks = [
    { label: "HOME", href: "#" },
    { label: "ABOUT", href: "#about" },
    { label: "PROJECTS", href: "#projects" },
  ];

  const handleCtaMouseMove = (e: React.MouseEvent) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <footer id="footer" className="py-16 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)',
        }}
      />

      <div className="container mx-auto relative z-10">
        {/* CTA Section with spotlight effect */}
        <AnimateOnScroll className="mb-12">
          <div 
            ref={ctaRef}
            className="relative flex flex-col items-center justify-between gap-6 sm:flex-row rounded-2xl p-8 overflow-hidden transition-all duration-500"
            onMouseMove={handleCtaMouseMove}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{ 
              background: "rgba(255, 255, 255, 0.03)", 
              border: ctaHovered 
                ? "1px solid rgba(168, 85, 247, 0.3)" 
                : "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: ctaHovered 
                ? '0 0 40px rgba(168, 85, 247, 0.15)' 
                : 'none',
            }}
          >
            {/* Spotlight effect */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.15), transparent 40%)`,
                opacity: ctaHovered ? 1 : 0,
              }}
            />

            {/* Animated border */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
              style={{
                opacity: ctaHovered ? 1 : 0,
                transition: 'opacity 0.5s',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), rgba(251, 146, 60, 0.2), transparent)',
                  animation: ctaHovered ? 'shimmer 2s linear infinite' : 'none',
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 
                className="text-xl font-bold tracking-tight mb-1 transition-all duration-300"
                style={{
                  transform: ctaHovered ? 'translateX(4px)' : 'translateX(0)',
                }}
              >
                Have an idea I can build? Or just want to chat?
              </h3>
              <p 
                className="text-sm text-muted-foreground transition-all duration-300"
                style={{
                  transform: ctaHovered ? 'translateX(2px)' : 'translateX(0)',
                }}
              >
                Whether it's product strategy, AI exploration, or sharing expat stories.
              </p>
            </div>

            <a 
              href="mailto:hello@abhishek221b.app" 
              className="relative z-10 whitespace-nowrap overflow-hidden rounded-lg px-5 py-2.5 font-medium text-sm text-primary-foreground transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--purple)), hsl(var(--purple-light)))',
                transform: ctaHovered ? 'scale(1.05)' : 'scale(1)',
                boxShadow: ctaHovered 
                  ? '0 0 30px rgba(168, 85, 247, 0.4)' 
                  : '0 0 20px rgba(168, 85, 247, 0.2)',
              }}
            >
              <span className="relative z-10">CONTACT</span>
              {/* Shine effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%)',
                  transform: ctaHovered ? 'translateX(100%)' : 'translateX(-100%)',
                  transition: 'transform 0.6s ease-out',
                }}
              />
            </a>
          </div>
        </AnimateOnScroll>

        {/* Navigation */}
        <AnimateOnScroll delay={100}>
          <div 
            className="flex flex-col items-start gap-6 pt-8 relative"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
          >
            {/* Animated border highlight */}
            <div 
              className="absolute top-0 left-0 h-px bg-gradient-to-r from-primary/50 via-purple-400/30 to-transparent"
              style={{ width: '200px' }}
            />

            {/* Logo with hover effect */}
            <a 
              href="#" 
              className="group text-lg font-bold tracking-tight text-foreground relative"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
                abhishek221b
              </span>
              <span 
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-orange-400 transition-all duration-300"
                style={{ width: '0%' }}
              />
            </a>

            {/* Nav Links with staggered hover */}
            <div className="flex items-center gap-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="relative text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-300 py-1"
                  style={{
                    transitionDelay: `${index * 30}ms`,
                  }}
                >
                  {link.label}
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-px bg-primary/50 scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </a>
              ))}
            </div>

            {/* Social Icons with magnetic effect */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-300"
                  aria-label={social.label}
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  style={{
                    background: hoveredSocial === index 
                      ? "rgba(255, 255, 255, 0.1)" 
                      : "rgba(255, 255, 255, 0.03)",
                    border: hoveredSocial === index 
                      ? `1px solid ${social.color}` 
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    transform: hoveredSocial === index 
                      ? 'translateY(-4px) scale(1.1)' 
                      : 'translateY(0) scale(1)',
                    boxShadow: hoveredSocial === index 
                      ? `0 10px 30px -10px ${social.color}` 
                      : 'none',
                  }}
                >
                  <div 
                    className="transition-transform duration-300"
                    style={{
                      transform: hoveredSocial === index ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {social.icon}
                  </div>

                  {/* Tooltip */}
                  <span 
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-foreground text-background whitespace-nowrap pointer-events-none transition-all duration-300"
                    style={{
                      opacity: hoveredSocial === index ? 1 : 0,
                      transform: hoveredSocial === index 
                        ? 'translateX(-50%) translateY(0)' 
                        : 'translateX(-50%) translateY(4px)',
                    }}
                  >
                    {social.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground mt-4">
              © 2025 Abhishek Sengupta
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </footer>
  );
};

export default Footer;
