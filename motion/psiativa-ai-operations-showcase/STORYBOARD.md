---
title: PsiAtiva AI Operations Showcase Storyboard
duration: 55.0
fps: 60
resolution: 1920x1080
music: none
theme: dark-modern-workflow
slug: psiativa-ai-operations-showcase
---

# Storyboard — PsiAtiva AI Operations · "Autonomous Inbound Acquisition & RAG Memory" · 1920×1080 · 55.0s · 60fps (3300f) · **silent, seamless loop, high-fidelity dark n8n canvas**

> **Concept:** Modern sales qualification requires far more than rigid decision trees. At the core of PsiAtiva's commercial acquisition engine is a multi-workflow production orchestration running on self-hosted n8n, an autonomous conversational WhatsApp SDR agent ("Renata") powered by LLMs, and a PostgreSQL + pgvector retrieval-augmented generation (RAG) memory subsystem. This flagship showcase demonstrates the complete end-to-end automation in action—from website intake webhook ingestion and AI lead scoring to live conversational qualification and real-time semantic vector retrieval.
> **CTA:** None. This is case-study hero media and portfolio evidence, not an advertisement.
> **Engine:** HyperFrames (HTML / GSAP → frames).
> **Slot:** `psiativa-ai-operations.json` → `previewMotion` + case study hero video.
> **Status:** PROPOSED FOR APPROVAL.

---

## Format Decision

| Parameter | Specification | Rationale |
|---|---|---|
| **Canvas** | **1920×1080**, dark technical canvas (`#111318` background, `#1A4B51` PsiAtiva teal accents, `#FF6D5A` n8n coral nodes, `#10B981` execution pulses) | Authentic developer-grade automation canvas; matching production n8n environment |
| **Frame Rate** | **60fps** (3300 frames total) | Ultra-smooth canvas navigation, camera panning, zoom transitions, and glowing execution pulses |
| **Duration** | **55.0s = 3300 frames** | Complete persuasion arc covering intake, router, AI enrichment, WhatsApp dialogue, and vector retrieval |
| **Audio** | None (`music: none`) | Zero third-party audio baggage; pure visual engineering proof |
| **Loop** | **Seamless** | Frame 3300 matches Frame 0 pixel-for-pixel and state-for-state |
| **Delivery** | H.264 MP4 (CRF 24) + VP9 WebM (CRF 36) + WebP / JPG stills from same master frame | High-efficiency delivery, seekable HTTP Range, lightweight web footprint |

---

## ⛔ Claim Guard — What this video may and may not assert

| May show & assert | May NOT show or imply |
|---|---|
| Juan **designed, architected, and operates 100% of the workflows** | That this is a **client case study or delivered customer automation** (it is internal business infrastructure) |
| Production n8n workflow orchestration with multi-step LLM chains | Any **unverified volume, response time, conversion, or revenue metrics** (strict zero-metric transparency) |
| WhatsApp SDR agent ("Renata") with dynamic prompt assembly | Rigid decision tree or simplistic no-code chatbot widget |
| Contextual memory via **PostgreSQL + pgvector semantic RAG** | In-memory or transient session storage without database persistence |
| Principle-of-least-privilege self-hosted **Docker Compose stack** | Real client private contact information, live API keys, or private webhook tokens |

---

## Asset Manifest

Every asset below is sourced from clean local records and verified Figma assets:

| File | Resolution / Type | Origin | Scene Usage |
|---|---|---|---|
| `psiativa-full-nobg.png` | 1000×240 (@2x) | Figma `31003:92` | S1 (Header Branding) & S5 (Unified Closing) |
| `psiativa-profile-nobg.png` | 500×500 (@2x) | Figma `31003:104` | S3 (Renata SDR Avatar) |
| `whatsapp-icon.png` | 1000×1000 (@2x) | Figma `31003:664` | S3 (WhatsApp Conversation Dock) |
| `workflow-router.json` | JSON Schema | `backup/v4/z-api-master-inbound-router.json` | S1 & S2 (Master Router Topology) |
| `workflow-enrichment.json` | JSON Schema | `backup/v4/lead-enrichment-pipeline.json` | S2 (Lead Enrichment Pipeline Topology) |
| `workflow-renata.json` | JSON Schema | `backup/v4/agente-renata.json` | S3 & S4 (Agente Renata & RAG Topology) |

---

## Detailed Scene Breakdown

```
0.0s             8.0s              19.0s             34.0s              46.0s           55.0s
|----------------|------------------|-----------------|------------------|----------------|
[ S1: INTAKE ]    [ S2: ENRICHMENT ] [ S3: SDR DIALOG] [ S4: PGVECTOR ]   [ S5: RESOLUTION]
 Webhook Arrival  GPT-5 Scoring      WhatsApp Renata   Semantic RAG Query Architecture & Loop
```

### Scene 1: Inbound Webhook Arrival & Master Orchestrator (0.0s – 8.0s | f0 – f480)
- **Visual**: Opens on the full n8n canvas with dark grid. Center view on the `PsiAtiva — Inbound Gateway`.
- **Top Badge Dock**: `PSIATIVA AI OPERATIONS` · `PRODUCTION INSTANCE` · `STATUS: ACTIVE`.
- **HUD Metric Pill**: `Inbound Webhook 200 OK` · `Latency: 42ms` · `Payload: Diagnostic Intake`.
- **Motion**:
  - `0.0s – 1.5s`: Settled opening frame showing workflow canvas (poster frame candidate at t=0.5s).
  - `1.5s – 4.0s`: Glowing neon pulse travels along the connector line into `Receber Z-API — Master`.
  - `4.0s – 8.0s`: Camera smoothly pans right and zooms inward (scale 1.00 → 1.15) following the execution trace toward the routing branch.

### Scene 2: Evidence-Based Enrichment & ICP Classification (8.0s – 19.0s | f480 – f1140)
- **Visual**: Focus moves into the `Lead Enrichment Pipeline` sub-workflow.
- **Top Badge Dock**: `ORCHESTRATION LAYER` · `MODULE 02: LEAD ENRICHMENT` · `DUAL-LLM EVALUATION`.
- **HUD Metric Pill**: `Model: GPT-5 nano / Qwen 3 235B` · `Scoring: Perfil A (Clínica)`.
- **Motion**:
  - `8.0s – 11.5s`: Node `Validar e Normalizar` executes with a green perimeter glow.
  - `11.5s – 15.5s`: Execution enters `Chamar GPT-5 nano — ICP`. Node expands slightly; an inspection overlay reveals structured evaluation:
    - *Clínica com 4 psicólogos ativos*
    - *Presença digital verificada (GBP + Meta Ads)*
    - *Classificação: Perfil A — Prioridade Alta*
  - `15.5s – 19.0s`: Data pulse routes to `Parsear Diagnóstico` and formats the lead dossier for the SDR agent.

### Scene 3: Autonomous WhatsApp SDR Agent — "Renata" (19.0s – 34.0s | f1140 – f2040)
- **Visual**: Camera pans to `Agente Renata (Inbound WhatsApp)` cluster. On the right side of the screen, a clean floating WhatsApp interface smoothly slides in.
- **Top Badge Dock**: `CONVERSATIONAL AI` · `MODULE 03: AGENTE RENATA` · `Z-API GATEWAY`.
- **HUD Metric Pill**: `Session ID: active` · `CFP Ethical Guardrails: Enabled` · `Tone: Consultive`.
- **Motion**:
  - `19.0s – 23.0s`: Node `Preparar Session ID` and `Montar Prompt e Chamar Claude Sonnet` illuminate simultaneously.
  - `23.0s – 27.0s`: WhatsApp phone UI displays incoming clinic message:
    - Prospect: *"Olá! Fiz o diagnóstico no site da PsiAtiva e queria entender o processo."*
  - `27.0s – 30.0s`: Node `Delay Humanizado` ticks with a countdown pulse, mimicking realistic conversational cadence.
  - `30.0s – 34.0s`: Node `Enviar via Z-API` fires; WhatsApp shows Renata's consultative response:
    - Renata: *"Olá, Dr. Marcos! Analisei o Raio-X da Clínica Integrar. Vi que vocês têm 4 profissionais mas sofrem com o no-show nas primeiras consultas. Como está a confirmação hoje?"*

### Scene 4: Contextual Memory — PostgreSQL & pgvector RAG (34.0s – 46.0s | f2040 – f2760)
- **Visual**: Camera zooms deep into the contextual memory node cluster: `Gerar Embedding` → `Busca RAG`.
- **Top Badge Dock**: `PERSISTENCE LAYER` · `MODULE 04: PGVECTOR RAG` · `POSTGRESQL 16`.
- **HUD Metric Pill**: `Vector Search: Cosine Distance (<=>)` · `Embedding: 1536-dim` · `Similarity: 0.942`.
- **Motion**:
  - `34.0s – 38.0s`: Dynamic query inspector opens revealing live SQL cosine similarity query:
    `SELECT content FROM knowledge_embeddings ORDER BY embedding <=> $1 LIMIT 3;`
  - `38.0s – 42.0s`: Retrieved chunks display verified institutional context:
    - *Metodologia PsiAtiva: Script de Qualificação NEPQ*
    - *Resolução CFP 11/2018: Limites éticos de captação*
  - `42.0s – 46.0s`: Context flows into `Salvar Historico` node; session state updates atomically in relational Postgres table.

### Scene 5: Architectural Overview, Container Stack & Seamless Loop Seam (46.0s – 55.0s | f2760 – f3300)
- **Visual**: Camera pulls back into a grand panoramic view of the entire connected infrastructure.
- **Top Badge Dock**: `FULL-STACK AI ENGINE` · `DOCKER COMPOSE ARCHITECTURE` · `SELF-HOSTED`.
- **Motion**:
  - `46.0s – 50.0s`: Architecture cards highlight the containerized isolation:
    - `n8n Orchestration Core`
    - `PostgreSQL + pgvector Database`
    - `Z-API WhatsApp Gateway`
    - `Cloudflare Tunnel Endpoint`
  - `50.0s – 54.0s`: Camera trajectory smoothly glides back along its opening vector. Canvas zoom, node states, and glowing particles ease into their initial configurations.
  - `54.0s – 55.0s`: Frame 3300 reaches the exact state, scale, and offset of Frame 0. Perfect seamless loop join.
