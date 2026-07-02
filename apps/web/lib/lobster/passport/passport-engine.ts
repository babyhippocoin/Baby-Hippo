import type { BhcDcaRecord, ExchangeId, PassportSnapshot } from "../types";

export function createPassportSnapshot(records: BhcDcaRecord[]): PassportSnapshot {
  const connectedExchanges = Array.from(new Set(records.map((record) => record.exchange))) as ExchangeId[];
  const verifiedRecords = records.filter((record) => record.verificationState === "verified");

  return {
    connectedExchanges,
    verifiedOrderCount: verifiedRecords.length,
    currentStreakWeeks: 0,
    verifiedAmount: "0",
    quoteCurrency: "USDT",
    currentLevel: "L0",
    currentScore: 0,
  };
}
