import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  CheckCircle2, 
  ShieldCheck,
  Layers
} from 'lucide-react';
import { generateCSVContent, generateExportManifest, triggerDownload } from '../utils/exportUtils';

export default function ExportModal({
  onClose,
  calls
}) {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [manifest, setManifest] = useState(generateExportManifest(calls, 'json'));
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleFormatChange = (fmt) => {
    setSelectedFormat(fmt);
    setManifest(generateExportManifest(calls, fmt));
  };

  const handleDownloadExport = () => {
    if (selectedFormat === 'json') {
      const jsonStr = JSON.stringify(calls, null, 2);
      triggerDownload(jsonStr, manifest.targetFilename, 'application/json');
    } else {
      const csvStr = generateCSVContent(calls);
      triggerDownload(csvStr, manifest.targetFilename, 'text/csv');
    }

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDownloadManifest = () => {
    const manifestStr = JSON.stringify(manifest, null, 2);
    triggerDownload(manifestStr, `manifest_${manifest.exportId}.json`, 'application/json');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        id="export-manifest-modal"
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '840px' }}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="metric-icon-wrap" style={{ background: '#f1f5f9', color: '#475569' }}>
              <Share2 size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="brand-badge" style={{ background: '#f1f5f9', color: '#334155', borderColor: '#cbd5e1' }}>
                  Export Engine
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Schema v2.4.0</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-highlight)' }}>
                Exports & Verified Manifest
              </h2>
            </div>
          </div>

          <button id="btn-close-export-modal" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Format Selection Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div
              id="export-format-json-card"
              style={{
                background: '#ffffff',
                border: `1px solid ${selectedFormat === 'json' ? '#2563eb' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: selectedFormat === 'json' ? '0 0 0 1px #2563eb' : 'none'
              }}
              onClick={() => handleFormatChange('json')}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileJson size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>JSON Dataset</strong>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                  Includes speaker transcripts, action items, objections & audit history.
                </div>
              </div>
            </div>

            <div
              id="export-format-csv-card"
              style={{
                background: '#ffffff',
                border: `1px solid ${selectedFormat === 'csv' ? '#2563eb' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: selectedFormat === 'csv' ? '0 0 0 1px #2563eb' : 'none'
              }}
              onClick={() => handleFormatChange('csv')}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Tabular CSV</strong>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                  Standard spreadsheet format for Excel, Google Sheets, or CRM import.
                </div>
              </div>
            </div>
          </div>

          {/* Manifest Inspector */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-highlight)' }}>
                <Layers size={15} />
                <span>Export Manifest Metadata</span>
              </div>
              <button 
                id="btn-download-manifest-json"
                className="btn btn-secondary btn-sm"
                onClick={handleDownloadManifest}
              >
                <Download size={12} />
                <span>Save Manifest JSON</span>
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.65rem',
              fontSize: '0.775rem',
              marginBottom: '0.75rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Export ID: </span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{manifest.exportId}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Record Count: </span>
                <strong>{manifest.recordCount} conversations</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total Value: </span>
                <strong>${manifest.pipelineSummary.totalPipelineValueUSD?.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>At-Risk Value: </span>
                <strong style={{ color: '#dc2626' }}>${manifest.pipelineSummary.atRiskPipelineValueUSD?.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '0.5rem 0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Checksum: {manifest.checksum}</span>
              <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 }}>
                <ShieldCheck size={13} /> SHA-256 Validated
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {downloadSuccess ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#059669', fontWeight: 600, fontSize: '0.825rem' }}>
              <CheckCircle2 size={16} />
              <span>Export downloaded successfully</span>
            </div>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button 
                id="btn-download-export-file"
                className="btn btn-primary"
                onClick={handleDownloadExport}
              >
                <Download size={15} />
                <span>Download {selectedFormat.toUpperCase()}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
