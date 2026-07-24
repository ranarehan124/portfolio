import { useEffect, useRef } from 'react';

/**
 * ParticleName
 * A lightweight port of the ParticleText Framer component, adapted for
 * plain React. Renders `text` as a field of colored particles that
 * assemble into shape on mount, then idle with a gentle twinkle.
 *
 * Usage:
 *   <ParticleName text="Rehan Tahir" colors={['#FFFFFF', '#8B7CF6']} />
 */
type ParticleNameProps = {
  text: string;
  colors?: string[];
  fontSize?: number;   // px, base font size used to sample the glyph shapes
  fontWeight?: number;
  width?: number;       // css px
  height?: number;      // css px
  particleGap?: number; // sampling density — lower = denser
  formMs?: number;      // formation duration
  className?: string;
};

export default function ParticleName({
  text,
  colors = ['#FFFFFF', '#8B7CF6', '#B4A6FF'],
  fontSize = 26,
  fontWeight = 700,
  width = 220,
  height = 40,
  particleGap = 2.1,
  formMs = 1400,
  className,
}: ParticleNameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const palette = colors.length ? colors : ['#FFFFFF'];

    const sample = () => {
      const off = document.createElement('canvas');
      off.width = width * dpr;
      off.height = height * dpr;
      const octx = off.getContext('2d');
      if (!octx) return [] as { x: number; y: number }[];
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.fillStyle = '#fff';
      octx.font = `${fontWeight} ${fontSize}px 'Fraunces', Georgia, serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText(text, width / 2, height / 2 + 2);

      const img = octx.getImageData(0, 0, width * dpr, height * dpr).data;
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < height; y += particleGap) {
        for (let x = 0; x < width; x += particleGap) {
          const ix = Math.floor(x * dpr);
          const iy = Math.floor(y * dpr);
          const idx = (iy * width * dpr + ix) * 4 + 3;
          if ((img[idx] ?? 0) > 128) pts.push({ x, y });
        }
      }
      return pts;
    };

    const build = () => {
      const points = sample();
      const particles = points.map((p) => {
        const ang = Math.random() * Math.PI * 2;
        const rad = 30 + Math.random() * 70;
        return {
          ox: p.x,
          oy: p.y,
          x: width / 2 + Math.cos(ang) * rad,
          y: height / 2 + Math.sin(ang) * rad,
          color: palette[Math.floor(Math.random() * palette.length)] ?? palette[0] ?? '#FFFFFF',
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 0.8,
        };
      });

      const startTime = performance.now();
      let raf = 0;

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const drawSettled = () => {
        // Once formed, draw crisp solid text instead of loose dots so the
        // name stays fully readable (no flicker/noise).
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const stops = palette.length > 1 ? palette : [palette[0], palette[0]];
        stops.forEach((c, i) => gradient.addColorStop(i / (stops.length - 1), c as string));
        ctx.fillStyle = gradient;
        ctx.font = `${fontWeight} ${fontSize}px 'Fraunces', Georgia, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2 + 2);
      };

      const frame = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / formMs);

        if (t >= 1) {
          drawSettled();
          return; // stop the loop — name stays crisp and static
        }

        const e = easeOutCubic(t);
        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
          const x = p.x + (p.ox - p.x) * e;
          const y = p.y + (p.oy - p.y) * e;

          ctx.globalAlpha = Math.max(0.15, e);
          ctx.fillStyle = p.color;
          ctx.fillRect(x, y, 2, 2);
        }
        ctx.globalAlpha = 1;

        raf = requestAnimationFrame(frame);
      };

      raf = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(raf);
    };

    let cleanup: (() => void) | undefined;

    // Wait for the custom font so glyph shapes are sampled correctly.
    if (document.fonts && document.fonts.ready) {
      document.fonts
        .load(`${fontWeight} ${fontSize}px 'Fraunces'`)
        .catch(() => {})
        .finally(() => {
          document.fonts.ready.then(() => {
            cleanup = build();
          });
        });
    } else {
      cleanup = build();
    }

    return () => {
      cleanup?.();
    };
  }, [text, colors.join('|'), fontSize, fontWeight, width, height, particleGap, formMs]);

  return <canvas ref={canvasRef} className={className} />;
}