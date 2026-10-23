import React, { useState } from 'react';
import { 
  X, 
  GitMerge, 
  CheckCircle2, 
  Scale, 
  AlertCircle
} from 'lucide-react';

export default function RoutingModal({
  onClose,
  call,
  onResolveRouting
}) {
  const [resolutionChoice, setResolutionChoice] = useState('co_ownership');
  const [managerMediationNotes, setManagerMediationNotes] = useState(
    'Dual-credit approved: Marcus Vance maintains deal execution leadership and clinical demo; Elena Rostova manages Nexus Health master procurement and enterprise legal terms. 60/40 commission split.'
  );
  const [isResolved, setIsResolved] = useState(false);

  const handleApplyResolution = () => {
    let assignedRep = 'Marcus Vance';
    let status = 'Manual Override';
    let splitNote = '';

    if (resolutionChoice === 'co_ownership') {
      assignedRep = 'Marcus Vance & Elena Rostova (Co-Owned)';
      splitNote = 'Co-Ownership Split: 60% Marcus / 40% Elena';
    } else if (resolutionChoice === 'marcus_only') {
      assignedRep = 'Marcus Vance';
      splitNote = 'Assigned 100% to Mid-Market Hunter (Marcus Vance)';
    } else if (resolutionChoice === 'elena_only') {
      assignedRep = 'Elena Rostova';
      splitNote = 'Assigned 100% to Enterprise Account Owner (Elena Rostova)';
    }

    if (onResolveRouting && call) {
      const now = new Date().toISOString();
      const updatedCall = {
        ...call,
        repAssigned: assignedRep,
        routingStatus: status,
        needsAttention: false,
        managerNotes: `${managerMediationNotes} [Resolution: ${splitNote}]`,
        auditLog: [
          {
            timestamp: now,
            user: "Alex Mercer (Sales Director)",
            action: `Resolved difficult territory routing conflict: ${splitNote}`
          },
          ...(call.auditLog || [])
        ]
      };
      onResolveRouting(updatedCall);
    }

    setIsResolved(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        id="routing-decision-modal"
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px' }}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="metric-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
              <GitMerge size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="brand-badge" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
                  Routing Conflict
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Case Study #109</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-highlight)' }}>
                Subsidiary Territory Conflict: Apex Bio vs. Nexus Health
              </h2>
            </div>
          </div>

          <button id="btn-close-routing-modal" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Conflict Context */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem'
          }}>
            <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: 'var(--text-highlight)', fontSize: '0.875rem', marginBottom: '2px' }}>
                Why This Requires Human Manager Arbitration
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Apex BioTech was acquired 60 days ago by Nexus Health. <strong>Marcus Vance</strong> (Mid-Market) prospected the lead and ran a successful $275k clinical demo.
                However, <strong>Elena Rostova</strong> holds the Master Agreement for Nexus Health, which requires all subsidiary purchases to route through corporate procurement.
              </p>
            </div>
          </div>

          {/* Rep Claims Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Marcus */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div className="rep-avatar" style={{ background: '#eff6ff', color: '#1e40af' }}>MV</div>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>Marcus Vance</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mid-Market AE (Lead Hunter)</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#1e40af', background: '#eff6ff', padding: '0.1rem 0.4rem', borderRadius: '3px', border: '1px solid #bfdbfe' }}>
                  Originator
                </span>
              </div>
              <ul style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '1rem' }}>
                <li>Originated opportunity via cold outbound campaign.</li>
                <li>Invested 14+ hours in discovery and technical demo with CMIO.</li>
                <li>Reassigning completely would demoralize outbound hunting.</li>
              </ul>
            </div>

            {/* Elena */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div className="rep-avatar" style={{ background: '#f5f3ff', color: '#5b21b6' }}>ER</div>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>Elena Rostova</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Strategic Enterprise Lead</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#5b21b6', background: '#f5f3ff', padding: '0.1rem 0.4rem', borderRadius: '3px', border: '1px solid #ddd6fe' }}>
                  Master MSA Owner
                </span>
              </div>
              <ul style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '1rem' }}>
                <li>Holds Named Account rights for parent Nexus Health Global.</li>
                <li>Prospect confirmed all contracts over $100k require Boston HQ review.</li>
                <li>Prevents conflicting discount terms across corporate entities.</li>
              </ul>
            </div>
          </div>

          {/* Arbitration Decision */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem'
          }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-highlight)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Scale size={15} color="#2563eb" />
              <span>Sales Manager Decision</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: resolutionChoice === 'co_ownership' ? '#eff6ff' : '#ffffff',
                border: `1px solid ${resolutionChoice === 'co_ownership' ? '#bfdbfe' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="resolution"
                  checked={resolutionChoice === 'co_ownership'}
                  onChange={() => setResolutionChoice('co_ownership')}
                  style={{ marginTop: '2px', accentColor: '#2563eb' }}
                />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-highlight)' }}>
                    (Recommended) Dual-Credit Co-Ownership Model (60% Marcus / 40% Elena)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                    Marcus continues driving product demos and user adoption. Elena aligns with the Nexus Health Master MSA. Both reps receive quota credit.
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: resolutionChoice === 'marcus_only' ? '#eff6ff' : '#ffffff',
                border: `1px solid ${resolutionChoice === 'marcus_only' ? '#bfdbfe' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="resolution"
                  checked={resolutionChoice === 'marcus_only'}
                  onChange={() => setResolutionChoice('marcus_only')}
                  style={{ marginTop: '2px', accentColor: '#2563eb' }}
                />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-highlight)' }}>
                    Assign 100% to Marcus Vance
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                    Treat Apex BioTech as an autonomous subsidiary.
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: resolutionChoice === 'elena_only' ? '#eff6ff' : '#ffffff',
                border: `1px solid ${resolutionChoice === 'elena_only' ? '#bfdbfe' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="resolution"
                  checked={resolutionChoice === 'elena_only'}
                  onChange={() => setResolutionChoice('elena_only')}
                  style={{ marginTop: '2px', accentColor: '#2563eb' }}
                />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-highlight)' }}>
                    Reassign 100% to Elena Rostova
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                    Enforce global corporate MSA territory assignment.
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontWeight: 500 }}>
                Audit Note:
              </label>
              <textarea
                rows="2"
                className="select-box"
                style={{ width: '100%', fontSize: '0.775rem' }}
                value={managerMediationNotes}
                onChange={(e) => setManagerMediationNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isResolved ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#059669', fontWeight: 600, fontSize: '0.825rem' }}>
              <CheckCircle2 size={16} />
              <span>Routing Decision Saved & Recorded in Audit Log</span>
            </div>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                id="btn-apply-routing-resolution"
                className="btn btn-primary"
                onClick={handleApplyResolution}
              >
                <CheckCircle2 size={15} />
                <span>Apply Decision</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
