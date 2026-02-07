import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = ['purpose', 'projects', 'lab'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update indicator position
  useEffect(() => {
    if (activeSection && linksRef.current.has(activeSection) && navRef.current) {
      const link = linksRef.current.get(activeSection);
      const nav = navRef.current;
      if (link) {
        const linkRect = link.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        setIndicatorStyle({
          left: linkRect.left - navRect.left,
          width: linkRect.width,
          opacity: 1,
        });
      }
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection]);

  const handleMouseEnter = (href: string) => {
    const link = linksRef.current.get(href);
    if (link && navRef.current) {
      const linkRect = link.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    }
  };

  const handleMouseLeave = () => {
    if (activeSection && linksRef.current.has(activeSection) && navRef.current) {
      const link = linksRef.current.get(activeSection);
      if (link) {
        const linkRect = link.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        setIndicatorStyle({
          left: linkRect.left - navRect.left,
          width: linkRect.width,
          opacity: 1,
        });
      }
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  };

  const navLinks = [
    { href: 'purpose', label: 'Purpose' },
    { href: 'projects', label: 'Projects' },
    { href: 'lab', label: 'Lab' },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      style={{
        transform: isLoaded ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s, border-color 0.3s, backdrop-filter 0.3s',
      }}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        {/* Logo with magnetic effect */}
        <a 
          href="#" 
          className="text-lg font-bold tracking-tight text-foreground relative group"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
          }}
        >
          <span className="relative z-10">abhishek221b</span>
          {/* Underline animation */}
          <span 
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-orange-400 transition-all duration-300"
            style={{
              width: '0%',
            }}
          />
          <style>{`
            a:hover > span:last-child {
              width: 100% !important;
            }
          `}</style>
        </a>

        {/* Navigation links with morphing indicator */}
        <div 
          ref={navRef}
          className="relative flex items-center gap-8"
          onMouseLeave={handleMouseLeave}
        >
          {/* Morphing indicator */}
          <div
            className="absolute -bottom-1 h-[2px] bg-gradient-to-r from-primary via-purple-400 to-orange-400 rounded-full transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: indicatorStyle.opacity,
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
            }}
          />

          {navLinks.map((link, index) => (
            <a
              key={link.href}
              ref={(el) => {
                if (el) linksRef.current.set(link.href, el);
              }}
              href={`#${link.href}`}
              className={`nav-link hidden sm:block relative py-1 transition-all duration-300 ${
                activeSection === link.href ? 'text-foreground' : ''
              }`}
              onMouseEnter={() => handleMouseEnter(link.href)}
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(-10px)',
                transition: `opacity 0.5s ease-out ${0.3 + index * 0.1}s, transform 0.5s ease-out ${0.3 + index * 0.1}s, color 0.3s`,
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Divider */}
          <div
            className="hidden sm:block w-px h-4 bg-white/15"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-out 0.7s',
            }}
          />

          {/* Personal Projects link — navigates to separate page */}
          <button
            onClick={() => navigate('/personal-projects')}
            className="nav-link hidden sm:block relative py-1 transition-all duration-300 hover:text-foreground"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'opacity 0.5s ease-out 0.7s, transform 0.5s ease-out 0.7s, color 0.3s',
            }}
          >
            Personal Projects
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-primary via-purple-400 to-orange-400 transition-all duration-150"
        style={{
          width: `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%`,
          opacity: scrolled ? 0.5 : 0,
        }}
      />
    </nav>
  );
};

export default Navbar;
