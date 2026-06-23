import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracker
    const mouse = { x: width / 2, y: height / 2, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    interface Dot {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseOpacity: number;
      color: string;
    }

    const dots: Dot[] = [];
    const maxDots = 100; // 100 particles is clean and premium without clutter

    for (let i = 0; i < maxDots; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45, // slow, elegant floating drift
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.0 + 0.8,
        baseOpacity: Math.random() * 0.5 + 0.25, // elegant opacity blend
        color: 'rgba(16, 185, 129, ', // emerald green base
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark blue-black radial gradient background painted once on the canvas
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, Math.max(width, height) * 0.95
      );
      bgGrad.addColorStop(0, '#090b24');
      bgGrad.addColorStop(1, '#05060f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      dots.forEach((dot) => {
        // Update positions
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Interactive mouse repulsion
        if (mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limitDist = 140;
          if (dist < limitDist) {
            const force = (limitDist - dist) / limitDist;
            dot.x += (dx / dist) * force * 1.5;
            dot.y += (dy / dist) * force * 1.5;
          }
        }

        // Screen wrap-around for endless floating effect
        if (dot.x < 0) dot.x = width;
        if (dot.x > width) dot.x = 0;
        if (dot.y < 0) dot.y = height;
        if (dot.y > height) dot.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `${dot.color}${dot.baseOpacity})`;
        ctx.fill();
      });

      // Interactive cursor glow overlay
      if (mouse.active) {
        ctx.beginPath();
        const cursorGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 110
        );
        cursorGlow.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
        cursorGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.03)');
        cursorGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = cursorGlow;
        ctx.arc(mouse.x, mouse.y, 110, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 pointer-events-none" />;
}
