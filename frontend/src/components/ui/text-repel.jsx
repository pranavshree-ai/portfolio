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
 * Individual character that calculates distance from cursor and displaces
 * according to quadratic falloff with spring physics.
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

  // Subtle tilt proportional to horizontal displacement
  const rotate = useTransform(springX, (v) => v * 0.3);

  const capture = useCallback(() => {
    if (!ref.current) return;
    const container = ref.current.closest("[data-text-repel]");
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const lr = ref.current.getBoundingClientRect();
    originX.current = lr.left - cr.left + lr.width / 2;
    originY.current = lr.top - cr.top + lr.height / 2;
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(capture);
    window.addEventListener("resize", capture);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", capture);
    };
  }, [capture]);

  useEffect(() => {
    const update = () => {
      const mx = mouseX.get();
      const my = mouseY.get();
      if (mx < -5000 || my < -5000) {
        x.set(0);
        y.set(0);
        return;
      }

      if (originX.current === 0 && originY.current === 0) {
        capture();
      }

      const dx = originX.current - mx;
      const dy = originY.current - my;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && distance > 0) {
        // Quadratic falloff for natural-feeling magnetic force
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
 * TextRepel Component
 * Exact Componentry implementation (@componentry/text-repel)
 * Interactive physics-based magnetic repel/attract typography.
 * Supports paragraphs, word wrapping, and scroll reveal integration.
 */
export function TextRepel({
  text,
  words,
  className,
  letterClassName,
  wordClassName,
  radius = 120,
  strength = 45,
  mode = "repel",
  stiffness = 180,
  damping = 14,
  mass = 0.4,
}) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  // Parse words array or split text
  const wordsList = words || (text ? text.split(" ") : []);

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    mouseX.set(-9999);
    mouseY.set(-9999);
  };

  // Also listen on parent #section2 so cursor approaching from flower petals triggers repel
  useEffect(() => {
    const section = containerRef.current?.closest("#section2") || containerRef.current;
    if (!section) return;

    const onSectionMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const onSectionMouseLeave = () => {
      mouseX.set(-9999);
      mouseY.set(-9999);
    };

    section.addEventListener("mousemove", onSectionMouseMove);
    section.addEventListener("mouseleave", onSectionMouseLeave);
    return () => {
      section.removeEventListener("mousemove", onSectionMouseMove);
      section.removeEventListener("mouseleave", onSectionMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      data-text-repel
      className={cn(
        "inline-flex flex-wrap items-center justify-center cursor-default select-none",
        className
      )}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      aria-label={text || wordsList.join(" ")}
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

