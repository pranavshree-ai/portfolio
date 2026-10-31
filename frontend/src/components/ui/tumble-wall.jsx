"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { RotateCcw, Zap, Compass, Tag } from "lucide-react";
import "./tumble-wall.css";

export const DEFAULT_TOOLKIT_ITEMS = [
  // Languages
  { name: "Python", category: "Languages", logo: "/images/tools/python.svg", accent: "#38bdf8", desc: "Core ML, PyTorch, PySpark & FastAPI" },
  { name: "SQL", category: "Languages", logo: "/images/tools/sql.svg", accent: "#60a5fa", desc: "Complex Joins, Windowing & Vector Aggregations" },
  { name: "Bash", category: "Languages", logo: "/images/tools/bash.svg", accent: "#4ade80", desc: "Linux CLI, Container Scripting & CI Pipelines" },

  // LLM & NLP
  { name: "Hugging Face", category: "LLM & NLP", logo: "/images/tools/huggingface.svg", accent: "#fbbf24", desc: "Transformers, PEFT/LoRA & Model Weights" },
  { name: "PyTorch", category: "LLM & NLP", logo: "/images/tools/pytorch.svg", accent: "#f97316", desc: "Deep Learning, Custom Tensors & CUDA Fine-Tuning" },
  { name: "Mistral AI", category: "LLM & NLP", logo: "/images/tools/mistral.svg", accent: "#f43f5e", desc: "Open Weights 7B/8x7B MoE Production Inference" },
  { name: "Llama 3", category: "LLM & NLP", logo: "/images/tools/llama.svg", accent: "#3b82f6", desc: "Domain-Tuned 8B/70B Instruct LLMs" },
  { name: "OpenAI", category: "LLM & NLP", logo: "/images/tools/openai.svg", accent: "#10b981", desc: "GPT-4o AI-Judge & Synthetic Distillation" },
  { name: "Claude API", category: "LLM & NLP", logo: "/images/tools/claude.svg", accent: "#d97706", desc: "Claude 3.5 Sonnet RAG & Reasoning Evaluation" },

  // RAG & Vector Search
  { name: "Qdrant", category: "RAG & Vectors", logo: "/images/tools/qdrant.svg", accent: "#00f0ff", desc: "1,037,086 Vector Collection Indexing in GRGPT" },
  { name: "LangChain", category: "RAG & Vectors", logo: "/images/tools/langchain.svg", accent: "#14b8a6", desc: "Planner-Writer-Critic Multi-Agent Chains" },
  { name: "FastAPI", category: "RAG & Vectors", logo: "/images/tools/fastapi.svg", accent: "#059669", desc: "Sub-3s Latency Async RAG Endpoint Serving" },

  // MLOps & DevOps
  { name: "Docker", category: "MLOps & DevOps", logo: "/images/tools/docker.svg", accent: "#2563eb", desc: "Multi-Stage Containerized ML Microservices" },
  { name: "MLflow", category: "MLOps & DevOps", logo: "/images/tools/mlflow.svg", accent: "#0284c7", desc: "Model Registry, Artifacts & Metric Tracking" },
  { name: "DVC", category: "MLOps & DevOps", logo: "/images/tools/dvc.svg", accent: "#a855f7", desc: "Data & Feature Pipeline Version Control" },
  { name: "W&B", category: "MLOps & DevOps", logo: "/images/tools/wandb.svg", accent: "#eab308", desc: "Fine-Tuning Loss Telemetry & Drift Dashboards" },
  { name: "GitHub Actions", category: "MLOps & DevOps", logo: "/images/tools/github.svg", accent: "#e4e4e7", desc: "Automated CI/CD Linting, Test Runs & Registry Push" },
  { name: "Nginx", category: "MLOps & DevOps", logo: "/images/tools/nginx.svg", accent: "#16a34a", desc: "Reverse Proxy, SSL Termination & Canary Traffic Routing" },

  // Model Optimization
  { name: "vLLM", category: "Optimization", logo: "/images/tools/vllm.svg", accent: "#00f0ff", desc: "PagedAttention High-Throughput Serving Engine" },
  { name: "ONNX Runtime", category: "Optimization", logo: "/images/tools/onnx.svg", accent: "#3b82f6", desc: "1.8× INT8 Quantization Speedup to 42ms p50" },

  // Cloud & Infrastructure
  { name: "AWS", category: "Cloud & Infra", logo: "/images/tools/aws.svg", accent: "#f59e0b", desc: "EC2 GPU Instances, S3 Vectors & Lambda Tasks" },
  { name: "GCP Vertex AI", category: "Cloud & Infra", logo: "/images/tools/gcp.svg", accent: "#4285f4", desc: "Managed Notebooks & Cloud Endpoint Serving" },
  { name: "Supabase", category: "Cloud & Infra", logo: "/images/tools/supabase.svg", accent: "#3ecf8e", desc: "Postgres pgvector & Auth Microservices" },

  // Data Engineering
  { name: "Pandas", category: "Data Engineering", logo: "/images/tools/pandas.svg", accent: "#ec4899", desc: "Dataframe Wrangling & Feature Engineering" },
  { name: "NumPy", category: "Data Engineering", logo: "/images/tools/numpy.svg", accent: "#38bdf8", desc: "Vectorized Matrix Maths & Cosine Similarity" },
  { name: "Apache Spark", category: "Data Engineering", logo: "/images/tools/spark.svg", accent: "#ea580c", desc: "Distributed Chunking Across 100K+ PDF Corpora" },
  { name: "DuckDB", category: "Data Engineering", logo: "/images/tools/duckdb.svg", accent: "#eab308", desc: "Zero-Copy Fast Analytical SQL Engine" },

  // Frontend / System
  { name: "TypeScript", category: "Languages", logo: "/images/tools/typescript.svg", accent: "#3b82f6", desc: "Strict Typed Contracts & Production Client API" },
  { name: "React", category: "Languages", logo: "/images/tools/react.svg", accent: "#00f0ff", desc: "Interactive Canvas, GSAP & Real-Time SSE Streams" }
];

const CATEGORIES = [
  "All",
  "RAG & Vectors",
  "LLM & NLP",
  "MLOps & DevOps",
  "Optimization",
  "Cloud & Infra",
  "Data Engineering"
];

export function TumbleWall({
  items = DEFAULT_TOOLKIT_ITEMS,
  className = "",
  initialShape = "circle",
  itemSize = 96,
  gravity = 1.35,
  bounce = 0.35,
  friction = 0.22,
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const itemsRef = useRef([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [shape, setShape] = useState(initialShape);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Physics state refs
  const engineRef = useRef(null);
  const wallsRef = useRef([]);
  const piecesRef = useRef([]);
  const dragRef = useRef(null);
  const animFrameRef = useRef(null);
  const isLoopRunningRef = useRef(false);
  const isVisibleRef = useRef(false);
  const hasRainedRef = useRef(false);

  // Dimensions of item based on shape with responsive sizing for mobile/tablet
  const getItemDims = useCallback(
    (index) => {
      const stageW = stageRef.current?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1200);
      const isMobile = stageW < 640;
      const isTablet = stageW < 900;
      const baseSize = isMobile ? 56 : isTablet ? 70 : itemSize;

      if (shape === "circle") {
        const variance = (index % 5) * (isMobile ? 2 : 4) - (isMobile ? 4 : 8);
        const d = baseSize + variance;
        return { w: d, h: d, radius: d / 2 };
      } else {
        const w = isMobile ? 108 + (index % 3) * 6 : 146 + (index % 4) * 8;
        const h = isMobile ? 36 : 44;
        return { w, h, radius: h / 2 };
      }
    },
    [shape, itemSize]
  );

  // Loop Controller: Starts only when active/moving, sleeps when settled
  const startLoop = useCallback(() => {
    if (isLoopRunningRef.current || !isVisibleRef.current) return;
    const engine = engineRef.current;
    if (!engine) return;

    isLoopRunningRef.current = true;

    const tick = () => {
      if (!isLoopRunningRef.current) return;

      Matter.Engine.update(engine, 1000 / 60);

      const pieces = piecesRef.current;
      let anyAwake = false;

      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        const b = p.body;
        if (!b || !p.node) continue;

        if (!b.isSleeping) {
          anyAwake = true;
          const x = b.position.x - p.w / 2;
          const y = b.position.y - p.h / 2;
          const deg = (b.angle * 180) / Math.PI;

          p.node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) rotate(${deg.toFixed(1)}deg)`;
        }
      }

      // Sleep loop when pieces have entered the stage and come to a rest
      const allInside = pieces.every((p) => p.body && p.body.position.y > 10);
      const allResting = pieces.every((p) => p.body && (p.body.isSleeping || p.body.speed < 0.25));

      if (allInside && allResting && !dragRef.current) {
        isLoopRunningRef.current = false;
        animFrameRef.current = null;
        return;
      }

      if (isVisibleRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        isLoopRunningRef.current = false;
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLoop = useCallback(() => {
    isLoopRunningRef.current = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Wake all bodies and start loop
  const wakeAll = useCallback(() => {
    piecesRef.current.forEach((p) => {
      if (p.body) Matter.Sleeping.set(p.body, false);
    });
    startLoop();
  }, [startLoop]);

  // Initialize Matter Engine & Boundaries
  const setupPhysics = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const width = stage.clientWidth || 1360;
    const height = stage.clientHeight || 600;

    // Clean old engine
    if (engineRef.current) {
      stopLoop();
      Matter.Engine.clear(engineRef.current);
    }

    const engine = Matter.Engine.create({
      enableSleeping: true,
      positionIterations: 6,
      velocityIterations: 6,
      constraintIterations: 2,
    });
    engine.gravity.y = gravity;
    engine.gravity.x = 0;
    engineRef.current = engine;

    // Boundaries (Floor, Left, Right, High Ceiling)
    const wallOpts = { isStatic: true, friction: 0.3, restitution: bounce };
    const thickness = 100;

    const floor = Matter.Bodies.rectangle(
      width / 2,
      height + thickness / 2,
      width * 2,
      thickness,
      wallOpts
    );
    const leftWall = Matter.Bodies.rectangle(
      -thickness / 2,
      height / 2,
      thickness,
      height * 4,
      wallOpts
    );
    const rightWall = Matter.Bodies.rectangle(
      width + thickness / 2,
      height / 2,
      thickness,
      height * 4,
      wallOpts
    );
    // Ceiling positioned far above so rain waterfall is never blocked
    const ceiling = Matter.Bodies.rectangle(
      width / 2,
      -2500,
      width * 2,
      thickness,
      wallOpts
    );

    wallsRef.current = [floor, leftWall, rightWall, ceiling];
    Matter.Composite.add(engine.world, wallsRef.current);

    // Natural responsive column layout across entire width
    const cols = width < 480 ? 4 : width < 768 ? 5 : width > 1150 ? 8 : 7;
    const horizontalMargin = width < 640 ? 40 : 140;
    const colWidth = (width - horizontalMargin) / cols;
    const leftPad = horizontalMargin / 2;
    const pieces = [];
    const elements = itemsRef.current;

    items.forEach((item, index) => {
      const node = elements[index];
      if (!node) return;

      const { w, h, radius } = getItemDims(index);

      const col = index % cols;
      const row = Math.floor(index / cols);

      const spawnX = leftPad + col * colWidth + colWidth / 2 + (Math.random() - 0.5) * (colWidth * 0.35);
      const rowGap = width < 640 ? 58 : 78;
      const spawnY = -radius - 20 - row * rowGap - Math.random() * 20;

      let body;
      const bodyOpts = {
        restitution: bounce,
        friction,
        frictionAir: 0.014,
        density: 0.0016,
        sleepThreshold: 120,
        angle: (Math.random() - 0.5) * 0.4,
      };

      if (shape === "circle") {
        body = Matter.Bodies.circle(spawnX, spawnY, radius, bodyOpts);
      } else {
        body = Matter.Bodies.rectangle(spawnX, spawnY, w, h, {
          ...bodyOpts,
          chamfer: { radius: h / 2 - 1 },
        });
      }

      // Initial entry momentum
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 1.5,
        y: 4 + Math.random() * 3,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);

      Matter.Composite.add(engine.world, body);

      pieces.push({
        id: index,
        item,
        body,
        node,
        w,
        h,
        radius,
      });

      node.style.width = `${w}px`;
      node.style.height = `${h}px`;
    });

    piecesRef.current = pieces;
    if (isVisibleRef.current) {
      startLoop();
    }
  }, [items, shape, gravity, bounce, friction, getItemDims, startLoop, stopLoop]);

  // Re-run physics setup on mount and shape changes
  useEffect(() => {
    setupPhysics();
    return () => {
      stopLoop();
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, [setupPhysics, stopLoop]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setupPhysics();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setupPhysics]);

  // Viewport IntersectionObserver: pauses engine when off-screen for 0% CPU overhead
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (!hasRainedRef.current) {
              hasRainedRef.current = true;
              wakeAll();
            } else {
              startLoop();
            }
          } else {
            stopLoop();
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, [wakeAll, startLoop, stopLoop]);

  // Pointer Down (Drag Start)
  const handlePointerDown = (e, piece) => {
    // Do not intercept if multi-touch gesture or right click
    if (e.button !== 0 && e.pointerType === "mouse") return;

    const stage = stageRef.current;
    const engine = engineRef.current;
    if (!stage || !engine || !piece.body) return;

    stage.setPointerCapture?.(e.pointerId);

    const rect = stage.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    Matter.Sleeping.set(piece.body, false);

    const constraint = Matter.Constraint.create({
      pointA: { x: px, y: py },
      bodyB: piece.body,
      pointB: { x: px - piece.body.position.x, y: py - piece.body.position.y },
      stiffness: 0.28,
      damping: 0.08,
      length: 0,
    });

    Matter.Composite.add(engine.world, constraint);

    piece.node.classList.add("dragging");

    dragRef.current = {
      pointerId: e.pointerId,
      piece,
      constraint,
      startTime: performance.now(),
      history: [{ x: px, y: py, t: performance.now() }],
    };

    startLoop();
  };

  // Pointer Move (Dragging)
  const handlePointerMove = (e) => {
    const drag = dragRef.current;
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (drag) {
      if (drag.constraint) {
        drag.constraint.pointA = { x: px, y: py };
        if (drag.piece.body) Matter.Sleeping.set(drag.piece.body, false);
      }

      const now = performance.now();
      drag.history.push({ x: px, y: py, t: now });
      if (drag.history.length > 5) drag.history.shift();

      startLoop();
    }

    setTooltipPos({ x: px, y: py });
  };

  // Pointer Up (Release & Throw)
  const handlePointerUp = (e) => {
    const drag = dragRef.current;
    const engine = engineRef.current;
    const stage = stageRef.current;
    if (!drag || !engine) return;

    if (stage?.hasPointerCapture?.(e.pointerId)) {
      stage.releasePointerCapture(e.pointerId);
    }

    if (drag.constraint) {
      Matter.Composite.remove(engine.world, drag.constraint);
    }

    drag.piece.node.classList.remove("dragging");

    const b = drag.piece.body;
    if (b) {
      Matter.Sleeping.set(b, false);
      const h = drag.history;
      if (h.length >= 2) {
        const last = h[h.length - 1];
        const first = h[0];
        const dt = (last.t - first.t) / 1000;
        if (dt > 0.005) {
          const vx = (last.x - first.x) / dt;
          const vy = (last.y - first.y) / dt;
          const speed = Math.hypot(vx, vy);

          if (speed < 40 && performance.now() - drag.startTime < 250) {
            Matter.Body.setVelocity(b, {
              x: (Math.random() - 0.5) * 5,
              y: -8 - Math.random() * 4,
            });
            Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.18);
          } else {
            const maxSpeed = 38;
            const throwX = Math.max(-maxSpeed, Math.min(maxSpeed, vx * 0.045));
            const throwY = Math.max(-maxSpeed, Math.min(maxSpeed, vy * 0.045));
            Matter.Body.setVelocity(b, { x: throwX, y: throwY });
            Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.22);
          }
        }
      }
    }

    dragRef.current = null;
    startLoop();
  };

  // Category Filter Click with Smooth Fluid Transition & Playful Nudge
  const handleFilterClick = (cat) => {
    setActiveCategory(cat);
    piecesRef.current.forEach((p) => {
      if (!p.body) return;
      Matter.Sleeping.set(p.body, false);
      const isMatch = cat === "All" || p.item.category === cat;
      if (isMatch) {
        // Subtle, fluid upward micro-impulse so active tools gently hop into focus
        Matter.Body.applyForce(p.body, p.body.position, {
          x: (Math.random() - 0.5) * 0.005,
          y: -0.016 - Math.random() * 0.008,
        });
        Matter.Body.setAngularVelocity(p.body, (Math.random() - 0.5) * 0.03);
      }
    });
    startLoop();
  };

  // Reset / Rain Action
  const triggerRain = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const width = stage.clientWidth || 1360;
    const cols = width < 480 ? 4 : width < 768 ? 5 : width > 1150 ? 8 : 7;
    const horizontalMargin = width < 640 ? 40 : 140;
    const colWidth = (width - horizontalMargin) / cols;
    const leftPad = horizontalMargin / 2;

    piecesRef.current.forEach((p, idx) => {
      if (!p.body) return;
      const { radius } = getItemDims(idx);
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const spawnX = leftPad + col * colWidth + colWidth / 2 + (Math.random() - 0.5) * (colWidth * 0.35);
      const rowGap = width < 640 ? 58 : 78;
      const spawnY = -radius - 20 - row * rowGap - Math.random() * 20;

      Matter.Body.setPosition(p.body, { x: newX, y: newY });
      Matter.Body.setVelocity(p.body, { x: (Math.random() - 0.5) * 2, y: 4 + Math.random() * 3 });
      Matter.Body.setAngle(p.body, (Math.random() - 0.5) * 0.6);
      Matter.Body.setAngularVelocity(p.body, (Math.random() - 0.5) * 0.08);
      Matter.Sleeping.set(p.body, false);
    });

    startLoop();
  };

  // Zero-G Blast Action
  const triggerZeroG = () => {
    piecesRef.current.forEach((p) => {
      if (!p.body) return;
      Matter.Sleeping.set(p.body, false);
      Matter.Body.setVelocity(p.body, {
        x: (Math.random() - 0.5) * 16,
        y: -14 - Math.random() * 10,
      });
      Matter.Body.setAngularVelocity(p.body, (Math.random() - 0.5) * 0.25);
    });

    startLoop();
  };

  // Arrow Keys Nudge
  const handleKeyDown = (e) => {
    const dirMap = {
      ArrowLeft: { x: -6, y: -2 },
      ArrowRight: { x: 6, y: -2 },
      ArrowUp: { x: 0, y: -8 },
      ArrowDown: { x: 0, y: 6 },
    };
    const imp = dirMap[e.key];
    if (imp) {
      e.preventDefault();
      piecesRef.current.forEach((p) => {
        if (!p.body) return;
        Matter.Sleeping.set(p.body, false);
        const v = p.body.velocity;
        Matter.Body.setVelocity(p.body, {
          x: v.x + imp.x * (0.6 + Math.random() * 0.8),
          y: v.y + imp.y * (0.6 + Math.random() * 0.8),
        });
      });
      startLoop();
    }
  };

  return (
    <div className={`tw-section ${className}`} ref={containerRef}>
      {/* Header Bar */}
      <div className="tw-header-bar">
        <span className="yaros-section-tag tw-tag">Complete Engineering Toolkit</span>
        <h2 className="tw-title">Interactive Production Toolkit</h2>
        <p className="tw-subtitle">
          Physics-driven toolkit wall. Grab, throw, or pop 28+ battle-tested tools spanning RAG, LLMOps, Optimization, and Cloud Infrastructure.
        </p>
      </div>

      {/* Controls & Filter Bar */}
      <div className="tw-controls-row">
        {/* Category Filters */}
        <div className="tw-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tw-filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleFilterClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="tw-actions">
          {/* Shape Toggle */}
          <button
            className="tw-action-btn"
            onClick={() => setShape((s) => (s === "circle" ? "chip" : "circle"))}
            title="Toggle Shape (Circle Tokens / Capsule Chips)"
          >
            {shape === "circle" ? <Tag size={13} /> : <Compass size={13} />}
            <span>{shape === "circle" ? "Chips" : "Circles"}</span>
          </button>

          {/* Rain Again */}
          <button className="tw-action-btn" onClick={triggerRain} title="Re-drop tools from sky">
            <RotateCcw size={13} />
            <span>Rain</span>
          </button>

          {/* Zero-G Blast */}
          <button className="tw-action-btn primary" onClick={triggerZeroG} title="Explosive Zero-G blast">
            <Zap size={13} />
            <span>Zero-G</span>
          </button>
        </div>
      </div>

      {/* Physics Stage Container (Seamless Arena) */}
      <div
        ref={stageRef}
        className="tw-stage-container"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Ambient Floor Glow & Boundary Line */}
        <div className="tw-stage-floor-glow" />
        <div className="tw-stage-floor-line" />

        {/* Floating Instruction Hint */}
        <div className="tw-hint-badge">
          <span className="tw-hint-dot" />
          <span className="tw-hint-desktop">Drag to throw • Click to pop • Arrow keys nudge</span>
          <span className="tw-hint-touch">Drag to throw • Tap to pop • Zero-G</span>
        </div>

        {/* Tumbling Items */}
        <div className="tw-items-layer">
          {items.map((item, index) => {
            const isDimmed = activeCategory !== "All" && item.category !== activeCategory;
            const accent = item.accent || "#00f0ff";

            return (
              <div
                key={`${item.name}-${index}`}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`tw-item shape-${shape} ${isDimmed ? "dimmed" : ""}`}
                style={{
                  borderColor: isDimmed ? "rgba(255,255,255,0.06)" : `${accent}55`,
                  background: isDimmed
                    ? "rgba(14, 18, 26, 0.4)"
                    : `radial-gradient(circle at 50% 35%, ${accent}22 0%, #0d1118 75%)`,
                  boxShadow: isDimmed
                    ? "none"
                    : `0 8px 20px -4px rgba(0, 0, 0, 0.8), 0 0 16px ${accent}20, inset 0 1px 1px rgba(255, 255, 255, 0.2)`,
                }}
                onPointerDown={(e) => {
                  const piece = piecesRef.current.find((p) => p.id === index);
                  if (piece) handlePointerDown(e, piece);
                }}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Specular Sheen */}
                <div className="tw-item-sheen" />

                {/* Tool Logo */}
                <img
                  src={item.logo}
                  alt={item.name}
                  className="tw-item-logo"
                  draggable={false}
                  loading="lazy"
                />

                {/* Tool Title */}
                <span className="tw-item-title">{item.name}</span>

                {/* Category for Chip view */}
                {shape === "chip" && (
                  <span className="tw-item-category">{item.category}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Tooltip */}
        {hoveredItem && (
          <div
            className="tw-tooltip visible"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <div className="tw-tooltip-title">{hoveredItem.name}</div>
            <div className="tw-tooltip-meta">
              {hoveredItem.category} • {hoveredItem.desc}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TumbleWall;
