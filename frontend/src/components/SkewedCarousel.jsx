import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import './SkewedCarousel.css';

/**
 * HorizonX Skewed Carousel with Infinite Continuous Auto-Scroll
 * Exact 3D perspective and mathematical physics reverse-engineered from:
 * https://horizonx.so/tools/skewed-carousel
 */
export default function SkewedCarousel({
  items = [],
  initialIndex = 0,
  cardWidth = 165,
  cardHeight = 190,
  rotation = 48,
  inactiveScale = 0.82,
  perspective = 850,
  borderRadius = 22,
  autoScroll = true,
  autoScrollSpeed = 0.35, // cards per second (smooth continuous drift)
  showControls = true,
  showDots = true
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  const N = items.length;

  // Tripled items for seamless mathematical wrapping
  const displayItems = useMemo(() => {
    if (N === 0) return [];
    return [...items, ...items, ...items];
  }, [items, N]);

  const totalCards = displayItems.length;

  // Start in the middle set
  const startPos = N + (initialIndex % N);
  const posRef = useRef(startPos);
  const activeIndexRef = useRef(initialIndex % N);
  const [activeIndex, setActiveIndex] = useState(initialIndex % N);
  const [isDragging, setIsDragging] = useState(false);

  // Interaction flags
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isTweeningRef = useRef(false);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const resumeTimerRef = useRef(null);

  // Drag info tracking
  const dragInfoRef = useRef({
    pointerId: null,
    startX: 0,
    startPos: 0,
    maxDragDistance: 0,
    clickedCardOriginalIndex: null
  });

  // Render DOM and GSAP transforms for a given float position
  const renderPosition = useCallback((targetPos, animated = false, duration = 0.35) => {
    if (!trackRef.current || totalCards === 0) return;

    const track = trackRef.current;
    const cards = cardRefs.current;
    const trackX = -(targetPos + 0.5) * cardWidth;

    if (!animated) {
      gsap.set(track, { x: trackX });
    } else {
      gsap.to(track, {
        x: trackX,
        duration: duration,
        ease: 'power2.out',
        overwrite: true
      });
    }

    cards.forEach((card, i) => {
      if (!card) return;
      const offset = i - targetPos;

      // HorizonX scale formula:
      // scale = Math.abs(offset) < 0.001 ? 1 : inactiveScale + (1 - inactiveScale) * Math.max(0, 1 - Math.abs(offset))
      const scale = Math.abs(offset) < 0.001
        ? 1
        : inactiveScale + (1 - inactiveScale) * Math.max(0, 1 - Math.abs(offset));

      // HorizonX rotation formula:
      const rotationY = offset * rotation;

      if (!animated) {
        gsap.set(card, {
          rotationY: rotationY,
          scale: scale,
          transformOrigin: '50% 50%'
        });
      } else {
        gsap.to(card, {
          rotationY: rotationY,
          scale: scale,
          duration: duration,
          ease: 'power2.out',
          transformOrigin: '50% 50%',
          overwrite: true
        });
      }

      // Center card has highest z-index, symmetrically drops with distance
      card.style.zIndex = String(Math.round(1000 - Math.abs(offset) * 10));
    });

    posRef.current = targetPos;
  }, [cardWidth, rotation, inactiveScale, totalCards]);

  // Smooth tween to a target integer index
  const animateTo = useCallback((targetPos, duration = 0.4) => {
    if (totalCards === 0) return;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    isTweeningRef.current = true;
    const target = Math.round(targetPos);

    // Normalize targetPos inside middle set
    let normTarget = target;
    if (normTarget >= 2 * N) normTarget -= N;
    if (normTarget < N) normTarget += N;

    const normActive = normTarget % N;
    activeIndexRef.current = normActive;
    setActiveIndex(normActive);

    renderPosition(normTarget, true, duration);

    resumeTimerRef.current = setTimeout(() => {
      isTweeningRef.current = false;
    }, duration * 1000 + 400);
  }, [N, totalCards, renderPosition]);

  // Navigate forward or backward
  const handleNext = () => {
    animateTo(posRef.current + 1, 0.35);
  };

  const handlePrev = () => {
    animateTo(posRef.current - 1, 0.35);
  };

  // Click on a specific dot
  const handleDotClick = (origIdx) => {
    const currentNorm = posRef.current % N;
    let diff = origIdx - currentNorm;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    animateTo(posRef.current + diff, 0.4);
  };

  // Pointer down (drag start)
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target.closest('.skc-arrow-btn, .skc-dot')) return;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    isTweeningRef.current = false;

    const clickedCard = e.target.closest('.skc-card');
    const clickedIdx = clickedCard ? Number(clickedCard.dataset.displayIndex) : null;

    dragInfoRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startPos: posRef.current,
      maxDragDistance: 0,
      clickedCardOriginalIndex: clickedIdx
    };

    if (containerRef.current?.setPointerCapture) {
      try {
        containerRef.current.setPointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
    }
  };

  // Pointer move (drag scrub)
  const handlePointerMove = (e) => {
    const drag = dragInfoRef.current;
    if (!isDraggingRef.current || e.pointerId !== drag.pointerId) return;

    const diffX = drag.startX - e.clientX;
    drag.maxDragDistance = Math.max(drag.maxDragDistance, Math.abs(diffX));

    const posOffset = diffX / cardWidth;
    let newPos = drag.startPos + posOffset;

    // Wrap position seamlessly during drag
    if (newPos >= 2 * N) {
      newPos -= N;
      drag.startPos -= N;
    } else if (newPos < N) {
      newPos += N;
      drag.startPos += N;
    }

    renderPosition(newPos, false);

    const newActive = Math.round(newPos) % N;
    if (newActive !== activeIndexRef.current) {
      activeIndexRef.current = newActive;
      setActiveIndex(newActive);
    }
  };

  // Pointer up (drag release & snap)
  const handlePointerUp = (e) => {
    const drag = dragInfoRef.current;
    if (!isDraggingRef.current || e.pointerId !== drag.pointerId) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    if (containerRef.current?.hasPointerCapture?.(e.pointerId)) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {
        // ignore
      }
    }

    // Small click without drag -> jump to card
    if (drag.maxDragDistance < 8 && drag.clickedCardOriginalIndex !== null) {
      animateTo(drag.clickedCardOriginalIndex, 0.38);
    } else {
      // Snap to closest integer card
      animateTo(Math.round(posRef.current), 0.35);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Continuous auto-scroll animation loop (RAF) with Viewport Pause optimization
  useEffect(() => {
    lastTimeRef.current = performance.now();
    let isVisible = true;

    const loop = (time) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      if (
        isVisible &&
        autoScroll &&
        !isDraggingRef.current &&
        !isHoveredRef.current &&
        !isTweeningRef.current &&
        totalCards > 0
      ) {
        let nextPos = posRef.current + autoScrollSpeed * dt;

        // Mathematical seamless wrapping
        if (nextPos >= 2 * N) {
          nextPos -= N;
        } else if (nextPos < N) {
          nextPos += N;
        }

        renderPosition(nextPos, false);

        const currentActive = Math.round(nextPos) % N;
        if (currentActive !== activeIndexRef.current) {
          activeIndexRef.current = currentActive;
          setActiveIndex(currentActive);
        }
      }

      if (isVisible) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };

    const container = containerRef.current;
    let observer;
    if (container) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !rafRef.current) {
              lastTimeRef.current = performance.now();
              rafRef.current = requestAnimationFrame(loop);
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (observer) observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, [autoScroll, autoScrollSpeed, N, totalCards, renderPosition]);

  // Initial position render
  useEffect(() => {
    renderPosition(startPos, false);
  }, [startPos, renderPosition]);

  return (
    <div
      className="skc-wrapper"
      style={{
        '--skc-card-width': `${cardWidth}px`,
        '--skc-card-height': `${cardHeight}px`,
        '--skc-card-radius': `${borderRadius}px`,
        '--skc-perspective': `${perspective}px`
      }}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      <div className="skc-frame">
        <div className="skc-viewport">
          <div
            ref={containerRef}
            className="skc-carousel"
            role="region"
            aria-label="3D Skewed Tools Carousel"
            tabIndex={0}
            data-dragging={isDragging ? 'true' : 'false'}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
          >
            <div ref={trackRef} className="skc-track">
              {displayItems.map((item, idx) => {
                const origIndex = idx % N;
                const isCurrent = origIndex === activeIndex;
                return (
                  <div
                    key={idx}
                    className="skc-slot"
                    data-skewed-slot={idx}
                  >
                    <button
                      ref={(el) => (cardRefs.current[idx] = el)}
                      type="button"
                      className="skc-card"
                      data-display-index={idx}
                      data-original-index={origIndex}
                      aria-current={isCurrent ? 'true' : 'false'}
                      aria-label={item.name}
                      tabIndex={isCurrent ? 0 : -1}
                      onClick={() => animateTo(idx, 0.38)}
                    >
                      <div className="skc-logo-wrap">
                        <img
                          src={item.src}
                          alt={item.name}
                          className="skc-logo-img"
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                      <div className="skc-card-label">{item.name}</div>
                      <div className="skc-gloss" />
                      <div className="skc-tooltip">{item.name}</div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls: Chevrons & Glowing Indicator Dots */}
      {(showControls || showDots) && (
        <div className="skc-bottom-bar">
          {showControls && (
            <button
              type="button"
              className="skc-arrow-btn"
              aria-label="Previous tool"
              onClick={handlePrev}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {showDots && (
            <div className="skc-dot-indicator">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="skc-dot"
                  aria-current={idx === activeIndex ? 'true' : 'false'}
                  aria-label={`Jump to ${item.name}`}
                  onClick={() => handleDotClick(idx)}
                />
              ))}
            </div>
          )}

          {showControls && (
            <button
              type="button"
              className="skc-arrow-btn"
              aria-label="Next tool"
              onClick={handleNext}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
