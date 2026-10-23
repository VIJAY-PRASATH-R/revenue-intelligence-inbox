import React from 'react';
import { 
  Inbox, 
  Search, 
  Share2, 
  Database, 
  GitMerge, 
  PlayCircle, 
  FileText 
} from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenTour,
  onOpenRouting,
  onOpenIngestion,
  onOpenExport,
  onOpenSlides,
  totalCallsCount,
  atRiskCount
}) {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-icon-box" id="brand-logo">
          <Inbox size={19} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span className="brand-title">Revenue Inbox</span>
            <span className="brand-badge">Sales Ops</span>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            Call intelligence, routing, & deal activity
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="search-input-box">
          <Search size={15} color="var(--text-muted)" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search accounts, reps, transcripts, objections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="btn-sm" 
              style={{ background: 'transparent', color: 'var(--text-muted)' }}
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="header-actions">
        <button 
          id="btn-open-tour"
          className="btn btn-secondary btn-sm"
          onClick={onOpenTour}
          title="3-minute narrated workflow walkthrough"
        >
          <PlayCircle size={14} color="#2563eb" />
          <span>Walkthrough</span>
        </button>

        <button 
          id="btn-open-routing-case"
          className="btn btn-secondary btn-sm"
          onClick={onOpenRouting}
          title="Inspect Call #109 territory routing conflict"
        >
          <GitMerge size={14} color="#d97706" />
          <span>Routing Conflict</span>
        </button>

        <button 
          id="btn-open-ingestion-test"
          className="btn btn-secondary btn-sm"
          onClick={onOpenIngestion}
          title="Test deduplication, updates & manual correction preservation"
        >
          <Database size={14} color="#059669" />
          <span>Ingest & Dedup</span>
        </button>

        <button 
          id="btn-open-export-manifest"
          className="btn btn-secondary btn-sm"
          onClick={onOpenExport}
          title="Export CSV/JSON & view manifest"
        >
          <Share2 size={14} color="#475569" />
          <span>Exports</span>
        </button>

        <button 
          id="btn-open-slides"
          className="btn btn-primary btn-sm"
          onClick={onOpenSlides}
          title="View 5 executive slides explaining findings & decisions"
        >
          <FileText size={14} />
          <span>5 Slides</span>
        </button>
      </div>
    </header>
  );
}
