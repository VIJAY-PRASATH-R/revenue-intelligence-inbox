import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Maximize2, 
  Minimize2, 
  Target,
  Lightbulb
} from 'lucide-react';

export default function SlidesModal({ onClose, onSelectCallById }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slidesData = [
    {
      badge: "Slide 1 of 5 • Executive Overview",
      title: "Revenue Intelligence: Autonomous Triage & Pipeline Visibility",
      box1Title: "The Problem for Sales Leadership",
      box1Items: [
        "Sales leaders lack visibility into 50+ hours of weekly recorded sales conversations.",
        "Crucial deal friction signals (competitor price cuts, champion turnover, SecOps delays) remain buried in raw audio.",
        "Ambiguous territory routing causes lead decay, commission disputes, and fractured customer touchpoints."
      ],
      box2Title: "The RevPulse Intelligence Architecture",
      box2Items: [
        "Centralized Revenue Inbox: Live health scores, sentiment ratings, and prioritized risk queues.",
        "Deterministic + Heuristic Routing: Automatically resolves territory assignments and surfaces multi-entity conflicts.",
        "Safe-Merge Ingestion: Ingests repeated webhooks and updates without overwriting manager coaching notes."
      ],
      takeaway: "RevPulse consolidates conversation signals, arbitrates routing conflicts, and protects manager annotations under high-frequency updates."
    },
    {
      badge: "Slide 2 of 5 • Activity & Health Metrics",
      title: "Pipeline Analytics, Call Sentiment Velocity & Objection Breakdown",
      box1Title: "Deal Health & Pipeline Volume",
      box1Items: [
        "Total Pipeline Under Review: $4,825,000 across 11 active accounts.",
        "At-Risk Pipeline Flagged: $890,000 (18.5% of total active pipeline) requiring immediate manager intervention.",
        "Average Portfolio Health: 72/100, weighted on stage velocity and prospect sentiment.",
        "Rep Coaching Velocity: +18% WoW increase in actionable manager interventions."
      ],
      box2Title: "Dominant Objection Clusters",
      box2Items: [
        "32% Competitor Displacement: Aggressive price cuts from Gong and Salesforce bundling.",
        "28% Security & Compliance: SOC2 Type II raw audio retention and customer key demands.",
        "22% Champion Departure: Deals stalled due to single-threaded executive sponsorship.",
        "18% End-User Adoption: Friction in rep UI onboarding in commercial segments."
      ],
      takeaway: "Real-time visibility separates healthy pipeline momentum from silent stalled opportunities before quarter-end."
    },
    {
      badge: "Slide 3 of 5 • Conversation Routing & Edge Case Decision",
      title: "Territory Routing Architecture & The Difficult Multi-Entity Case Study",
      box1Title: "The Routing Engine Hierarchy",
      box1Items: [
        "Tier 1: Inbound Domain & Email Match (98%+ confidence matching).",
        "Tier 2: Named Account & Territory Logic (Commercial vs Strategic Enterprise).",
        "Tier 3: Conflict Arbitration Gate (Flags M&A acquisitions, parent-child structures, and multi-rep claims)."
      ],
      box2Title: "Difficult Routing Case Study: Call #109 (Apex Bio vs. Nexus Health)",
      box2Items: [
        "The Dilemma: Apex BioTech ($275k expansion) was acquired 60 days ago by Nexus Health Global.",
        "Marcus Vance (Mid-Market AE) spent 14 hours outbound prospecting and hosted the clinical CMIO demo.",
        "Elena Rostova (Enterprise Director) holds the parent Nexus Health Master MSA agreement.",
        "Resolution Decision: Approved Dual-Credit Co-Ownership (60% Marcus execution / 40% Elena procurement alignment)."
      ],
      takeaway: "Dual-Credit Co-Ownership prevents rep demoralization for outbound hunting while preserving enterprise contract compliance."
    },
    {
      badge: "Slide 4 of 5 • Ingestion Pipeline & Safe Merge",
      title: "Deduplication, Upsert Rules & Manual Correction Integrity",
      box1Title: "The Ingestion Challenge",
      box1Items: [
        "Repeated Zoom/Teams webhooks and CRM syncs push re-processed audio and revised transcripts daily.",
        "Standard CRM sync engines blindly overwrite existing rows, obliterating hours of manager coaching notes and custom tags.",
        "RevPulse introduces an Idempotent Checksum Fingerprint (chk_hash) and Safe-Merge Protocol."
      ],
      box2Title: "Live Test Verification Results",
      box2Items: [
        "Test 1 (Identical Duplicate): Re-importing Call #101 results in 0 state mutations; logged as DUPLICATE_IDENTICAL.",
        "Test 2 (Duplicate with Payload Updates): Ingesting updated Call #101 updates deal value ($345k) and transcript, while 100% of manager notes and custom tags stay intact.",
        "Audit Trail Integrity: Every merge logs exact field deltas and counts preserved corrections."
      ],
      takeaway: "The Safe-Merge Engine provides mathematical guarantees that sales leadership coaching and tag corrections are never erased."
    },
    {
      badge: "Slide 5 of 5 • Strategic Findings & Rejected Decision",
      title: "Three Source-Linked Findings & One Rejected Architectural Decision",
      box1Title: "Three Important Findings (Linked to Evidence)",
      box1Items: [
        "Finding 1 (Competitor Friction): ACME Corp [Call #104] — Gong offering 30% discount; reps coached on RevPulse auto-triage ROI instead of margin cuts.",
        "Finding 2 (Champion Loss): Cyberdyne Systems [Call #108] — VP Mark Henderson resigned; deal stalled in Stage 3 due to single-threading.",
        "Finding 3 (SecOps Blocker): OmniConsumer [Call #112] — 14-day delay on SOC2 audio retention questionnaire; created 48h InfoSec escalation SLA."
      ],
      box2Title: "One Considered & Rejected Decision",
      box2Items: [
        "Considered: Fully autonomous AI auto-rerouting of conflict calls using LLM predictions without human confirmation.",
        "Rejected Because: Enterprise commission disputes and incorrect CRM re-parenting cause severe rep attrition and sales chaos.",
        "Adopted Instead: AI Recommendation + Confidence Scoring (<0.85 triggers Conflict Queue) + One-Click Manager Audit Gate."
      ],
      takeaway: "High-stakes revenue intelligence demands AI-accelerated recommendations paired with accountable human-in-the-loop governance."
    }
  ];

  const slide = slidesData[currentSlide];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide(prev => Math.min(prev + 1, slidesData.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        id="executive-slides-modal"
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: isFullscreen ? '98vw' : '1000px',
          height: isFullscreen ? '95vh' : 'auto'
        }}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="brand-badge" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
                  Slide Deck
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Findings & Architectural Decisions</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-highlight)' }}>
                Executive Presentation
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button 
              className="btn-close" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button id="btn-close-slides-modal" className="btn-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem' }}>
          <div className="slide-frame">
            <div>
              <div className="slide-badge">{slide.badge}</div>
              <h2 className="slide-title">{slide.title}</h2>

              <div className="slide-content-grid">
                <div className="slide-box">
                  <div className="slide-box-title">
                    <Target size={15} color="#2563eb" />
                    <span>{slide.box1Title}</span>
                  </div>
                  <ul className="slide-list">
                    {slide.box1Items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="slide-box">
                  <div className="slide-box-title">
                    <Lightbulb size={15} color="#d97706" />
                    <span>{slide.box2Title}</span>
                  </div>
                  <ul className="slide-list">
                    {slide.box2Items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Takeaway */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <strong style={{ color: 'var(--text-highlight)' }}>
                  Takeaway:
                </strong>
                <span>{slide.takeaway}</span>
              </div>
            </div>

            {/* Navigation Strip */}
            <div className="slide-nav-bar">
              <button
                id="btn-slide-prev"
                className="btn btn-secondary btn-sm"
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
                style={{ opacity: currentSlide === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>

              <div className="slide-dots">
                {slidesData.map((_, idx) => (
                  <div
                    key={idx}
                    className={`slide-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                id="btn-slide-next"
                className="btn btn-primary btn-sm"
                disabled={currentSlide === slidesData.length - 1}
                onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slidesData.length - 1))}
                style={{ opacity: currentSlide === slidesData.length - 1 ? 0.4 : 1 }}
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            Use Left / Right arrow keys to navigate. Full content also in <code>SLIDES.md</code>.
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
