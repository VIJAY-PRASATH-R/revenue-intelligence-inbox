// Ingestion, Deduplication, and Manual Correction Preservation Engine

/**
 * Computes a pseudo-hash for incoming payloads to verify content idempotency
 */
export function computeMeetingChecksum(call) {
  const str = `${call.id}|${call.title}|${call.account}|${call.durationMinutes}|${call.dealValue}|${call.sentimentScore}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `chk_${Math.abs(hash).toString(16)}`;
}

/**
 * Ingests a batch of incoming calls into existing state with:
 * 1. Exact Duplicate detection (Idempotency)
 * 2. Update merging with strict preservation of manual corrections/overrides
 * 3. Audit log tracking of all deltas
 */
export function ingestCallsWithDeduplication(existingCalls, incomingBatch, options = {}) {
  const user = options.user || "Alex Mercer (Sales Director)";
  const now = new Date().toISOString();
  
  const existingMap = new Map();
  existingCalls.forEach(call => {
    existingMap.set(call.id, { ...call });
    if (call.meetingHash) {
      existingMap.set(call.meetingHash, { ...call });
    }
  });

  const stats = {
    totalProcessed: incomingBatch.length,
    newIngested: 0,
    exactDuplicates: 0,
    updatesApplied: 0,
    correctionsPreserved: 0,
    logs: []
  };

  const updatedCalls = [...existingCalls];

  incomingBatch.forEach(incoming => {
    // Check if call exists by ID or meetingHash
    const existingIndex = updatedCalls.findIndex(
      c => c.id === incoming.id || (incoming.meetingHash && c.meetingHash === incoming.meetingHash)
    );

    if (existingIndex === -1) {
      // BRAND NEW RECORD
      const newCall = {
        ...incoming,
        id: incoming.id || `CALL-2026-${Math.floor(100 + Math.random() * 900)}`,
        lastSyncedAt: now,
        auditLog: [
          ...(incoming.auditLog || []),
          {
            timestamp: now,
            user: "Ingestion Engine",
            action: `New call ingested successfully (${incoming.title})`
          }
        ]
      };
      updatedCalls.unshift(newCall);
      stats.newIngested++;
      stats.logs.push({
        callId: newCall.id,
        type: "NEW_RECORD",
        message: `Successfully ingested new call "${newCall.title}" for ${newCall.account}`,
        timestamp: now
      });
    } else {
      // RECORD ALREADY EXISTS: TEST IDEMPOTENCY VS UPDATE
      const current = updatedCalls[existingIndex];
      const incomingChecksum = computeMeetingChecksum(incoming);
      const currentChecksum = computeMeetingChecksum(current);

      if (incomingChecksum === currentChecksum && !incoming.isForceUpdate) {
        // EXACT DUPLICATE (IDEMPOTENT)
        stats.exactDuplicates++;
        stats.logs.push({
          callId: current.id,
          type: "DUPLICATE_IDENTICAL",
          message: `Identical duplicate detected for ${current.id} (${current.account}). Ingestion skipped, no state mutation.`,
          timestamp: now
        });
        
        // Touch sync timestamp only
        updatedCalls[existingIndex] = {
          ...current,
          lastSyncedAt: now
        };
      } else {
        // UPDATE DETECTED: SMART MERGE WITH MANUAL OVERRIDE PRESERVATION
        stats.updatesApplied++;
        
        // Audit field changes
        const deltas = [];
        if (incoming.sentimentScore !== undefined && incoming.sentimentScore !== current.sentimentScore) {
          deltas.push(`sentiment: ${current.sentimentScore} -> ${incoming.sentimentScore}`);
        }
        if (incoming.dealValue !== undefined && incoming.dealValue !== current.dealValue) {
          deltas.push(`value: $${current.dealValue} -> $${incoming.dealValue}`);
        }
        if (incoming.dealStage !== undefined && incoming.dealStage !== current.dealStage) {
          deltas.push(`stage: ${current.dealStage} -> ${incoming.dealStage}`);
        }

        // PRESERVED MANUAL OVERRIDES:
        // If manager had custom notes, manual tags, or manually assigned rep, preserve them!
        const preservedNotes = current.managerNotes || incoming.managerNotes || "";
        const preservedManualTags = Array.from(new Set([
          ...(current.manualTags || []),
          ...(incoming.manualTags || [])
        ]));
        
        // Check if rep was manually assigned/overridden
        const isRepOverridden = current.isRepOverridden || (current.repAssigned !== incoming.repAssigned && current.routingStatus === "Manual Override");
        const finalRep = isRepOverridden ? current.repAssigned : (incoming.repAssigned || current.repAssigned);

        const preservedCorrectionsCount = (current.managerNotes ? 1 : 0) + (current.manualTags?.length ? 1 : 0) + (isRepOverridden ? 1 : 0);
        stats.correctionsPreserved += preservedCorrectionsCount;

        const auditEntry = {
          timestamp: now,
          user: "Upsert Pipeline (Safe Merge)",
          action: `Merged incoming update. Preserved manager notes & tags. Deltas: [${deltas.join(", ") || "transcript & metrics update"}]`
        };

        const mergedCall = {
          ...current,
          ...incoming,
          // Explicitly protect user corrections
          managerNotes: preservedNotes,
          manualTags: preservedManualTags,
          repAssigned: finalRep,
          isRepOverridden,
          lastSyncedAt: now,
          auditLog: [auditEntry, ...(current.auditLog || [])]
        };

        updatedCalls[existingIndex] = mergedCall;
        stats.logs.push({
          callId: current.id,
          type: "UPDATE_MERGED_PRESERVED",
          message: `Updated ${current.id} (${current.account}). Preserved manager annotations and tags. Deltas applied: ${deltas.length || 1}`,
          timestamp: now
        });
      }
    }
  });

  return {
    calls: updatedCalls,
    stats
  };
}

// Test Fixtures for Live Ingestion Verification
export const testFixtures = {
  // Test 1: Identical re-import of Stark Industries (Should be flagged duplicate, 0 mutations)
  duplicateUnchanged: {
    id: "CALL-2026-101",
    meetingHash: "hash_acme_q3_expansion_101",
    title: "Q3 Enterprise License Expansion Sync",
    account: "Stark Industries",
    dealValue: 320000,
    durationMinutes: 42,
    sentimentScore: 0.82
  },

  // Test 2: Ingestion update for Call #101 with updated transcript & dropped sentiment,
  // showing that manager notes and custom tags ("Executive Sponsor Aligned") are safely retained!
  duplicateWithUpdate: {
    id: "CALL-2026-101",
    meetingHash: "hash_acme_q3_expansion_101",
    title: "Q3 Enterprise License Expansion Sync (Post-Review Re-sync)",
    account: "Stark Industries",
    dealValue: 345000, // Deal value increased
    durationMinutes: 45,
    sentimentScore: 0.89, // Sentiment updated
    sentimentLabel: "Positive",
    summary: "Re-synced with updated billing addendum. Procurement confirmed Stark CFO signed off on Net 60.",
    isForceUpdate: true,
    // Note: Incoming payload does NOT have managerNotes or manualTags — our engine MUST PRESERVE current ones!
    managerNotes: "",
    manualTags: []
  },

  // Test 3: Brand new incoming call for Soylent Corp
  newCallIngest: {
    id: "CALL-2026-113",
    meetingHash: "hash_soylent_corp_pilot_113",
    title: "Global Supply Chain Food Analytics Pilot",
    account: "Soylent Corporation",
    accountTier: "Mid-Market",
    contactName: "Robert Thorn",
    contactRole: "VP of Quality Control",
    contactEmail: "r.thorn@soylent.corp",
    repAssigned: "Marcus Vance",
    dealValue: 165000,
    dealStage: "Discovery",
    callDate: new Date().toISOString(),
    durationMinutes: 32,
    sentimentScore: 0.77,
    sentimentLabel: "Positive",
    dealHealth: 81,
    priority: "Medium",
    needsAttention: false,
    attentionReason: "High-interest discovery call; requires security questionnaire",
    routingStatus: "Auto-Routed",
    routingRule: "Domain match @soylent.corp -> Mid-Market Rep Marcus Vance",
    routingConfidence: 0.95,
    competitorsMentioned: ["HubSpot"],
    objections: [],
    actionItems: [
      { id: "act-new-1", text: "Send standard security packet and SOC2 report", owner: "Marcus Vance", completed: false }
    ],
    summary: "Robert demonstrated high interest in conversation intelligence for auditing nutritional compliance calls. Pilot slated for November.",
    transcript: [
      { time: "00:05", speaker: "Marcus Vance (Rep)", text: "Robert, thanks for joining us to discuss QA transcription workflows." },
      { time: "01:20", speaker: "Robert Thorn (VP)", text: "We need automated keyword alerts whenever compliance questions are raised by partners." }
    ],
    managerNotes: "",
    manualTags: ["Inbound Lead", "FoodTech"],
    auditLog: []
  }
};
