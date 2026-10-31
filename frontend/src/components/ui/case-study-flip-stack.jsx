"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import "./case-study-flip-stack.css";

const DEFAULT_ITEMS = [
  {
    number: "01",
    eyebrow: "Production RAG · Qdrant",
    title: "GRGPT: 1M+ Vector Tender & Gov Resolution RAG",
    description:
      "Domain-restricted RAG assistant indexing 100K+ PDFs in Qdrant with Sentence-BERT embeddings, delivering 2-3s query latency across 1,037,086 indexed vector chunks with zero hallucination.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&q=90&auto=format&fit=crop",
    imageAlt: "GRGPT Architecture",
    background: "linear-gradient(135deg, rgba(185, 75, 10, 0.45) 0%, rgba(28, 15, 10, 0.88) 55%, rgba(10, 8, 6, 0.96) 100%)",
    accentColor: "#f97316",
    foreground: "#ffffff",
  },
  {
    number: "02",
    eyebrow: "LLMOps · Observability",
    title: "LLM-Eval: Dual AI-Judge Observability Platform",
    description:
      "Automated production LLM telemetry pipeline comparing Claude and GPT judges with Pydantic structured output validation, achieving 94% evaluator agreement and sub-50ms p50 inference.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=90&auto=format&fit=crop",
    imageAlt: "LLM-Eval Telemetry",
    background: "linear-gradient(135deg, rgba(6, 135, 155, 0.45) 0%, rgba(10, 24, 30, 0.88) 55%, rgba(6, 12, 16, 0.96) 100%)",
    accentColor: "#22d3ee",
    foreground: "#ffffff",
  },
  {
    number: "03",
    eyebrow: "Transformer NLP · MLOps",
    title: "DistilBERT MLOps: Quantized Real-Time Classifier",
    description:
      "End-to-end production pipeline with fine-tuned DistilBERT, Feast online feature store, INT8 quantization (1.8× speedup to 42ms p50), and zero-downtime Nginx canary routing.",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1400&q=90&auto=format&fit=crop",
    imageAlt: "DistilBERT Pipeline",
    background: "linear-gradient(135deg, rgba(200, 10, 100, 0.45) 0%, rgba(30, 12, 22, 0.88) 55%, rgba(12, 6, 10, 0.96) 100%)",
    accentColor: "#f43f5e",
    foreground: "#ffffff",
  },
  {
    number: "04",
    eyebrow: "Hybrid Retrieval · Citations",
    title: "RAG Document Q&A: Enterprise Hybrid Intelligence",
    description:
      "Hybrid retrieval platform merging dense Sentence-BERT FAISS semantic embeddings with sparse Rank-BM25 keyword search, powered by Claude API and chunk-level citation audit trails.",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1400&q=90&auto=format&fit=crop",
    imageAlt: "Hybrid Search Platform",
    background: "linear-gradient(135deg, rgba(65, 45, 190, 0.45) 0%, rgba(16, 14, 36, 0.88) 55%, rgba(8, 6, 16, 0.96) 100%)",
    accentColor: "#818cf8",
    foreground: "#ffffff",
  },
];

function FlipCard({
  item,
  index,
  total,
  progress,
  reduceMotion,
}) {
  const segment = 1 / Math.max(total, 1);
  const start = index * segment;
  const end = Math.min(start + segment, 1);
  const entryStart = Math.max(0, start - segment);
  const entryEnd =
    index === 0
      ? 0.0001
      : Math.min(start, entryStart + segment * 0.7);
  const exitStart = start;
  const exitEnd = end;
  const stackedCardGap = Math.min(22, 68 / Math.max(total - 1, 1));
  const stackedOffset = index * stackedCardGap;
  const restingOffset = Math.min(index * 10, 28);
  const restingScale = 1 - Math.min(index * 0.012, 0.035);

  const exitYPercent = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, -118],
  );
  const exitStackOffset = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, stackedOffset],
  );
  const exitY = useMotionTemplate`calc(${exitYPercent}% + ${exitStackOffset}px)`;
  const rotateX = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, 22],
  );
  
  // Fade out cards as they flip past the exit mark so off-screen cards
  // are removed from GPU compositor overhead during scroll
  const exitFadeEnd = Math.min(1, exitEnd + segment * 0.2);
  const opacity = useTransform(
    progress,
    [exitStart, exitEnd, exitFadeEnd],
    reduceMotion ? [1, 0, 0] : [1, 1, 0],
    { clamp: true }
  );

  const pointerEvents = useTransform(
    progress,
    (p) => (p >= exitEnd ? "none" : "auto")
  );

  const entryScale = useTransform(
    progress,
    [entryStart, entryEnd],
    index === 0 ? [1, 1] : [restingScale, 1],
  );
  const entryY = useTransform(
    progress,
    [entryStart, entryEnd],
    index === 0 ? [0, 0] : [restingOffset, 0],
  );

  return (
    <motion.article
      className="csfs-card"
      style={{
        y: exitY,
        rotateX,
        opacity,
        pointerEvents,
        zIndex: total - index,
        transformOrigin: "50% 50%",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform, opacity",
      }}
    >
      <motion.div
        className="csfs-card-inner"
        style={{
          backgroundColor: "#0b0b0e",
          backgroundImage: item.background || "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(20,20,25,0.92) 100%)",
          color: item.foreground ?? "#FFFFFF",
          y: entryY,
          scale: entryScale,
          transformOrigin: "50% 100%",
        }}
        onClick={() => {
          if (item.link) {
            window.open(item.link, '_blank');
          }
        }}
      >
        <div className="csfs-card-content">
          <div className="csfs-card-num-row">
            <span className="csfs-card-num">
              {item.number ?? String(index + 1).padStart(2, "0")}
            </span>
            {item.eyebrow && (
              <span
                className="csfs-card-tag"
                style={{
                  color: item.accentColor || "#FFFFFF",
                  borderColor: `${item.accentColor || "#FFFFFF"}40`,
                  backgroundColor: `${item.accentColor || "#FFFFFF"}18`,
                }}
              >
                {item.eyebrow}
              </span>
            )}
          </div>

          <div className="csfs-card-text-body">
            <h2 className="csfs-card-title">
              {item.title}
            </h2>
            <p className="csfs-card-desc">
              {item.description}
            </p>
          </div>
        </div>

        <div className="csfs-card-img-wrap">
          <img
            src={item.image}
            alt={item.imageAlt || item.title}
            className="csfs-card-img"
            loading={index < 2 ? "eager" : "lazy"}
            draggable={false}
          />
          <div className="csfs-card-img-gradient" />
        </div>
      </motion.div>
    </motion.article>
  );
}

export function CaseStudyFlipStack({
  items = DEFAULT_ITEMS,
  className,
  heading = "Work that Measurable.",
}) {
  const stackRef = useRef(null);
  const reduceMotion = useReducedMotion() ?? false;
  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  // Lenis provides smooth inertial scrolling globally.
  // Using scrollYProgress directly eliminates the double-spring rubber-band latency,
  // yielding instantaneous, buttery-smooth 60/120fps card flips synchronized with Lenis.
  const cardProgress = scrollYProgress;

  // Heading scroll transition:
  // Fully visible on first project (progress = 0).
  // When scrolling forward to second project, heading glides up and fades out cleanly.
  // When scrolling back down to first project, it automatically slides down and returns to view.
  const firstCardSegment = 1 / Math.max(safeItems.length, 1);
  const headingFadeEnd = firstCardSegment * 0.75;

  const headingY = useTransform(
    cardProgress,
    [0, headingFadeEnd],
    reduceMotion ? [0, 0] : [0, -50],
    { clamp: true }
  );

  const headingOpacity = useTransform(
    cardProgress,
    [0, headingFadeEnd],
    [1, 0],
    { clamp: true }
  );

  const headingPointerEvents = useTransform(
    cardProgress,
    (p) => (p >= headingFadeEnd ? "none" : "auto")
  );

  return (
    <main
      className={cn("csfs-container relative bg-black font-sans text-white", className)}
    >
      {/* 3D Folding Cards Stack with Integrated Sticky Heading */}
      <div
        ref={stackRef}
        className="csfs-stack-outer relative"
        style={{ height: `${safeItems.length * 90}vh` }}
      >
        <div className="csfs-stack-sticky">
          {heading && (
            <motion.div
              className="csfs-sticky-header"
              style={{
                y: headingY,
                opacity: headingOpacity,
                pointerEvents: headingPointerEvents,
                willChange: "transform, opacity",
              }}
            >
              <h2 className="csfs-heading">
                {heading}
              </h2>
            </motion.div>
          )}

          <div className="csfs-stage">
            {[...safeItems].reverse().map((item, reverseIndex) => {
              const index = safeItems.length - reverseIndex - 1;
              return (
                <FlipCard
                  key={`${item.title}-${index}`}
                  item={item}
                  index={index}
                  total={safeItems.length}
                  progress={cardProgress}
                  reduceMotion={reduceMotion}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CaseStudyFlipStack;
