import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useReducedMotion
} from 'framer-motion';
import './MagneticDock.css';

/**
 * DockItem
 * Individual interactive magnetic icon item with cursor-distance scaling and spring physics.
 * Tooltip strictly pops up ONLY when the cursor hovers directly over this item.
 */
function DockItem({
  item,
  mouseX,
  iconSize,
  maxScale,
  magneticDistance,
  showLabels,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onItemClick,
  isVertical,
  reducedMotion
}) {
  const ref = useRef(null);
  // Tooltip strictly appears ONLY when the cursor is actively hovering over this item
  const showLabel = Boolean(showLabels && isHovered);

  // Calculate distance from mouse to center of item
  const distance = useTransform(mouseX, (val) => {
    if (!ref.current) return magneticDistance + 1;
    const rect = ref.current.getBoundingClientRect();
    const center = isVertical
      ? rect.top + rect.height / 2
      : rect.left + rect.width / 2;
    return val - center;
  });

  // Scale based on distance - closer = larger
  const scale = useTransform(
    distance,
    [-magneticDistance, 0, magneticDistance],
    [1, maxScale, 1]
  );

  // Apply spring physics for buttery-smooth scaling
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothScale = useSpring(scale, springConfig);

  // Size calculation
  const size = useTransform(smoothScale, (s) => s * iconSize);

  // Subtle floating lift effect on hover
  const y = useTransform(smoothScale, (s) => (s - 1) * -12);
  const smoothY = useSpring(y, springConfig);

  const handlePointerEnter = (e) => {
    // Only show tooltip for actual mouse/pen pointers, never sticky touch taps
    if (e.pointerType === 'touch') return;
    onHoverStart();
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      tabIndex={0}
      aria-label={item.label}
      aria-current={item.isActive ? "page" : undefined}
      onClick={(e) => {
        onHoverEnd();
        e.currentTarget?.blur();
        if (onItemClick) {
          onItemClick(e);
        } else if (item.onClick) {
          item.onClick(e);
        }
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={onHoverEnd}
      onBlur={onHoverEnd}
      className={`magnetic-dock-item ${item.isActive ? 'active' : ''}`}
      style={{
        width: reducedMotion ? iconSize : size,
        height: reducedMotion ? iconSize : size,
        y: reducedMotion || isVertical ? 0 : smoothY,
        x: reducedMotion || !isVertical ? 0 : smoothY
      }}
      whileTap={reducedMotion ? undefined : { scale: 0.92 }}
    >
      {/* Icon Capsule Container */}
      <motion.div className="magnetic-dock-icon-capsule">
        {/* Glyph / React Icon Node */}
        <div aria-hidden="true" className="magnetic-dock-glyph">
          {item.icon}
        </div>

        {/* Top Glass Shine */}
        <div className="magnetic-dock-shine" />
      </motion.div>

      {/* Notification / Counter Badge */}
      <AnimatePresence initial={false}>
        {item.badge !== undefined && (
          <motion.div
            initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            className="magnetic-dock-badge"
          >
            {item.badge}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Dot Indicator */}
      <AnimatePresence initial={false}>
        {item.isActive && (
          <motion.div
            initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            className="magnetic-dock-active-dot"
          >
            <span className="sr-only">Active section</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Tooltip Label (Strictly on Cursor Hover Only, Instant Dismissal on Leave) */}
      {showLabel && (
        <motion.div
          aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, y: 6, scale: 0.92, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="magnetic-dock-tooltip"
        >
          {item.label}
          <div className="magnetic-dock-tooltip-arrow" />
        </motion.div>
      )}
    </motion.button>
  );
}

/**
 * MagneticDock
 * Full macOS-style magnetic dock with cursor-following spring physics.
 * Single source of truth for hover state: exactly ONE item can show a tooltip at any time,
 * and only when the cursor is directly over it.
 */
export default function MagneticDock({
  items = [],
  iconSize = 44,
  maxScale = 1.42,
  magneticDistance = 140,
  showLabels = true,
  position = "bottom",
  className = ""
}) {
  const mousePosition = useMotionValue(Infinity);
  const [hoveredId, setHoveredId] = useState(null);
  const reducedMotion = useReducedMotion() ?? false;
  const isVertical = position === "left" || position === "right";

  const handleMouseMove = useCallback(
    (e) => {
      if (isVertical) {
        mousePosition.set(e.clientY);
      } else {
        mousePosition.set(e.clientX);
      }
    },
    [mousePosition, isVertical]
  );

  const handleMouseLeave = useCallback(() => {
    mousePosition.set(Infinity);
    setHoveredId(null);
  }, [mousePosition]);

  // Global listener to immediately dismiss any tooltip if window blurs or user clicks outside
  useEffect(() => {
    const dismissTooltip = () => setHoveredId(null);
    window.addEventListener('blur', dismissTooltip);
    window.addEventListener('scroll', dismissTooltip, { passive: true });
    return () => {
      window.removeEventListener('blur', dismissTooltip);
      window.removeEventListener('scroll', dismissTooltip);
    };
  }, []);

  return (
    <motion.div
      onMouseMove={reducedMotion ? undefined : handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerLeave={handleMouseLeave}
      className={`magnetic-dock-container position-${position} ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {items.map((item) => (
        <DockItem
          key={item.id}
          item={item}
          mouseX={mousePosition}
          iconSize={iconSize}
          maxScale={maxScale}
          magneticDistance={magneticDistance}
          showLabels={showLabels}
          isHovered={hoveredId === item.id}
          onHoverStart={() => setHoveredId(item.id)}
          onHoverEnd={() => {
            setHoveredId((current) => (current === item.id ? null : current));
          }}
          onItemClick={(e) => {
            setHoveredId(null);
            e.currentTarget?.blur();
            item.onClick?.(e);
          }}
          isVertical={isVertical}
          reducedMotion={reducedMotion}
        />
      ))}
    </motion.div>
  );
}
