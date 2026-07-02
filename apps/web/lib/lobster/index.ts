export type {
  BhcDcaRecord,
  DcaExecutionStatus,
  DcaFrequency,
  ExchangeId,
  ExchangeSupportStatus,
  PassportSnapshot,
  ScoreSnapshot,
  VerificationResult,
  VerificationState,
} from "./types";

export {
  collectNormalizedDcaRecords,
  getExchangeAdapter,
  listExchangeConnectors,
} from "./exchange/connector-manager";
export type {
  ExchangeAdapter,
  ExchangeAdapterContext,
  ExchangeAdapterResult,
  ExchangeConnectorProfile,
} from "./exchange/types";
export { verifyDcaRecords } from "./verification/verification-engine";
export { createPassportSnapshot } from "./passport/passport-engine";
export { createScoreSnapshot } from "./score/score-engine";
export type {
  FutureAiClassification,
  FutureAiVerificationInput,
  FutureAiVerificationOutput,
} from "./ai/future-ai-engine";
export { classifyDcaRecordWithFutureAi } from "./ai/future-ai-engine";
