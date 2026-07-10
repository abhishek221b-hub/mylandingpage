import { useEffect, useRef, useState, ReactNode } from "react";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
}

const SectionTransition = ({ children, className = "", immediate = false }: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      setIsVisible(true);
      return;
    }

    // Use requestIdleCallback or setTimeout for non-blocking
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.01 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translateY(48px) scale(0.985)",
        filter: isVisible ? "none" : "blur(10px)",
        transition:
          "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: isVisible ? "auto" : "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
};

export default SectionTransition;
