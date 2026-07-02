import { forbiddenExchangePermissions, readOnlyRequiredPermissions } from "../permissions";
import type { ExchangeAdapter } from "../types";

export const OKXAdapter: ExchangeAdapter = {
  profile: {
    id: "okx",
    name: "OKX",
    supportStatus: "current",
    supportedRecordTypes: ["spot_order_history", "recurring_buy_history"],
    requiredPermissions: readOnlyRequiredPermissions,
    forbiddenPermissions: forbiddenExchangePermissions,
  },
  async normalizeDcaRecords() {
    return {
      exchange: "okx",
      records: [],
      warnings: ["OKXAdapter is architecture-only. Real API integration is not implemented in BH-ARCH-001."],
    };
  },
};
