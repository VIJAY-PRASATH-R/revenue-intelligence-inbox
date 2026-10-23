import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import CallInbox from './components/CallInbox';
import CallDetailModal from './components/CallDetailModal';
import RoutingModal from './components/RoutingModal';
import IngestionModal from './components/IngestionModal';
import ExportModal from './components/ExportModal';
import SlidesModal from './components/SlidesModal';
import GuidedTourModal from './components/GuidedTourModal';
import { initialCalls, teamReps } from './data/mockCalls';
import { 
  PlayCircle, 
  Database, 
  Inbox
} from 'lucide-react';
import './App.css';

export default function App() {
  const [calls, setCalls] = useState(initialCalls);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRep, setSelectedRep] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');

  // Modals state
  const [selectedCall, setSelectedCall] = useState(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isRoutingOpen, setIsRoutingOpen] = useState(false);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSlidesOpen, setIsSlidesOpen] = useState(false);

  // Filtered Calls Computation
  const filteredCalls = useMemo(() => {
    return calls.filter(call => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAccount = call.account?.toLowerCase().includes(q);
        const matchesTitle = call.title?.toLowerCase().includes(q);
        const matchesRep = call.repAssigned?.toLowerCase().includes(q);
        const matchesContact = call.contactName?.toLowerCase().includes(q);
        const matchesSummary = call.summary?.toLowerCase().includes(q);
        const matchesCompetitor = call.competitorsMentioned?.some(c => c.toLowerCase().includes(q));
        const matchesObjection = call.objections?.some(o => o.topic.toLowerCase().includes(q) || o.quote.toLowerCase().includes(q));
        const matchesTranscript = call.transcript?.some(t => t.text.toLowerCase().includes(q));
        if (!matchesAccount && !matchesTitle && !matchesRep && !matchesContact && !matchesSummary && !matchesCompetitor && !matchesObjection && !matchesTranscript) {
          return false;
        }
      }

      // 2. Rep Filter
      if (selectedRep !== 'all' && call.repAssigned !== selectedRep) {
        return false;
      }

      // 3. Stage Filter
      if (selectedStage !== 'all' && call.dealStage !== selectedStage) {
        return false;
      }

      // 4. Category Pill Filter
      if (activeFilter === 'attention' && !call.needsAttention && (call.dealHealth === undefined || call.dealHealth >= 50)) {
        return false;
      }
      if (activeFilter === 'conflicts' && call.routingStatus !== 'Conflict Detected') {
        return false;
      }
      if (activeFilter === 'objections' && (!call.objections || call.objections.length === 0)) {
        return false;
      }

      return true;
    });
  }, [calls, searchQuery, activeFilter, selectedRep, selectedStage]);

  // Update Single Call (e.g. from detail modal)
  const handleUpdateCall = (updatedCall) => {
    setCalls(prev => prev.map(c => c.id === updatedCall.id ? updatedCall : c));
    setSelectedCall(updatedCall);
  };

  // Batch Update from Ingestion Engine
  const handleBatchUpdate = (updatedCallsList) => {
    setCalls(updatedCallsList);
  };

  // Routing conflict resolution
  const handleResolveRouting = (resolvedCall) => {
    setCalls(prev => prev.map(c => c.id === resolvedCall.id ? resolvedCall : c));
  };

  // Actions triggered from the 3-minute guided tour
  const handleTourAction = (actionKey) => {
    setIsTourOpen(false);
    if (actionKey === 'inspect_acme') {
      const acmeCall = calls.find(c => c.id === 'CALL-2026-104');
      if (acmeCall) setSelectedCall(acmeCall);
    } else if (actionKey === 'open_routing') {
      setIsRoutingOpen(true);
    } else if (actionKey === 'open_ingestion') {
      setIsIngestionOpen(true);
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenRouting={() => setIsRoutingOpen(true)}
        onOpenIngestion={() => setIsIngestionOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSlides={() => setIsSlidesOpen(true)}
        totalCallsCount={calls.length}
        atRiskCount={calls.filter(c => c.needsAttention).length}
      />

      {/* Main Container */}
      <main className="dashboard-main">
        {/* Clean Overview Banner */}
        <div className="tour-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Inbox size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-highlight)' }}>
                Sales Management Revenue Inbox
              </div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                Review call recordings, triage at-risk deals, resolve territory routing conflicts, and verify deduplicated sync.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              id="banner-btn-start-tour"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsTourOpen(true)}
            >
              <PlayCircle size={14} color="#2563eb" />
              <span>3-Min Walkthrough</span>
            </button>

            <button
              id="banner-btn-test-dedup"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsIngestionOpen(true)}
            >
              <Database size={14} color="#059669" />
              <span>Duplicate / Update Test</span>
            </button>
          </div>
        </div>

        {/* Executive Metrics Overview Grid */}
        <MetricsOverview
          calls={calls}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/* Conversation Intelligence Inbox */}
        <CallInbox
          calls={filteredCalls}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          selectedRep={selectedRep}
          setSelectedRep={setSelectedRep}
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
          onSelectCall={(call) => setSelectedCall(call)}
          teamReps={teamReps}
        />
      </main>

      {/* Detail / Inspection Modal */}
      {selectedCall && (
        <CallDetailModal
          call={selectedCall}
          onClose={() => setSelectedCall(null)}
          onUpdateCall={handleUpdateCall}
          teamReps={teamReps}
        />
      )}

      {/* Difficult Routing Case Study Modal */}
      {isRoutingOpen && (
        <RoutingModal
          call={calls.find(c => c.id === 'CALL-2026-109')}
          onClose={() => setIsRoutingOpen(false)}
          onResolveRouting={handleResolveRouting}
        />
      )}

      {/* Deduplication & Ingestion Test Modal */}
      {isIngestionOpen && (
        <IngestionModal
          calls={calls}
          onClose={() => setIsIngestionOpen(false)}
          onBatchUpdate={handleBatchUpdate}
        />
      )}

      {/* Exports & Manifest Modal */}
      {isExportOpen && (
        <ExportModal
          calls={calls}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* 5 Executive Slides Presentation Modal */}
      {isSlidesOpen && (
        <SlidesModal
          onClose={() => setIsSlidesOpen(false)}
          onSelectCallById={(id) => {
            const found = calls.find(c => c.id === id);
            if (found) {
              setIsSlidesOpen(false);
              setSelectedCall(found);
            }
          }}
        />
      )}

      {/* 3-Minute Narrated Guided Walkthrough Tour */}
      {isTourOpen && (
        <GuidedTourModal
          onClose={() => setIsTourOpen(false)}
          onTriggerAction={handleTourAction}
        />
      )}
    </div>
  );
}
