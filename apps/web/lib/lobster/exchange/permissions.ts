import type { ExchangeConnectorProfile } from "./types";

export const readOnlyRequiredPermissions: ExchangeConnectorProfile["requiredPermissions"] = [
  "read_order_history",
  "read_recurring_buy_history",
];

export const forbiddenExchangePermissions: ExchangeConnectorProfile["forbiddenPermissions"] = [
  "trading",
  "withdrawal",
  "transfer",
  "futures",
  "margin",
  "account_management",
];
