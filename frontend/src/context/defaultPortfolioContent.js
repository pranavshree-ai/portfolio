export const DEFAULT_PORTFOLIO_CONTENT = {
  theme: "dark", // "dark" | "light"
  general: {
    siteTitle: "Pranav Jadhav — Production ML & LLMOps Engineer",
    siteTagline: "Production Machine Learning & LLMOps Portfolio",
    accentColor: "#00f0ff",
    contactEmail: "pranav.shree96@gmail.com",
    githubUrl: "https://github.com/shreecloudai",
    huggingFaceUrl: "https://huggingface.co/shreecloud",
    linkedinUrl: "https://www.linkedin.com/in/pranav-jadhav-mlops"
  },
  hero: {
    navBrand: "Pranav",
    mainGreeting: "I'm Pranav",
    roleBadge: "Production ML & LLMOps Engineer",
    rotatingHeadings: [
      "MACHINE LEARNING ENGINEER.",
      "LLMOPS & MLOPS SPECIALIST.",
      "GENERATIVE AI ENGINEER.",
      "DEEP LEARNING SPECIALIST."
    ],
    contactButtonText: "Contact"
  },
  statement: {
    words: [
      "I", "work", "at", "the", "intersection", "of", "machine", "learning", "and",
      "production", "engineering", "—", "building", "systems", "that",
      "retrieve,", "reason,", "evaluate,", "optimize,", "and", "deploy"
    ]
  },
  marquee: [
    "Sub-50ms p50 Latency Budgets",
    "1M+ Vector Scale Retrieval",
    "Automated Dual-Judge Verification",
    "Production-Hardened LLM Pipelines",
    "94% Inter-Rater Agreement",
    "1.8× INT8 Latency Reduction",
    "Closed-Loop LoRA Fine-Tuning",
    "92.4% DistilBERT Accuracy",
    "Hybrid SBERT + BM25 Search"
  ],
  impact: {
    sectionTag: "Telemetry & Precision",
    heading: "Impact & Telemetry",
    subheading: "Measured in production, not notebooks.",
    description: "Every system is engineered against measurable latency budgets, verified precision thresholds, and robust containerized infrastructure.",
    pillars: [
      {
        tag: "01 · SLA BUDGET",
        title: "Sub-50ms p50 Latency Budgets",
        desc: "Strict runtime SLA budgets across ONNX INT8 and vLLM inference microservices."
      },
      {
        tag: "02 · VECTOR SCALE",
        title: "1M+ Vector Scale Retrieval",
        desc: "1,037,086 indexed chunks in Qdrant cluster with sub-3s context lookup."
      },
      {
        tag: "03 · VERIFICATION",
        title: "Automated Dual-Judge Verification",
        desc: "Closed-loop Claude + GPT-4o evaluation with 94% inter-rater agreement."
      }
    ],
    metrics: [
      { number: "100K+", label: "Government Resolutions & Tenders Ingested", tag: "Vector RAG" },
      { number: "1,037,086", label: "Indexed Vectors in Production Qdrant Cluster", tag: "Vector Scale" },
      { number: "2–3s", label: "Context Retrieval Latency across 1M+ Chunks", tag: "Retrieval" },
      { number: "<50ms", label: "p50 Model Inference Latency via ONNX/vLLM", tag: "Inference" },
      { number: "94%", label: "LLM-as-Judge Inter-Rater Agreement Rate", tag: "LLMOps Eval" },
      { number: "1.8×", label: "Latency Speedup via INT8 Quantization", tag: "Quantization" },
      { number: "92.4%", label: "DistilBERT Classifier Accuracy (0.924 F1)", tag: "Transformers" },
      { number: "75%", label: "Reduction in Manual Authoring Time with Agents", tag: "Agentic Loops" }
    ]
  },
  projects: [
    {
      id: "grgpt",
      number: "01",
      eyebrow: "Production RAG · Qdrant",
      title: "GRGPT: 1M+ Vector Tender & Gov Resolution RAG",
      tagline: "Govt Resolution & Tender RAG Assistant",
      category: "Production RAG · Vector Search · GenAI",
      description: "ChatGPT-style assistant for Maharashtra Government Resolutions and tenders, built around a domain-restricted RAG architecture over 100K+ PDFs in Qdrant with Sentence-BERT embeddings, delivering 2-3s query latency across 1,037,086 indexed vector chunks with zero hallucination.",
      metricHighlight: "1,037,086 Vectors · 2-3s Latency",
      image: "/images/project_grgpt.png",
      link: "https://github.com/shreecloudai",
      technologies: ["Qdrant", "Sentence-BERT", "RAG", "FastAPI", "Docker", "React"],
      accentColor: "#f97316",
      background: "linear-gradient(135deg, rgba(185, 75, 10, 0.45) 0%, rgba(28, 15, 10, 0.88) 55%, rgba(10, 8, 6, 0.96) 100%)"
    },
    {
      id: "llm-eval",
      number: "02",
      eyebrow: "LLMOps · Observability",
      title: "LLM-Eval: Dual AI-Judge Observability Platform",
      tagline: "Production LLM Observability Platform",
      category: "LLMOps · Evaluation · Telemetry",
      description: "Dual AI-judge evaluation pipeline (Claude + GPT) measuring factuality, coherence, and toxicity with sub-50ms p50 inference, Pydantic structured schemas, 94% inter-rater agreement, and automated drift telemetry.",
      metricHighlight: "94% Agreement · <50ms p50",
      image: "/images/project_llmeval.png",
      link: "https://github.com/shreecloudai",
      technologies: ["vLLM", "Evidently AI", "MLflow", "DuckDB", "W&B", "Docker Compose"],
      accentColor: "#22d3ee",
      background: "linear-gradient(135deg, rgba(6, 135, 155, 0.45) 0%, rgba(10, 24, 30, 0.88) 55%, rgba(6, 12, 16, 0.96) 100%)"
    },
    {
      id: "distilbert-mlops",
      number: "03",
      eyebrow: "Transformer NLP · MLOps",
      title: "DistilBERT MLOps: Quantized Real-Time Classifier",
      tagline: "Sentiment Classifier with Advanced MLOps",
      category: "Transformer NLP · Production ML",
      description: "Production transformer classification pipeline featuring Feast online feature store, Redis feature caching, INT8 quantization (1.8× speedup to 42ms p50), and zero-downtime Nginx canary routing.",
      metricHighlight: "92.4% Accuracy · 42ms p50 Latency",
      image: "/images/project_distilbert.svg",
      link: "https://github.com/shreecloudai",
      technologies: ["DistilBERT", "PyTorch", "ONNX Runtime", "Feast", "Redis", "Docker"],
      accentColor: "#f43f5e",
      background: "linear-gradient(135deg, rgba(200, 10, 100, 0.45) 0%, rgba(30, 12, 22, 0.88) 55%, rgba(12, 6, 10, 0.96) 100%)"
    },
    {
      id: "rag-document-qa",
      number: "04",
      eyebrow: "Hybrid Retrieval · Citations",
      title: "RAG Document Q&A: Enterprise Hybrid Intelligence",
      tagline: "Hybrid Vector + Lexical Search Engine",
      category: "Document Intelligence · Hybrid Search",
      description: "High-accuracy document question-answering system combining FAISS dense vector search with BM25 lexical retrieval and chunk-level source citations via Claude API.",
      metricHighlight: "Hybrid Search · SBERT + BM25",
      image: "/images/project_rag_qa.svg",
      link: "https://github.com/shreecloudai",
      technologies: ["FAISS", "Rank-BM25", "Claude 3.5", "FastAPI", "Streamlit"],
      accentColor: "#818cf8",
      background: "linear-gradient(135deg, rgba(65, 45, 190, 0.45) 0%, rgba(16, 14, 36, 0.88) 55%, rgba(8, 6, 16, 0.96) 100%)"
    },
    {
      id: "agentic-content-suite",
      number: "05",
      eyebrow: "Multi-Agent · Synthesis",
      title: "Agentic Content Suite: Autonomous Pipeline",
      tagline: "Planner-Writer-Critic Multi-Agent Orchestrator",
      category: "Autonomous Agents · LLM Workflows",
      description: "Multi-agent orchestration system implementing Planner → Writer → Critic architecture with Pydantic structured schemas, rubric scoring, auto-retries, and SSE token streaming.",
      metricHighlight: "75% Time Saved · SSE Streaming",
      image: "/images/project_agentic.svg",
      link: "https://github.com/shreecloudai",
      technologies: ["Multi-Agent", "LangChain", "Claude API", "Pydantic", "SSE"],
      accentColor: "#10b981",
      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.45) 0%, rgba(8, 30, 22, 0.88) 55%, rgba(4, 14, 10, 0.96) 100%)"
    },
    {
      id: "vision-classifier",
      number: "06",
      eyebrow: "Computer Vision · Saliency",
      title: "Vision Classifier: CNN + Grad-CAM Explainability",
      tagline: "Deep Transfer Learning Image Classifier",
      category: "Computer Vision · Interpretability",
      description: "Deep transfer learning vision model with ResNet-18 achieving 93.7% test accuracy, featuring Grad-CAM saliency visualizations and MLflow model registry on AWS S3.",
      metricHighlight: "93.7% Accuracy · Grad-CAM Maps",
      image: "/images/project_vision.svg",
      link: "https://github.com/shreecloudai",
      technologies: ["PyTorch", "ResNet-18", "Grad-CAM", "MLflow", "AWS S3", "FastAPI"],
      accentColor: "#eab308",
      background: "linear-gradient(135deg, rgba(234, 179, 8, 0.45) 0%, rgba(32, 26, 8, 0.88) 55%, rgba(14, 12, 4, 0.96) 100%)"
    }
  ],
  automation: {
    sectionTag: "Autonomous Infrastructure",
    heading: "Production Automation Pipelines",
    subtitle: "Closed-loop pipelines that ingest, evaluate, optimize, and self-heal in production without manual intervention.",
    items: [
      {
            "id": "rag-ingestion",
            "title": "Autonomous RAG Ingestion",
            "subtitle": "Continuous Vector Processing",
            "description": "Automated document processing with Sentence-BERT chunking, deduplication, metadata retention, and real-time streaming vector upserts into Qdrant clusters.",
            "metric": "100K+ Docs · Sub-3s Sync",
            "badge": "Vector Automation",
            "bgColor": "#23262f",
            "textColor": "#ffffff",
            "accentColor": "#ffffff",
            "iconName": "Database",
            "tags": [
                  "Qdrant",
                  "Sentence-BERT",
                  "FastAPI",
                  "Async IO"
            ]
      },
      {
            "id": "agentic-automation",
            "title": "Agentic Workflow Loops",
            "subtitle": "Planner → Writer → Critic Architecture",
            "description": "Autonomous multi-agent orchestration pipeline with dynamic few-shot prompt injection, Pydantic structured output validation, rubric-based evaluation scoring, and automated retry loops with SSE streaming.",
            "metric": "75% Reduction in Manual Authoring",
            "badge": "Agentic Loop",
            "bgColor": "#e2e2e2",
            "textColor": "#111111",
            "accentColor": "#111111",
            "iconName": "Bot",
            "tags": [
                  "Anthropic Claude",
                  "LangChain",
                  "Pydantic",
                  "SSE Stream"
            ]
      },
      {
            "id": "llm-eval-ci",
            "title": "Automated LLM Evaluation",
            "subtitle": "Dual-AI Judge Production CI/CD",
            "description": "Continuous automated model verification benchmarking factuality, coherence, and safety against production drift triggers with Evidently AI.",
            "metric": "94% Agreement · <50ms p50 Latency",
            "badge": "LLMOps CI/CD",
            "bgColor": "#1a5bcf",
            "textColor": "#ffffff",
            "accentColor": "#ffffff",
            "iconName": "ShieldCheck",
            "tags": [
                  "Claude API",
                  "Evidently AI",
                  "MLflow",
                  "GitHub Actions"
            ]
      },
      {
            "id": "mlops-canary-pipeline",
            "title": "Self-Healing MLOps Pipelines",
            "subtitle": "Self-Healing Automated Rollouts",
            "description": "End-to-end automated machine learning pipeline with Feast feature store, Redis real-time ingestion, ONNX INT8 model quantization (1.8× speedup), and automated Nginx canary deployments with rollback on drift.",
            "metric": "42ms p50 · 92.4% F1-Score",
            "badge": "Production MLOps",
            "bgColor": "#1c1c1c",
            "textColor": "#ffffff",
            "accentColor": "#ffffff",
            "iconName": "Cpu",
            "tags": [
                  "Feast",
                  "Redis",
                  "ONNX Runtime",
                  "Nginx Canary"
            ]
      },
      {
            "id": "auto-finetune",
            "title": "Closed-Loop LoRA Tuning",
            "subtitle": "Drift-Triggered Retraining",
            "description": "Closed-loop pipeline that intercepts distribution drift, curates high-loss production samples, and triggers automated LoRA parameter-efficient fine-tuning with validation.",
            "metric": "Automated Drift Triggers",
            "badge": "Continuous Learning",
            "bgColor": "#172338",
            "textColor": "#ffffff",
            "accentColor": "#ffffff",
            "iconName": "GitBranch",
            "tags": [
                  "PEFT / LoRA",
                  "Hugging Face",
                  "MLflow",
                  "Docker"
            ]
      }
]
  },
  toolkit: [
    { name: "Python", category: "Languages", logo: "/images/tools/python.svg", accent: "#38bdf8", desc: "Core ML, PyTorch, PySpark & FastAPI" },
    { name: "SQL", category: "Languages", logo: "/images/tools/sql.svg", accent: "#60a5fa", desc: "Complex Joins, Windowing & Vector Aggregations" },
    { name: "Bash", category: "Languages", logo: "/images/tools/bash.svg", accent: "#4ade80", desc: "Linux CLI, Container Scripting & CI Pipelines" },
    { name: "Hugging Face", category: "LLM & NLP", logo: "/images/tools/huggingface.svg", accent: "#fbbf24", desc: "Transformers, PEFT/LoRA & Model Weights" },
    { name: "PyTorch", category: "LLM & NLP", logo: "/images/tools/pytorch.svg", accent: "#f97316", desc: "Deep Learning, Custom Tensors & CUDA Fine-Tuning" },
    { name: "Mistral AI", category: "LLM & NLP", logo: "/images/tools/mistral.svg", accent: "#f43f5e", desc: "Open Weights 7B/8x7B MoE Production Inference" },
    { name: "Llama 3", category: "LLM & NLP", logo: "/images/tools/llama.svg", accent: "#3b82f6", desc: "Domain-Tuned 8B/70B Instruct LLMs" },
    { name: "OpenAI", category: "LLM & NLP", logo: "/images/tools/openai.svg", accent: "#10b981", desc: "GPT-4o AI-Judge & Synthetic Distillation" },
    { name: "Claude API", category: "LLM & NLP", logo: "/images/tools/claude.svg", accent: "#d97706", desc: "Claude 3.5 Sonnet RAG & Reasoning Evaluation" },
    { name: "Qdrant", category: "RAG & Vectors", logo: "/images/tools/qdrant.svg", accent: "#00f0ff", desc: "1,037,086 Vector Collection Indexing in GRGPT" },
    { name: "LangChain", category: "RAG & Vectors", logo: "/images/tools/langchain.svg", accent: "#14b8a6", desc: "Planner-Writer-Critic Multi-Agent Chains" },
    { name: "FastAPI", category: "RAG & Vectors", logo: "/images/tools/fastapi.svg", accent: "#059669", desc: "Sub-3s Latency Async RAG Endpoint Serving" },
    { name: "Docker", category: "MLOps & DevOps", logo: "/images/tools/docker.svg", accent: "#2563eb", desc: "Multi-Stage Containerized ML Microservices" },
    { name: "MLflow", category: "MLOps & DevOps", logo: "/images/tools/mlflow.svg", accent: "#0284c7", desc: "Model Registry, Artifacts & Metric Tracking" },
    { name: "DVC", category: "MLOps & DevOps", logo: "/images/tools/dvc.svg", accent: "#a855f7", desc: "Data & Feature Pipeline Version Control" },
    { name: "W&B", category: "MLOps & DevOps", logo: "/images/tools/wandb.svg", accent: "#eab308", desc: "Fine-Tuning Loss Telemetry & Drift Dashboards" },
    { name: "GitHub Actions", category: "MLOps & DevOps", logo: "/images/tools/github.svg", accent: "#e4e4e7", desc: "Automated CI/CD Linting, Test Runs & Registry Push" },
    { name: "Nginx", category: "MLOps & DevOps", logo: "/images/tools/nginx.svg", accent: "#16a34a", desc: "Reverse Proxy, SSL Termination & Canary Traffic Routing" },
    { name: "vLLM", category: "Optimization", logo: "/images/tools/vllm.svg", accent: "#00f0ff", desc: "PagedAttention High-Throughput Serving Engine" },
    { name: "ONNX Runtime", category: "Optimization", logo: "/images/tools/onnx.svg", accent: "#3b82f6", desc: "1.8× INT8 Quantization Speedup to 42ms p50" },
    { name: "AWS", category: "Cloud & Infra", logo: "/images/tools/aws.svg", accent: "#f59e0b", desc: "EC2 GPU Instances, S3 Vectors & Lambda Tasks" },
    { name: "GCP Vertex AI", category: "Cloud & Infra", logo: "/images/tools/gcp.svg", accent: "#4285f4", desc: "Managed Notebooks & Cloud Endpoint Serving" },
    { name: "Supabase", category: "Cloud & Infra", logo: "/images/tools/supabase.svg", accent: "#3ecf8e", desc: "Postgres pgvector & Auth Microservices" },
    { name: "Pandas", category: "Data Engineering", logo: "/images/tools/pandas.svg", accent: "#ec4899", desc: "Dataframe Wrangling & Feature Engineering" },
    { name: "NumPy", category: "Data Engineering", logo: "/images/tools/numpy.svg", accent: "#38bdf8", desc: "Vectorized Matrix Maths & Cosine Similarity" },
    { name: "Apache Spark", category: "Data Engineering", logo: "/images/tools/spark.svg", accent: "#ea580c", desc: "Distributed Chunking Across 100K+ PDF Corpora" },
    { name: "DuckDB", category: "Data Engineering", logo: "/images/tools/duckdb.svg", accent: "#eab308", desc: "Zero-Copy Fast Analytical SQL Engine" },
    { name: "TypeScript", category: "Languages", logo: "/images/tools/typescript.svg", accent: "#3b82f6", desc: "Strict Typed Contracts & Production Client API" },
    { name: "React", category: "Languages", logo: "/images/tools/react.svg", accent: "#00f0ff", desc: "Interactive Canvas, GSAP & Real-Time SSE Streams" }
  ],
  experience: {
    sectionTag: "Experience",
    heading: "Experience",
    subheading: "Engineering background.",
    role: "Data Analytics Intern – AI/ML",
    company: "Fourise Software Solutions Pvt. Ltd.",
    badge: "Internship · Lead Role",
    location: "Pune",
    period: "Jul 2026 – Present",
    leadSummary: "Led an engineering team building GRGPT, a specialized domain-restricted RAG assistant for Maharashtra Government Resolutions and tenders.",
    bullets: [
      "Built backend, RAG pipeline and embeddings model over 100K+ Maharashtra GR and tender PDFs.",
      "Indexed 1M+ chunks (1,037,086 vectors) in Qdrant, achieving 2–3 second relevant-context retrieval.",
      "Implemented frontend chat logic and UI changes for bilingual Marathi and English querying.",
      "Conducted structured verification and rigorous testing focused on domain answer correctness and zero-hallucination guardrails."
    ]
  },
  education: [
    {
      degreeType: "Postgraduate Degree",
      degree: "Master of Computer Applications (MCA)",
      institution: "DY Patil Technical Campus, Talsande",
      field: "Computer & Information Technology",
      period: "Jun 2025 – Mar 2027 (Expected)",
      accentColor: "#38BDF8"
    },
    {
      degreeType: "Undergraduate Degree",
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Shivaji University, Kolhapur",
      field: "Graduated",
      period: "May 2023 – May 2025",
      accentColor: "#10B981"
    }
  ],
  about: {
    sectionTag: "About Pranav",
    headline: "I work at the intersection of machine learning and production engineering — building systems that retrieve, reason, evaluate, optimize and deploy.",
    description: "My technical focus spans model training, transformer fine-tuning, RAG pipelines, vector search at scale, LLM-as-judge evaluation frameworks, inference optimization (ONNX/vLLM), and reproducible MLOps infrastructure.",
    photo: "/images/pranav_about.png"
  },
  publicWork: [
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
    }
  ],
  faq: [
    {
        "id": 1,
        "q": "What is your primary engineering specialization?",
        "question": "What is your primary engineering specialization?",
        "shortAnswer": "Production ML Engineering specializing in LLMOps, MLOps, Generative AI, and domain-restricted RAG pipelines built for verified speed and zero hallucination.",
        "a": "I specialize in production-focused Machine Learning Engineering with deep emphasis on LLMOps, MLOps, and Generative AI. My work bridges the gap between ML models and hardened production systems—spanning RAG pipelines, LLM evaluation, inference optimization, and containerized deployment.",
        "tag": "SPECIALIZATION",
        "stat": "LLMOPS · MLOPS",
        "accent": "#00f0ff"
    },
    {
        "id": 2,
        "q": "What was your architectural role on the GRGPT project?",
        "question": "What was your architectural role on the GRGPT project?",
        "shortAnswer": "Led engineering for 100K+ Gov Resolution PDFs and 1,037,086 indexed vector chunks in Qdrant with Sentence-BERT, delivering sub-3s query latency.",
        "a": "At Fourise Software Solutions, I led the engineering team building GRGPT—a domain-restricted RAG assistant for Maharashtra Government Resolutions and tenders. I architected the backend API, the Sentence-BERT ingestion pipeline over 100K+ documents and 1,037,086 vector chunks in Qdrant, verified answer correctness, and implemented frontend chat logic.",
        "tag": "ARCHITECTURE",
        "stat": "1M+ VECTORS · QDRANT",
        "accent": "#38bdf8"
    },
    {
        "id": 3,
        "q": "How do you evaluate and benchmark production LLM pipelines?",
        "question": "How do you evaluate and benchmark production LLM pipelines?",
        "shortAnswer": "Built dual AI-judge evaluation pipelines using Claude and GPT with Pydantic schemas, achieving 94% inter-rater agreement and drift telemetry.",
        "a": "In my LLM-Eval platform, I designed dual AI-judge evaluation pipelines using Claude and GPT judges with Pydantic structured schemas. We benchmarked models across factuality, coherence, and toxicity, achieving a 94% inter-rater agreement and automated drift detection with Evidently AI and MLflow.",
        "tag": "EVALUATION",
        "stat": "94% AGREEMENT · MLFLOW",
        "accent": "#818cf8"
    },
    {
        "id": 4,
        "q": "What optimization techniques do you use to reduce inference latency?",
        "question": "What optimization techniques do you use to reduce inference latency?",
        "shortAnswer": "Engineered ONNX runtime execution, INT8 quantization (1.8× speedup to 42ms p50), and high-throughput vLLM serving with PagedAttention.",
        "a": "I leverage ONNX runtime execution, INT8/FP16 quantization, and high-throughput vLLM serving with PagedAttention. For instance, in DistilBERT MLOps, INT8 quantization delivered a 1.8× latency reduction down to 42ms p50, validated under heavy load with Locust.",
        "tag": "OPTIMIZATION",
        "stat": "42ms P50 · 1.8X SPEEDUP",
        "accent": "#34d399"
    },
    {
        "id": 5,
        "q": "What is your experience with vector search and embeddings?",
        "question": "What is your experience with vector search and embeddings?",
        "shortAnswer": "Architected dense Qdrant & FAISS clusters fused with Rank-BM25 sparse search via Reciprocal Rank Fusion, eliminating retrieval blind spots.",
        "a": "I work extensively with Qdrant, FAISS, and BM25 hybrid retrieval systems. By combining dense semantic search (Sentence-BERT embeddings) with sparse keyword matching (Rank-BM25) via Reciprocal Rank Fusion, I eliminate retrieval blind spots and achieve 2–3s context retrieval over million-vector collections.",
        "tag": "HYBRID RETRIEVAL",
        "stat": "RRF · 2-3s CONTEXT",
        "accent": "#22d3ee"
    },
    {
        "id": 6,
        "q": "Which MLOps and CI/CD tools do you use in production?",
        "question": "Which MLOps and CI/CD tools do you use in production?",
        "shortAnswer": "Docker multi-container services, MLflow model registries, DVC data versioning, GitHub Actions CI/CD, and Nginx canary traffic routing.",
        "a": "My standard stack includes Docker and Docker Compose for containerization, MLflow for experiment tracking and model registry, DVC for data versioning, GitHub Actions for automated testing and linting, Evidently AI for data/concept drift monitoring, and Nginx for canary traffic routing.",
        "tag": "MLOPS STACK",
        "stat": "DOCKER · DVC · MLFLOW",
        "accent": "#f472b6"
    },
    {
        "id": 7,
        "q": "What is your educational background?",
        "question": "What is your educational background?",
        "shortAnswer": "Pursuing Master of Computer Applications (MCA) at DY Patil Technical Campus (2025–2027); graduated with BCA from Shivaji University (2022–2025).",
        "a": "I am currently pursuing my Master of Computer Applications (MCA) in Computer & Information Technology at DY Patil Technical Campus, Talsande (expected graduation 2027), following my Bachelor of Computer Applications (BCA) from Shivaji University, Kolhapur (graduated 2025).",
        "tag": "EDUCATION",
        "stat": "MCA CANDIDATE · BCA",
        "accent": "#a78bfa"
    },
    {
        "id": 8,
        "q": "Have you worked with multi-agent workflows?",
        "question": "Have you worked with multi-agent workflows?",
        "shortAnswer": "Designed Planner-Writer-Critic agent loops using LangChain, Claude, and Pydantic with real-time SSE streaming and automated rubric retries.",
        "a": "Yes. In the Agentic Content Suite, I built a Planner → Writer → Critic multi-agent architecture using LangChain, Anthropic Claude, and Pydantic. The system generates structured outlines, drafts content with Server-Sent Events (SSE) streaming, evaluates drafts against rubrics, and triggers automated retries when needed.",
        "tag": "AGENT LOOPS",
        "stat": "SSE STREAMING · LANGCHAIN",
        "accent": "#fb923c"
    },
    {
        "id": 9,
        "q": "Are you open to full-time, internship, or remote positions?",
        "question": "Are you open to full-time, internship, or remote positions?",
        "shortAnswer": "Actively interviewing for full-time Machine Learning Engineering, LLMOps, and contract production roles globally.",
        "a": "Yes, absolutely. I am actively open to full-time roles, internships, and remote-first Machine Learning Engineering / LLMOps opportunities globally.",
        "tag": "AVAILABILITY",
        "stat": "OPEN FOR HIRE · GLOBAL",
        "accent": "#4ade80"
    },
    {
        "id": 10,
        "q": "Where can I review your code and public models?",
        "question": "Where can I review your code and public models?",
        "shortAnswer": "Open-source repositories on github.com/shreecloudai, model weights on huggingface.co/shreecloud, and professional profile on LinkedIn.",
        "a": "You can explore my open-source repositories at github.com/shreecloudai, inspect model weights and tokenizers at huggingface.co/shreecloud, or connect directly on LinkedIn at linkedin.com/in/pranav-jadhav-mlops.",
        "tag": "REPOSITORIES",
        "stat": "GITHUB · HUGGING FACE",
        "accent": "#60a5fa"
    }
]
};

