import React from 'react';
import { 
  DollarSign, 
  AlertCircle, 
  HeartPulse, 
  TrendingUp, 
  MessageSquareWarning 
} from 'lucide-react';

export default function MetricsOverview({ calls, activeFilter, setActiveFilter }) {
  const totalValue = calls.reduce((acc, c) => acc + (c.dealValue || 0), 0);
  
  const atRiskCalls = calls.filter(c => c.needsAttention || (c.dealHealth !== undefined && c.dealHealth < 50));
  const atRiskValue = atRiskCalls.reduce((acc, c) => acc + (c.dealValue || 0), 0);

  const avgHealth = calls.length 
    ? Math.round(calls.reduce((acc, c) => acc + (c.dealHealth || 0), 0) / calls.length) 
    : 0;

  const positiveCalls = calls.filter(c => c.sentimentScore >= 0.65).length;
  const positiveRatio = calls.length ? Math.round((positiveCalls / calls.length) * 100) : 0;

  const totalObjections = calls.reduce((acc, c) => acc + (c.objections ? c.objections.length : 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="metrics-grid">
      {/* Total Pipeline */}
      <div 
        id="metric-total-pipeline"
        className={`metric-card ${activeFilter === 'all' ? 'active-metric' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => setActiveFilter('all')}
      >
        <div className="metric-header">
          <span className="metric-title">Pipeline In Review</span>
          <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <DollarSign size={16} />
          </div>
        </div>
        <div className="metric-value">{formatCurrency(totalValue)}</div>
        <div className="metric-footer">
          <span className="trend-badge trend-up">
            +12% WoW
          </span>
          <span>{calls.length} active opportunities</span>
        </div>
      </div>

      {/* At-Risk Pipeline */}
      <div 
        id="metric-at-risk-pipeline"
        className={`metric-card ${activeFilter === 'attention' ? 'active-metric' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => setActiveFilter(activeFilter === 'attention' ? 'all' : 'attention')}
      >
        <div className="metric-header">
          <span className="metric-title">Pipeline At Risk</span>
          <div className="metric-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <AlertCircle size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#dc2626' }}>{formatCurrency(atRiskValue)}</div>
        <div className="metric-footer">
          <span className="trend-badge trend-down">
            {atRiskCalls.length} deals flagged
          </span>
          <span>Requires manager review</span>
        </div>
      </div>

      {/* Portfolio Health */}
      <div 
        id="metric-deal-health"
        className="metric-card"
      >
        <div className="metric-header">
          <span className="metric-title">Avg Deal Health</span>
          <div className="metric-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
            <HeartPulse size={16} />
          </div>
        </div>
        <div className="metric-value">{avgHealth} / 100</div>
        <div className="metric-footer">
          <span className="trend-badge trend-up">
            Healthy
          </span>
          <span>Based on activity velocity</span>
        </div>
      </div>

      {/* Call Sentiment */}
      <div 
        id="metric-sentiment-ratio"
        className="metric-card"
      >
        <div className="metric-header">
          <span className="metric-title">Positive Sentiment</span>
          <div className="metric-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <TrendingUp size={16} />
          </div>
        </div>
        <div className="metric-value">{positiveRatio}%</div>
        <div className="metric-footer">
          <span className="trend-badge trend-neutral">
            Target 70%+
          </span>
          <span>Natural language rating</span>
        </div>
      </div>

      {/* Objections */}
      <div 
        id="metric-unresolved-objections"
        className={`metric-card ${activeFilter === 'objections' ? 'active-metric' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => setActiveFilter(activeFilter === 'objections' ? 'all' : 'objections')}
      >
        <div className="metric-header">
          <span className="metric-title">Active Objections</span>
          <div className="metric-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <MessageSquareWarning size={16} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#b45309' }}>{totalObjections}</div>
        <div className="metric-footer">
          <span className="trend-badge trend-down">
            Pricing & SecOps
          </span>
          <span>Blockers to resolve</span>
        </div>
      </div>
    </div>
  );
}
