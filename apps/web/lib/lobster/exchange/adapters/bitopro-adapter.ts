import { forbiddenExchangePermissions, readOnlyRequiredPermissions } from "../permissions";
import type { ExchangeAdapter } from "../types";

export const BitoAdapter: ExchangeAdapter = {
  profile: {
    id: "bitopro",
    name: "BitoPro",
    supportStatus: "current",
    supportedRecordTypes: ["spot_order_history", "recurring_buy_history"],
    requiredPermissions: readOnlyRequiredPermissions,
    forbiddenPermissions: forbiddenExchangePermissions,
  },
  async normalizeDcaRecords() {
    return {
      exchange: "bitopro",
      records: [],
      warnings: ["BitoAdapter is architecture-only. Real API integration is not implemented in BH-ARCH-001."],
    };
  },
};
