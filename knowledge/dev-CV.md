# INSAF ISMATH

Abu Dhabi (UAE Golden Visa) | i.m.insaf@gmail.com | +971 56 607 1157 | [linkedin.com/in/iminsaf](https://www.linkedin.com/in/iminsaf)

---

## Profile

AI/ML Engineer and Researcher with hands-on experience translating business problems into end-to-end enterprise-scale AI systems that deliver measurable impact, and published research on large multimodal models at top-tier AI conferences including EMNLP and CVPR. Skilled across the full generative AI stack alongside classical ML and scalable data-led solutions.

---

## Professional Experience

### 2PointZero – Energy and Consumer investment platform under IHC | Abu Dhabi, UAE
*AI Analyst* | Oct 2025 – Present

- Built Omorfia GIS, a geospatial platform for consolidation and expansion decisions across a 134-branch, 8-brand UAE salon network. Composite risk model fuses Google Maps signals, drive-time catchments, WorldPop demographics, and internal financials; H3 hex-grid tessellation identifies expansion zones. *React, MapLibre, Cesium dashboard; FastAPI + MCP backend*
- Built an Avatar AI Voice Agent as a digital delegate for the Company's Growth Day, interacting with C-suite from 20+ portfolio companies in real time. *STT-LLM-TTS pipeline, LiveKit, Anam 3D avatar*
- Built an FTE (Full-Time Equivalent) benchmarking agent that compresses weeks of manual workforce analysis into a conversational query across portfolio companies, grounded on an agentic hybrid RAG retriever. Given sparse and unevenly disclosed workforce data, built a segment-aware ML pipeline that classifies companies into 12 segments, imputes missing fields via iterative LightGBM imputation within each segment, and validates imputed values through multi-LLM majority-vote consensus. *FastAPI, PostgreSQL/pgvector, MCP backend; hybrid RAG (semantic cosine + weighted tsvector), Qwen3 embeddings; PyCaret + LightGBM; Streamlit frontend*
- Led 2PointZero's portfolio rollout of 8,000+ custom GPTs on SAIF (IHC's agentic AI platform), compressing months of manual configuration into an automated pipeline. Identified core functions and roles by sector (retail, beauty & wellness, media, etc.), generated general and role-specific GPT instructions, mapped employees to GPTs via LLM-driven role, function, and hierarchy matching, and provisioned at scale through Playwright automation. Ran technical rollout sessions with portfolio company teams across the group. *Prompt Engineering, Playwright*
- Represented 2PointZero Innovation Labs in scoping a multi-year research partnership with MBZUAI, presenting business use cases to faculty across workshops spanning multilingual financial NLP, multimodal document intelligence, causal decision intelligence, and AI system evaluation and governance, establishing the path to joint publications, sponsored PhDs, and co-developed IP.
- Built a LangGraph-orchestrated evaluation pipeline that auto-generates ground-truth Q&A datasets for portfolio analytics agents, with multi-provider parallel answer generation, LLM-as-Judge scoring, and Langfuse traces for audit and comparison, turning ad-hoc agent testing into systematic, reproducible benchmarking. *LangGraph, Langfuse*
- Designed a Power Automate flow for legal request intake that writes a structured list item, fires parallel notifications to the legal team and requester, and provisions a request-scoped SharePoint folder for attachments, replacing manual triage across the legal pipeline. *Power Automate, SharePoint*

### VisionLabs – Human and Object Recognition Technologies | Dubai, UAE
*AI Research Engineer* | May 2024 – Aug 2024

- Built the descriptor extraction stage of a synthetic-data augmentation pipeline: trained IR-50 + ArcFace baseline on MS1M-RetinaFace-T1 (5M faces, 90K identities) and extracted IR-101 CurricularFace descriptors to compute per-identity class centers. *PyTorch; IR-50/IR-101 (CNNs); ArcFace/CurricularFace (margin losses)*
- Generated per-identity synthetic faces with Arc2Face conditioned on class centers; retraining on mixed real+synthetic data improved face recognition accuracy by 30% across 7 benchmarks. *Arc2Face (diffusion)*

### Intelligent Visual Analytics Lab (IVAL) – MBZUAI | Abu Dhabi, UAE
*Graduate Research Assistant* | Dec 2023 – Jan 2025

- Built an evaluation harness on 20× NVIDIA A100s, orchestrating 1,500+ inference runs across 8 open-source and 2 proprietary LMMs over 3 MCQA benchmarks in under 2 months. Published at EMNLP 2025 Findings. *PyTorch, Hugging Face*
- Built a human-in-the-loop QA generation pipeline for a long-form video benchmark sourcing egocentric (Ego4D) and non-egocentric videos (3-30 min), enabling systematic evaluation of long-form video understanding where existing benchmarks fell short; implemented inference and evaluation code to benchmark 7 open-source and 2 proprietary Video-LMMs. *PyTorch, Hugging Face*
- Introduced Selective Channel Recalibration Attention (SCRA) to ConvNeXt-Large-V2, improving fine-grained image classification accuracy on CUB Birds, FGVC Aircraft, and FoodX while staying within 5% of baseline compute (FLOPs). *PyTorch, ConvNeXt V2*

### Faculty of Engineering – University of Peradeniya | Sri Lanka
*Research Assistant* | Jan 2021 – Aug 2023

- Real-time Multiple Dyadic Interaction Detection: Built a real-time pipeline for detecting co-occurring two-person interactions in crowded surveillance footage, combining YOLOv7 + SORT for spatiotemporal localization, YOLO-Pose for skeleton extraction, and X3D-M + attention for action classification. Published at IEEE ICIIS 2023. *PyTorch; YOLOv7, SORT; X3D-M*
- Solar GHI Nowcasting from Sky Images: Built a physics-informed two-stage system where a classical CV sky-condition classifier routes inputs to regime-specialized ResNet sub-models, achieving 10.80% nRMSE and 98.88% Pearson correlation. Published at IEEE ICIIS 2021. *PyTorch, OpenCV; ResNet*

---

## Education

### Mohamed Bin Zayed University of Artificial Intelligence (MBZUAI) | Abu Dhabi, UAE
*Master of Science in Computer Vision* | Aug 2023 – May 2025

- GPA: 3.95/4.0 (Rank 2/36); MBZUAI Full Scholarship (4.6% acceptance rate).
- Relevant Coursework: Mathematical Foundations of AI, Deep Learning, Probabilistic & Statistical Inference, Advanced Vision and Language, Visual Object Recognition and Detection, Human and Computer Vision

### University of Peradeniya | Sri Lanka
*Bachelor of Science in Electrical & Electronic Engineering* | Nov 2017 – Mar 2023

- GPA: 3.95/4.0, First Class Honours (Rank 3/100)

### Chartered Institute of Management Accountants (CIMA) | UK
*CIMA Diploma in Management Accounting (CIMA Dip MA)* | Nov 2016 – Feb 2018

---

## Publications

- **Promptception: How Sensitive Are Large Multimodal Models to Prompts?** *EMNLP 2025 (Findings).* [[Paper]](https://aclanthology.org/2025.findings-emnlp.1302.pdf) A 61-prompt evaluation framework across 15 categories measuring prompt sensitivity in 10 LMMs on 3 MCQA benchmarks, revealing up to 15% accuracy deviation from phrasing alone.
- **Towards Calibrating Prompt Tuning of Vision-Language Models.** *CVPR 2026.* [[Paper]](https://arxiv.org/pdf/2602.19024) Dual-regularization calibration framework (mean-variance margin loss + text moment-matching) for prompt-tuned CLIP, reducing Expected Calibration Error across 11 datasets and 7 prompt-tuning methods without sacrificing accuracy.
- **Real-time Multiple Dyadic Interaction Detection in Surveillance Videos in the Wild.** *IEEE ICIIS 2023.* [[Paper]](https://ieeexplore.ieee.org/document/10253565) Real-time multi-dyadic interaction detection in crowded surveillance video via a skeleton-based X3D-M model with attention.
- **Global Horizontal Irradiance Modeling from Sky Images Using ResNet Architectures.** *IEEE ICIIS 2021.* [[Paper]](https://ieeexplore.ieee.org/document/9660664) Hybrid classification-regression framework combining physics-based sky-condition labeling with condition-specific ResNet nowcasters for solar irradiance prediction.

---

## Skills & Leadership

**GenAI:** LangGraph, LangChain, LlamaIndex, CrewAI, Model Context Protocol (MCP), Langfuse, LLM APIs, Retrieval-Augmented Generation (RAG), structured prompting, LLM-as-Judge evaluation, AI agents

**Deep Learning & ML:** PyTorch, TensorFlow, OpenCV, Hugging Face, CUDA, distributed multi-GPU inference, PEFT, vision-language models, CNNs (ResNet/ConvNeXt), AutoML (PyCaret), XGBoost, scikit-learn, K-means clustering, pandas, NumPy

**Full-Stack:** Python, FastAPI, Pydantic, Celery; PostgreSQL, pgvector, Qdrant, Redis, SQL; React, TypeScript, MapLibre, CesiumJS, H3, Streamlit; Docker, AWS (SageMaker, S3), Git, GitHub Actions, pytest, Playwright, LaTeX

**AI Coding Tools:** Claude Code, Codex, GitHub Copilot, Cursor

**Competitive Programming:** IEEEXtreme 15.0 (2021) - Global Rank 161/2,403, Country Rank 9/300

**Languages:** English (Fluent, IELTS 8.0), Tamil (Native), Sinhala (Native)

**Founding President – MBZUAI Consulting Club** (Jan 2024 – May 2025)

- Established the UAE's first inter-university case competition with 7 teams from MBZUAI, NYUAD, and AUS; organized preparatory workshops with BCG and Kearney consultants and secured judges from both firms for the finals.
- Hosted flagship "Introduction to Consulting: Digital & Analytics" session and an AI Industry Panel with the AI Leader from Kearney (Middle East & Africa); engaged 50+ students.

**Interests:** Padel, Running, Karting (Yas Marina Circuit), Football, Badminton
