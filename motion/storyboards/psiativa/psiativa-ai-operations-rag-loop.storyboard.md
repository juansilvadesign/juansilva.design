---
title: PsiAtiva pgvector RAG Memory Loop Storyboard
duration: 15.0
fps: 60
resolution: 1920x1080
music: none
theme: dark-modern-workflow
slug: psiativa-ai-operations-rag-loop
---

# Storyboard — pgvector RAG Memory · "Semantic Vector Retrieval & Session Persistence" · 1920×1080 · 15.0s · 60fps (900f) · **silent, seamless loop**

> **Concept:** Dedicated body loop for the case study section *"Contextual memory: PostgreSQL and pgvector RAG"*. Demonstrates the retrieval-augmented generation loop inside n8n: converting incoming messages to 1536-dimensional embeddings, performing cosine distance queries (`<=>`) against the PostgreSQL knowledge base, and injecting verified clinical and regulatory context into the active session without hallucination.
> **Slot:** `psiativa-ai-operations.json` → `caseStudy.en.blocks` & `caseStudy.pt.blocks` video block under pgvector RAG section.
> **Status:** PROPOSED FOR APPROVAL.

---

## Detailed Scene Breakdown

```
0.0s             3.5s              7.5s              11.5s           15.0s
|----------------|------------------|-----------------|---------------|
[ S1: QUERY ]     [ S2: EMBEDDING ]  [ S3: PGVECTOR ]  [ S4: INJECT & LOOP]
 User Query       1536-dim Vector    Cosine Distance   Relational Memory
```

### Scene 1: Query Input & Vectorization Trigger (0.0s – 3.5s | f0 – f210)
- **Canvas Focus**: Zoomed view of the n8n memory pipeline: `Z-API Message` → `Gerar Embedding`.
- **Query Input**: Prospect question: *"Vocês garantem que vou ter 20 pacientes no primeiro mês?"*
- **Vectorization**: Node `Gerar Embedding` lights up cyan/emerald; vector stream pulse (1536 floats) generates.

### Scene 2: PostgreSQL pgvector Cosine Search (3.5s – 7.5s | f210 – f450)
- **Node Execution**: `Busca RAG` node expands into an interactive terminal-style database inspector.
- **SQL Execution**:
  ```sql
  SELECT document_id, content, 1 - (embedding <=> $query_vector) AS similarity
  FROM knowledge_embeddings
  WHERE namespace = 'compliance_cfp'
  ORDER BY embedding <=> $query_vector LIMIT 2;
  ```
- **Live Output**:
  - `[0.961 similarity]` *CFP Código de Ética Art. 20: É vedado garantir resultados ou prometer cura.*
  - `[0.914 similarity]` *PsiAtiva Matriz Comercial: Alinhamento de expectativas éticas.*

### Scene 3: Dynamic Context Grounding & Prompt Injection (7.5s – 11.5s | f450 – f690)
- **Data Flow**: Glowing data lines carry the similarity search result into the LLM system prompt node.
- **Prompt Inspector**: Highlights dynamic injection block:
  `<grounded_knowledge>CFP proíbe promessa de volume fixo de pacientes. Reframe: processo previsível e qualificação de demanda.</grounded_knowledge>`
- **Output Generated**: LLM crafts a compliant, authoritative response with zero hallucination.

### Scene 4: Relational Session Persistence & Seamless Loop Seam (11.5s – 15.0s | f690 – f900)
- **Persistence**: Node `Salvar Historico` executes an atomic `INSERT INTO db_sales.sessions` with metadata, latency, and turn count.
- **Loop Seam**: Camera smoothly glides back to Frame 0 position and node states for an undetectable loop join.
