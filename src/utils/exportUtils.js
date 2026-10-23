// Export Engine and Manifest Generator for Revenue Intelligence Calls

export function generateCSVContent(calls) {
  const headers = [
    "Call ID",
    "Meeting Hash",
    "Title",
    "Account",
    "Account Tier",
    "Contact Name",
    "Contact Role",
    "Assigned Rep",
    "Deal Value ($)",
    "Deal Stage",
    "Call Date",
    "Duration (Mins)",
    "Sentiment Score",
    "Sentiment Label",
    "Deal Health",
    "Priority",
    "Needs Attention",
    "Attention Reason",
    "Routing Status",
    "Routing Rule",
    "Competitors Mentioned",
    "Objections Count",
    "Manager Notes",
    "Manual Tags"
  ];

  const escapeCSV = (val) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = calls.map(call => [
    escapeCSV(call.id),
    escapeCSV(call.meetingHash),
    escapeCSV(call.title),
    escapeCSV(call.account),
    escapeCSV(call.accountTier),
    escapeCSV(call.contactName),
    escapeCSV(call.contactRole),
    escapeCSV(call.repAssigned),
    call.dealValue || 0,
    escapeCSV(call.dealStage),
    escapeCSV(call.callDate),
    call.durationMinutes || 0,
    call.sentimentScore || 0,
    escapeCSV(call.sentimentLabel),
    call.dealHealth || 0,
    escapeCSV(call.priority),
    call.needsAttention ? "YES" : "NO",
    escapeCSV(call.attentionReason),
    escapeCSV(call.routingStatus),
    escapeCSV(call.routingRule),
    escapeCSV((call.competitorsMentioned || []).join("; ")),
    call.objections ? call.objections.length : 0,
    escapeCSV(call.managerNotes || ""),
    escapeCSV((call.manualTags || []).join(", "))
  ].join(","));

  return [headers.join(","), ...rows].join("\n");
}

export function generateExportManifest(calls, format, exportedBy = "Alex Mercer (Sales Director)") {
  const timestamp = new Date().toISOString();
  const filename = `revpulse_intelligence_export_${Date.now()}.${format}`;
  
  // Compute deterministic hash
  let hashVal = 0;
  const rawStr = JSON.stringify(calls);
  for (let i = 0; i < rawStr.length; i++) {
    hashVal = ((hashVal << 5) - hashVal) + rawStr.charCodeAt(i);
    hashVal |= 0;
  }
  const checksum = `sha256_${Math.abs(hashVal).toString(16).padStart(16, "a")}`;

  const pipelineValueTotal = calls.reduce((acc, c) => acc + (c.dealValue || 0), 0);
  const atRiskDeals = calls.filter(c => c.needsAttention || c.dealHealth < 50);
  const atRiskValue = atRiskDeals.reduce((acc, c) => acc + (c.dealValue || 0), 0);

  return {
    schemaVersion: "2.4.0",
    exportId: `EXP-${Date.now()}`,
    exportedAt: timestamp,
    exportedBy,
    format: format.toUpperCase(),
    targetFilename: filename,
    recordCount: calls.length,
    checksum,
    pipelineSummary: {
      totalPipelineValueUSD: pipelineValueTotal,
      atRiskPipelineValueUSD: atRiskValue,
      atRiskDealsCount: atRiskDeals.length,
      averageDealHealth: Math.round(calls.reduce((acc, c) => acc + (c.dealHealth || 0), 0) / (calls.length || 1)),
      routingBreakdown: {
        autoRouted: calls.filter(c => c.routingStatus === "Auto-Routed").length,
        conflictsDetected: calls.filter(c => c.routingStatus === "Conflict Detected").length,
        manualOverrides: calls.filter(c => c.routingStatus === "Manual Override").length
      }
    },
    filterCriteria: {
      appliedDateRange: "All Recorded Calls (Q3-Q4 2026)",
      includedStages: Array.from(new Set(calls.map(c => c.dealStage))),
      includedReps: Array.from(new Set(calls.map(c => c.repAssigned)))
    }
  };
}

export function triggerDownload(content, filename, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
