import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Bot, ShieldCheck, Cpu, GitBranch, Workflow } from 'lucide-react';
import './ScrollSplitCard.css';

gsap.registerPlugin(ScrollTrigger);

function renderIcon(card) {
  if (card.icon && React.isValidElement(card.icon)) return card.icon;
  const name = card.iconName || (typeof card.icon === 'string' ? card.icon : '');
  const col = card.textColor || '#ffffff';
  switch (name) {
    case 'Database': return <Database size={24} strokeWidth={1.8} color={col} />;
    case 'Bot': return <Bot size={24} strokeWidth={1.8} color={col} />;
    case 'ShieldCheck': return <ShieldCheck size={24} strokeWidth={1.8} color={col} />;
    case 'Cpu': return <Cpu size={24} strokeWidth={1.8} color={col} />;
    case 'GitBranch': return <GitBranch size={24} strokeWidth={1.8} color={col} />;
    default: return <Workflow size={24} strokeWidth={1.8} color={col} />;
  }
}

/**
 * ScrollSplitCard
 * Exact replication of @componentry/scroll-split-card
 * Features a scroll-driven multi-panel split, 3D flip, and project reveal.
 * Dynamically handles 5 panels (2 left, 1 center, 2 right) with GSAP ScrollTrigger.
 */
export default function ScrollSplitCard({
  imageSrc = "/images/split_card_cover.jpg",
  cards = []
}) {
  const trackRef = useRef(null);
  const cardsRowRef = useRef(null);
  const indicatorRef = useRef(null);
  const panelsRef = useRef([]);
  const frontsRef = useRef([]);
  const backsRef = useRef([]);

  useEffect(() => {
    if (!trackRef.current || cards.length === 0) return;

    const total = cards.length;
    const center = (total - 1) / 2;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: "+=2400px",
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1
        }
      });

      // 1. Starting Indicator: "SCROLL DOWN" fades out (0 -> 0.10)
      if (indicatorRef.current) {
        tl.to(indicatorRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.10,
          ease: "none"
        }, 0);
      }

      // 2. Stage 1: Separation & Border Radius Rounding (0 -> 0.40)
      for (let i = 0; i < total; i++) {
        const front = frontsRef.current[i];
        const back = backsRef.current[i];
        const panel = panelsRef.current[i];
        const factor = i - center; // -2, -1, 0, 1, 2 for 5 cards

        if (front && back) {
          tl.to([front, back], {
            borderRadius: "16px",
            duration: 0.20,
            ease: "power1.inOut"
          }, 0);
        }

        if (panel) {
          // Spread outward from center: responsive spread factor for mobile vs desktop
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
          const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
          const spreadFactor = isMobile ? 16 : isTablet ? 28 : 44;
          const spreadX = factor * spreadFactor;
          tl.to(panel, {
            x: spreadX,
            duration: 0.40,
            ease: "power1.inOut"
          }, 0);
        }
      }

      // Entire card row scales slightly for breathing room
      if (cardsRowRef.current) {
        tl.to(cardsRowRef.current, {
          scale: 0.88,
          duration: 0.40,
          ease: "power1.inOut"
        }, 0);
      }

      // 3. Stage 2: 3D Flip & Splay Settle (0.40 -> 0.80)
      for (let i = 0; i < total; i++) {
        const panel = panelsRef.current[i];
        const factor = i - center; // -2, -1, 0, 1, 2

        if (panel) {
          const splayZ = -factor * 4.5; // +9, +4.5, 0, -4.5, -9
          const settleX = factor * 24; // -48, -24, 0, 24, 48

          tl.to(panel, {
            rotateY: 180,
            rotateZ: splayZ,
            x: settleX,
            duration: 0.40,
            ease: "power2.inOut"
          }, 0.40);
        }
      }

    }, trackRef);

    const sortTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(sortTimer);
      ctx.revert();
    };
  }, [cards.length]);

  const total = cards.length;

  return (
    <div ref={trackRef} className="ssc-track">
      <div className="ssc-sticky">
        
        {/* Top Starting Indicator */}
        <div ref={indicatorRef} className="ssc-indicator">
          <p className="ssc-indicator-text">
            Scroll down
          </p>
        </div>

        {/* Multi-Panel Split Card Container (Dynamic width for 5 panels) */}
        <div 
          ref={cardsRowRef} 
          className="ssc-cards-row"
          style={{ maxWidth: total >= 5 ? '1240px' : '896px' }}
        >
          {cards.map((card, i) => {
            const isFirst = i === 0;
            const isLast = i === total - 1;
            // z-index: center card highest when flipped
            const centerDistance = Math.abs(i - (total - 1) / 2);
            const zIndexVal = Math.round(10 - centerDistance);

            return (
              <div
                key={card.id || i}
                ref={(el) => (panelsRef.current[i] = el)}
                className={`ssc-panel ssc-panel-${i}`}
                style={{ zIndex: zIndexVal }}
              >
                {/* FRONT SIDE: Sliced Image Segment */}
                <div
                  ref={(el) => (frontsRef.current[i] = el)}
                  className="ssc-front-side"
                  style={{
                    borderTopLeftRadius: isFirst ? '16px' : '0',
                    borderBottomLeftRadius: isFirst ? '16px' : '0',
                    borderTopRightRadius: isLast ? '16px' : '0',
                    borderBottomRightRadius: isLast ? '16px' : '0',
                  }}
                >
                  <div
                    className="ssc-front-slice"
                    style={{
                      width: `${total * 100}%`,
                      left: `${-100 * i}%`,
                      backgroundImage: `url(${imageSrc})`
                    }}
                  />
                </div>

                {/* BACK SIDE: Content Card */}
                <div
                  ref={(el) => (backsRef.current[i] = el)}
                  className="ssc-back-side"
                  style={{
                    backgroundColor: card.bgColor || '#141414',
                    color: card.textColor || '#FFFFFF',
                    borderTopLeftRadius: isFirst ? '16px' : '0',
                    borderBottomLeftRadius: isFirst ? '16px' : '0',
                    borderTopRightRadius: isLast ? '16px' : '0',
                    borderBottomRightRadius: isLast ? '16px' : '0',
                  }}
                >
                  {/* Grainy Noise Overlay */}
                  <div
                    className="ssc-noise"
                    style={{ backgroundImage: `url('/images/noise.png')` }}
                  />

                  {/* Card Icon */}
                  <div className="ssc-card-icon">
                    {renderIcon(card)}
                  </div>

                  {/* Card Badge */}
                  {card.badge && (
                    <div className="ssc-card-badge" style={{ color: card.textColor || '#FFFFFF' }}>
                      {card.badge}
                    </div>
                  )}

                  {/* Card Title & Description */}
                  <h3 className="ssc-card-title">{card.title}</h3>
                  <p className="ssc-card-desc">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
