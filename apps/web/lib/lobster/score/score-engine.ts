import type { BhcDcaRecord, ScoreSnapshot } from "../types";

export function createScoreSnapshot(records: BhcDcaRecord[]): ScoreSnapshot {
  const verificationCount = records.filter((record) => record.verificationState === "verified").length;

  return {
    verificationCount,
    consistencyScore: 0,
    disciplineScore: 0,
    bhcPoints: 0,
    level: verificationCount > 0 ? "L1 Explorer" : "L0",
    futureBadges: [],
  };
}
