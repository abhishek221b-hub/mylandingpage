import { useEffect, useState } from "react";

const CursorGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTap, setIsTap] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      setIsTap(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setPosition({ x: touch.clientX, y: touch.clientY });
      setIsVisible(true);
      setIsTap(true);
    };

    const handleTouchEnd = () => {
      // Fade out after a short delay on mobile
      setTimeout(() => {
        setIsVisible(false);
      }, 400);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className={`cursor-glow ${isTap ? 'tap-glow' : ''}`}
        style={{
          left: position.x,
          top: position.y,
        }}
      />
    </div>
  );
};

export default CursorGlow;
