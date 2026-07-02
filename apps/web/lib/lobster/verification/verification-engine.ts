import type { BhcDcaRecord, VerificationResult } from "../types";

export function verifyDcaRecords(records: BhcDcaRecord[]): VerificationResult[] {
  return records.map((record) => ({
    recordId: record.id,
    state: record.verificationState,
    reasons: ["Architecture placeholder. Real verification logic is not implemented in BH-ARCH-001."],
    confidence: 0,
  }));
}
