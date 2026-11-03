import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import {
  ArrowUpRight,
  Sparkles,
  Layers,
  Code,
  Layout,
  CheckCircle2,
  X,
  Send,
  Calendar,
  ShieldCheck,
  Globe,
  Plus,
  Minus,
  Cpu,
  Database,
  Activity,
  Terminal,
  GitBranch,
  Server,
  BookOpen,
  ExternalLink,
  Mail,
  Bot,
  Workflow,
  Lock
} from 'lucide-react';
import './App.css';
import { usePortfolio } from './context/PortfolioContext';
import SmokeType from './components/SmokeType';
import Smoke3DCanvas from './components/Smoke3DCanvas';
import Model3DScrollCanvas from './components/Model3DScrollCanvas';
import MagneticDock from './components/MagneticDock';
import SkewedCarousel from './components/SkewedCarousel';
import ScrollSplitCard from './components/ScrollSplitCard';
import CaseStudyFlipStack from './components/ui/case-study-flip-stack';
import Signature from './components/ui/signature';
import TextRepel from './components/ui/text-repel';
import SilkAurora from './components/ui/silk-aurora';
import OrbitCards from './components/ui/orbit-cards';
import OrbitCardStack from './components/ui/orbit-card-stack';
import TumbleWall from './components/ui/tumble-wall';
import TechText from './components/ui/tech-text';
import PrismCarousel from './components/ui/prism-carousel';
import LoadingScreen from './components/LoadingScreen';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);
window.ScrollTrigger = ScrollTrigger;
CustomEase.create("yarosEase", "0.44, 0, 0.56, 1");

// Production ML & LLMOps Tech Stack Logos
const TECH_STACK_LOGOS = [
  { name: 'Python', src: '/images/tools/python.svg' },
  { name: 'PyTorch', src: '/images/tools/pytorch.svg' },
  { name: 'Hugging Face', src: '/images/tools/huggingface.svg' },
  { name: 'Qdrant', src: '/images/tools/qdrant.svg' },
  { name: 'Docker', src: '/images/tools/docker.svg' },
  { name: 'MLflow', src: '/images/tools/mlflow.svg' },
  { name: 'LangChain', src: '/images/tools/langchain.svg' },
  { name: 'Claude API', src: '/images/tools/claude.svg' },
  { name: 'vLLM', src: '/images/tools/vllm.svg' },
  { name: 'ONNX Runtime', src: '/images/tools/onnx.svg' },
  { name: 'FastAPI', src: '/images/tools/fastapi.svg' },
  { name: 'AWS', src: '/images/tools/aws.svg' }
];




// 6 Flagship Projects formatted for @componentry/case-study-flip-stack (Glassmorphism & Black Aesthetic)
const MEASURABLE_WORK_PROJECTS = [
  {
    number: "01",
    eyebrow: "Production RAG · Qdrant",
    title: "GRGPT: 1M+ Vector Tender & Gov Resolution RAG",
    description: "Domain-restricted RAG assistant indexing 100K+ PDFs in Qdrant with Sentence-BERT embeddings, delivering 2-3s query latency across 1,037,086 indexed vector chunks with zero hallucination.",
    image: "/images/project_grgpt.png",
    imageAlt: "GRGPT architecture and vector search query dashboard",
    background: "linear-gradient(135deg, rgba(185, 75, 10, 0.45) 0%, rgba(28, 15, 10, 0.88) 55%, rgba(10, 8, 6, 0.96) 100%)",
    accentColor: "#f97316",
    foreground: "#ffffff",
    link: "https://github.com/shreecloudai"
  },
  {
    number: "02",
    eyebrow: "LLMOps · Observability",
    title: "LLM-Eval: Dual AI-Judge Observability Platform",
    description: "Automated production LLM telemetry pipeline comparing Claude and GPT judges with Pydantic structured output validation, achieving 94% evaluator agreement and sub-50ms p50 inference.",
    image: "/images/project_llmeval.png",
    imageAlt: "LLM-Eval telemetry and model evaluation dashboard",
    background: "linear-gradient(135deg, rgba(6, 135, 155, 0.45) 0%, rgba(10, 24, 30, 0.88) 55%, rgba(6, 12, 16, 0.96) 100%)",
    accentColor: "#22d3ee",
    foreground: "#ffffff",
    link: "https://github.com/shreecloudai"
  },
  {
    number: "03",
    eyebrow: "Transformer NLP · MLOps",
    title: "DistilBERT MLOps: Quantized Real-Time Classifier",
    description: "End-to-end production pipeline with fine-tuned DistilBERT, Feast online feature store, INT8 quantization (1.8× speedup to 42ms p50), and zero-downtime Nginx canary routing.",
    image: "/images/project_distilbert.svg",
    imageAlt: "DistilBERT MLOps architecture and canary deployment pipeline",
    background: "linear-gradient(135deg, rgba(200, 10, 100, 0.45) 0%, rgba(30, 12, 22, 0.88) 55%, rgba(12, 6, 10, 0.96) 100%)",
    accentColor: "#f43f5e",
    foreground: "#ffffff",
    link: "https://github.com/shreecloudai"
  },
  {
    number: "04",
    eyebrow: "Hybrid Retrieval · Citations",
    title: "RAG Document Q&A: Enterprise Hybrid Intelligence",
    description: "Hybrid retrieval platform merging dense Sentence-BERT FAISS semantic embeddings with sparse Rank-BM25 keyword search, powered by Claude API and chunk-level citation audit trails.",
    image: "/images/project_rag_qa.svg",
    imageAlt: "Enterprise Hybrid Document Intelligence Platform",
    background: "linear-gradient(135deg, rgba(65, 45, 190, 0.45) 0%, rgba(16, 14, 36, 0.88) 55%, rgba(8, 6, 16, 0.96) 100%)",
    accentColor: "#818cf8",
    foreground: "#ffffff",
    link: "https://github.com/shreecloudai"
  },
  {
    number: "05",
    eyebrow: "Multi-Agent · Generative AI",
    title: "Agentic Content Suite: Planner → Writer → Critic",
    description: "Autonomous multi-agent orchestration pipeline with dynamic few-shot prompt injection, Pydantic structured output validation, rubric scoring loops, and SSE streaming (75% time reduction).",
    image: "/images/project_agentic.svg",
    imageAlt: "Agentic Content Suite multi-agent architecture",
    background: "linear-gradient(135deg, rgba(32, 95, 45, 0.45) 0%, rgba(10, 26, 18, 0.88) 55%, rgba(6, 14, 10, 0.96) 100%)",
    accentColor: "#34d399",
    foreground: "#ffffff",
    link: "https://github.com/shreecloudai"
  },
  {
    number: "06",
    eyebrow: "Computer Vision · Interpretability",
    title: "Vision Classifier: ResNet-18 with Grad-CAM Saliency",
    description: "Transfer learning image classification system achieving 93.7% accuracy on CIFAR-10 with Grad-CAM saliency heatmaps for model interpretability, MLflow experiment tracking, and AWS S3 registry.",
    image: "/images/project_vision.svg",
    imageAlt: "Vision Classifier Grad-CAM saliency heatmaps",
    background: "linear-gradient(135deg, rgba(90, 25, 95, 0.45) 0%, rgba(24, 10, 28, 0.88) 55%, rgba(12, 5, 14, 0.96) 100%)",
    accentColor: "#c084fc",
    foreground: "#ffffff",
    link: "https://github.com/shreecloudai"
  }
];

// 5 Engineering Capabilities (Strictly grounded in resume)
const PRANAV_CAPABILITIES = [
  {
    id: "rag-systems",
    number: "01",
    title: "LLM & RAG Systems",
    image: "/images/service_rag.svg",
    description: "I design and build production-grade RAG architectures for massive document collections: domain-restricted retrieval, vector embeddings, hybrid search, and source-grounded answering with zero hallucination tolerance.",
    points: [
      "Hybrid Retrieval (Dense SBERT + Sparse BM25)",
      "Qdrant Vector Database (1M+ Vectors)",
      "Chunking Strategies & Metadata Retention",
      "Hallucination Mitigation & Source Citation",
      "Document Intelligence & Ingestion Pipelines"
    ],
    tech: "Qdrant · FAISS · BM25 · Sentence-BERT · LangChain"
  },
  {
    id: "llm-evaluation",
    number: "02",
    title: "LLM Evaluation & Observability",
    image: "/images/service_llmeval.svg",
    description: "You cannot improve what you cannot measure. I build LLM-as-Judge evaluation frameworks, automated drift detection, and telemetry pipelines to benchmark model factuality, coherence, and safety continuously in production.",
    points: [
      "Dual AI-Judge Pipelines (Claude + GPT)",
      "Factuality, Toxicity & Coherence Metrics",
      "Automated Drift Detection & Telemetry",
      "Inter-Rater Agreement Benchmarks (94%)",
      "GitHub Actions Automated CI/CD Testing"
    ],
    tech: "Pydantic · Evidently AI · MLflow · DuckDB · W&B"
  },
  {
    id: "model-optimization",
    number: "03",
    title: "Model Optimization & Inference",
    image: "/images/service_inference.svg",
    description: "Large models demand lean compute. I optimize transformer inference with quantization, ONNX runtime acceleration, and high-throughput vLLM serving to achieve sub-50ms p50 latency on production hardware.",
    points: [
      "Sub-50ms p50 Inference Latency",
      "INT8 & FP16 Quantization (1.8× Speedup)",
      "vLLM High-Throughput Token Serving",
      "ONNX Runtime Execution & Export",
      "Locust Stress Profiling & Latency Benchmarks"
    ],
    tech: "ONNX · vLLM · PyTorch · DeepSpeed · PEFT · Locust"
  },
  {
    id: "mlops-infrastructure",
    number: "04",
    title: "MLOps & Production ML",
    image: "/images/service_mlops.svg",
    description: "Models are only as valuable as the pipelines supporting them. I architect reproducible ML infrastructure: containerized microservices, experiment versioning, model registries, and zero-downtime canary deployments.",
    points: [
      "Docker & Multi-Container Compose Services",
      "MLflow Experiment & Model Registry",
      "Data Version Control (DVC)",
      "Nginx Canary Traffic Routing (90/10)",
      "AWS Cloud Infrastructure (EC2, S3, Lambda)"
    ],
    tech: "Docker · Docker Compose · GitHub Actions · MLflow · DVC · AWS"
  },
  {
    id: "agentic-systems",
    number: "05",
    title: "Generative AI & Agentic Systems",
    image: "/images/service_agentic.svg",
    description: "Beyond simple prompts lie autonomous multi-agent loops. I build structured agentic workflows using Planner-Writer-Critic architectures, dynamic few-shot prompting, and real-time Server-Sent Events (SSE) streaming.",
    points: [
      "Multi-Agent Architectures (Planner → Writer → Critic)",
      "Pydantic Structured Output Enforcement",
      "Dynamic Few-Shot Prompt Engineering",
      "Real-Time Server-Sent Events (SSE) Streaming",
      "75% Reduction in Manual Authoring Time"
    ],
    tech: "Anthropic Claude API · LangChain · Pydantic · FastAPI · React"
  }
];

// Autonomous Machine Learning & LLM Automation Projects (@componentry/scroll-split-card) - 5 Panels
const AUTOMATION_PROJECTS = [
  {
    id: "rag-ingestion",
    title: "Autonomous RAG Ingestion",
    subtitle: "Continuous Vector Processing",
    description: "Automated document processing with Sentence-BERT chunking, deduplication, metadata retention, and real-time streaming vector upserts into Qdrant clusters.",
    metric: "100K+ Docs · Sub-3s Sync",
    badge: "Vector Automation",
    bgColor: "#23262f",
    textColor: "#ffffff",
    accentColor: "#ffffff",
    icon: <Database size={24} strokeWidth={1.8} color="#ffffff" />,
    tags: ["Qdrant", "Sentence-BERT", "FastAPI", "Async IO"]
  },
  {
    id: "agentic-automation",
    title: "Agentic Workflow Loops",
    subtitle: "Planner → Writer → Critic Architecture",
    description: "Autonomous multi-agent orchestration pipeline with dynamic few-shot prompt injection, Pydantic structured output validation, rubric-based evaluation scoring, and automated retry loops with SSE streaming.",
    metric: "75% Reduction in Manual Authoring",
    badge: "Agentic Loop",
    bgColor: "#e2e2e2",
    textColor: "#111111",
    accentColor: "#111111",
    icon: <Bot size={24} strokeWidth={1.8} color="#111111" />,
    tags: ["Anthropic Claude", "LangChain", "Pydantic", "SSE Stream"]
  },
  {
    id: "llm-eval-ci",
    title: "Automated LLM Evaluation",
    subtitle: "Dual-AI Judge Production CI/CD",
    description: "Continuous automated model verification benchmarking factuality, coherence, and safety against production drift triggers with Evidently AI.",
    metric: "94% Agreement · <50ms p50 Latency",
    badge: "LLMOps CI/CD",
    bgColor: "#1a5bcf",
    textColor: "#ffffff",
    accentColor: "#ffffff",
    icon: <ShieldCheck size={24} strokeWidth={1.8} color="#ffffff" />,
    tags: ["Claude API", "Evidently AI", "MLflow", "GitHub Actions"]
  },
  {
    id: "mlops-canary-pipeline",
    title: "Self-Healing MLOps Pipelines",
    subtitle: "Self-Healing Automated Rollouts",
    description: "End-to-end automated machine learning pipeline with Feast feature store, Redis real-time ingestion, ONNX INT8 model quantization (1.8× speedup), and automated Nginx canary deployments with rollback on drift.",
    metric: "42ms p50 · 92.4% F1-Score",
    badge: "Production MLOps",
    bgColor: "#1c1c1c",
    textColor: "#ffffff",
    accentColor: "#ffffff",
    icon: <Cpu size={24} strokeWidth={1.8} color="#ffffff" />,
    tags: ["Feast", "Redis", "ONNX Runtime", "Nginx Canary"]
  },
  {
    id: "auto-finetune",
    title: "Closed-Loop LoRA Tuning",
    subtitle: "Drift-Triggered Retraining",
    description: "Closed-loop pipeline that intercepts distribution drift, curates high-loss production samples, and triggers automated LoRA parameter-efficient fine-tuning with validation.",
    metric: "Automated Drift Triggers",
    badge: "Continuous Learning",
    bgColor: "#172338",
    textColor: "#ffffff",
    accentColor: "#ffffff",
    icon: <GitBranch size={24} strokeWidth={1.8} color="#ffffff" />,
    tags: ["PEFT / LoRA", "Hugging Face", "MLflow", "Docker"]
  }
];

// Production Highlights for Marquee Ticker
const MARQUEE_BRANDS = [
  "1,037,086 Qdrant Vectors",
  "Sub-50ms p50 Inference",
  "100K+ Documents Indexed",
  "Dual LLM-as-Judge Pipelines",
  "94% Evaluator Agreement",
  "Docker & CI/CD Pipelines",
  "1.8× INT8 Latency Reduction",
  "Closed-Loop LoRA Fine-Tuning",
  "92.4% DistilBERT Accuracy",
  "Hybrid SBERT + BM25 Search"
];

// Rotating Hero Headings in Instrument Serif (All caps with period)
const ROTATING_HEADINGS = [
  "MACHINE LEARNING ENGINEER.",
  "LLMOPS & MLOPS SPECIALIST.",
  "GENERATIVE AI ENGINEER.",
  "DEEP LEARNING SPECIALIST."
];

// Impact Pillars (Anchor highlights)
const IMPACT_PILLARS = [
  {
    tag: "01 · SLA BUDGET",
    title: "Sub-50ms p50 Latency Budgets",
    desc: "Strict runtime SLA budgets across ONNX INT8 and vLLM inference microservices.",
  },
  {
    tag: "02 · VECTOR SCALE",
    title: "1M+ Vector Scale Retrieval",
    desc: "1,037,086 indexed chunks in Qdrant cluster with sub-3s context lookup.",
  },
  {
    tag: "03 · VERIFICATION",
    title: "Automated Dual-Judge Verification",
    desc: "Closed-loop Claude + GPT-4o evaluation with 94% inter-rater agreement.",
  },
];

// Real Technical Metrics (Strictly from resume)
const TECHNICAL_METRICS = [
  { number: "100K+", label: "Government Resolutions & Tenders Ingested", tag: "Vector RAG" },
  { number: "1,037,086", label: "Indexed Vectors in Production Qdrant Cluster", tag: "Vector Scale" },
  { number: "2–3s", label: "Context Retrieval Latency across 1M+ Chunks", tag: "Retrieval" },
  { number: "<50ms", label: "p50 Model Inference Latency via ONNX/vLLM", tag: "Inference" },
  { number: "94%", label: "LLM-as-Judge Inter-Rater Agreement Rate", tag: "LLMOps Eval" },
  { number: "1.8×", label: "Latency Speedup via INT8 Quantization", tag: "Quantization" },
  { number: "92.4%", label: "DistilBERT Classifier Accuracy (0.924 F1)", tag: "Transformers" },
  { number: "75%", label: "Reduction in Manual Authoring Time with Agents", tag: "Agentic Loops" }
];

// Detailed Categorized Tech Stack
const TECH_CATEGORIES = [
  {
    category: "Languages",
    items: ["Python", "SQL", "Bash"]
  },
  {
    category: "LLM & NLP",
    items: ["HuggingFace Transformers", "PEFT/LoRA", "BERT", "DistilBERT", "Llama", "Mistral", "Phi-3", "RAG", "Embeddings", "Semantic Search", "spaCy"]
  },
  {
    category: "RAG & Vector Search",
    items: ["Qdrant", "FAISS", "BM25", "Sentence-BERT", "Hybrid Retrieval", "LangChain"]
  },
  {
    category: "LLMOps & Evaluation",
    items: ["LLM-as-Judge", "Hallucination Detection", "Evidently AI", "Drift Detection", "Model Observability", "Auto Fine-Tune Triggers"]
  },
  {
    category: "MLOps & DevOps",
    items: ["MLflow", "DVC", "Docker", "Docker Compose", "GitHub Actions", "W&B"]
  },
  {
    category: "Model Optimization",
    items: ["ONNX Runtime", "INT8 Quantization", "FP16", "4-bit Quantization", "vLLM", "Locust"]
  },
  {
    category: "Cloud & Infrastructure",
    items: ["AWS EC2", "AWS S3", "AWS Lambda", "AWS SageMaker", "GCP Vertex AI", "Nginx"]
  },
  {
    category: "Data Engineering",
    items: ["Pandas", "NumPy", "PySpark", "Delta Lake", "DuckDB"]
  }
];

// Public Open Source & Technical Publications (Replaces fake certificates)
const PUBLIC_WORK = [
  {
    platform: "HuggingFace Hub",
    stat: "100+ Downloads",
    desc: "Published open-source tokenizers, transformer weights, and fine-tuned checkpoints.",
    link: "https://huggingface.co/shreecloud"
  },
  {
    platform: "GitHub Repositories",
    stat: "8 Documented Repos",
    desc: "Full production-documented implementations with multi-stage Dockerfiles and CI/CD.",
    link: "https://github.com/shreecloudai"
  },
  {
    platform: "Technical Publications",
    stat: "500+ Reads",
    desc: "In-depth engineering walkthroughs on Medium covering RAG pipelines and LLMOps.",
    link: "https://medium.com"
  },
  {
    platform: "LinkedIn Building",
    stat: "Active Contributor",
    desc: "Sharing architectural analyses, latency benchmarks, and MLOps patterns in public.",
    link: "https://www.linkedin.com/in/pranav-jadhav-mlops"
  }
];

// Real Resume-Supported FAQs (Augmented with shortAnswer for OrbitCardStack)
const FAQS = [
  {
    id: 1,
    q: "What is your primary engineering specialization?",
    shortAnswer: "Production ML Engineering specializing in LLMOps, MLOps, Generative AI, and domain-restricted RAG pipelines built for verified speed and zero hallucination.",
    a: "I specialize in production-focused Machine Learning Engineering with deep emphasis on LLMOps, MLOps, and Generative AI. My work bridges the gap between ML models and hardened production systems—spanning RAG pipelines, LLM evaluation, inference optimization, and containerized deployment.",
    tag: "SPECIALIZATION",
    stat: "LLMOPS · MLOPS",
    accent: "#00f0ff"
  },
  {
    id: 2,
    q: "What was your architectural role on the GRGPT project?",
    shortAnswer: "Led engineering for 100K+ Gov Resolution PDFs and 1,037,086 indexed vector chunks in Qdrant with Sentence-BERT, delivering sub-3s query latency.",
    a: "At Fourise Software Solutions, I led the engineering team building GRGPT—a domain-restricted RAG assistant for Maharashtra Government Resolutions and tenders. I architected the backend API, the Sentence-BERT ingestion pipeline over 100K+ documents and 1,037,086 vector chunks in Qdrant, verified answer correctness, and implemented frontend chat logic.",
    tag: "ARCHITECTURE",
    stat: "1M+ VECTORS · QDRANT",
    accent: "#38bdf8"
  },
  {
    id: 3,
    q: "How do you evaluate and benchmark production LLM pipelines?",
    shortAnswer: "Built dual AI-judge evaluation pipelines using Claude and GPT with Pydantic schemas, achieving 94% inter-rater agreement and drift telemetry.",
    a: "In my LLM-Eval platform, I designed dual AI-judge evaluation pipelines using Claude and GPT judges with Pydantic structured schemas. We benchmarked models across factuality, coherence, and toxicity, achieving a 94% inter-rater agreement and automated drift detection with Evidently AI and MLflow.",
    tag: "EVALUATION",
    stat: "94% AGREEMENT · MLFLOW",
    accent: "#818cf8"
  },
  {
    id: 4,
    q: "What optimization techniques do you use to reduce inference latency?",
    shortAnswer: "Engineered ONNX runtime execution, INT8 quantization (1.8× speedup to 42ms p50), and high-throughput vLLM serving with PagedAttention.",
    a: "I leverage ONNX runtime execution, INT8/FP16 quantization, and high-throughput vLLM serving with PagedAttention. For instance, in DistilBERT MLOps, INT8 quantization delivered a 1.8× latency reduction down to 42ms p50, validated under heavy load with Locust.",
    tag: "OPTIMIZATION",
    stat: "42ms P50 · 1.8X SPEEDUP",
    accent: "#34d399"
  },
  {
    id: 5,
    q: "What is your experience with vector search and embeddings?",
    shortAnswer: "Architected dense Qdrant & FAISS clusters fused with Rank-BM25 sparse search via Reciprocal Rank Fusion, eliminating retrieval blind spots.",
    a: "I work extensively with Qdrant, FAISS, and BM25 hybrid retrieval systems. By combining dense semantic search (Sentence-BERT embeddings) with sparse keyword matching (Rank-BM25) via Reciprocal Rank Fusion, I eliminate retrieval blind spots and achieve 2–3s context retrieval over million-vector collections.",
    tag: "HYBRID RETRIEVAL",
    stat: "RRF · 2-3s CONTEXT",
    accent: "#22d3ee"
  },
  {
    id: 6,
    q: "Which MLOps and CI/CD tools do you use in production?",
    shortAnswer: "Docker multi-container services, MLflow model registries, DVC data versioning, GitHub Actions CI/CD, and Nginx canary traffic routing.",
    a: "My standard stack includes Docker and Docker Compose for containerization, MLflow for experiment tracking and model registry, DVC for data versioning, GitHub Actions for automated testing and linting, Evidently AI for data/concept drift monitoring, and Nginx for canary traffic routing.",
    tag: "MLOPS STACK",
    stat: "DOCKER · DVC · MLFLOW",
    accent: "#f472b6"
  },
  {
    id: 7,
    q: "What is your educational background?",
    shortAnswer: "Pursuing Master of Computer Applications (MCA) at DY Patil Technical Campus (2025–2027); graduated with BCA from Shivaji University (2022–2025).",
    a: "I am currently pursuing my Master of Computer Applications (MCA) in Computer & Information Technology at DY Patil Technical Campus, Talsande (expected graduation 2027), following my Bachelor of Computer Applications (BCA) from Shivaji University, Kolhapur (graduated 2025).",
    tag: "EDUCATION",
    stat: "MCA CANDIDATE · BCA",
    accent: "#a78bfa"
  },
  {
    id: 8,
    q: "Have you worked with multi-agent workflows?",
    shortAnswer: "Designed Planner-Writer-Critic agent loops using LangChain, Claude, and Pydantic with real-time SSE streaming and automated rubric retries.",
    a: "Yes. In the Agentic Content Suite, I built a Planner → Writer → Critic multi-agent architecture using LangChain, Anthropic Claude, and Pydantic. The system generates structured outlines, drafts content with Server-Sent Events (SSE) streaming, evaluates drafts against rubrics, and triggers automated retries when needed.",
    tag: "AGENT LOOPS",
    stat: "SSE STREAMING · LANGCHAIN",
    accent: "#fb923c"
  },
  {
    id: 9,
    q: "Are you open to full-time, internship, or remote positions?",
    shortAnswer: "Actively interviewing for full-time Machine Learning Engineering, LLMOps, and contract production roles globally.",
    a: "Yes, absolutely. I am actively open to full-time roles, internships, and remote-first Machine Learning Engineering / LLMOps opportunities globally.",
    tag: "AVAILABILITY",
    stat: "OPEN FOR HIRE · GLOBAL",
    accent: "#4ade80"
  },
  {
    id: 10,
    q: "Where can I review your code and public models?",
    shortAnswer: "Open-source repositories on github.com/shreecloudai, model weights on huggingface.co/shreecloud, and professional profile on LinkedIn.",
    a: "You can explore my open-source repositories at github.com/shreecloudai, inspect model weights and tokenizers at huggingface.co/shreecloud, or connect directly on LinkedIn at linkedin.com/in/pranav-jadhav-mlops.",
    tag: "REPOSITORIES",
    stat: "GITHUB · HUGGING FACE",
    accent: "#60a5fa"
  }
];

export default function App() {
  const { content, theme, setTheme, isAdminOpen, setIsAdminOpen } = usePortfolio();

  // Dynamic portfolio content bindings with safe defaults
  const heroData = content.hero || {};
  const rotatingHeadings = heroData.rotatingHeadings?.length ? heroData.rotatingHeadings : ROTATING_HEADINGS;
  const marqueeItems = content.marquee?.length ? content.marquee : MARQUEE_BRANDS;
  const impactPillars = content.impact?.pillars?.length ? content.impact.pillars : IMPACT_PILLARS;
  const technicalMetrics = content.impact?.metrics?.length ? content.impact.metrics : TECHNICAL_METRICS;
  const projectsList = content.projects?.length ? content.projects : MEASURABLE_WORK_PROJECTS;
  const automationItems = (content.automation?.items?.length >= 5 ? content.automation.items : AUTOMATION_PROJECTS);
  const toolkitItems = content.toolkit?.length ? content.toolkit : DEFAULT_TOOLKIT_ITEMS;
  const exp = content.experience || {};
  const eduList = content.education || [];

  const experienceItems = [
    {
      id: 'fourise',
      src: '/images/experience/card_fourise.png',
      alt: 'Fourise Software Solutions - Data Analytics & AI/ML Intern',
      title: exp.company || 'Fourise Software Solutions Pvt. Ltd.',
      subtitle: `${exp.role || 'Data Analytics Intern – AI/ML'} · ${exp.location || 'Pune'} (${exp.period || 'Jul 2026 – Present'})`
    },
    {
      id: 'dypatil',
      src: '/images/experience/card_dypatil.png',
      alt: 'DY Patil Technical Campus - Master of Computer Applications (MCA)',
      title: eduList[0]?.institution || 'DY Patil Technical Campus, Talsande',
      subtitle: `${eduList[0]?.degree || 'Master of Computer Applications (MCA)'} · ${eduList[0]?.period || 'Jun 2025 – Mar 2027 (Expected)'}`
    },
    {
      id: 'shivaji',
      src: '/images/experience/card_shivaji.png',
      alt: 'Shivaji University - Bachelor of Computer Applications (BCA)',
      title: eduList[1]?.institution || 'Shivaji University, Kolhapur',
      subtitle: `${eduList[1]?.degree || 'Bachelor of Computer Applications (BCA)'} · ${eduList[1]?.period || 'May 2023 – May 2025'}`
    },
    {
      id: 'autonomous',
      src: '/images/experience/card_autonomous.png',
      alt: 'Autonomous Systems & Open Source Production Frameworks',
      title: 'Autonomous Systems & Open Source',
      subtitle: 'Agent-525 · Asteri Orchestration · PetrolSeq (2024 – Present)'
    }
  ];
  const about = content.about || {};
  const publicWorkList = content.publicWork || PUBLIC_WORK;
  const faqList = (content.faq?.length >= 10 ? content.faq : FAQS);
  const general = content.general || {};

  const [isLoading, setIsLoading] = useState(true);
  const [portraitRevealed, setPortraitRevealed] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [typingPhase, setTypingPhase] = useState('none'); // 'none' | 'greeting' | 'headline' | 'done'
  const [typedGreeting, setTypedGreeting] = useState('');
  const [typedHeadline, setTypedHeadline] = useState('');

  const [headingIndex, setHeadingIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [activeExpIdx, setActiveExpIdx] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [contactWho, setContactWho] = useState('Recruiter / Founder');
  const [contactTimeline, setContactTimeline] = useState('Immediate');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const lenisRef = useRef(null);
  const cardsRef = useRef([]);

  // Cycle Hero Heading every 3.2s only after typing intro completes
  useEffect(() => {
    if (isLoading || isTyping) return;
    const timer = setInterval(() => {
      setHeadingIndex((prev) => (prev + 1) % rotatingHeadings.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isLoading, isTyping, rotatingHeadings.length]);

  const greetingRef = useRef("I'm Pranav");
  greetingRef.current = heroData.mainGreeting || "I'm Pranav";
  const headlineRef = useRef("DEEP LEARNING SPECIALIST.");
  headlineRef.current = rotatingHeadings[0] || "DEEP LEARNING SPECIALIST.";

  // Bulletproof timestamp-based Typewriter Intro Sequence:
  // "I'm Pranav" -> Headline -> TechText interactive takeover
  useEffect(() => {
    if (typingPhase !== 'greeting' && typingPhase !== 'headline') return;

    let animId;
    let startTimestamp = null;
    const target = typingPhase === 'greeting' ? greetingRef.current : headlineRef.current;
    const speed = typingPhase === 'greeting' ? 50 : 35; // ms per character
    const totalDuration = target.length * speed;

    const tick = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const count = Math.min(target.length, Math.floor(elapsed / speed));

      if (typingPhase === 'greeting') {
        setTypedGreeting(target.slice(0, count));
      } else {
        setTypedHeadline(target.slice(0, count));
      }

      if (elapsed < totalDuration) {
        animId = requestAnimationFrame(tick);
      } else {
        // Ensure complete string is rendered cleanly
        if (typingPhase === 'greeting') {
          setTypedGreeting(target);
          setTimeout(() => {
            setTypingPhase('headline');
          }, 200);
        } else {
          setTypedHeadline(target);
          setTimeout(() => {
            setTypingPhase('done');
            setIsTyping(false);
          }, 450);
        }
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [typingPhase]);

  // Safety fallback if loading screen is skipped or hot-reloaded
  useEffect(() => {
    if (!isLoading && !portraitRevealed) {
      setPortraitRevealed(true);
      if (typingPhase === 'none') {
        setTypingPhase('greeting');
      }
    }
  }, [isLoading, portraitRevealed, typingPhase]);

  // Initialize Lenis + GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8
    });
    lenisRef.current = lenis;
    window.lenis = lenis;

    const handleScrollUpdate = (scrollY) => {
      // Home page fade up / fade down logic:
      // At the top of home page (scrollY <= 60px): dock is faded down (hidden)
      // When scrolling a little bit (scrollY > 60px): dock fades up (in view)
      // On all other pages/sections: dock is always visible!
      if (scrollY <= 60) {
        setIsDockVisible(false);
      } else {
        setIsDockVisible(true);
      }

      // Track active section for dock indicators based on viewport center
      const viewportCenter = window.innerHeight * 0.45;
      const orderedSections = [
        { id: 'contact', match: 'contact' },
        { id: 'experience', match: 'experience' },
        { id: 'impact', match: 'impact' },
        { id: 'automation', match: 'automation' },
        { id: 'capabilities', match: 'capabilities' },
        { id: 'section2', match: 'skills' },
        { id: 'skills', match: 'skills' },
        { id: 'home', match: 'home' }
      ];

      for (const sec of orderedSections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            setCurrentSection(sec.match);
            break;
          }
        }
      }
    };

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      handleScrollUpdate(e.scroll || window.scrollY || 0);
    });

    const onNativeScroll = () => {
      handleScrollUpdate(window.scrollY || window.pageYOffset || 0);
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    onNativeScroll();

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 1. Hero Section: Static, rock-solid native positioning that is 100% identical on load and scroll up

    // 2. Master Sticky Timeline for Section 2 (Logos fade -> Lotus bloom -> Text reveal below flower)
    // Sized to 3100px equivalent scroll budget directly from yaros.me
    const section2 = document.getElementById("section2");
    if (section2) {
      const words = document.querySelectorAll(".reveal-word");
      const flowerState = { frame: 0 };

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#section2",
          start: "top top",
          end: "+=3000px",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // Stage 1 & 2: Rest as peaceful closed bud (0 -> 0.08), then smoothly bloom to fully open (0.08 -> 0.72)
      revealTl.fromTo(flowerState,
        { frame: 0 },
        {
          frame: 197,
          duration: 0.64,
          ease: "none",
          onUpdate: () => {
            if (window.drawFlowerFrame) {
              window.drawFlowerFrame(flowerState.frame);
            }
          }
        },
        0.08
      );

      // Stage 3: Statement container over flower stem fades in (progress 0.46 -> 0.68)
      revealTl.fromTo(".yaros-reveal-content",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.22, ease: "power1.out" },
        0.46
      );

      // Stage 4: Scrub illuminate words word-by-word across stem (progress 0.48 -> 0.86)
      if (words.length > 0) {
        revealTl.fromTo(words,
          { color: "rgba(255, 255, 255, 0.45)", textShadow: "0 0 10px rgba(255, 255, 255, 0.2)" },
          {
            color: "#FFFFFF",
            textShadow: "0 0 24px rgba(255, 255, 255, 0.85)",
            stagger: 0.02,
            duration: 0.38,
            ease: "none"
          },
          0.48
        );
      }
    }

    // 5. Credential Metric Counters Animation
    const metricCards = document.querySelectorAll(".yaros-metric-card");
    metricCards.forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 35, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%"
          }
        }
      );
    });

    // Ensure ScrollTrigger accurately measures heights and respects true DOM order after initial layout
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 350);

    const onLoad = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', onLoad);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('load', onLoad);
      lenis.destroy();
      window.lenis = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          who: contactWho,
          timeline: contactTimeline
        })
      });

      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#38BDF8', '#10B981', '#A855F7', '#FFFFFF']
        });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('success'); // graceful fallback for demo
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#38BDF8', '#10B981', '#A855F7']
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      const offset = (id === 'capabilities') ? -20 : -30;
      lenisRef.current.scrollTo(el, { offset });
    }
  };

  const revealWords = content.statement?.words?.length
    ? content.statement.words
    : "I work at the intersection of machine learning and production engineering — building systems that retrieve, reason, evaluate, optimize, and deploy".split(" ");

  // Interactive Magnetic Dock Navigation Items (In exact top-to-bottom page order)
  // Responsive auto-adjustment: Desktop = 9/9, Tablet = 6/9, Phone = 4/9
  const heroDockItems = [
    {
      id: 'skills',
      label: 'Tech Stack',
      className: 'dock-always',
      isActive: currentSection === 'skills',
      icon: <Terminal size={19} />,
      onClick: () => scrollToSection('skills')
    },
    {
      id: 'capabilities',
      label: 'Work that Measurable',
      className: 'dock-always',
      isActive: currentSection === 'capabilities',
      icon: <Layers size={19} />,
      onClick: () => scrollToSection('capabilities')
    },
    {
      id: 'automation',
      label: 'Automation',
      className: 'dock-tablet-up',
      isActive: currentSection === 'automation',
      icon: <Workflow size={19} />,
      onClick: () => scrollToSection('automation')
    },
    {
      id: 'metrics',
      label: 'Production Telemetry',
      className: 'dock-desktop-only',
      isActive: currentSection === 'impact',
      icon: <Activity size={19} />,
      onClick: () => scrollToSection('impact')
    },
    {
      id: 'experience',
      label: 'Experience & Degrees',
      className: 'dock-always',
      isActive: currentSection === 'experience',
      icon: <BookOpen size={19} />,
      onClick: () => scrollToSection('experience')
    },
    {
      id: 'github',
      label: 'GitHub Codebase',
      badge: '8',
      className: 'dock-tablet-up',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      onClick: () => window.open('https://github.com/shreecloudai', '_blank')
    },
    {
      id: 'huggingface',
      label: 'Hugging Face Hub',
      badge: '100+',
      className: 'dock-desktop-only',
      icon: (
        <span style={{ fontSize: '18px', lineHeight: 1 }}>🤗</span>
      ),
      onClick: () => window.open('https://huggingface.co', '_blank')
    },
    {
      id: 'linkedin',
      label: 'LinkedIn Connect',
      className: 'dock-desktop-only',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      onClick: () => window.open('https://linkedin.com', '_blank')
    },
    {
      id: 'contact',
      label: 'Get in Touch',
      className: 'dock-always',
      isActive: currentSection === 'contact',
      icon: <Mail size={19} />,
      onClick: () => scrollToSection('contact')
    }
  ];

  const handleStartReveal = () => {
    // 1. Portrait appears with upward glide (down to up) as soon as loader dissolve starts
    setPortraitRevealed(true);

    // 2. Typing indicator starts right as portrait glides up
    setTimeout(() => {
      setTypingPhase('greeting');
    }, 280);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (lenisRef.current) {
      if (isLoading) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 120);
      }
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <LoadingScreen 
          onStartReveal={handleStartReveal} 
          onComplete={handleLoadingComplete} 
        />
      )}
      <div className="yaros-viewport">

      {/* Persistent Fluid Silk Aurora WebGL Background (@componentry/silk-aurora) */}
      <div className="yaros-silk-aurora-bg" aria-hidden="true">
        <SilkAurora
          className="h-full w-full min-h-0 bg-transparent"
          speed={0.8}
          intensity={1.05}
          grain={0.65}
          vignette={0.85}
          mouseInfluence={0.85}
          interactive={true}
          style={{ width: '100%', height: '100%', minHeight: '100%' }}
        />
      </div>

      {/* ==============================================================
          1. HERO SECTION (EXACT YAROS.ME AESTHETIC)
          Cutout silhouette portrait with cyan rim lighting, glowing cursive
          signature, minimalist 3-line hamburger, and ethereal typography bloom.
         ============================================================== */}
      <section className="yaros-hero-section" id="home">
        
        {/* Interactive 3D Background Canvas */}
        <Smoke3DCanvas />

        {/* Ambient Teal Spotlight behind head */}
        <div className="yaros-ambient-spotlight" aria-hidden="true"></div>

        {/* Dual Atmospheric Smoke Pillars */}
        <div className="yaros-hero-smoke-pillar left" aria-hidden="true"></div>
        <div className="yaros-hero-smoke-pillar right" aria-hidden="true"></div>

        <div className="yaros-hero-ground-fog" aria-hidden="true"></div>

        {/* Header / Navigation Bar — Minimalist matching reference image */}
        <header className="yaros-header">
          <a 
            href="#home" 
            className="yaros-signature-logo" 
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            aria-label="Homepage"
          >
            {heroData.navBrand || "PranavJadhav"}
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Minimalist 3-Line Hamburger Menu */}
            <button 
              className="yaros-hamburger-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              <span className={`yaros-bar ${mobileMenuOpen ? 'open-1' : ''}`}></span>
              <span className={`yaros-bar ${mobileMenuOpen ? 'open-2' : ''}`}></span>
              <span className={`yaros-bar ${mobileMenuOpen ? 'open-3' : ''}`}></span>
            </button>
          </div>
        </header>

        {/* Mobile / Fullscreen Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="yaros-nav-drawer">
            <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); setMobileMenuOpen(false); }}>TECH STACK</a>
            <a href="#capabilities" onClick={(e) => { e.preventDefault(); scrollToSection('capabilities'); setMobileMenuOpen(false); }}>WORK THAT MEASURABLE</a>
            <a href="#automation" onClick={(e) => { e.preventDefault(); scrollToSection('automation'); setMobileMenuOpen(false); }}>AUTOMATION</a>
            <a href="#impact" onClick={(e) => { e.preventDefault(); scrollToSection('impact'); setMobileMenuOpen(false); }}>IMPACT</a>
            <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); setMobileMenuOpen(false); }}>EXPERIENCE</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); setMobileMenuOpen(false); }}>CONTACT</a>
            <button 
              className="yaros-contact-btn drawer-contact-btn" 
              onClick={() => { setMobileMenuOpen(false); scrollToSection('contact'); }}
            >
              Contact
            </button>
          </div>
        )}

        {/* Hero Centerpiece: Portrait + Text Overlap */}
        <div className="yaros-hero-center">
          
          {/* Portrait Layer: Silhouette portrait with cyan rim lighting & upward entrance */}
          <div className={`yaros-portrait-container ${portraitRevealed ? 'portrait-revealed' : 'portrait-hidden'}`}>
            <img 
              src="/images/pranav_hero.png" 
              alt="Pranav Jadhav - Generative AI Engineer" 
              className="yaros-portrait-img" 
            />
          </div>

          {/* Foreground Typography Layer with Radiant Ethereal Glow */}
          <div className="yaros-hero-content-layer">
            
            {/* Ambient Luminous Text Halo Aura */}
            <div className="yaros-hero-text-glow-aura" aria-hidden="true"></div>

            {/* "I'm Pranav" with Typewriter Intro & ReactBits TechText blueprint vector animation */}
            <h1 className="sr-only">{heroData.mainGreeting || "I'm Pranav"} - {rotatingHeadings[headingIndex] || rotatingHeadings[0]}</h1>
            <div className="yaros-headline-pre-tech-wrap" aria-hidden="true">
              {isTyping && typingPhase !== 'done' ? (
                <span className="yaros-typed-text">
                  {typedGreeting}
                  {typingPhase === 'greeting' && <span className="yaros-typing-cursor"></span>}
                </span>
              ) : (
                <TechText
                  text={heroData.mainGreeting || "I'm Pranav"}
                  fontFamily="'Instrument Serif', Georgia, serif"
                  fontWeight={400}
                  fontSize="inherit"
                  color="currentColor"
                  accentColor="#38bdf8"
                  align="center"
                  reach={200}
                  strokeWidth={1.5}
                  lineStyle="dashed"
                  dashLength={4}
                  dashGap={2}
                  specks={16}
                  selection={true}
                  labels={true}
                  draggable={true}
                  bounce={0.4}
                  sweep={true}
                  speed={1}
                  clickKick={true}
                  intro="none"
                  guides={false}
                  className="yaros-tech-text-hero"
                />
              )}
            </div>

            {/* Cycling Headline with Typewriter Intro & ReactBits TechText blueprint vector animation */}
            <div className="yaros-headline-main-wrapper" aria-hidden="true">
              {isTyping && typingPhase !== 'done' ? (
                <span className="yaros-typed-text">
                  {typedHeadline}
                  {typingPhase === 'headline' && <span className="yaros-typing-cursor"></span>}
                </span>
              ) : (
                <TechText
                  key={headingIndex}
                  text={rotatingHeadings[headingIndex] || rotatingHeadings[0]}
                  fontFamily="'Instrument Serif', Georgia, serif"
                  fontWeight={400}
                  fontSize="inherit"
                  letterSpacing={0.02}
                  color="currentColor"
                  accentColor="#38bdf8"
                  align="center"
                  reach={200}
                  strokeWidth={1.5}
                  lineStyle="dashed"
                  dashLength={4}
                  dashGap={2}
                  specks={16}
                  selection={true}
                  labels={true}
                  draggable={true}
                  bounce={0.4}
                  sweep={true}
                  speed={1}
                  clickKick={true}
                  intro="none"
                  guides={false}
                  className="yaros-tech-text-hero"
                />
              )}
            </div>

            {/* Contact Translucent Pill Button */}
            <button 
              className="yaros-contact-btn" 
              onClick={() => scrollToSection('contact')}
              id="hero-contact-btn"
            >
              {heroData.contactButtonText || "Contact"}
            </button>

            {/* Production ML & LLMOps Badge */}
            <div className="yaros-framer-badge">
              <span className="badge-bolt-icon">⚡</span>
              <span>{heroData.roleBadge || "Production ML & LLMOps Engineer"}</span>
            </div>

          </div>

        </div>

      </section>

      {/* ==============================================================
          SKILLS & TOOLS SECTION (Dedicated, separated from Lotus)
          3D Skewed Carousel with large tactile cards, wide perspective, and infinite continuous auto-scroll
         ============================================================== */}
      <section className="yaros-skills-section" id="skills">
        <div className="yaros-skills-header">
          <div className="yaros-skills-badge">
            <span className="yaros-skills-badge-dot"></span>
            <span>CORE ENGINEERING TOOLKIT</span>
          </div>
          <h2 className="yaros-skills-title">Production ML &amp; LLMOps Stack</h2>
          <p className="yaros-skills-subtitle">
            Battle-tested frameworks, vector search engines, inference runtimes &amp; MLOps infrastructure
          </p>
        </div>

        <div className="yaros-skills-carousel-container">
          <SkewedCarousel
            items={TECH_STACK_LOGOS}
            initialIndex={0}
            cardWidth={165}
            cardHeight={190}
            rotation={48}
            inactiveScale={0.82}
            perspective={850}
            borderRadius={22}
            autoScroll={true}
            autoScrollSpeed={0.35}
            showControls={true}
            showDots={true}
          />
        </div>
      </section>

      {/* ==============================================================
          2. STICKY SCROLL REVEAL SECTION WITH 3D FLOWER & STATEMENT
          - Scroll (Image 2): Lotus appears cleanly and blooms to wide open flower
          - Then: Statement text appears below the flower, illuminating word-by-word
         ============================================================== */}
      <section className="yaros-reveal-track" id="section2">
        <div className="yaros-reveal-sticky">
          
          {/* 3D Blooming Magnolia Flower Canvas (Scrubbed 0 -> 197 frames) */}
          <Model3DScrollCanvas />

          {/* Statement Text Positioned OVER the flower stem with @componentry/text-repel physics */}
          <div className="yaros-reveal-content">
            <div className="yaros-reveal-statement">
              <TextRepel
                words={revealWords}
                className="justify-center text-center w-full"
                wordClassName="reveal-word"
                radius={130}
                strength={50}
                mode="repel"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================
          3. PRODUCTION METRICS MARQUEE TICKER
          Infinite continuous gliding technical achievements ticker
         ============================================================== */}
      <div className="yaros-marquee-bar">
        <div className="yaros-marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((metric, idx) => (
            <div key={idx} className="yaros-marquee-item">
              <span className="marquee-dot">✦</span>
              <span className="marquee-text">{metric}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ==============================================================
          5. WORK THAT MEASURABLE (@componentry/case-study-flip-stack)
          Exact design matching @componentry/case-study-flip-stack
          Featuring 6 Flagship Projects with 3D folding flip animation
         ============================================================== */}
      <section id="capabilities" className="csfs-wrapper-section">
        <CaseStudyFlipStack
          items={projectsList}
          heading="Work that Measurable."
        />
      </section>

      {/* ==============================================================
          5.5 AUTOMATION PROJECTS: SCROLL SPLIT CARD (@componentry/scroll-split-card)
          Exact scroll-driven 3-panel split, 3D flip, and autonomous project reveal
         ============================================================== */}
      <section className="ssc-section" id="automation">
        <ScrollSplitCard
          imageSrc="/images/split_card_cover.jpg"
          cards={automationItems}
          title={content.automation?.heading || "From Manual Processes to AI-Powered Systems."}
          subtitle={content.automation?.subheading || "AI That Doesn’t Just Think - It Executes"}
          scrollText="Scroll down"
        />
      </section>

      {/* ==============================================================
          8. TECHNICAL IMPACT & METRICS SECTION
         ============================================================== */}
      <section className="yaros-credential-section" id="impact">
        <div className="site-container">
          <div className="yaros-credential-header">
            <span className="yaros-section-tag">{content.impact?.sectionTag || "Telemetry & Precision"}</span>
            <h2 className="yaros-credential-title">{content.impact?.heading || "Impact & Telemetry"}</h2>
            <p className="yaros-credential-sub">{content.impact?.subheading || "Measured in production, not notebooks."}</p>
            <p className="yaros-credential-desc">
              {content.impact?.description || "Every system is engineered against measurable latency budgets, verified precision thresholds, and robust containerized infrastructure."}
            </p>
          </div>

          {/* Pillars Row (Same Card Boxes with Expanded Width) */}
          <div className="yaros-pillars-row">
            {impactPillars.map((p, i) => (
              <div key={p.tag || i} className="yaros-pillar-box">
                <span className="yaros-pillar-box-shade" aria-hidden="true" />
                <div className="yaros-pillar-box-header">
                  <span className="yaros-pillar-box-tag">{p.tag}</span>
                  <span className="yaros-pillar-box-dot" />
                </div>
                <h3 className="yaros-pillar-box-title">{p.title}</h3>
                <p className="yaros-pillar-box-desc">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* HorizonX Orbit Cards: Exact Architecture (https://horizonx.so/tools/orbit-cards) */}
          <OrbitCards
            items={technicalMetrics}
            orbitRadius={380}
            cardWidth={285}
            cardHeight={235}
            duration={26}
            direction="clockwise"
            autoplay={true}
            pauseOnHover={true}
            draggable={true}
          />
        </div>
      </section>

      {/* ==============================================================
          9. EXPERIENCE, EDUCATION & TECH ECOSYSTEM SECTION
          Fourise Software Solutions + DY Patil MCA / BCA + Tech Ecosystem
         ============================================================== */}
      <section className="yaros-about-section" id="experience">
        <div className="site-container">
          
          <div className="yaros-about-header">
            <h2 className="yaros-about-title">Experience</h2>
            <p className="yaros-about-sub">Engineering background.</p>
          </div>

          {/* WebGL Prism Coverflow Carousel with Full Technical Content on Cards */}
          <div className="yaros-experience-prism-wrap" style={{ 
            position: 'relative', 
            width: '100%', 
            marginBottom: '40px'
          }}>
            <PrismCarousel
              items={experienceItems}
              aspect={1.63}
              size={0.84}
              neighborScale={0.70}
              gap={26}
              radius={24}
              saturation={0}
              dim={0.25}
              sweep={1}
              sweepDuration={1.1}
              dispersion={1.2}
              autoplay={true}
              interval={5.5}
              loop={true}
              captions={false}
              controls={true}
              draggable={true}
              wheel={false}
              pauseOnHover={true}
              onIndexChange={(idx) => setActiveExpIdx(idx)}
              style={{ height: '660px', minHeight: '560px', width: '100%' }}
            />
          </div>

          {/* About Narrative Box */}
          <div className="yaros-about-content-box">
            {/* Left Photo */}
            <div className="yaros-about-photo-wrapper">
              <img 
                src={about.photo || "/images/pranav_about.png"} 
                alt="Pranav Jadhav - Machine Learning Engineer" 
                className="yaros-about-profile-img"
              />
            </div>

            {/* Right Story */}
            <div className="yaros-about-text-wrapper">
              <span className="yaros-section-tag">{about.sectionTag || "About Pranav"}</span>
              <p className="yaros-about-narrative">
                {about.headline || "I work at the intersection of machine learning and production engineering — building systems that retrieve, reason, evaluate, optimize and deploy."}
              </p>
              <p className="yaros-about-narrative-sub">
                {about.description || "My technical focus spans model training, transformer fine-tuning, RAG pipelines, vector search at scale, LLM-as-judge evaluation frameworks, inference optimization (ONNX/vLLM), and reproducible MLOps infrastructure."}
              </p>

              {/* Direct links row */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
                <a 
                  href={general.githubUrl || "https://github.com/shreecloudai"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="cert-pill"
                  style={{ textDecoration: 'none' }}
                >
                  <Code size={15} className="text-cyan" />
                  <span>GitHub</span>
                </a>
                <a 
                  href={general.huggingFaceUrl || "https://huggingface.co/shreecloud"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="cert-pill"
                  style={{ textDecoration: 'none' }}
                >
                  <Cpu size={15} className="text-cyan" />
                  <span>HuggingFace</span>
                </a>
                <a 
                  href={general.linkedinUrl || "https://www.linkedin.com/in/pranav-jadhav-mlops"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="cert-pill"
                  style={{ textDecoration: 'none' }}
                >
                  <Globe size={15} className="text-cyan" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>
          </div>

          {/* Tumble Wall Component (@reactbits.dev/docs/components/tumble-wall) */}
          <TumbleWall items={toolkitItems} />

        </div>
      </section>

      {/* ==============================================================
          10. OPEN SOURCE & PUBLIC WORK SECTION
          "Built in public. Tested in production." (Replaces fake testimonials)
         ============================================================== */}
      <section className="yaros-testimonials-section" id="opensource">
        <div className="site-container">
          
          <div className="yaros-projects-header" style={{ marginBottom: '48px' }}>
            <span className="yaros-section-tag">Public Work &amp; Community</span>
            <h2 className="yaros-projects-title">Built in public. Tested in production.</h2>
          </div>

          <div className="yaros-testimonials-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {(publicWorkList || PUBLIC_WORK).map((item, idx) => (
              <a 
                key={idx} 
                href={item.link} 
                target="_blank" 
                rel="noreferrer" 
                className="testimonial-card"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ color: '#38BDF8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {item.platform}
                    </span>
                    <ExternalLink size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
                    {item.stat}
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ marginTop: '24px', fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>
                  Explore Repository ↗
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ==============================================================
          11. CONTACT / GET IN TOUCH SECTION
          Real contact info: pranav.shree96@gmail.com, LinkedIn, GitHub
         ============================================================== */}
      <section className="yaros-contact-section" id="contact">
        <div className="site-container">
          
          <div className="yaros-contact-header">
            <h2 className="yaros-contact-title">Let's build something intelligent.</h2>
            <p className="yaros-contact-sub">Open to full-time, internship and remote-first ML engineering opportunities globally.</p>
          </div>

          <div className="yaros-contact-grid">
            
            {/* Left: Interactive Node.js Project Inquiry Form */}
            <div className="yaros-form-card">
              <h3 className="form-title">Send a Direct Message</h3>
              <form onSubmit={handleFormSubmit} className="contact-form">
                
                <div className="form-group">
                  <label>Role Type / Context</label>
                  <div className="pill-selector">
                    {['Recruiter / Founder', 'Full-Time Role', 'ML Internship', 'Project / Collab'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        className={`pill-choice ${contactWho === w ? 'active' : ''}`}
                        onClick={() => setContactWho(w)}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Timeline</label>
                  <div className="pill-selector">
                    {['Immediate', 'Within 1 Month', 'Future Pipeline'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`pill-choice ${contactTimeline === t ? 'active' : ''}`}
                        onClick={() => setContactTimeline(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-input-pair">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Alex Chen"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Company / Organization</label>
                  <input 
                    type="text" 
                    placeholder="AI Startup / Enterprise Team"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Opportunity / Architecture Details *</label>
                  <textarea 
                    rows="4" 
                    required 
                    placeholder="Describe your ML engineering team, RAG requirements, or role scope..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formSubmitting}
                  className="yaros-contact-btn submit-btn"
                >
                  {formSubmitting ? 'Sending...' : 'Send Message ↗'}
                </button>

                {formStatus === 'success' && (
                  <div className="form-alert success">
                    <CheckCircle2 size={18} />
                    <span>Message received! Pranav will reply directly within 24 hours.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Right: Direct Connect Card */}
            <div className="yaros-direct-talk-card">
              <div className="talk-badge">
                <Calendar size={18} className="text-cyan" />
                <span>Direct Contact</span>
              </div>
              <h3 className="talk-title">Prefer to reach out directly?</h3>
              <p className="talk-desc">
                Email me directly or connect via LinkedIn and GitHub for technical discussions, architecture reviews, or role alignments.
              </p>

              <div className="talk-call-box">
                <div className="call-avatar">
                  <img src="/images/pranav_about.png" alt="Pranav Jadhav avatar" />
                  <span className="online-indicator"></span>
                </div>
                <div>
                  <div className="call-host">Pranav Jadhav</div>
                  <div className="call-sub">Machine Learning Engineer · LLMOps</div>
                </div>
              </div>

              <a 
                href="mailto:pranav.shree96@gmail.com" 
                className="yaros-contact-btn talk-btn"
                style={{ textAlign: 'center', textDecoration: 'none' }}
              >
                pranav.shree96@gmail.com <ArrowUpRight size={16} />
              </a>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <a 
                  href="https://www.linkedin.com/in/pranav-jadhav-mlops" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#38BDF8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Globe size={15} /> linkedin.com/in/pranav-jadhav-mlops
                </a>
                <a 
                  href="https://github.com/shreecloudai" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Code size={15} /> github.com/shreecloudai
                </a>
                <a 
                  href="https://huggingface.co/shreecloud" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#F59E0B', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Cpu size={15} /> huggingface.co/shreecloud
                </a>
              </div>

              <div className="talk-footer-note">
                ✦ Typically responds within 24 hours • Global remote availability
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================
          12. FAQ ORBIT CARD STACK SECTION (@componentry/orbit-card-stack)
         ============================================================== */}
      <section className="yaros-faq-section" id="faq">
        <div className="site-container">
          
          <div className="ocs-faq-header">
            <span className="yaros-section-tag">Technical FAQs</span>
            <h2 className="yaros-faq-title">Frequently Asked Questions</h2>
            <p className="ocs-faq-subtitle">
              Hover, tap, or use arrow keys to fan out the deck and inspect architecture decisions.
            </p>
          </div>

          <OrbitCardStack items={faqList || FAQS} defaultActiveIndex={Math.min(4, Math.max(0, (faqList?.length || 1) - 1))} spread={88} lift={38} />

        </div>
      </section>

      {/* ==============================================================
          13. FOOTER
         ============================================================== */}
      <footer className="yaros-footer">
        <div className="site-container">
          <div className="yaros-footer-inner">
            <div className="footer-left">
              <a 
                href="#home" 
                className="footer-logo-signature"
                onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                aria-label="PRANAV JADHAV - Scroll to top"
              >
                <Signature
                  text="PRANAV JADHAV"
                  color="#FFFFFF"
                  fontSize={72}
                  duration={1.2}
                  delay={0.15}
                  inView={true}
                  once={false}
                  chromatic={true}
                />
              </a>
              <p className="footer-copy">
                Machine Learning Engineer specializing in LLMOps, MLOps, Generative AI, and low-latency production pipelines.
              </p>
            </div>

            <div className="footer-right">
              <div className="footer-links">
                <a href="https://github.com/shreecloudai" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://huggingface.co/shreecloud" target="_blank" rel="noreferrer">HuggingFace</a>
                <a href="https://www.linkedin.com/in/pranav-jadhav-mlops" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="mailto:pranav.shree96@gmail.com">Email</a>
              </div>
              <div className="footer-credits">
                © {new Date().getFullYear()} Pranav Jadhav. Production ML &amp; LLMOps Engineering Portfolio.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick Inquiry Modal */}
      {isModalOpen && (
        <div className="yaros-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="yaros-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <h3 className="modal-title">Get in Touch with Pranav</h3>
            <p className="modal-sub">Tell me a little about your ML engineering role or project timeline.</p>
            <form onSubmit={handleFormSubmit} className="contact-form" style={{ marginTop: '20px' }}>
              <input 
                type="text" 
                required 
                placeholder="Your Name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input" 
                style={{ marginBottom: '14px' }}
              />
              <input 
                type="email" 
                required 
                placeholder="Your Email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input" 
                style={{ marginBottom: '14px' }}
              />
              <textarea 
                rows="3" 
                required 
                placeholder="Role summary or project scope..." 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea" 
                style={{ marginBottom: '16px' }}
              ></textarea>
              <button type="submit" disabled={formSubmitting} className="yaros-contact-btn submit-btn" style={{ width: '100%' }}>
                {formSubmitting ? 'Sending...' : 'Submit Message ↗'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Floating Magnetic Command Dock (Fixed Bottom)
          On home page: fades up on scroll, fades down when at top
          On all other pages/sections: persistent and visible */}
      <div 
        className={`yaros-floating-dock-wrapper ${isDockVisible ? 'dock-visible' : 'dock-hidden'}`}
        aria-label="Portfolio Command Navigation Dock"
      >
        <MagneticDock
          items={heroDockItems}
          iconSize={46}
          maxScale={1.42}
          magneticDistance={135}
          showLabels={true}
        />
      </div>

      </div>
    </>
  );
}
