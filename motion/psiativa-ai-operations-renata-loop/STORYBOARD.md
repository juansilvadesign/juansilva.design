---
title: PsiAtiva Renata SDR Loop Storyboard
duration: 16.0
fps: 60
resolution: 1920x1080
music: none
theme: dark-modern-workflow
slug: psiativa-ai-operations-renata-loop
---

# Storyboard — Renata WhatsApp SDR · "Conversational Qualification Flow" · 1920×1080 · 16.0s · 60fps (960f) · **silent, seamless loop**

> **Concept:** Dedicated body loop for the case study section *"Architecture: The autonomous WhatsApp SDR agent"*. Demonstrates how the conversational SDR "Renata" operates asynchronously over WhatsApp Business API via n8n: receiving incoming messages, assembling dynamic prompts with CFP ethical guidelines, executing a humanized typing delay, and responding with high-context clinical empathy rather than rigid decision trees.
> **Slot:** `psiativa-ai-operations.json` → `caseStudy.en.blocks` & `caseStudy.pt.blocks` video block under WhatsApp SDR section.
> **Status:** PROPOSED FOR APPROVAL.

---

## Detailed Scene Breakdown

```
0.0s             4.0s              8.5s              13.0s           16.0s
|----------------|------------------|-----------------|---------------|
[ S1: WEBHOOK ]   [ S2: LLM PROMPT ] [ S3: DELAY/TYPE] [ S4: CLOSE & LOOP]
 Inbound Msg      Context Injection  Humanized Typing  WhatsApp Sent
```

### Scene 1: Webhook Reception & Session Verification (0.0s – 4.0s | f0 – f240)
- **Split Screen**: Left side = n8n workflow canvas (`Z-API Webhook` → `Buscar Sessao`); Right side = simulated WhatsApp mobile interface.
- **Inbound Event**: Prospect message arrives: *"Olá Renata, quero entender como funciona a qualificação da minha clínica."*
- **Node Glow**: `Z-API Webhook` pulses green, extracts phone number, session history retrieved from Postgres.

### Scene 2: Dynamic Prompt Assembly & LLM Reasoning (4.0s – 8.5s | f240 – f510)
- **Node Execution**: `Montar Prompt e Chamar Claude Sonnet` activates.
- **Inspector Tooltip**: Shows system prompt constraints:
  - *Identidade: Renata, consultora de captação da PsiAtiva*
  - *Diretriz Ética: CFP Resolução 11/2018 (sem mercantilização)*
  - *Técnica: SPIN Selling (foco em perda oculta de pacientes)*
- **Data Flow**: Glowing particles travel across the node output toward the delay mechanism.

### Scene 3: Humanized Typing Delay & WhatsApp Interaction (8.5s – 13.0s | f510 – f780)
- **Node Execution**: `Delay Humanizado` node ticks (simulated 2.0s timing curve).
- **WhatsApp Interface**: WhatsApp chat header updates to 💬 *"Renata está digitando..."*.
- **Message Dispatch**: Node `Enviar via Z-API` fires; message delivers with double checkmarks:
  - *"Olá Dr. Carlos! Perfeito. Antes de falar de planos, queria entender: hoje a maior perda de vocês está no contato inicial ou na confirmação da consulta?"*

### Scene 4: State Commitment & Seamless Loop Seam (13.0s – 16.0s | f780 – f960)
- **Node Execution**: `Salvar Historico` persists the turn into `db_sales.sessions`.
- **Loop Seam**: Floating WhatsApp and canvas transform smoothly return to Frame 0 state.
