import type { BhcDcaRecord } from "../types";

export type FutureAiClassification =
  | "real_dca"
  | "one_time_purchase"
  | "manual_purchase"
  | "repeated_cheating"
  | "abnormal_record"
  | "unknown";

export type FutureAiVerificationInput = {
  record: BhcDcaRecord;
  relatedRecords: BhcDcaRecord[];
};

export type FutureAiVerificationOutput = {
  classification: FutureAiClassification;
  confidence: number;
  reasons: string[];
};

export function classifyDcaRecordWithFutureAi(): FutureAiVerificationOutput {
  return {
    classification: "unknown",
    confidence: 0,
    reasons: ["Future AI Engine placeholder. AI verification is not implemented in BH-ARCH-001."],
  };
}
