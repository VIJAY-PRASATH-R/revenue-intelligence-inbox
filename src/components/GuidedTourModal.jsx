import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  Film,
  ArrowRight
} from 'lucide-react';

export default function GuidedTourModal({
  onClose,
  onTriggerAction
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [stepTimer, setStepTimer] = useState(0);

  const tourSteps = [
    {
      chapter: "Part 1: Sales Review & Triage",
      title: "1. Prioritizing At-Risk Revenue & Objection Signals",
      durationSeconds: 35,
      narration: "Welcome to RevPulse. As a sales leader, our morning begins on the Executive Inbox. Out of $4.82M in pipeline, the system automatically flags $890,000 at risk across three critical accounts. Let's look at ACME Corp. The conversation intelligence engine detected an aggressive 30% discount pitch from Gong. Rather than allowing our rep to panic-discount, we can open the call, inspect the transcript quote at three minutes twenty-two seconds, and provide a coaching note on our automated deduplication ROI.",
      keyAction: "inspect_acme",
      actionLabel: "Inspect ACME Corp (Call #104)",
      badgeColor: "#dc2626"
    },
    {
      chapter: "Part 2: Difficult Routing Decision",
      title: "2. Resolving Territory Conflict (Apex Bio vs. Nexus Health)",
      durationSeconds: 45,
      narration: "Next, we examine our difficult routing decision on Call #109. Apex BioTech was recently acquired by Nexus Health. Mid-market rep Marcus Vance prospected the subsidiary and led a $275,000 clinical demo with the CMIO. However, strategic enterprise rep Elena Rostova holds the parent company's Master Services Agreement. A simple rule cannot solve this without alienating reps. We open the arbitration console and approve a Dual-Credit Co-Ownership split: sixty percent to Marcus for execution, forty percent to Elena for parent legal alignment.",
      keyAction: "open_routing",
      actionLabel: "Open Territory Conflict Console",
      badgeColor: "#d97706"
    },
    {
      chapter: "Part 3: Ingestion & Duplicate Test",
      title: "3. Testing Idempotency & Protecting Manual Manager Corrections",
      durationSeconds: 40,
      narration: "Finally, let's execute the Ingestion Pipeline Test. Sales tools often receive repeated webhooks from Zoom and CRM syncs. Standard tools overwrite existing rows, wiping out hours of manager notes. First, we run Test 1: an identical duplicate payload of Call #101. The engine detects identical checksums and performs zero database mutations. Next, we run Test 2: an updated payload with higher deal value and revised transcript. The engine merges the new data, while strictly preserving our manual coaching notes and custom tags.",
      keyAction: "open_ingestion",
      actionLabel: "Run Live Ingestion Test",
      badgeColor: "#059669"
    }
  ];

  const currentStep = tourSteps[currentStepIndex];

  // Voice narration using Web Speech API
  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isPlaying) {
      speakText(currentStep.narration);
      setStepTimer(0);
      const timer = setInterval(() => {
        setStepTimer(prev => {
          if (prev >= currentStep.durationSeconds) {
            if (currentStepIndex < tourSteps.length - 1) {
              setCurrentStepIndex(i => i + 1);
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
      return () => {
        clearInterval(timer);
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      };
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  }, [isPlaying, currentStepIndex, isVoiceEnabled]);

  const handleStepChange = (index) => {
    setCurrentStepIndex(index);
    setStepTimer(0);
    if (isPlaying) {
      speakText(tourSteps[index].narration);
    }
  };

  const handleExecuteAction = () => {
    if (onTriggerAction) {
      onTriggerAction(currentStep.keyAction);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        id="guided-tour-modal-container"
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Film size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="brand-badge" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
                  Walkthrough
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3-Minute Guided Screen Narrative</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-highlight)' }}>
                Product Demonstration & Audio Tour
              </h2>
            </div>
          </div>

          <button id="btn-close-tour-modal" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Progress Timeline Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.65rem',
            marginBottom: '1.25rem',
            background: '#f8fafc',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            {tourSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  opacity: idx === currentStepIndex ? 1 : 0.65,
                  transition: 'all 0.15s'
                }}
                onClick={() => handleStepChange(idx)}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: idx === currentStepIndex ? '#2563eb' : '#e2e8f0',
                  color: idx === currentStepIndex ? '#fff' : '#475569',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {idx + 1}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: idx === currentStepIndex ? 'var(--text-highlight)' : 'var(--text-secondary)' }}>
                  {step.chapter.split(':')[1] || step.chapter}
                </div>
              </div>
            ))}
          </div>

          {/* Active Step Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.725rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 600,
                color: currentStep.badgeColor
              }}>
                {currentStep.chapter}
              </span>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {stepTimer}s / {currentStep.durationSeconds}s
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-highlight)', marginBottom: '0.85rem' }}>
              {currentStep.title}
            </h3>

            {/* Narration Script */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 600 }}>
                  <Sparkles size={13} />
                  <span>Narration Script (Web Speech Voice)</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.1rem 0.45rem', fontSize: '0.675rem' }}
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                >
                  {isVoiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  <span>{isVoiceEnabled ? 'Voice On' : 'Voice Muted'}</span>
                </button>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                "{currentStep.narration}"
              </p>
            </div>

            {/* Action Trigger */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                id="btn-tour-launch-step-action"
                className="btn btn-primary"
                onClick={handleExecuteAction}
              >
                <span>{currentStep.actionLabel}</span>
                <ArrowRight size={14} />
              </button>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Click to jump directly to this view
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              id="btn-tour-play-pause"
              className="btn btn-primary btn-sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : 'Play Walkthrough'}</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setCurrentStepIndex(0); setStepTimer(0); }}
            >
              <RotateCcw size={13} />
              <span>Restart</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentStepIndex === 0}
              onClick={() => handleStepChange(currentStepIndex - 1)}
            >
              Previous
            </button>
            <button
              id="btn-tour-next-chapter"
              className="btn btn-secondary btn-sm"
              disabled={currentStepIndex === tourSteps.length - 1}
              onClick={() => handleStepChange(currentStepIndex + 1)}
            >
              Next
              <ChevronRight size={13} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
