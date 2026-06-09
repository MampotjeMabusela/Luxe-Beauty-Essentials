import { useEffect, useRef } from 'react';

function createFlake(width, height, layer) {
  const layerConfig = {
    back: { size: [0.6, 1.4], speed: [0.35, 0.75], opacity: [0.25, 0.5], drift: 0.25 },
    mid: { size: [1.2, 2.4], speed: [0.65, 1.25], opacity: [0.45, 0.75], drift: 0.45 },
    front: { size: [2.2, 4.2], speed: [1.1, 2.1], opacity: [0.55, 0.95], drift: 0.7 },
  }[layer];

  const radius =
    layerConfig.size[0] + Math.random() * (layerConfig.size[1] - layerConfig.size[0]);

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius,
    speedY:
      layerConfig.speed[0] + Math.random() * (layerConfig.speed[1] - layerConfig.speed[0]),
    speedX: (Math.random() - 0.5) * layerConfig.drift,
    opacity:
      layerConfig.opacity[0] +
      Math.random() * (layerConfig.opacity[1] - layerConfig.opacity[0]),
    layer,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.008 + Math.random() * 0.02,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    crystal: layer !== 'back' && radius > 1.8 && Math.random() > 0.55,
  };
}

function drawCrystal(ctx, x, y, radius, opacity, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.lineWidth = Math.max(0.5, radius * 0.22);
  ctx.lineCap = 'round';

  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.55);
    ctx.lineTo(-radius * 0.28, -radius * 0.78);
    ctx.moveTo(0, -radius * 0.55);
    ctx.lineTo(radius * 0.28, -radius * 0.78);
    ctx.stroke();

    ctx.rotate(Math.PI / 3);
  }

  ctx.restore();
}

function drawFlake(ctx, flake) {
  if (flake.crystal) {
    drawCrystal(ctx, flake.x, flake.y, flake.radius, flake.opacity, flake.rotation);
    return;
  }

  const gradient = ctx.createRadialGradient(
    flake.x,
    flake.y,
    0,
    flake.x,
    flake.y,
    flake.radius
  );
  gradient.addColorStop(0, `rgba(255, 255, 255, ${flake.opacity})`);
  gradient.addColorStop(0.45, `rgba(230, 242, 255, ${flake.opacity * 0.85})`);
  gradient.addColorStop(1, `rgba(200, 220, 240, 0)`);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
  ctx.fill();
}

export default function WinterDecoration() {
  const canvasRef = useRef(null);
  const flakesRef = useRef([]);
  const frameRef = useRef(null);
  const windRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initFlakes = () => {
      const count = Math.min(220, Math.max(90, Math.floor(width / 7)));
      const layers = ['back', 'mid', 'front'];
      flakesRef.current = Array.from({ length: count }, (_, i) =>
        createFlake(width, height, layers[i % 3])
      );
    };

    resize();
    initFlakes();

    const onResize = () => {
      resize();
      initFlakes();
    };

    window.addEventListener('resize', onResize);

    let time = 0;
    const animate = () => {
      time += 1;
      windRef.current = Math.sin(time * 0.004) * 0.6 + Math.sin(time * 0.0015) * 0.35;

      ctx.clearRect(0, 0, width, height);

      const sorted = [...flakesRef.current].sort((a, b) => {
        const order = { back: 0, mid: 1, front: 2 };
        return order[a.layer] - order[b.layer];
      });

      sorted.forEach((flake) => {
        flake.wobble += flake.wobbleSpeed;
        flake.rotation += flake.rotationSpeed;
        flake.y += flake.speedY;
        flake.x += flake.speedX + windRef.current * (flake.layer === 'front' ? 1.2 : 0.6);
        flake.x += Math.sin(flake.wobble) * 0.35;

        if (flake.y > height + flake.radius * 2) {
          flake.y = -flake.radius * 2;
          flake.x = Math.random() * width;
        }
        if (flake.x > width + 10) flake.x = -10;
        if (flake.x < -10) flake.x = width + 10;

        drawFlake(ctx, flake);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', onResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="winter-deco" aria-hidden>
      <div className="winter-deco__aurora" />
      <div className="winter-deco__frost-glow" />

      <canvas ref={canvasRef} className="winter-deco__canvas" />

      <div className="winter-deco__sparkles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="winter-deco__sparkle"
            style={{
              '--delay': `${i * 0.7}s`,
              '--x': `${8 + (i * 7.5) % 84}%`,
              '--y': `${12 + (i * 11) % 70}%`,
            }}
          />
        ))}
      </div>

      <div className="winter-deco__corner winter-deco__corner--tl" />
      <div className="winter-deco__corner winter-deco__corner--tr" />
      <div className="winter-deco__vignette" />
    </div>
  );
}
