"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "./orbit-cards.css";

/**
 * OrbitCards Component
 * Exact HorizonX Orbit Cards Architecture (https://horizonx.so/tools/orbit-cards)
 *
 * Mechanics extracted from HorizonX:
 * - Stage with CSS clip-path floor & mask-image horizon gradient
 * - Card origin anchored at: left: 50%; top: calc(100% - var(--oc-floor, 48px) + 24px)
 * - Exact transform: translate(-50%, -50%) rotate(am deg) translateY(-R px) rotate(0deg)
 * - Z-Index depth curve: 100 + round(cos(rad) * 100)
 * - Autoplay revolution with momentum touch/mouse drag & friction damping
 * - Subtle "DRAG TO ROTATE" micro-label centered below the floor
 */
export function OrbitCards({
  items = [],
  orbitRadius = 250,
  cardWidth = 156,
  cardHeight = 188,
  duration = 24,
  direction = "clockwise",
  orientation = "upright",
  autoplay = true,
  pauseOnHover = true,
  draggable = true,
  dragSensitivity = 0.35,
  className,
}) {
  const [rotation, setRotation] = useState(0);
  const [isPlaying] = useState(autoplay);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [effectiveRadius, setEffectiveRadius] = useState(orbitRadius);

  const stageRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);

  const total = items.length || 1;
  const speedSign = direction === "clockwise" ? 1 : -1;
  const degPerSecond = (360 / Math.max(duration, 5)) * speedSign;

  // Responsive radius scaling
  useEffect(() => {
    const handleResize = () => {
      if (!stageRef.current) return;
      const width = stageRef.current.clientWidth;
      if (width < 480) {
        setEffectiveRadius(Math.min(orbitRadius * 0.72, width * 0.44));
      } else if (width < 768) {
        setEffectiveRadius(Math.min(orbitRadius * 0.86, width * 0.46));
      } else {
        setEffectiveRadius(orbitRadius);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [orbitRadius]);

  // Main Animation Loop with Momentum & Autoplay (with Viewport Pause optimization)
  useEffect(() => {
    let isVisible = true;

    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (isVisible && !isDragging) {
        // Friction decay for momentum fling
        if (Math.abs(velocityRef.current) > 0.05) {
          rotationRef.current += velocityRef.current * dt;
          velocityRef.current *= Math.pow(0.92, dt * 60);
        } else {
          velocityRef.current = 0;
          // Smooth continuous autoplay revolution
          if (isPlaying && (!pauseOnHover || !isHovered)) {
            rotationRef.current += degPerSecond * dt;
          }
        }
        setRotation(rotationRef.current);
      }

      if (isVisible) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        animFrameRef.current = null;
      }
    };

    const stage = stageRef.current;
    let observer;
    if (stage) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animFrameRef.current) {
              lastTimeRef.current = performance.now();
              animFrameRef.current = requestAnimationFrame(loop);
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(stage);
    }

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (observer) observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isHovered, isDragging, pauseOnHover, degPerSecond]);

  // Pointer / Drag Event Handlers
  const handlePointerDown = (e) => {
    if (!draggable) return;
    setIsDragging(true);
    velocityRef.current = 0;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max((now - lastPointerTime.current) / 1000, 0.001);
    const dx = e.clientX - lastPointerX.current;

    // Convert pixel drag to angular displacement
    const dAngle = (dx / Math.max(effectiveRadius, 100)) * (180 / Math.PI) * dragSensitivity * 2.2;
    rotationRef.current += dAngle;
    setRotation(rotationRef.current);

    velocityRef.current = dAngle / dt;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    velocityRef.current = Math.max(Math.min(velocityRef.current, 320), -320);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className={cn("oc-container", className)}>
      {/* HorizonX Orbit Stage */}
      <div
        ref={stageRef}
        className="oc-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {items.map((metric, i) => {
          const stepAngle = 360 / total;
          // Angular displacement along orbit
          const am = (rotation + i * stepAngle) % 360;
          const rad = (am * Math.PI) / 180;

          // Depth factor: 1 at apex (am = 0°), -1 at bottom (am = 180°)
          const cosVal = Math.cos(rad);
          const zIndex = Math.round(100 + cosVal * 100);

          // In HorizonX, cards facing front have data-upper="true"
          const isUpper = cosVal >= -0.2;

          const an = orientation === "upright" ? -am : 0;

          return (
            <div
              key={`${metric.number}-${i}`}
              className={cn("oc-card", isUpper && "is-upper")}
              data-orbit-card={i}
              data-upper={isUpper ? "true" : "false"}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                transform: `translate(-50%, -50%) rotate(${am.toFixed(
                  3
                )}deg) translateY(${-effectiveRadius.toFixed(1)}px) rotate(${an.toFixed(
                  3
                )}deg)`,
                zIndex,
              }}
            >
              {/* Card Specular Sheen Overlay */}
              <span className="oc-card-shade" aria-hidden="true" />

              {/* Card Top: Monospace Category / Index Tag */}
              <div className="oc-card-header">
                <span className="oc-card-tag">
                  {metric.tag || `0${i + 1} · METRIC`}
                </span>
                <span className="oc-card-dot" />
              </div>

              {/* Card Middle: Hero Number */}
              <div className="oc-card-body">
                <div className="oc-card-number">{metric.number}</div>
              </div>

              {/* Card Bottom: Clear Production Label */}
              <div className="oc-card-label">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* HorizonX Drag Indicator */}
      <div className="oc-hint">DRAG TO ROTATE</div>
    </div>
  );
}

export default OrbitCards;
