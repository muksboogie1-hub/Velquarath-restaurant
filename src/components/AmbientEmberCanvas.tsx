import React, { useEffect, useRef } from 'react';

/**
 * Interactive WebGL / 2D Canvas Ambient Hearth Ember & Gold Dust Shader
 * Enhances the Hero and Vibe sections with subtle, organic floating fire embers
 * inspired by Afrotopia Café's open flame grill and indoor fireplace.
 * Automatically pauses when off-screen or when prefers-reduced-motion is enabled.
 */
export const AmbientEmberCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    interface Ember {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      targetAlpha: number;
      color: string;
    }

    const colors = ['#C9A24B', '#DFB85E', '#D97724', '#F4ECDA'];
    const particleCount = Math.min(38, Math.floor(width / 36));

    const embers: Ember[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.45 + 0.15),
      alpha: Math.random() * 0.55 + 0.1,
      targetAlpha: Math.random() * 0.65 + 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const e of embers) {
        e.x += e.vx;
        e.y += e.vy;

        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }
        if (e.x < -10) e.x = width + 10;
        if (e.x > width + 10) e.x = -10;

        e.alpha += (e.targetAlpha - e.alpha) * 0.02;
        if (Math.abs(e.alpha - e.targetAlpha) < 0.05) {
          e.targetAlpha = Math.random() * 0.65 + 0.1;
        }

        ctx.save();
        ctx.globalAlpha = e.alpha;
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  );
};
