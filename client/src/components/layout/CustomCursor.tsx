import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor
 * A premium custom cursor: a solid dot that tracks the mouse instantly,
 * a lagging ring that eases behind it, and a soft trail of violet/cyan
 * particles that drift and fade. Ring grows on hover over interactive
 * elements (a, button, [data-cursor-hover]).
 *
 * Desktop only — hidden automatically on touch devices.
 */
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { damping: 20, stiffness: 500, mass: 0.3 });
const ringY = useSpring(cursorY, { damping: 20, stiffness: 500, mass: 0.3 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; life: number; color: string }[]
  >([]);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const palette = ['#8B7CF6', '#60A5FA', '#B4A6FF'];
    let lastEmit = 0;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);

      const now = performance.now();
      if (now - lastEmit > 24) {
        lastEmit = now;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 1,
          color: palette[Math.floor(Math.random() * palette.length)] ?? '#8B7CF6',
        });
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.03);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life *= 0.93;
        ctx.globalAlpha = p.life * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Grow the ring on hover over interactive elements.
    const onEnter = () => ringRef.current?.classList.add('cursor-ring--hover');
    const onLeave = () => ringRef.current?.classList.remove('cursor-ring--hover');

    const bindHovers = () => {
      const interactive = document.querySelectorAll('a, button, [data-cursor-hover]');
      interactive.forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
      return interactive;
    };
    let interactive = bindHovers();

    // Re-bind on DOM changes (React re-renders add/remove elements).
    const observer = new MutationObserver(() => {
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      interactive = bindHovers();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9998] pointer-events-none hidden md:block"
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white z-[9999] pointer-events-none hidden md:block"
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 w-8 h-8 -ml-3 -mt-3 rounded-full border border-primary/60 z-[9999] pointer-events-none hidden md:block"
        style={{ x: ringX, y: ringY }}
      />
    </>
  );
}

export default CustomCursor;