import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SmokeType.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Helper to recursively wrap text nodes inside elements into .smoke-word and .smoke-char
 */
function renderSmokyContent(children, counter = { index: 0 }) {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      const words = child.split(' ');
      return words.map((word, wIdx) => {
        if (!word) return wIdx < words.length - 1 ? ' ' : null;
        return (
          <span key={wIdx} className="smoke-word">
            {word.split('').map((char, cIdx) => {
              const currentIdx = counter.index++;
              return (
                <span key={cIdx} className="smoke-char" data-smoke-index={currentIdx}>
                  {char}
                </span>
              );
            })}
            {wIdx < words.length - 1 && '\u00A0'}
          </span>
        );
      });
    }

    if (React.isValidElement(child)) {
      return React.cloneElement(
        child,
        { ...child.props },
        renderSmokyContent(child.props.children, counter)
      );
    }

    return child;
  });
}

/**
 * SmokeType - React Bits Pro Scroll Effect
 * A headline/text component where letters condense out of drifting smoke on scroll.
 */
export default function SmokeType({
  text,
  children,
  as: Component = 'span',
  smokeColor = '#FF5B26',
  turbulence = 1.2,
  rise = 1.4,
  softness = 14,
  trigger = 'scroll',
  scrub = 1,
  className = '',
  delay = 0.02,
  ...rest
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.smoke-char');
    if (!chars || chars.length === 0) return;

    // Calculate initial smoky positions for each character
    const charData = Array.from(chars).map((char, index) => {
      const angle = index * 1.45;
      const xOffset = Math.sin(angle) * 20 * turbulence;
      const yOffset = -1 * rise * 22 + Math.cos(angle * 0.9) * 12 * turbulence;
      const rotation = Math.sin(index * 2.2) * 22 * turbulence;
      const scale = 1.15 + (Math.sin(index * 0.8) * 0.15);

      return { xOffset, yOffset, rotation, scale };
    });

    // Set initial smoke state
    chars.forEach((char, i) => {
      const data = charData[i];
      gsap.set(char, {
        x: data.xOffset,
        y: data.yOffset,
        rotation: data.rotation,
        scale: data.scale,
        opacity: 0,
        filter: `blur(${softness}px)`,
        color: smokeColor
      });
    });

    const ctx = gsap.context(() => {
      if (trigger === 'scroll') {
        // Scrubbed scroll: condenses directly as user scrolls
        gsap.to(chars, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          color: 'inherit',
          ease: 'power2.out',
          stagger: {
            each: delay,
            from: 'start'
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: typeof scrub === 'boolean' ? (scrub ? 1 : false) : scrub,
          }
        });
      } else if (trigger === 'view') {
        // Trigger on entering viewport
        gsap.to(chars, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          color: 'inherit',
          duration: 1.1,
          ease: 'power3.out',
          stagger: delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse'
          }
        });
      } else {
        // On mount animation
        gsap.to(chars, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          color: 'inherit',
          duration: 1.2,
          ease: 'power3.out',
          stagger: delay
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [text, children, smokeColor, turbulence, rise, softness, trigger, scrub, delay]);

  const contentToRender = text ? text : children;

  return (
    <Component className={`smoke-type-container ${className}`} ref={containerRef} {...rest}>
      {renderSmokyContent(contentToRender)}
    </Component>
  );
}
