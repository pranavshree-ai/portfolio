import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MODEL_FRAMES from '../data/modelFrames';

gsap.registerPlugin(ScrollTrigger);

/**
 * Model3DScrollCanvas
 * Renders the exact 3D blooming magnolia flower scroll animation from yaros.me.
 * Smoothly scrubs through all 198 local frames synced with page scroll.
 * Uses direct canvas ref manipulation for 60fps buttery-smooth motion with 0 React re-renders!
 */
export default function Model3DScrollCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const isLoadedRef = useRef(false);
  const totalFrames = MODEL_FRAMES.length; // 198

  // Draw a specific frame index (0 to totalFrames - 1) directly to canvas
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width || window.innerWidth;
    const cssH = rect.height || window.innerHeight;
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const w = canvas.width;
    const h = canvas.height;
    if (w <= 0 || h <= 0) return;

    const targetIdx = Math.max(0, Math.min(totalFrames - 1, Math.round(index)));
    currentFrameRef.current = targetIdx;

    let img = imagesRef.current[targetIdx];
    // If exact frame is not loaded yet, search for nearest available loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < totalFrames; offset++) {
        const prev = imagesRef.current[targetIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[targetIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.clearRect(0, 0, w, h);

    // yaros.me lotus expansion:
    // Make the lotus substantially wider across the viewport
    const imgRatio = img.naturalWidth / img.naturalHeight; // 1.0
    const canvasRatio = w / h;
    const isPhone = w <= 640;
    let drawW, drawH;

    if (canvasRatio > imgRatio) {
      // Widescreen desktop: scale lotus widely (up to 88% of screen width, or 1.35x height)
      drawW = Math.max(w * 0.88, h * 1.35);
      drawH = drawW / imgRatio;
    } else if (isPhone) {
      // Phone view (<= 640px): enlarge lotus so petals bloom prominently across mobile screens
      drawW = Math.max(w * 1.48, h * 0.62);
      drawH = drawW / imgRatio;
    } else {
      // Tablet / portrait screens (641px - 1024px)
      drawW = Math.max(w * 1.08, h * 0.75);
      drawH = drawW / imgRatio;
    }

    const scale = 1.0;
    const scaledW = drawW * scale;
    const scaledH = drawH * scale;
    const drawX = (w - scaledW) / 2;
    // Position vertically: on phone, slight lift ensures flower sits in upper half while text is below
    const yOffsetPercent = isPhone ? 0.075 : 0.055;
    const drawY = (h - scaledH) / 2 - (h * yOffsetPercent);

    ctx.drawImage(img, drawX, drawY, scaledW, scaledH);
  }, [totalFrames]);

  useEffect(() => {
    const images = new Array(totalFrames);
    imagesRef.current = images;

    // 1. Immediately load frame 0 and render
    const firstImg = new Image();
    firstImg.onload = () => {
      images[0] = firstImg;
      isLoadedRef.current = true;
      drawFrame(0);
      loadRemainingFrames();
    };
    firstImg.src = MODEL_FRAMES[0];

    // 2. Preload remaining frames
    function loadRemainingFrames() {
      for (let i = 1; i < totalFrames; i++) {
        const img = new Image();
        img.onload = () => {
          images[i] = img;
        };
        img.src = MODEL_FRAMES[i];
      }
    }

    // 3. Expose drawFrame to master timeline in App.jsx
    window.drawFlowerFrame = (idx) => {
      drawFrame(idx);
    };

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      delete window.drawFlowerFrame;
    };
  }, [totalFrames, drawFrame]);

  return (
    <div ref={containerRef} className="yaros-3d-model-canvas-container">
      <canvas 
        ref={canvasRef} 
        className="yaros-3d-model-canvas"
      />
    </div>
  );
}
