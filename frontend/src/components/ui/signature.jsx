"use client";

import React, { useEffect, useId, useState, useCallback } from "react";
import { motion } from "framer-motion";
import opentype from "opentype.js";
import { cn } from "@/lib/utils";

/**
 * Signature Component
 * Exact Componentry Signature implementation (@componentry/signature)
 * Featuring authentic animated SVG calligraphy handwriting path reveal,
 * Kunstler Script font geometry, and subtle chromatic aberration fringe.
 */
export function Signature({
  text = "PRANAV JADHAV",
  color = "#FFFFFF",
  fontSize = 72,
  duration = 0.95,
  delay = 0.08,
  className,
  inView = true,
  once = false,
  fontUrl = "/KunstlerScript.ttf",
  chromatic = true,
  interactive = true,
}) {
  const [paths, setPaths] = useState([]);
  const [viewBox, setViewBox] = useState("0 0 740 170");
  const [aspectWidth, setAspectWidth] = useState(740);
  const [aspectHeight, setAspectHeight] = useState(170);
  const [animKey, setAnimKey] = useState(0);

  const rawId = useId();
  const maskId = `signature-reveal-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    let isMounted = true;

    async function loadFont() {
      try {
        let font = null;
        const candidatePaths = [
          fontUrl,
          "/KunstlerScript.ttf",
          "/LastoriaBoldRegular.otf",
          "https://www.componentry.fun/LastoriaBoldRegular.otf"
        ].filter(Boolean);

        for (const candidate of candidatePaths) {
          try {
            const res = await fetch(candidate);
            if (!res.ok) continue;
            const buffer = await res.arrayBuffer();
            font = opentype.parse(buffer);
            if (font) break;
          } catch (e) {
            // try next candidate
          }
        }

        if (!font) {
          throw new Error("Could not parse font from provided candidates");
        }

        if (!isMounted) return;

        let x = 0;
        const newPaths = [];
        let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity;

        for (const char of text) {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(x, fontSize * 1.5, fontSize);
          const pathData = path.toPathData(3);
          newPaths.push(pathData);

          const bbox = path.getBoundingBox();
          if (bbox.x1 < minX) minX = bbox.x1;
          if (bbox.x2 > maxX) maxX = bbox.x2;
          if (bbox.y1 < minY) minY = bbox.y1;
          if (bbox.y2 > maxY) maxY = bbox.y2;

          let advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          if (char === " ") {
            advanceWidth = Math.max(advanceWidth, font.unitsPerEm * 0.45);
          }
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        if (!isMounted) return;

        // Bounding box with safe padding so grand flourish loops never clip
        const padX = fontSize * 0.2;
        const padY = fontSize * 0.3;
        const vbX = minX - padX;
        const vbY = minY - padY;
        const vbW = Math.max(1, (maxX - minX) + padX * 2);
        const vbH = Math.max(1, (maxY - minY) + padY * 2);

        setPaths(newPaths);
        setViewBox(`${vbX} ${vbY} ${vbW} ${vbH}`);
        setAspectWidth(vbW);
        setAspectHeight(vbH);
      } catch (err) {
        console.error("Signature component font load error:", err);
      }
    }

    loadFont();

    return () => {
      isMounted = false;
    };
  }, [text, fontSize, fontUrl]);

  const handleReplay = useCallback(() => {
    if (interactive) {
      setAnimKey((prev) => prev + 1);
    }
  }, [interactive]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  const stagger = 0.08;

  if (paths.length === 0) {
    return (
      <div 
        className={cn("signature-placeholder", className)}
        style={{ 
          fontFamily: "'Kunstler Script', 'Great Vibes', cursive, sans-serif",
          fontSize: `${fontSize * 0.75}px`,
          color,
          letterSpacing: "0.08em"
        }}
      >
        {text}
      </div>
    );
  }

  return (
    <motion.svg
      key={`${paths.length}-${animKey}`}
      viewBox={viewBox}
      fill="none"
      className={cn("signature-svg overflow-visible select-none", className)}
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        aspectRatio: `${aspectWidth} / ${aspectHeight}`,
        cursor: interactive ? "pointer" : "default",
      }}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : "visible"}
      viewport={{ once }}
      onMouseEnter={handleReplay}
      onClick={handleReplay}
      aria-label={text}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {paths.map((d, i) => {
            if (!d) return null;
            return (
              <motion.path
                key={`mask-${i}`}
                d={d}
                stroke="white"
                strokeWidth={fontSize * 0.28}
                fill="none"
                variants={variants}
                transition={{
                  pathLength: {
                    delay: delay + i * stagger,
                    duration,
                    ease: "easeInOut",
                  },
                  opacity: {
                    delay: delay + i * stagger + 0.01,
                    duration: 0.01,
                  },
                }}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </mask>
      </defs>

      {/* 1. Chromatic Cyan Layer (left 1px offset) */}
      {chromatic && (
        <g transform="translate(-1, 0)" opacity="0.85">
          {paths.map((d, i) => {
            if (!d) return null;
            return (
              <motion.path
                key={`cyan-${i}`}
                d={d}
                stroke="#00d8ff"
                strokeWidth={1.8}
                fill="none"
                variants={variants}
                transition={{
                  pathLength: {
                    delay: delay + i * stagger,
                    duration,
                    ease: "easeInOut",
                  },
                  opacity: {
                    delay: delay + i * stagger + 0.01,
                    duration: 0.01,
                  },
                }}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>
      )}

      {/* 2. Chromatic Orange/Red Layer (right 1px offset) */}
      {chromatic && (
        <g transform="translate(1, 0)" opacity="0.85">
          {paths.map((d, i) => {
            if (!d) return null;
            return (
              <motion.path
                key={`orange-${i}`}
                d={d}
                stroke="#ff5500"
                strokeWidth={1.8}
                fill="none"
                variants={variants}
                transition={{
                  pathLength: {
                    delay: delay + i * stagger,
                    duration,
                    ease: "easeInOut",
                  },
                  opacity: {
                    delay: delay + i * stagger + 0.01,
                    duration: 0.01,
                  },
                }}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>
      )}

      {/* 3. Primary White Stroke Outline Animation (Exact Componentry drawing effect) */}
      <g>
        {paths.map((d, i) => {
          if (!d) return null;
          return (
            <motion.path
              key={`white-${i}`}
              d={d}
              stroke={color}
              strokeWidth={2}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * stagger,
                  duration,
                  ease: "easeInOut",
                },
                opacity: {
                  delay: delay + i * stagger + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </g>

      {/* 4. Calligraphy Solid Body Revealed via Animated Mask */}
      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => {
          if (!d) return null;
          return <path key={`fill-${i}`} d={d} fill={color} />;
        })}
      </g>
    </motion.svg>
  );
}

export default Signature;
