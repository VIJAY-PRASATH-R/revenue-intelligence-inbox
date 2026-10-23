# RevPulse AI — Revenue Intelligence Inbox & Call Analytics

RevPulse AI is an enterprise-grade Revenue Intelligence application built for sales leadership to triage conversation signals, monitor deal health, arbitrate territory routing conflicts, and ensure audit-safe data ingestion across distributed sales teams.

---

## 🚀 Live Deployed Application & Repository
- **Direct Live Deployed URL**: [https://vijay-prasath-r.github.io/revenue-intelligence-inbox/](https://vijay-prasath-r.github.io/revenue-intelligence-inbox/) (Publicly accessible with zero permission barriers)
- **GitHub Repository**: [https://github.com/VIJAY-PRASATH-R/revenue-intelligence-inbox](https://github.com/VIJAY-PRASATH-R/revenue-intelligence-inbox)
- **Alternative Live Tunnel**: [https://revpulse-inbox.loca.lt](https://revpulse-inbox.loca.lt)
- **Local Development**: `npm run dev` (Runs locally on `http://localhost:5173`)

---

## 🌟 Key Capabilities

### 1. Executive Intelligence Inbox & Dashboard
- **Live Health Metrics**:
  - Total Pipeline Under Review: **$4.82M** across 11 active accounts
  - At-Risk Pipeline: **$890K** across 3 critical deals
  - Average Deal Health: **72/100**
  - Weekly Rep Coaching Velocity: **+18% WoW**
- **Dynamic Multi-Dimensional Filters**: Filter by Deal Stage, Sentiment (Positive, Neutral, Negative, Critical), Attention Priority, Assigned Rep, Account, and Routing Status.
- **Deep Call Inspection Drawer**: Timestamped audio waveform playback simulator, complete speaker-segmented transcripts, AI summaries, detected objections with quotes, competitor mentions, and action item checklists.

### 2. Conversation Routing & Conflict Resolution
- **Deterministic & Heuristic Routing**: Auto-routes calls based on email domain matching, CRM account ownership, and territory rules.
- **Difficult Routing Decision Case Study (Call #109 — Apex BioTech vs. Nexus Health)**:
  - *Conflict*: Apex BioTech was recently acquired by parent Nexus Health. Mid-Market AE Marcus Vance prospected and hosted the demo ($275k), while Strategic Enterprise Director Elena Rostova holds the parent MSA agreement.
  - *Manager Decision*: Co-Ownership Model with 60/40 commission split, giving Marcus clinical demonstration execution and Elena parent procurement/legal governance.
  - Interactive modal allows sales managers to inspect candidate arguments, confidence scores, and apply one-click resolutions.

### 3. Ingestion Pipeline, Deduplication & Safe-Merge Upsert
- **Idempotency Verification**: Computes 32-bit checksum hashes (`chk_hash`) to identify duplicate payloads without redundant database mutations.
- **Safe-Merge Protocol**: Updates system metrics, transcripts, and summaries on incoming syncs while **strictly preserving** sales manager notes, manual tags, rep reassignment overrides, and deal escalations.
- **Interactive Simulator**: One-click live testing for:
  - Identical duplicate ingestion (skips mutation, logs duplicate)
  - Duplicate with payload updates (verifies manager notes & tags remain 100% intact)
  - Brand new call ingestion (`CALL-2026-113` Soylent Corp)

### 4. Export Center & Manifest Generation
- Export full or filtered call records to **JSON** and **CSV**.
- Generates official manifest (`manifest.json` and `manifest.csv`) with:
  - Schema version (`2.4.0`)
  - Unique export ID and timestamp
  - Checksum validation (`sha256`)
  - Filter criteria and pipeline valuation summary
- Pre-generated exports ready in the [`exports/`](./exports/) directory.

### 5. Interactive 5-Slide Presentation Deck
- Interactive presentation deck embedded inside the web application with full-screen mode, slide navigation, and speaker notes.
- Standalone documentation available in [`SLIDES.md`](./SLIDES.md).

### 6. Narrated Guided Walkthrough & Screen Tour
- Built-in automated 3-minute narrated walkthrough highlighting:
  1. Sales manager triage workflow (identifying at-risk deals and coaching reps)
  2. Difficult routing decision (arbitrating subsidiary vs. parent account conflict)
  3. Duplicate and update test (verifying safe merge and manual tag preservation)
- Integrated voice synthesis (Web Speech API) and on-screen visual guides.

---

## 🔍 Key Findings & Rejected Decision Summary

| Item | Finding / Decision | Source Evidence | Management Action |
|------|--------------------|-----------------|-------------------|
| **Finding 1** | **Competitor Displacement in Mid-Market** | [Call #104 (ACME Corp)](src/data/mockCalls.js) | Gong pitched 30% discount; trained reps on ROI auto-routing savings over price cuts |
| **Finding 2** | **Executive Champion Turnover Stalls Deals** | [Call #108 (Cyberdyne)](src/data/mockCalls.js) | VP Mark Henderson resigned; mandated multi-threading (3+ execs) on deals >$200k |
| **Finding 3** | **SecOps Compliance Gap as Silent Blocker** | [Call #112 (OmniConsumer)](src/data/mockCalls.js) | 14-day delay on SOC2 audio retention; created 48h InfoSec escalation SLA |
| **Rejected Decision** | **Fully Autonomous AI Deal Re-Routing** | Architecture Decision Record | Rejected black-box rerouting; instituted AI Suggestion + One-Click Manager Audit Gate |

---

## 📂 Project Structure

```
├── exports/
│   ├── calls_export.csv         # Generated CSV call intelligence dataset
│   ├── calls_export.json        # Generated JSON call intelligence dataset
│   ├── manifest.csv             # CSV Export Manifest with checksums & counts
│   └── manifest.json            # Formal JSON Export Manifest (Schema v2.4.0)
├── src/
│   ├── data/
│   │   └── mockCalls.js         # Realistic sales call dataset & routing metadata
│   ├── utils/
│   │   ├── deduplication.js     # Ingestion, deduplication & safe merge engine
│   │   └── exportUtils.js       # CSV/JSON exporters and manifest generator
│   ├── components/
│   │   ├── Header.jsx           # App navigation, search, and action triggers
│   │   ├── MetricsOverview.jsx  # Health metrics, pipeline at risk & objection trends
│   │   ├── CallInbox.jsx        # Triage list, quick filters & routing badges
│   │   ├── CallDetailModal.jsx  # Deep transcript viewer, audio player & manual overrides
│   │   ├── RoutingModal.jsx     # Difficult routing case study & mediation controls
│   │   ├── IngestionModal.jsx   # Ingestion engine simulator & audit logs
│   │   ├── ExportModal.jsx      # Export center & live manifest viewer
│   │   ├── SlidesModal.jsx      # Interactive 5-slide presentation deck
│   │   └── GuidedTourModal.jsx  # 3-minute narrated walkthrough & audio tour
│   ├── App.jsx                  # Main orchestration container & state management
│   ├── App.css                  # Modern responsive design tokens & glassmorphism
│   └── main.jsx                 # React root entry
├── SLIDES.md                    # Five presentation slides with source evidence
└── README.md                    # Project documentation & deployment guide
```

---

## 🛠️ Installation & Local Setup

```bash
# Clone or navigate to the directory
cd revenue

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to public preview
npx -y surge ./dist revpulse-intelligence.surge.sh
```

---
*Built with React, Vite, Lucide Icons, and Vanilla CSS.*
