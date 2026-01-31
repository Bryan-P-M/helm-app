# Multi-Agent AI Framework Technical Landscape
> Research compiled 31 January 2026
> Purpose: Evaluate multi-agent frameworks for relevance to Helm (portfolio governance SaaS)

---

## Table of Contents

1. [Framework Comparison](#1-framework-comparison)
   - [MetaGPT](#11-metagpt)
   - [CrewAI](#12-crewai)
   - [AutoGen (Microsoft)](#13-autogen-microsoft)
   - [LangGraph (LangChain)](#14-langgraph-langchain)
   - [Agency Swarm](#15-agency-swarm)
2. [Comparison Matrix](#2-comparison-matrix)
3. [Recommendation: Why MetaGPT (or Why Not)](#3-recommendation-why-metagpt-or-why-not)
4. [Verification: The MetaGPT SOP Claim](#4-verification-the-metagpt-sop-claim)
5. [Patterns Worth Stealing](#5-patterns-worth-stealing)
6. [Sources](#6-sources)

---

## 1. Framework Comparison

### 1.1 MetaGPT

**What it is:** A meta-programming framework that simulates a software company using LLM-powered agents. Each agent plays a role (Product Manager, Architect, Engineer, QA) and follows Standardized Operating Procedures (SOPs) to coordinate work.

**Key architectural patterns:**
- **Role-based agents** inheriting from a `Role` base class with profile, goal, constraints, actions, and watch triggers
- **Assembly-line paradigm:** agents activate sequentially when they observe output from the preceding role
- **SOP-encoded prompts:** structured output requirements (PRDs, design docs, task lists) enforced at each handoff point
- **Environment-based message passing:** a shared `Environment` where all agents publish and subscribe to messages
- **Three execution modes:** REACT (think-act loop), BY_ORDER (sequential), PLAN_AND_ACT (plan then execute)

**Maturity / community:**
- GitHub stars: ~59–63k (varies by snapshot; FoundationAgents/MetaGPT repo)
  - Source: [GitHub stargazers page](https://github.com/FoundationAgents/MetaGPT/stargazers)
- Forks: ~7.2–8k
  - Source: [GitHub forks page](https://github.com/FoundationAgents/MetaGPT/forks)
- Last release: v0.8.2 (March 2025)
  - Source: [GitHub releases](https://github.com/FoundationAgents/MetaGPT/releases)
- Paper: Accepted at ICLR 2024 (oral presentation). AFlow paper accepted at ICLR 2025 (top 1.8%)
  - Source: [arXiv:2308.00352](https://arxiv.org/abs/2308.00352)
- Organisation: DeepWisdom (founded by Chenglin Wu). Commercial product MGX launched Feb 2025 (#1 Product of the Day/Week on Product Hunt)
  - Source: [MetaGPT README](https://github.com/FoundationAgents/MetaGPT), [deepwisdom.ai](https://www.deepwisdom.ai/)

**Strengths:**
- Strongest SOP/workflow encoding pattern of any framework
- Excellent academic foundation (peer-reviewed, ICLR 2024)
- Structured intermediate outputs reduce hallucination cascading
- Well-defined role→action→watch trigger chain

**Weaknesses:**
- **Fundamentally designed for software generation**, not general business workflows
- Hardcoded around software company roles (PM, Architect, Engineer, QA)
- Limited production deployment evidence outside code generation
- No built-in human-in-the-loop for approval workflows
- No durable execution / checkpointing for long-running processes
- Python 3.9–3.11 only (narrow version support)

**Relevance to PMO/governance SaaS:** LOW-MEDIUM. The *patterns* (SOP encoding, structured handoffs, role-based agents) are highly relevant, but the *framework itself* is purpose-built for code generation. Using it directly for meeting extraction → RAID management → governance reporting would require extensive modification to replace the software company metaphor.

---

### 1.2 CrewAI

**What it is:** A lean, standalone Python framework for orchestrating role-playing AI agents in collaborative workflows. Built from scratch — independent of LangChain. Supports both autonomous "Crews" and event-driven "Flows."

**Key architectural patterns:**
- **Role-based agent teams** ("Crews") with Manager, Worker, and Researcher archetypes
- **Dual execution models:** Crews (autonomous collaboration) and Flows (event-driven, granular control)
- **Sequential, parallel, and conditional task execution**
- **Hierarchical coordination** with authority levels and dynamic task reassignment
- **YAML-based configuration** for agent definitions, tasks, and workflows
- **Built-in tools** for web scraping, file processing, API interactions

**Maturity / community:**
- GitHub stars: ~40.5k
  - Source: [GitHub contributors page](https://github.com/crewAIInc/crewAI/graphs/contributors)
- Forks: ~5.4k
- Downloads: ~1M monthly (PyPI)
  - Source: [CrewAI GA blog post](https://blog.crewai.com/crewai-oss-1-0-we-are-going-ga/)
- Last major release: v1.0 GA (October 2025)
  - Source: [CrewAI blog](https://blog.crewai.com/crewai-oss-1-0-we-are-going-ga/)
- Claims: 1.4 billion agentic automations, 60% of Fortune 500
  - Source: [CrewAI blog](https://blog.crewai.com/crewai-oss-1-0-we-are-going-ga/)
- 100,000+ certified developers via [learn.crewai.com](https://learn.crewai.com)
  - Source: [GitHub README](https://github.com/crewAIInc/crewAI)
- Enterprise product: CrewAI AMP Suite (Control Plane, tracing, observability)

**Strengths:**
- **Most flexible role definitions** — not locked to any specific domain
- GA-quality (v1.0), production-ready with enterprise support
- Event-driven Flows architecture suits business process automation
- Strong enterprise traction (Fortune 500 adoption)
- Good documentation and learning resources (DeepLearning.ai courses)
- YAML + Python hybrid configuration reduces boilerplate

**Weaknesses:**
- Lacks streaming function calling (affects real-time performance)
  - Source: [Firecrawl comparison](https://www.firecrawl.dev/blog/best-open-source-agent-frameworks-2025)
- Relatively young project (launched early 2024, GA Oct 2025)
- Enterprise features locked behind paid AMP Suite
- Less academic rigour than MetaGPT or AutoGen

**Relevance to PMO/governance SaaS:** HIGH. CrewAI's domain-agnostic role definitions, event-driven Flows, and enterprise focus make it the most directly applicable framework for Helm's workflows. A "Meeting Analyst" crew could extract actions, a "RAID Manager" crew could categorise risks/issues, and Flows could orchestrate the governance pipeline.

---

### 1.3 AutoGen (Microsoft)

**What it is:** An event-driven programming framework for building scalable multi-agent AI systems. Developed by Microsoft Research. Now transitioning into the broader **Microsoft Agent Framework** (combined with Semantic Kernel).

**Key architectural patterns:**
- **Event-driven architecture** for complex multi-agent interactions
- **AssistantAgent** as core agent type handling message exchange
- **AgentTool pattern** — wrap agents as tools for other agents (hierarchical composition)
- **AutoGen Studio** — no-code GUI for building multi-agent apps
- **MCP (Model Context Protocol) integration** for tool connectivity
- **Structured conversation flows** with defined termination conditions

**Maturity / community:**
- GitHub stars: ~51.8k
  - Source: [GitHub contributors page](https://github.com/microsoft/autogen/graphs/contributors)
- Forks: ~7.9k
- Contributors: 559
- Releases: 98 total, 3,776 commits, 2,488 issues resolved
  - Source: [AutoGen Update discussion](https://github.com/microsoft/autogen/discussions/7066)
- **Status: Entering maintenance mode.** Microsoft is consolidating AutoGen + Semantic Kernel into the [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) (public preview October 2025)
  - Source: [Visual Studio Magazine](https://visualstudiomagazine.com/articles/2025/10/01/semantic-kernel-autogen--open-source-microsoft-agent-framework.aspx), [AutoGen discussions](https://github.com/microsoft/autogen/discussions/7066)
- Fork: AG2 (formerly AutoGen, community fork) at [ag2ai/ag2](https://github.com/ag2ai/ag2)

**Strengths:**
- Massive community and Microsoft backing
- Strong academic research foundation
- Event-driven architecture suits complex workflows
- AutoGen Studio provides no-code prototyping
- MCP integration for broad tool connectivity
- .NET support (via Microsoft Agent Framework) for enterprise environments

**Weaknesses:**
- **Entering maintenance mode** — new features going to Microsoft Agent Framework
- Migration path still evolving (Agent Framework is public preview)
- Historically complex API surface — multiple paradigm shifts (v0.2 → v0.4 → Agent Framework)
- Heavier dependency footprint than CrewAI
- Enterprise deployment examples limited (Novo Nordisk data science is main cited case)
  - Source: [Microsoft Research blog](https://www.microsoft.com/en-us/research/blog/autogen-enabling-next-generation-large-language-model-applications/)

**Relevance to PMO/governance SaaS:** MEDIUM. The event-driven patterns are relevant, but the framework is in transition. Building on AutoGen now means either accepting maintenance-mode status or adopting the nascent Microsoft Agent Framework. For a startup needing stability, this is risky.

---

### 1.4 LangGraph (LangChain)

**What it is:** A low-level orchestration framework for building stateful, long-running agents as directed graphs. Part of the LangChain ecosystem. Focuses on durable execution, human-in-the-loop, and comprehensive memory.

**Key architectural patterns:**
- **StateGraph** — define workflows as nodes and edges with typed state
- **Directed graph execution** with branching, subgraphs, and conditional routing
- **Checkpointing / durable execution** — agents persist through failures, resume exactly where they stopped
- **Human-in-the-loop** — inspect and modify agent state at any execution point
- **Short-term + long-term memory** for truly stateful agents
- **LangGraph Swarm** — multi-agent handoff patterns (separate library)
- **LangGraph Platform** — deployment infrastructure for long-running workflows

**Maturity / community:**
- GitHub stars: ~11.7k+ (Python repo); JS version also available
  - Source: [GitHub repo](https://github.com/langchain-ai/langgraph)
- Downloads: ~4.2M monthly (PyPI) — highest adoption by download volume
  - Source: [Firecrawl comparison](https://www.firecrawl.dev/blog/best-open-source-agent-frameworks-2025)
- Active development: frequent releases, backed by LangChain Inc
- Enterprise users: Klarna (85M users, 80% resolution time reduction), Replit, Elastic, AppFolio
  - Source: [LangGraph case studies](https://langchain-ai.github.io/langgraph/case-studies/klarna)
- Ecosystem: LangSmith (observability), LangGraph Studio (visual prototyping), LangChain (integrations)

**Strengths:**
- **Durable execution** is unique and critical for long-running governance workflows
- **Human-in-the-loop** is first-class, not bolted on — essential for governance approvals
- Highest download volume = largest active developer base
- Enterprise-proven at scale (Klarna's 85M users)
- Full observability via LangSmith
- Graph-based design maps naturally to workflow/process modelling
- Both Python and JavaScript support (relevant for Next.js stack)

**Weaknesses:**
- Lower-level abstraction — more code to write than CrewAI
- Tied to LangChain ecosystem (vendor dependency concern)
- Stars-to-downloads ratio suggests many users via LangChain rather than direct adoption
- Learning curve steeper than CrewAI's role-based model
- Deployment infrastructure (LangGraph Platform) is a paid product

**Relevance to PMO/governance SaaS:** HIGHEST. LangGraph's durable execution, human-in-the-loop, checkpointing, and graph-based workflow design are purpose-built for the kind of long-running, stateful, approval-gated processes Helm needs. A meeting transcript → extraction → categorisation → review → approval → reporting pipeline maps directly to a LangGraph state graph.

---

### 1.5 Agency Swarm

**What it is:** A framework for building multi-agent applications built on top of the OpenAI Agents SDK (formerly OpenAI Assistants API). Models agencies as organisational structures with customisable agent roles and explicit communication flows.

**Key architectural patterns:**
- **Organisational structure metaphor** — define agencies with CEO, VA, Developer etc.
- **Explicit communication flows** — directional agent-to-agent messaging via `send_message` tool
- **OpenAI Agents SDK foundation** — leverages OpenAI's native agent infrastructure
- **Type-safe tools** via Pydantic models
- **Flexible state persistence** via callback-based thread management
- **LiteLLM router support** — use non-OpenAI models (Claude, Gemini, etc.)

**Maturity / community:**
- GitHub stars: ~3.1–3.9k (varying snapshots)
  - Source: [GitHub repo](https://github.com/VRSEN/agency-swarm)
- Forks: ~800–992
- Last release: v1.4.0 (November 2025)
  - Source: [GitHub releases](https://github.com/VRSEN/agency-swarm/releases)
- Creator: Arsenii Shatokhin (VRSEN) — individual developer, YouTube tutorials
- Community: Discord server, YouTube channel
- Python 3.12+ required

**Strengths:**
- Intuitive organisational metaphor
- Clean API design, easy to understand
- Leverages OpenAI's infrastructure for threading and state
- LiteLLM support avoids full OpenAI lock-in
- Good for rapid prototyping of agent workflows

**Weaknesses:**
- **Smallest community** of all five frameworks
- Single-maintainer risk (VRSEN / small team)
- Heavily dependent on OpenAI Agents SDK — inherits its limitations
- No durable execution or checkpointing
- No human-in-the-loop primitives
- Limited enterprise adoption evidence
- Python 3.12+ only (cutting edge, may conflict with other dependencies)

**Relevance to PMO/governance SaaS:** LOW. The organisational metaphor is appealing but the framework is too immature, too small, and too tightly coupled to OpenAI's infrastructure for a production SaaS product. No durable execution or human-in-the-loop makes it unsuitable for governance workflows.

---

## 2. Comparison Matrix

| Dimension | MetaGPT | CrewAI | AutoGen | LangGraph | Agency Swarm |
|-----------|---------|--------|---------|-----------|--------------|
| **GitHub Stars** | ~60k | ~40k | ~52k | ~12k | ~3.5k |
| **Monthly Downloads** | Moderate | ~1M | ~250k | ~4.2M | Low |
| **Latest Release** | v0.8.2 (Mar 2025) | v1.0 GA (Oct 2025) | Maintenance mode | Active | v1.4.0 (Nov 2025) |
| **Backing** | DeepWisdom | CrewAI Inc | Microsoft (winding down) | LangChain Inc | Individual (VRSEN) |
| **Primary Design** | Software company sim | Domain-agnostic crews | Event-driven agents | Stateful graph workflows | Org-structure agents |
| **Durable Execution** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Human-in-the-Loop** | ❌ | Limited | Limited | ✅ (first-class) | ❌ |
| **Checkpointing** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **SOP/Workflow Encoding** | ✅ (core feature) | ✅ (via Flows) | Partial | ✅ (graph definition) | Partial |
| **Enterprise Proven** | Code gen only | Fortune 500 (claimed) | Novo Nordisk | Klarna, Elastic, Replit | No |
| **JS/TS Support** | ❌ | ❌ | ❌ | ✅ (langgraphjs) | ❌ |
| **Domain Lock-in** | Software company | None | None | None | None |
| **Helm Relevance** | LOW-MEDIUM | HIGH | MEDIUM | HIGHEST | LOW |

---

## 3. Recommendation: Why MetaGPT (or Why Not)

### The Original Analysis Was Wrong to Focus on MetaGPT

The existing analysis (`market-validation-and-metagpt-analysis.md`) provides a thorough deep-dive into MetaGPT's architecture, but makes a category error: **MetaGPT is a software company simulator, not a general-purpose workflow framework.** Its roles (PM, Architect, Engineer, QA), its outputs (PRDs, code, tests), and its assembly line are all hardcoded around software development. Adapting it for Helm would mean:

1. Replacing every built-in role with PMO equivalents
2. Rewriting all SOP prompt templates
3. Rebuilding the message-passing chain for governance workflows
4. Adding durable execution, checkpointing, and human-in-the-loop from scratch
5. Adding a web-accessible API layer (MetaGPT is CLI/library only)

At that point, you're not using MetaGPT — you're using its *ideas* in custom code.

### What MetaGPT Gets Right (Patterns to Steal)

Despite being the wrong framework, MetaGPT's *design principles* are the most relevant of any framework for Helm:

1. **SOP-encoded workflows** — the idea that agents follow explicit Standard Operating Procedures, not freeform chat, directly maps to P3O governance
2. **Structured intermediate outputs** — requiring standardised documents between stages (PRD → Design → Tasks) mirrors the RAID log → Actions → Reporting chain
3. **Role-based bounded responsibility** — each agent has a clear scope, goal, and constraint set
4. **Watch triggers** — agents activate in response to specific output types, creating a deterministic pipeline

### The Actual Recommendation

**For Helm's AI layer, use LangGraph as the orchestration engine, borrowing MetaGPT's SOP-encoding pattern for workflow design.**

**Rationale:**

| Helm Requirement | Best Framework | Why |
|-----------------|----------------|-----|
| Meeting transcript → structured extraction | LangGraph | Stateful pipeline with typed state; can checkpoint mid-extraction |
| Action item → RAID categorisation | LangGraph or CrewAI | Both support multi-step agent workflows |
| Governance approval gates | LangGraph | **Only framework with first-class human-in-the-loop** |
| Long-running report generation | LangGraph | **Only framework with durable execution** |
| SOP-based agent behaviour | MetaGPT patterns | Encode governance SOPs into prompt templates (MetaGPT's innovation) |
| Next.js integration | LangGraph | **Only framework with JS/TS support** (langgraphjs) |
| Production observability | LangGraph | LangSmith integration for tracing agent workflows |

**Secondary option: CrewAI** if you want faster prototyping and simpler agent definitions, with the trade-off of no durable execution or native JS support.

### Recommended Architecture for Helm's AI Pipeline

```
Meeting Recording
       ↓
[Transcription Node] — Whisper/Deepgram
       ↓
[Extraction Agent] — LangGraph node: extract actions, decisions, risks, issues
       ↓
[Classification Agent] — LangGraph node: categorise into RAID taxonomy
       ↓
[Human Review Gate] — LangGraph interrupt: PM reviews/approves extracted items  ← CRITICAL
       ↓
[RAID Integration Node] — Write approved items to Helm's database
       ↓
[Reporting Agent] — Generate governance summaries on schedule
       ↓
[Dashboard Update] — Push to Helm UI
```

Each node follows an SOP template (borrowed from MetaGPT's pattern):
- **Explicit instructions** (not freeform "be a helpful assistant")
- **Structured output schema** (JSON with defined fields, not prose)
- **Validation rules** (constraints on what's acceptable)
- **Error handling** (what to do when uncertain — escalate to human)

### Why Not the Others?

- **MetaGPT:** Wrong domain (software dev), no durable execution, no HITL, no JS support
- **AutoGen:** Entering maintenance mode. Building on a dying framework is unjustifiable risk for a new SaaS product
- **Agency Swarm:** Too immature, single-maintainer risk, no HITL, OpenAI lock-in

---

## 4. Verification: The MetaGPT SOP Claim

### The Claim

The existing report (`market-validation-and-metagpt-analysis.md`) states:

> "MetaGPT's core thesis: a software company's real intellectual property is its Standard Operating Procedures, not its code."

### Verdict: INTERPRETATION, NOT DIRECT QUOTE

This specific phrasing — *"a software company's real intellectual property is its Standard Operating Procedures, not its code"* — does **not** appear in any MetaGPT source material. It is an interpretive paraphrase that, while capturing the spirit, overstates and misattributes.

### What MetaGPT Actually Says

**1. The GitHub README / official docs state:**

> "Code = SOP(Team) is the core philosophy. We materialize SOP and apply it to teams composed of LLMs."
>
> — [MetaGPT GitHub README](https://github.com/FoundationAgents/MetaGPT), [MetaGPT Docs Introduction](https://docs.deepwisdom.ai/main/en/guide/get_started/introduction.html)

**2. The academic paper (arXiv:2308.00352v7) states:**

> "MetaGPT encodes Standardized Operating Procedures (SOPs) into prompt sequences for more streamlined workflows, thus allowing agents with human-like domain expertise to verify intermediate results and reduce errors."
>
> — [Hong et al., "MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework," arXiv:2308.00352v7](https://arxiv.org/abs/2308.00352v7)

**3. The paper's introduction further explains:**

> "Through extensive collaborative practice, humans have developed widely accepted Standardized Operating Procedures (SOPs) across various domains. These SOPs play a critical role in supporting task decomposition and effective coordination. Furthermore, SOPs outline the responsibilities of each team member, while establishing standards for intermediate outputs."
>
> — [arXiv:2308.00352v7, Section 1](https://arxiv.org/html/2308.00352v7)

### Analysis

MetaGPT's actual thesis is **"Code = SOP(Team)"** — meaning the output (code) is a function of applying SOPs to a team. This is a statement about *process efficiency*, not about *intellectual property*. The framework argues that:

1. SOPs reduce hallucination cascading in multi-agent systems
2. Structured intermediate outputs improve quality
3. Role-based decomposition with explicit handoff standards produces better results

The "intellectual property" framing in the original report is an *editorialised interpretation* — plausible but not sourced. The IBM explainer article describes MetaGPT as "orchestrating the use of human procedural knowledge and AI agents" ([IBM, "What Is MetaGPT"](https://www.ibm.com/think/topics/metagpt)), which is closer to the actual thesis.

**Correct citation should be:**

> MetaGPT's core philosophy is "Code = SOP(Team)" — that applying Standardized Operating Procedures to teams of LLM agents produces better outputs than freeform agent conversation.

---

## 5. Patterns Worth Stealing

Regardless of which framework Helm uses (or whether it uses any), these patterns from across the landscape are directly applicable:

### From MetaGPT: SOP-Encoded Agent Prompts
- Define explicit procedures for each agent role (not vague personas)
- Require structured output schemas at every handoff point
- Use watch triggers to create deterministic pipelines
- **Application to Helm:** Each governance workflow step (extraction, classification, review, approval) gets an explicit SOP template

### From LangGraph: Durable Stateful Execution
- Checkpoint workflow state so processes can resume after failure
- Human-in-the-loop interrupts for approval gates
- Graph-based workflow definition for complex branching logic
- **Application to Helm:** Meeting processing pipeline can survive API failures, and governance approvals naturally fit the interrupt model

### From CrewAI: Domain-Agnostic Role Design
- Define agent roles in YAML without code changes
- Manager/Worker/Researcher archetypes map well to PMO roles
- Event-driven Flows for production pipelines
- **Application to Helm:** Customer-configurable governance roles (PMO Director, Project Manager, Risk Owner) as agent configurations

### From AutoGen: Agent-as-Tool Composition
- Wrap specialist agents as tools for coordinator agents
- Hierarchical delegation pattern
- **Application to Helm:** A "Governance Coordinator" agent that delegates to specialist extraction, classification, and reporting agents

### From Agency Swarm: Communication Flow Governance
- Explicit directional communication rules between agents
- Not every agent can talk to every other agent
- **Application to Helm:** Enforce that extraction agents can't bypass human review gates

---

## 6. Sources

### Primary Sources
1. MetaGPT GitHub: https://github.com/FoundationAgents/MetaGPT
2. MetaGPT Paper: https://arxiv.org/abs/2308.00352
3. MetaGPT Paper (HTML): https://arxiv.org/html/2308.00352v7
4. MetaGPT Docs: https://docs.deepwisdom.ai/main/en/guide/get_started/introduction.html
5. DeepWisdom: https://www.deepwisdom.ai/
6. CrewAI GitHub: https://github.com/crewAIInc/crewAI
7. CrewAI GA Blog: https://blog.crewai.com/crewai-oss-1-0-we-are-going-ga/
8. CrewAI Website: https://www.crewai.com/
9. AutoGen GitHub: https://github.com/microsoft/autogen
10. AutoGen Update Discussion: https://github.com/microsoft/autogen/discussions/7066
11. Microsoft Agent Framework: https://github.com/microsoft/agent-framework
12. Microsoft Agent Framework Docs: https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview
13. LangGraph GitHub: https://github.com/langchain-ai/langgraph
14. LangGraph Website: https://www.langchain.com/langgraph
15. LangGraph JS: https://github.com/langchain-ai/langgraphjs
16. Agency Swarm GitHub: https://github.com/VRSEN/agency-swarm

### Comparison & Analysis Sources
17. Firecrawl "Best Open Source Frameworks for Building AI Agents in 2025": https://www.firecrawl.dev/blog/best-open-source-agent-frameworks-2025
18. Latenode "CrewAI Framework 2025 Complete Review": https://latenode.com/blog/ai-frameworks-technical-infrastructure/crewai-framework/crewai-framework-2025-complete-review-of-the-open-source-multi-agent-ai-platform
19. IBM "What Is MetaGPT": https://www.ibm.com/think/topics/metagpt
20. Visual Studio Magazine "Semantic Kernel + AutoGen = Microsoft Agent Framework": https://visualstudiomagazine.com/articles/2025/10/01/semantic-kernel-autogen--open-source-microsoft-agent-framework.aspx
21. Cloud Summit EU "Microsoft Agent Framework Overview": https://cloudsummit.eu/blog/microsoft-agent-framework-production-ready-convergence-autogen-semantic-kernel
22. Turing "Detailed Comparison of Top 6 AI Agent Frameworks": https://www.turing.com/resources/ai-agent-frameworks
23. Langflow "Complete Guide to Choosing an AI Agent Framework in 2025": https://www.langflow.org/blog/the-complete-guide-to-choosing-an-ai-agent-framework-in-2025
24. APIPie "Top 10 Open-Source AI Agent Frameworks May 2025": https://apipie.ai/docs/blog/top-10-opensource-ai-agent-frameworks-may-2025
25. DeepWiki "MetaGPT Overview": https://deepwiki.com/FoundationAgents/MetaGPT

### Data Points (GitHub stats are point-in-time, late Jan 2026)
26. MetaGPT stars: ~59–63k (FoundationAgents/MetaGPT stargazers page)
27. CrewAI stars: ~40.5k (crewAIInc/crewAI contributors page)
28. AutoGen stars: ~51.8k (microsoft/autogen contributors page)
29. LangGraph stars: ~11.7k+ (langchain-ai/langgraph repo), 4.2M monthly downloads
30. Agency Swarm stars: ~3.1–3.9k (VRSEN/agency-swarm repo)

---

*Note: GitHub star counts fluctuate. Values cited are from search results dated late January 2026. Download numbers from PyPI are as reported in cited articles (mid-2025).*
