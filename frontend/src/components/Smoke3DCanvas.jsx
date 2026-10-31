import React, { useEffect, useRef } from 'react';

/**
 * Smoke3DCanvas - 3D Volumetric Drifting Smoke Simulation
 * Renders an atmospheric 3D particle smoke effect with depth perspective,
 * curl turbulence, and a soft blur filter.
 */
export default function Smoke3DCanvas({
  blurAmount = 14,
  particleCount = 42,
  primaryColor = 'rgba(56, 189, 248, 0.09)', // Subtle cyan/teal
  secondaryColor = 'rgba(255, 255, 255, 0.07)', // Soft silver mist
  accentColor = 'rgba(255, 91, 38, 0.06)' // Warm ambient glow
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Responsive particle count to ensure high framerates on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const effectiveCount = isMobile ? Math.min(particleCount, 20) : particleCount;

    // Create 3D smoke particles
    const particles = [];
    for (let i = 0; i < effectiveCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 800 + 200, // 3D depth distance
        radius: Math.random() * 140 + 100,
        baseRadius: Math.random() * 140 + 100,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.35 - Math.random() * 0.35, // Drifts gently upwards like real smoke
        vz: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.005,
        alpha: Math.random() * 0.45 + 0.25,
        colorIndex: i % 3,
        seed: Math.random() * 1000
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const fov = 600; // 3D field of view

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Atmospheric turbulence vectors
        p.x += p.vx + Math.sin(time + p.seed) * 0.4;
        p.y += p.vy + Math.cos(time * 0.8 + p.seed) * 0.3;
        p.z += p.vz;
        p.rotation += p.vRot;

        // Subtle mouse push
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          const force = (1 - dist / 300) * 0.8;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }

        // Screen boundary wrapping
        if (p.y < -p.radius * 2) {
          p.y = height + p.radius * 2;
          p.x = Math.random() * width;
        }
        if (p.x < -p.radius * 2) p.x = width + p.radius * 2;
        if (p.x > width + p.radius * 2) p.x = -p.radius * 2;
        if (p.z < 100) p.z = 900;
        if (p.z > 1000) p.z = 200;

        // 3D perspective projection
        const scale = fov / (fov + p.z);
        const screenX = p.x;
        const screenY = p.y;
        const currentRadius = p.radius * scale;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(p.rotation);

        // Volumetric radial smoke puff
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
        
        let colorCenter;
        if (p.colorIndex === 0) colorCenter = primaryColor;
        else if (p.colorIndex === 1) colorCenter = secondaryColor;
        else colorCenter = accentColor;

        gradient.addColorStop(0, colorCenter);
        gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.04)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = null;
      }
    };

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      });
    }, { threshold: 0.05 });

    observer.observe(canvas);
    render();

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount, primaryColor, secondaryColor, accentColor]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.85
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '112%',
          height: '112%',
          marginLeft: '-6%',
          marginTop: '-6%',
          filter: `blur(${blurAmount}px)`,
          WebkitFilter: `blur(${blurAmount}px)`,
          display: 'block'
        }}
      />
    </div>
  );
}
