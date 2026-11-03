"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * RepelLetter
 * Official @componentry/text-repel individual letter physics.
 * Calculates displacement based on cursor distance from the unperturbed letter origin
 * using quadratic falloff and Framer Motion spring physics with subtle rotational tilt.
 */
function RepelLetter({
  letter,
  mouseX,
  mouseY,
  radius = 120,
  strength = 45,
  mode = "repel",
  stiffness = 180,
  damping = 14,
  mass = 0.4,
  className,
}) {
  const ref = useRef(null);
  const originX = useRef(0);
  const originY = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  // Subtle tilt proportional to horizontal displacement (exact Componentry behavior)
  const rotate = useTransform(springX, (v) => v * 0.3);

  // Capture original unperturbed resting position relative to the container
  const capture = useCallback(() => {
    if (!ref.current) return;
    const container = ref.current.closest("[data-text-repel]");
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const lr = ref.current.getBoundingClientRect();
    const currentX = x.get() || 0;
    const currentY = y.get() || 0;
    // Subtract current displacement so anchor remains unperturbed
    originX.current = (lr.left - currentX) - cr.left + lr.width / 2;
    originY.current = (lr.top - currentY) - cr.top + lr.height / 2;
  }, [x, y]);

  useEffect(() => {
    const raf = requestAnimationFrame(capture);
    window.addEventListener("resize", capture);
    window.addEventListener("scroll", capture, { passive: true });
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(capture);
      });
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", capture);
      window.removeEventListener("scroll", capture);
    };
  }, [capture]);

  useEffect(() => {
    const update = () => {
      const mx = mouseX.get();
      const my = mouseY.get();

      // Cursor is off-screen or outside influence zone
      if (mx < -5000 || my < -5000) {
        x.set(0);
        y.set(0);
        return;
      }

      // Lazy capture if initial mount was unmeasured
      if (originX.current === 0 && originY.current === 0) {
        capture();
      }

      const dx = originX.current - mx;
      const dy = originY.current - my;
      const distance = Math.hypot(dx, dy);

      if (distance < radius && distance > 0) {
        // Quadratic falloff — identical to official @componentry/text-repel
        const force = Math.pow(1 - distance / radius, 2) * strength;
        const angle = Math.atan2(dy, dx);
        const dir = mode === "attract" ? -1 : 1;
        x.set(Math.cos(angle) * force * dir);
        y.set(Math.sin(angle) * force * dir);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const unsub1 = mouseX.on("change", update);
    const unsub2 = mouseY.on("change", update);
    return () => {
      unsub1();
      unsub2();
    };
  }, [mouseX, mouseY, radius, strength, mode, x, y, capture]);

  if (letter === " ") {
    return <span className="inline-block whitespace-pre"> </span>;
  }

  return (
    <motion.span
      ref={ref}
      className={cn(
        "inline-block whitespace-pre will-change-transform select-none",
        className
      )}
      style={{ x: springX, y: springY, rotate }}
      aria-hidden
    >
      {letter}
    </motion.span>
  );
}

/**
 * TextRepel
 * Exact @componentry/text-repel physics, adapted for GSAP pinned sections.
 * Tracks mouse position smoothly across the entire Section 2 area with zero layout thrashing.
 */
export function TextRepel({
  text,
  words,
  className,
  letterClassName,
  wordClassName,
  radius = 130,
  strength = 50,
  mode = "repel",
  stiffness = 180,
  damping = 14,
  mass = 0.4,
}) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  // Parse input — accept either a `words` array (from GSAP scrub) or a plain `text` string
  const wordsList = words || (text ? text.split(" ") : []);
  const ariaLabel = text || wordsList.join(" ");

  const updateCoordinates = useCallback((clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  }, [mouseX, mouseY]);

  const resetCoordinates = useCallback(() => {
    mouseX.set(-9999);
    mouseY.set(-9999);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Listen globally for smooth cursor approach from any direction
    const onPointerMove = (e) => {
      const section = document.getElementById("section2");
      if (section) {
        const sRect = section.getBoundingClientRect();
        // Check if cursor is within or near the visible Section 2
        if (
          e.clientY >= sRect.top - 50 &&
          e.clientY <= sRect.bottom + 50 &&
          e.clientX >= sRect.left - 50 &&
          e.clientX <= sRect.right + 50
        ) {
          updateCoordinates(e.clientX, e.clientY);
          return;
        }
      }
      resetCoordinates();
    };

    const onPointerLeave = () => {
      resetCoordinates();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [updateCoordinates, resetCoordinates]);

  return (
    <div
      ref={containerRef}
      data-text-repel
      className={cn(
        "inline-flex flex-wrap items-center justify-center cursor-default select-none",
        className
      )}
      onPointerMove={(e) => updateCoordinates(e.clientX, e.clientY)}
      aria-label={ariaLabel}
    >
      {wordsList.map((word, wordIndex) => (
        <span
          key={`word-${wordIndex}`}
          className={cn("reveal-word inline-flex whitespace-nowrap mr-[0.28em]", wordClassName)}
        >
          {word.split("").map((letter, letterIndex) => (
            <RepelLetter
              key={`letter-${wordIndex}-${letterIndex}`}
              letter={letter}
              mouseX={mouseX}
              mouseY={mouseY}
              radius={radius}
              strength={strength}
              mode={mode}
              stiffness={stiffness}
              damping={damping}
              mass={mass}
              className={letterClassName}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

export default TextRepel;
