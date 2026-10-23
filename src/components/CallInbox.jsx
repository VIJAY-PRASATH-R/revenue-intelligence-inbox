import React from 'react';
import { 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  GitMerge, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export default function CallInbox({
  calls,
  activeFilter,
  setActiveFilter,
  selectedRep,
  setSelectedRep,
  selectedStage,
  setSelectedStage,
  onSelectCall,
  teamReps
}) {
  const getStageClass = (stage) => {
    switch (stage) {
      case 'Discovery': return 'stage-discovery';
      case 'Technical Validation': return 'stage-technical-validation';
      case 'Proposal': return 'stage-proposal';
      case 'Security Review': return 'stage-security-review';
      case 'Negotiation': return 'stage-negotiation';
      default: return 'stage-discovery';
    }
  };

  const getHealthClass = (score) => {
    if (score >= 75) return 'health-high';
    if (score >= 50) return 'health-mid';
    return 'health-low';
  };

  const getSentimentPill = (label, score) => {
    let color = '#065f46';
    let bg = '#ecfdf5';
    let border = '#a7f3d0';
    if (label === 'Negative' || label === 'Critical Risk') {
      color = '#991b1b';
      bg = '#fef2f2';
      border = '#fecaca';
    } else if (label === 'Neutral') {
      color = '#475569';
      bg = '#f1f5f9';
      border = '#e2e8f0';
    }
    return (
      <span style={{
        fontSize: '0.725rem',
        padding: '0.1rem 0.45rem',
        borderRadius: '4px',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {label} ({Math.round(score * 100)}%)
      </span>
    );
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div>
      {/* Filter and Toolbar Row */}
      <div className="toolbar-section">
        <div className="toolbar-row">
          <div className="filter-pills-wrap">
            <button
              id="filter-pill-all"
              className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Calls <span className="filter-count">{calls.length}</span>
            </button>

            <button
              id="filter-pill-attention"
              className={`filter-pill ${activeFilter === 'attention' ? 'active' : ''}`}
              onClick={() => setActiveFilter('attention')}
            >
              <AlertCircle size={13} color="#dc2626" />
              Needs Attention <span className="filter-count">{calls.filter(c => c.needsAttention).length}</span>
            </button>

            <button
              id="filter-pill-conflicts"
              className={`filter-pill ${activeFilter === 'conflicts' ? 'active' : ''}`}
              onClick={() => setActiveFilter('conflicts')}
            >
              <GitMerge size={13} color="#d97706" />
              Routing Conflicts <span className="filter-count">{calls.filter(c => c.routingStatus === 'Conflict Detected').length}</span>
            </button>

            <button
              id="filter-pill-objections"
              className={`filter-pill ${activeFilter === 'objections' ? 'active' : ''}`}
              onClick={() => setActiveFilter('objections')}
            >
              <ShieldAlert size={13} color="#b45309" />
              Objections <span className="filter-count">{calls.filter(c => c.objections && c.objections.length > 0).length}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Rep Filter */}
            <select
              id="select-filter-rep"
              className="select-box"
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
            >
              <option value="all">All Sales Reps</option>
              {teamReps.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>

            {/* Stage Filter */}
            <select
              id="select-filter-stage"
              className="select-box"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="all">All Deal Stages</option>
              <option value="Discovery">Discovery</option>
              <option value="Technical Validation">Technical Validation</option>
              <option value="Proposal">Proposal</option>
              <option value="Security Review">Security Review</option>
              <option value="Negotiation">Negotiation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="inbox-grid">
        {calls.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '2.5rem',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)'
          }}>
            No conversation records match the current filter criteria.
          </div>
        ) : (
          calls.map((call) => (
            <div
              key={call.id}
              id={`call-card-${call.id.toLowerCase()}`}
              className={`call-card ${call.needsAttention ? 'attention-required' : ''}`}
              onClick={() => onSelectCall(call)}
            >
              <div>
                <div className="call-card-top">
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {call.id} • {call.accountTier}
                    </span>
                    <h3 className="call-account-title">{call.account}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {call.title}
                    </div>
                  </div>
                  <span className={`call-stage-badge ${getStageClass(call.dealStage)}`}>
                    {call.dealStage}
                  </span>
                </div>

                <div className="call-meta-line">
                  <span style={{ fontWeight: 600, color: 'var(--text-highlight)' }}>{formatCurrency(call.dealValue)}</span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> {call.durationMinutes}m
                  </span>
                  <span>•</span>
                  {getSentimentPill(call.sentimentLabel, call.sentimentScore)}
                </div>

                {call.needsAttention && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '4px',
                    padding: '0.35rem 0.55rem',
                    fontSize: '0.75rem',
                    color: '#991b1b',
                    marginBottom: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <AlertCircle size={13} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 500 }}>{call.attentionReason}</span>
                  </div>
                )}

                <p className="call-summary-preview">
                  {call.summary}
                </p>

                {/* Tags & Badges */}
                <div className="call-tags-row">
                  {call.routingStatus === 'Conflict Detected' ? (
                    <span className="tag-badge tag-conflict">
                      <GitMerge size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      Territory Conflict
                    </span>
                  ) : call.routingStatus === 'Manual Override' ? (
                    <span className="tag-badge" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>
                      <UserCheck size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      Manager Overridden
                    </span>
                  ) : (
                    <span className="tag-badge" style={{ background: '#f8fafc', color: '#475569' }}>
                      Auto-Routed
                    </span>
                  )}

                  {call.competitorsMentioned?.map((comp) => (
                    <span key={comp} className="tag-badge tag-competitor">
                      {comp}
                    </span>
                  ))}

                  {call.objections && call.objections.length > 0 && (
                    <span className="tag-badge tag-objection">
                      {call.objections.length} Objection{call.objections.length > 1 ? 's' : ''}
                    </span>
                  )}

                  {call.manualTags?.map((tag) => (
                    <span key={tag} className="tag-badge" style={{ background: '#f1f5f9', color: '#334155' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Strip */}
              <div className="call-card-bottom">
                <div className="rep-info">
                  <div className="rep-avatar">
                    {call.repAssigned.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="rep-name">{call.repAssigned}</div>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                      {call.contactName}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span className={`health-pill ${getHealthClass(call.dealHealth)}`}>
                    Health: {call.dealHealth}
                  </span>
                  <ChevronRight size={15} color="var(--text-muted)" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
