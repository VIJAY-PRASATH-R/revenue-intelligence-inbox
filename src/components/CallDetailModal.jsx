import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  Save, 
  History, 
  ShieldAlert, 
  FileEdit,
  Sparkles
} from 'lucide-react';

export default function CallDetailModal({
  call,
  onClose,
  onUpdateCall,
  teamReps
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(25);
  const [editNotes, setEditNotes] = useState(call.managerNotes || '');
  const [editRep, setEditRep] = useState(call.repAssigned);
  const [editStage, setEditStage] = useState(call.dealStage);
  const [editHealth, setEditHealth] = useState(call.dealHealth);
  const [editAttention, setEditAttention] = useState(call.needsAttention);
  const [newTagInput, setNewTagInput] = useState('');
  const [tags, setTags] = useState(call.manualTags || []);
  const [actionItems, setActionItems] = useState(call.actionItems || []);
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  // Simulated audio playback progress ticker
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress(prev => (prev >= 100 ? 0 : prev + 2));
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleToggleActionItem = (itemId) => {
    const updated = actionItems.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setActionItems(updated);
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveChanges = () => {
    const isRepChanged = editRep !== call.repAssigned;
    const now = new Date().toISOString();

    const newAuditEntries = [];
    if (isRepChanged) {
      newAuditEntries.push({
        timestamp: now,
        user: "Alex Mercer (Sales Director)",
        action: `Manually re-routed rep assignment from ${call.repAssigned} to ${editRep}`
      });
    }
    if (editStage !== call.dealStage) {
      newAuditEntries.push({
        timestamp: now,
        user: "Alex Mercer (Sales Director)",
        action: `Updated deal stage: ${call.dealStage} -> ${editStage}`
      });
    }
    if (editNotes !== (call.managerNotes || '')) {
      newAuditEntries.push({
        timestamp: now,
        user: "Alex Mercer (Sales Director)",
        action: `Updated sales manager coaching notes`
      });
    }

    const updatedCall = {
      ...call,
      repAssigned: editRep,
      dealStage: editStage,
      dealHealth: Number(editHealth),
      needsAttention: editAttention,
      managerNotes: editNotes,
      manualTags: tags,
      actionItems,
      routingStatus: isRepChanged ? 'Manual Override' : call.routingStatus,
      isRepOverridden: isRepChanged || call.isRepOverridden,
      auditLog: [...newAuditEntries, ...(call.auditLog || [])]
    };

    onUpdateCall(updatedCall);
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2500);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        id="call-detail-modal-container"
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '980px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {call.id}
                </span>
                <span className="brand-badge" style={{ background: '#f1f5f9', color: '#334155', borderColor: '#cbd5e1' }}>
                  {call.accountTier}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  • {call.callDate.split('T')[0]} • {call.durationMinutes} Mins
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-highlight)' }}>
                {call.account} — {call.title}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Contact: <strong>{call.contactName}</strong> ({call.contactRole}) • {call.contactEmail}
              </div>
            </div>
          </div>

          <button id="btn-close-detail-modal" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Audio Player */}
          <div className="audio-player-bar">
            <button 
              id="btn-play-pause-audio"
              className="btn btn-primary btn-sm"
              style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '1px' }} />}
            </button>

            <div style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {isPlaying ? '08:42 / 38:00' : '00:00 / 38:00'}
            </div>

            <div className="waveform-visualizer">
              {[14, 24, 18, 12, 26, 22, 10, 20, 28, 14, 22, 26, 8, 18, 28, 14, 20, 24, 12, 16, 28, 20, 12, 24, 22, 14, 26, 18, 12, 24, 20, 14, 22, 12, 24].map((height, idx) => (
                <div 
                  key={idx}
                  className={`wave-bar ${(idx / 35) * 100 <= audioProgress ? 'active' : ''}`}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <Volume2 size={15} />
              <span style={{ fontSize: '0.725rem' }}>1.0x</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Left: Intelligence & Transcript */}
            <div>
              {/* Summary Box */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.825rem' }}>
                  <Sparkles size={15} />
                  <span>Call Summary & Buying Intent</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {call.summary}
                </p>
                <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Route: <strong>{call.routingRule}</strong></span>
                  <span>Confidence: <strong>{Math.round(call.routingConfidence * 100)}%</strong></span>
                </div>
              </div>

              {/* Transcript */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-highlight)', marginBottom: '0.5rem' }}>
                  Conversation Transcript
                </h4>
                <div className="transcript-container">
                  {call.transcript && call.transcript.length > 0 ? (
                    call.transcript.map((line, idx) => (
                      <div key={idx} className="transcript-bubble">
                        <div className="transcript-speaker-row">
                          <span>{line.speaker}</span>
                          <span className="transcript-time">[{line.time}]</span>
                        </div>
                        <div className="transcript-text">
                          "{line.text}"
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
                      Transcription processing...
                    </div>
                  )}
                </div>
              </div>

              {/* Objections */}
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-highlight)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldAlert size={15} color="#dc2626" />
                  <span>Objections & Evidence Quotes</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {call.objections && call.objections.length > 0 ? (
                    call.objections.map((obj, idx) => (
                      <div key={idx} style={{
                        background: '#fff1f2',
                        border: '1px solid #fecdd3',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.65rem',
                        fontSize: '0.775rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <strong style={{ color: '#9f1239' }}>{obj.topic}</strong>
                          <span style={{ 
                            fontSize: '0.675rem', 
                            padding: '0.1rem 0.35rem', 
                            borderRadius: '3px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            fontWeight: 600
                          }}>
                            {obj.severity}
                          </span>
                        </div>
                        <div style={{ fontStyle: 'italic', color: '#475569', marginTop: '2px' }}>
                          "{obj.quote}"
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      No critical objections detected on this recording.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Sales Manager Controls */}
            <div>
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: 'var(--text-highlight)', fontSize: '0.85rem' }}>
                    <FileEdit size={15} />
                    <span>Manager Controls</span>
                  </div>
                  {call.routingStatus === 'Manual Override' && (
                    <span style={{ fontSize: '0.675rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                      Overridden
                    </span>
                  )}
                </div>

                {/* Assigned Rep */}
                <div>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontWeight: 500 }}>
                    Assigned Account Rep
                  </label>
                  <select
                    id="edit-call-rep-select"
                    className="select-box"
                    style={{ width: '100%' }}
                    value={editRep}
                    onChange={(e) => setEditRep(e.target.value)}
                  >
                    {teamReps.map(r => (
                      <option key={r.id} value={r.name}>{r.name} ({r.role})</option>
                    ))}
                  </select>
                </div>

                {/* Stage and Health */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontWeight: 500 }}>
                      Deal Stage
                    </label>
                    <select
                      id="edit-call-stage-select"
                      className="select-box"
                      style={{ width: '100%' }}
                      value={editStage}
                      onChange={(e) => setEditStage(e.target.value)}
                    >
                      <option value="Discovery">Discovery</option>
                      <option value="Technical Validation">Technical Validation</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Security Review">Security Review</option>
                      <option value="Negotiation">Negotiation</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontWeight: 500 }}>
                      Deal Health (0-100)
                    </label>
                    <input
                      id="edit-call-health-input"
                      type="number"
                      min="0"
                      max="100"
                      className="select-box"
                      style={{ width: '100%' }}
                      value={editHealth}
                      onChange={(e) => setEditHealth(e.target.value)}
                    />
                  </div>
                </div>

                {/* Attention Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    id="checkbox-needs-attention"
                    type="checkbox"
                    checked={editAttention}
                    onChange={(e) => setEditAttention(e.target.checked)}
                    style={{ width: '15px', height: '15px', accentColor: '#dc2626' }}
                  />
                  <label htmlFor="checkbox-needs-attention" style={{ fontSize: '0.775rem', color: '#991b1b', fontWeight: 500, cursor: 'pointer' }}>
                    Flag: Needs Attention
                  </label>
                </div>

                {/* Manager Coaching Notes */}
                <div>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontWeight: 500 }}>
                    Manager Coaching Notes (Protected)
                  </label>
                  <textarea
                    id="textarea-manager-notes"
                    rows="3"
                    className="select-box"
                    style={{ width: '100%', resize: 'vertical', fontSize: '0.775rem' }}
                    placeholder="Enter strategic coaching notes..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                </div>

                {/* Custom Tags */}
                <div>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontWeight: 500 }}>
                    Deal Tags
                  </label>
                  <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.45rem' }}>
                    <input
                      id="input-new-tag"
                      type="text"
                      className="select-box"
                      style={{ flex: 1, fontSize: '0.775rem' }}
                      placeholder="Add tag"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    />
                    <button id="btn-add-tag" className="btn btn-secondary btn-sm" onClick={handleAddTag}>
                      Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {tags.map((t) => (
                      <span key={t} style={{
                        fontSize: '0.7rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '3px',
                        background: '#f1f5f9',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        {t}
                        <X size={10} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t)} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Items */}
                <div>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontWeight: 500 }}>
                    Action Items
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {actionItems.map((act) => (
                      <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={act.completed}
                          onChange={() => handleToggleActionItem(act.id)}
                          style={{ accentColor: '#2563eb' }}
                        />
                        <span style={{ textDecoration: act.completed ? 'line-through' : 'none', color: act.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                          {act.text} <span style={{ color: 'var(--text-muted)' }}>({act.owner})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <button 
                  id="btn-save-manager-corrections"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                >
                  <Save size={15} />
                  <span>Save Manager Corrections</span>
                </button>

                {isSavedMessage && (
                  <div style={{ fontSize: '0.725rem', color: '#059669', textAlign: 'center', fontWeight: 500 }}>
                    ✓ Saved and protected against overwrite
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audit History */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1rem'
          }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-highlight)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <History size={14} color="#64748b" />
              <span>Audit Trail</span>
            </h4>
            <div className="audit-timeline">
              {call.auditLog && call.auditLog.length > 0 ? (
                call.auditLog.map((log, idx) => (
                  <div key={idx} className="audit-item">
                    <div className="audit-meta">
                      {log.timestamp} • <strong>{log.user}</strong>
                    </div>
                    <div className="audit-action">
                      {log.action}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Initial record created.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
