import { forbiddenExchangePermissions, readOnlyRequiredPermissions } from "../permissions";
import type { ExchangeAdapter } from "../types";

function createFutureAdapter(id: "bitunix" | "bybit" | "bitget" | "hyperliquid", name: string): ExchangeAdapter {
  return {
    profile: {
      id,
      name,
      supportStatus: "future",
      supportedRecordTypes: ["spot_order_history", "recurring_buy_history"],
      requiredPermissions: readOnlyRequiredPermissions,
      forbiddenPermissions: forbiddenExchangePermissions,
    },
    async normalizeDcaRecords() {
      return {
        exchange: id,
        records: [],
        warnings: [`${name} adapter is reserved for future integration. No API implementation exists in BH-ARCH-001.`],
      };
    },
  };
}

export const BitunixAdapter = createFutureAdapter("bitunix", "Bitunix");
export const BybitAdapter = createFutureAdapter("bybit", "Bybit");
export const BitgetAdapter = createFutureAdapter("bitget", "Bitget");
export const HyperliquidAdapter = createFutureAdapter("hyperliquid", "Hyperliquid");
