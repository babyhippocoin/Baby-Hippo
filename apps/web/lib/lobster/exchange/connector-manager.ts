import type { BhcDcaRecord, ExchangeId } from "../types";
import { BinanceAdapter } from "./adapters/binance-adapter";
import { BitoAdapter } from "./adapters/bitopro-adapter";
import {
  BitgetAdapter,
  BitunixAdapter,
  BybitAdapter,
  HyperliquidAdapter,
} from "./adapters/future-adapters";
import { OKXAdapter } from "./adapters/okx-adapter";
import type { ExchangeAdapter, ExchangeAdapterContext, ExchangeConnectorProfile } from "./types";

const adapters: Record<ExchangeId, ExchangeAdapter> = {
  binance: BinanceAdapter,
  okx: OKXAdapter,
  bitopro: BitoAdapter,
  bitunix: BitunixAdapter,
  bybit: BybitAdapter,
  bitget: BitgetAdapter,
  hyperliquid: HyperliquidAdapter,
};

export function listExchangeConnectors(): ExchangeConnectorProfile[] {
  return Object.values(adapters).map((adapter) => adapter.profile);
}

export function getExchangeAdapter(exchange: ExchangeId): ExchangeAdapter {
  return adapters[exchange];
}

export async function collectNormalizedDcaRecords(contexts: ExchangeAdapterContext[]): Promise<BhcDcaRecord[]> {
  const results = await Promise.all(
    contexts.map((context) => getExchangeAdapter(context.exchange).normalizeDcaRecords(context)),
  );

  return results.flatMap((result) => result.records);
}
