import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  layer: number;
  speed: number;
  angle: number;
  wobble: number;
  wobbleSpeed: number;
  brightness: number; // 0-1 extra brightness from zone proximity
}

// Global registry: other components can push rects here
export const particleZones: { rect: DOMRect; color: string }[] = [];

const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  useEffect(() => {
    const colors = [
      { color: 'rgba(251, 146, 60, 0.6)', weight: 3 },   // orange
      { color: 'rgba(192, 132, 252, 0.6)', weight: 3 },  // purple
      { color: 'rgba(255, 255, 255, 0.4)', weight: 2 },  // white
      { color: 'rgba(168, 85, 247, 0.5)', weight: 2 },   // violet
      { color: 'rgba(56, 189, 248, 0.4)', weight: 1 },   // sky
    ];

    // Weighted color selection
    const weightedColors: string[] = [];
    colors.forEach(c => {
      for (let i = 0; i < c.weight; i++) {
        weightedColors.push(c.color);
      }
    });

    // Reduce particles on mobile for performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 35;
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const layer = Math.floor(Math.random() * 3);
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 2,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight * 2,
        size: (Math.random() * 1.2 + 0.3) * (layer * 0.2 + 0.4),
        color: weightedColors[Math.floor(Math.random() * weightedColors.length)],
        layer,
        speed: (Math.random() * 0.3 + 0.1) * (layer * 0.2 + 0.3),
        angle: Math.random() * Math.PI * 2,
        wobble: Math.random() * 30 + 10,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        brightness: 0,
      };
    });
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * 2,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scroll = scrollRef.current;
    const mouse = mouseRef.current;

    // Read current zones (cards register their rects)
    const zones = particleZones;

    // Sort by layer for proper depth rendering
    const sortedParticles = [...particlesRef.current].sort((a, b) => a.layer - b.layer);

    sortedParticles.forEach((p) => {
      // Parallax based on layer
      const parallaxSpeed = [0.1, 0.25, 0.4][p.layer];
      const parallaxY = scroll * parallaxSpeed;

      // Organic wobble movement
      p.angle += p.wobbleSpeed;
      const wobbleX = Math.sin(p.angle) * p.wobble;
      const wobbleY = Math.cos(p.angle * 0.7) * p.wobble * 0.5;

      // Base position with wobble
      let targetX = p.baseX + wobbleX;
      let targetY = p.baseY + wobbleY + parallaxY;

      // Mouse repulsion (subtle)
      const dx = targetX - mouse.x;
      const dy = (targetY - scroll) - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 150;

      if (dist < maxDist && dist > 0) {
        const force = (1 - dist / maxDist) * 30 * (p.layer * 0.3 + 0.3);
        targetX += (dx / dist) * force;
        targetY += (dy / dist) * force;
      }

      // Zone interaction: gentle attraction toward nearest card edge + brightness boost
      let targetBrightness = 0;
      for (const zone of zones) {
        const r = zone.rect;
        // Card center in screen space
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // Particle screen position
        const screenY = targetY - scroll;
        const zdx = targetX - cx;
        const zdy = screenY - cy;
        const zDist = Math.sqrt(zdx * zdx + zdy * zdy);
        const attractRadius = 220;

        if (zDist < attractRadius && zDist > 0) {
          const strength = (1 - zDist / attractRadius);
          // Gentle drift toward card edge (not center — so they orbit the perimeter)
          const edgeX = targetX < cx ? r.left - 12 : r.right + 12;
          const edgeY = screenY < cy ? r.top - 12 : r.bottom + 12;
          const pullX = (edgeX - targetX) * strength * 0.012;
          const pullY = (edgeY - screenY) * strength * 0.012;
          targetX += pullX;
          targetY += pullY;

          // Brightness boost
          targetBrightness = Math.max(targetBrightness, strength * 0.5);
        }
      }

      // Smooth brightness interpolation
      p.brightness += (targetBrightness - p.brightness) * 0.08;

      // Smooth interpolation
      p.x += (targetX - p.x) * 0.05;
      p.y += (targetY - p.y) * 0.05;

      // Draw particle
      const screenY = p.y - scroll;

      // Only draw if on screen (with buffer)
      if (screenY > -50 && screenY < window.innerHeight + 50) {
        // Glow radius grows slightly when near a zone
        const glowMultiplier = 1 + p.brightness * 1.5;
        const sizeMultiplier = 1 + p.brightness * 0.8;

        // Glow effect
        const gradient = ctx.createRadialGradient(
          p.x, screenY, 0,
          p.x, screenY, p.size * 3 * glowMultiplier
        );
        // Boost alpha when near zones
        const extraAlpha = p.brightness * 0.3;
        const glowColor = p.color.replace(
          /[\d.]+\)$/,
          `${Math.min(parseFloat(p.color.match(/[\d.]+\)$/)?.[0] || '0.6') + extraAlpha, 1)})`
        );
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size * 3 * glowMultiplier, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size * sizeMultiplier, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.6', '0.9').replace('0.5', '0.8').replace('0.4', '0.7');
        ctx.fill();
      }

      // Wrap around vertically
      if (p.y - scroll > window.innerHeight + 100) {
        p.baseY -= window.innerHeight + 200;
        p.y = p.baseY;
      } else if (p.y - scroll < -100) {
        p.baseY += window.innerHeight + 200;
        p.y = p.baseY;
      }
    });

    // Draw subtle connection lines between nearby particles
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.03)';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < sortedParticles.length; i++) {
      for (let j = i + 1; j < sortedParticles.length; j++) {
        const p1 = sortedParticles[i];
        const p2 = sortedParticles[j];

        // Only connect same-layer particles
        if (p1.layer !== p2.layer) continue;

        const dx = p1.x - p2.x;
        const dy = (p1.y - scroll) - (p2.y - scroll);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.globalAlpha = (1 - dist / 100) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y - scroll);
          ctx.lineTo(p2.x, p2.y - scroll);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    animationRef.current = requestAnimationFrame(animate);
  }, [dimensions]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingParticles;
