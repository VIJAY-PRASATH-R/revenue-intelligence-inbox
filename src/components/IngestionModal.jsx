import React, { useState } from 'react';
import { 
  X, 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  FileCode, 
  Zap,
  Lock
} from 'lucide-react';
import { ingestCallsWithDeduplication, testFixtures } from '../utils/deduplication';

export default function IngestionModal({
  onClose,
  calls,
  onBatchUpdate
}) {
  const [ingestionLogs, setIngestionLogs] = useState([]);
  const [lastStats, setLastStats] = useState(null);
  const [activeTestKey, setActiveTestKey] = useState(null);
  const [inspectedCall, setInspectedCall] = useState(calls.find(c => c.id === 'CALL-2026-101') || calls[0]);

  const runTestScenario = (key) => {
    setActiveTestKey(key);
    let payload = [];

    if (key === 'duplicate_unchanged') {
      payload = [testFixtures.duplicateUnchanged];
    } else if (key === 'duplicate_with_update') {
      payload = [testFixtures.duplicateWithUpdate];
    } else if (key === 'new_call') {
      payload = [testFixtures.newCallIngest];
    }

    const { calls: newCalls, stats } = ingestCallsWithDeduplication(calls, payload);
    
    // Update parent state
    onBatchUpdate(newCalls);

    // Save stats & logs
    setLastStats(stats);
    setIngestionLogs(prev => [...stats.logs, ...prev]);

    // Update inspected record
    const updatedTarget = newCalls.find(c => c.id === (payload[0].id || 'CALL-2026-101'));
    if (updatedTarget) {
      setInspectedCall(updatedTarget);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        id="ingestion-dedup-modal"
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '980px' }}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="metric-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Database size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="brand-badge" style={{ background: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
                  Ingestion Engine
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe-Merge & Deduplication</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-highlight)' }}>
                Repeated Imports, Updates & Manual Correction Integrity
              </h2>
            </div>
          </div>

          <button id="btn-close-ingestion-modal" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Explanation Banner */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ color: 'var(--text-highlight)', fontSize: '0.85rem', marginBottom: '2px' }}>
                Zero-Overwrite Guarantee
              </h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                When Zoom or CRM webhooks resend existing calls, RevPulse verifies checksums.
                Incoming updates safely refresh transcripts and metrics while <strong>strictly preserving</strong> manual notes, custom tags, and rep overrides.
              </p>
            </div>
          </div>

          {/* Test Buttons Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {/* Test 1 */}
            <div style={{
              background: '#ffffff',
              border: `1px solid ${activeTestKey === 'duplicate_unchanged' ? '#2563eb' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Test 1
                </div>
                <strong style={{ fontSize: '0.85rem' }}>Identical Duplicate Test</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Re-import Call #101 with identical payload. Verifies idempotency: 0 mutations.
                </p>
              </div>
              <button
                id="btn-run-duplicate-test-1"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.65rem' }}
                onClick={() => runTestScenario('duplicate_unchanged')}
              >
                <RefreshCw size={13} />
                <span>Run Duplicate Test</span>
              </button>
            </div>

            {/* Test 2 */}
            <div style={{
              background: '#ffffff',
              border: `1px solid ${activeTestKey === 'duplicate_with_update' ? '#059669' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Test 2 (Critical)
                </div>
                <strong style={{ fontSize: '0.85rem' }}>Update & Preserve Test</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Import updated Call #101. Proves manager notes & tags remain 100% intact!
                </p>
              </div>
              <button
                id="btn-run-update-test-2"
                className="btn btn-primary btn-sm"
                style={{ marginTop: '0.65rem', background: '#059669' }}
                onClick={() => runTestScenario('duplicate_with_update')}
              >
                <ShieldCheck size={13} />
                <span>Run Update Test</span>
              </button>
            </div>

            {/* Test 3 */}
            <div style={{
              background: '#ffffff',
              border: `1px solid ${activeTestKey === 'new_call' ? '#475569' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Test 3
                </div>
                <strong style={{ fontSize: '0.85rem' }}>New Call Ingest</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Ingest new discovery call for Soylent Corp (CALL-2026-113).
                </p>
              </div>
              <button
                id="btn-run-new-call-test-3"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.65rem' }}
                onClick={() => runTestScenario('new_call')}
              >
                <Zap size={13} color="#475569" />
                <span>Ingest New Call</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          {lastStats && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Processed</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-highlight)' }}>{lastStats.totalProcessed}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exact Duplicates</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#2563eb' }}>{lastStats.exactDuplicates}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Updates Merged</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#d97706' }}>{lastStats.updatesApplied}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Corrections Preserved</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#059669' }}>{lastStats.correctionsPreserved} Protected</div>
              </div>
            </div>
          )}

          {/* Inspector & Log */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Target Record */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem'
            }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-highlight)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={14} color="#059669" />
                <span>Live State: {inspectedCall.account} ({inspectedCall.id})</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.775rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Deal Value: </span>
                  <strong>${inspectedCall.dealValue?.toLocaleString()}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned Rep: </span>
                  <strong>{inspectedCall.repAssigned}</strong>
                </div>

                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '4px',
                  padding: '0.45rem 0.65rem'
                }}>
                  <div style={{ fontSize: '0.675rem', color: '#065f46', fontWeight: 600, marginBottom: '2px' }}>
                    PROTECTED MANAGER NOTES:
                  </div>
                  <div style={{ fontStyle: 'italic', color: '#0f172a' }}>
                    "{inspectedCall.managerNotes || 'No notes currently stored.'}"
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Protected Manual Tags: </span>
                  <div style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                    {inspectedCall.manualTags?.map(tag => (
                      <span key={tag} style={{
                        fontSize: '0.675rem',
                        padding: '0.05rem 0.35rem',
                        borderRadius: '3px',
                        background: '#f1f5f9',
                        color: '#334155',
                        border: '1px solid #cbd5e1'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Last Synced: </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: '#64748b' }}>
                    {inspectedCall.lastSyncedAt || 'Initial seed load'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ingestion Logs */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-highlight)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FileCode size={14} color="#64748b" />
                <span>Ingestion Activity Log</span>
              </h4>

              <div style={{
                flex: 1,
                maxHeight: '190px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem'
              }}>
                {ingestionLogs.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                    Click a test scenario above to execute the pipeline and inspect live deduplication events.
                  </div>
                ) : (
                  ingestionLogs.map((log, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: '4px',
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                        [{log.timestamp.split('T')[1].slice(0, 8)}] • <strong>{log.type}</strong>
                      </div>
                      <div style={{ marginTop: '1px' }}>{log.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
