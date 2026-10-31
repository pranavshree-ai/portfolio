"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import "./orbit-card-stack.css";

/**
 * OrbitCardStack Component (@componentry/orbit-card-stack)
 * Interactive card stack that rests in a tight deck and smoothly fans out
 * across an orbital arc on hover, tap, or keyboard focus.
 *
 * Adapted for Pranav Jadhav Portfolio:
 * - Pure Vanilla CSS Design System (Zero Tailwind Dependencies)
 * - Obsidian dark glassmorphism aesthetic with cyan/neon telemetry accents
 * - Specular reflection shine overlays
 * - Keyboard navigation (Arrow keys, Escape)
 * - Touch & mobile-responsive spread scaling
 */
export function OrbitCardStack({
  items = [],
  className = "",
  cardClassName = "",
  defaultActiveIndex = 4,
  spread = 90,
  lift = 38,
  onActiveChange,
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const cards = items.length ? items : [];
  const restingIndex = Math.min(Math.max(0, defaultActiveIndex), Math.max(0, cards.length - 1));
  const [activeIndex, setActiveIndex] = useState(restingIndex);
  const [open, setOpen] = useState(false);
  const [responsiveSpread, setResponsiveSpread] = useState(spread);
  const stageRef = useRef(null);
  const midpoint = (cards.length - 1) / 2;

  // Responsive spread based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w < 480) {
        setResponsiveSpread(Math.min(spread * 0.35, 30));
      } else if (w < 768) {
        setResponsiveSpread(Math.min(spread * 0.55, 50));
      } else if (w < 1100) {
        setResponsiveSpread(Math.min(spread * 0.78, 70));
      } else {
        setResponsiveSpread(spread);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [spread]);

  const layouts = useMemo(
    () =>
      cards.map((_, index) => {
        const orbit = index - midpoint;
        const stack = index - restingIndex;
        return {
          open: {
            x: orbit * responsiveSpread,
            y: Math.abs(orbit) * 14 + Math.max(0, Math.abs(orbit) - 1) * 6,
            rotation: orbit * 3.6,
          },
          closed: {
            x: stack * 6,
            y: Math.abs(stack) * 3,
            rotation: stack * 1.4,
          },
        };
      }),
    [cards, midpoint, restingIndex, responsiveSpread]
  );

  const activate = (index) => {
    const next = Math.min(Math.max(0, index), Math.max(0, cards.length - 1));
    setOpen(true);
    setActiveIndex(next);
    onActiveChange?.(cards[next], next);
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(restingIndex);
  };

  const leaveFocus = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  };

  return (
    <div
      className={`ocs-container ${className}`}
      onMouseEnter={() => setOpen(true)}
    >
      <div
        ref={stageRef}
        className="ocs-stage"
        onMouseLeave={close}
        onBlur={leaveFocus}
        role="list"
        aria-label="Frequently asked questions card stack"
      >
        {cards.map((item, index) => {
          const position = open ? layouts[index]?.open : layouts[index]?.closed;
          const active = index === activeIndex;
          const accentColor = item.accent || "#00f0ff";

          const style = {
            zIndex: active ? 90 : 50 - Math.abs(index - activeIndex),
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${
              position.y - (open && active ? lift : 0)
            }px)) rotate(${position.rotation}deg) scale(${open ? (active ? 1.03 : 0.98) : 0.96})`,
            transitionDuration: reduceMotion ? "0ms" : "420ms",
          };

          return (
            <article
              key={`${item.q || item.question || item.name || index}-${index}`}
              role="listitem"
              tabIndex={0}
              aria-current={active ? "true" : undefined}
              className={`ocs-card ${active ? "active" : ""} ${cardClassName}`}
              style={style}
              onMouseEnter={() => activate(index)}
              onFocus={() => activate(index)}
              onClick={() => activate(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  const next = (index + 1) % cards.length;
                  activate(next);
                  stageRef.current?.querySelectorAll("[role=listitem]")?.[next]?.focus();
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const next = (index - 1 + cards.length) % cards.length;
                  activate(next);
                  stageRef.current?.querySelectorAll("[role=listitem]")?.[next]?.focus();
                }
                if (event.key === "Escape") {
                  event.currentTarget.blur();
                  close();
                }
              }}
            >
              {/* Card Specular Shine Gradient */}
              <div className="ocs-sheen" aria-hidden="true" />

              {/* Card Header Illustration / Banner */}
              <div
                className="ocs-card-banner"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}20 0%, #0d121c 70%, #080a0f 100%)`,
                }}
              >
                {/* Radial Glow Anchor */}
                <div
                  className="ocs-card-glow"
                  style={{ backgroundColor: accentColor }}
                />

                <div className="ocs-banner-top">
                  <span className="ocs-tag-pill">
                    <span
                      className="ocs-tag-dot"
                      style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
                    />
                    {item.tag || `FAQ · 0${index + 1}`}
                  </span>

                  <span
                    className="ocs-arrow-btn"
                    style={{ color: active ? accentColor : undefined }}
                  >
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </div>

                {/* Question Index Badge */}
                <div className="ocs-banner-bottom">
                  <span className="ocs-q-label">
                    Question
                  </span>
                  <span
                    className="ocs-q-num"
                    style={{ color: accentColor }}
                  >
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="ocs-card-body">
                <div>
                  {/* Question */}
                  <h3 className="ocs-card-title">
                    {item.q || item.question || item.name}
                  </h3>

                  {/* Short Answer */}
                  <p className="ocs-card-answer">
                    {item.shortAnswer || item.a || item.answer || item.description}
                  </p>
                </div>

                {/* Footer Stat / Architecture Pillar */}
                <div className="ocs-card-footer">
                  <span className="ocs-stat-text">
                    {item.stat || "TELEMETRY VERIFIED"}
                  </span>
                  <span
                    className="ocs-stat-badge"
                    style={{ color: accentColor }}
                  >
                    ✦ ML
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default OrbitCardStack;
