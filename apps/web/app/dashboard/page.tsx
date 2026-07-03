"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Award,
  Bell,
  Bitcoin,
  CalendarClock,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Coins,
  Eye,
  Gauge,
  Home,
  Info,
  Landmark,
  Mail,
  Menu,
  Plus,
  BookOpen,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { PublicLanguageSwitcher } from "../components/public-language";
import type { BinanceDcaAssetSummary, BinanceDcaSyncState } from "../../lib/lobster/client-sync-store";
import { groupBinanceDcaRecordsByAsset, loadBinanceDcaSyncState } from "../../lib/lobster/client-sync-store";

type View = "dashboard" | "alerts" | "aave" | "dca" | "settings";
type Modal = "price" | "reminder" | null;
type NavItem = {
  id: View;
  label: string;
  icon: typeof Home;
  badge?: number;
};
type DcaReminder = {
  id: string;
  sourceExchange: "binance";
  sourceAsset: string;
  type: "dca_funding_check";
  title: string;
  reminderDate: string;
  reminderTime: string;
  amount: string;
  quoteCurrency: string;
  estimatedNextDcaTime: string | null;
  status: "active";
  createdAt: string;
  updatedAt: string;
};
type AlertItem = {
  type: "Aave" | "BTC" | "ETH" | "DCA" | "System";
  title: string;
  detail: string;
  time: string;
  tone: "warning" | "notice" | "info" | "success";
  unread: boolean;
  source?: string;
  relatedView?: View;
};
type MarketAsset = {
  price: number;
  change24h: number | null;
  lastUpdatedAt: number;
};
type MarketData = {
  bitcoin: MarketAsset;
  ethereum: MarketAsset;
};
type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  isRabby?: boolean;
  providers?: Eip1193Provider[];
};
type WalletOption = {
  id: string;
  name: "Rabby" | "MetaMask";
  icon?: string;
  provider: Eip1193Provider;
};
type AaveAssetPosition = {
  symbol: "ETH" | "weETH" | "cbBTC" | "USDC";
  supplied: number;
  borrowed: number;
  suppliedUsd: number;
  borrowedUsd: number;
  supplyApy: number;
  borrowApy: number;
};
type AavePosition = {
  address: string;
  network: "Base";
  market: "Aave V3";
  hasPosition: boolean;
  totalSuppliedUsd: string;
  totalBorrowedUsd: string;
  availableBorrowUsd: string;
  netApy: number;
  healthFactor: string | null;
  hasDebt: boolean;
  assets: AaveAssetPosition[];
  checkedAt: string;
};
type AaveMonitorState = {
  data: AavePosition | null;
  loading: boolean;
  refreshing: boolean;
  error: string;
  cooldownSeconds: number;
  refresh: (initial?: boolean) => Promise<void>;
};

const COINGECKO_SIMPLE_PRICE_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true";
const DCA_REMINDERS_STORAGE_KEY = "baby-hippo-dca-reminders";
const BASE_RPC_URL = "https://mainnet.base.org";
const AAVE_V3_BASE_POOL = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";
const AAVE_V3_BASE_ORACLE = "0x2Cc0Fc26eD4563A5ce5e8bdcfe1A2878676Ae156";
const GET_USER_ACCOUNT_DATA_SELECTOR = "bf92857c";
const GET_RESERVE_DATA_SELECTOR = "35ea6a75";
const GET_ASSET_PRICE_SELECTOR = "b3596f07";
const BALANCE_OF_SELECTOR = "70a08231";
const RAY = 1e27;
const AAVE_BASE_ASSETS = [
  {
    symbol: "ETH" as const,
    underlying: "0x4200000000000000000000000000000000000006",
    aToken: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7",
    variableDebtToken: "0x24e6e0795b3c7c71D965fCc4f371803d1c1DcA1E",
    decimals: 18,
  },
  {
    symbol: "weETH" as const,
    underlying: "0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A",
    aToken: "0x7C307e128efA31F540F2E2d976C995E0B65F51F6",
    variableDebtToken: "0x8D2e3F1f4b38AA9f1ceD22ac06019c7561B03901",
    decimals: 18,
  },
  {
    symbol: "cbBTC" as const,
    underlying: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
    aToken: "0xBdb9300b7CDE636d9cD4AFF00f6F009fFBBc8EE6",
    variableDebtToken: "0x05e08702028de6AaD395DC6478b554a56920b9AD",
    decimals: 8,
  },
  {
    symbol: "USDC" as const,
    underlying: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    aToken: "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB",
    variableDebtToken: "0x59dca05b6c26dbd64b5381374aAaC5CD05644C28",
    decimals: 6,
  },
];

const nav: NavItem[] = [
  { id: "dashboard" as View, label: "Dashboard", icon: Home },
  { id: "alerts" as View, label: "Alerts", icon: Bell },
  { id: "aave" as View, label: "Aave", icon: Gauge },
  { id: "dca" as View, label: "DCA", icon: CalendarClock },
  { id: "settings" as View, label: "Settings", icon: Settings },
];

const alerts: AlertItem[] = [];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async (showInitialLoading = false) => {
    if (showInitialLoading) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await fetch(COINGECKO_SIMPLE_PRICE_URL, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`CoinGecko returned ${response.status}`);
      }

      const result = (await response.json()) as {
        bitcoin?: { usd?: number; usd_24h_change?: number | null; last_updated_at?: number };
        ethereum?: { usd?: number; usd_24h_change?: number | null; last_updated_at?: number };
      };

      if (
        typeof result.bitcoin?.usd !== "number" ||
        typeof result.ethereum?.usd !== "number" ||
        typeof result.bitcoin.last_updated_at !== "number" ||
        typeof result.ethereum.last_updated_at !== "number"
      ) {
        throw new Error("CoinGecko returned incomplete market data");
      }

      setData({
        bitcoin: {
          price: result.bitcoin.usd,
          change24h:
            typeof result.bitcoin.usd_24h_change === "number"
              ? result.bitcoin.usd_24h_change
              : null,
          lastUpdatedAt: result.bitcoin.last_updated_at,
        },
        ethereum: {
          price: result.ethereum.usd,
          change24h:
            typeof result.ethereum.usd_24h_change === "number"
              ? result.ethereum.usd_24h_change
              : null,
          lastUpdatedAt: result.ethereum.last_updated_at,
        },
      });
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Live market data is temporarily unavailable",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh(true);
    const timer = window.setInterval(() => void refresh(false), 60_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return { data, loading, refreshing, error, refresh };
}

function useWalletConnection() {
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [address, setAddress] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Eip1193Provider | null>(null);
  const [connecting, setConnecting] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const discovered = new Map<string, WalletOption>();
    let fallbackTimer = 0;

    const publish = () => setWallets(Array.from(discovered.values()));
    const addProvider = (
      id: string,
      name: string,
      provider: Eip1193Provider,
      icon?: string,
    ) => {
      const normalizedName = `${name}`.toLowerCase();
      const walletName =
        provider.isRabby || normalizedName.includes("rabby")
          ? "Rabby"
          : provider.isMetaMask || normalizedName.includes("metamask")
            ? "MetaMask"
            : null;
      if (!walletName) return;
      discovered.set(walletName, { id, name: walletName, icon, provider });
      publish();
      void provider
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          const connectedAccounts = Array.isArray(accounts) ? (accounts as string[]) : [];
          if (!connectedAccounts[0]) return;
          setAddress((currentAddress) => {
            if (currentAddress) return currentAddress;
            setSelectedWallet(walletName);
            setSelectedProvider(provider);
            return connectedAccounts[0];
          });
        })
        .catch(() => {
          // Discovery stays silent when the wallet has not authorized this site.
        });
    };

    const announce = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          info: { uuid: string; name: string; icon?: string; rdns?: string };
          provider: Eip1193Provider;
        }>
      ).detail;
      if (detail?.provider && detail?.info) {
        addProvider(
          detail.info.uuid || detail.info.rdns || detail.info.name,
          `${detail.info.name} ${detail.info.rdns || ""}`,
          detail.provider,
          detail.info.icon,
        );
      }
    };

    window.addEventListener("eip6963:announceProvider", announce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    fallbackTimer = window.setTimeout(() => {
      const injected = (window as Window & { ethereum?: Eip1193Provider }).ethereum;
      const providers = injected?.providers?.length ? injected.providers : injected ? [injected] : [];
      providers.forEach((provider, index) => {
        if (provider.isRabby) addProvider(`rabby-fallback-${index}`, "Rabby", provider);
        if (provider.isMetaMask) addProvider(`metamask-fallback-${index}`, "MetaMask", provider);
      });
    }, 250);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("eip6963:announceProvider", announce);
    };
  }, []);

  useEffect(() => {
    if (!selectedProvider) return;
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? (args[0] as string[]) : [];
      setAddress(accounts[0] || "");
      if (!accounts[0]) setSelectedWallet("");
    };
    selectedProvider.on?.("accountsChanged", handleAccountsChanged);
    return () => selectedProvider.removeListener?.("accountsChanged", handleAccountsChanged);
  }, [selectedProvider]);

  const connect = useCallback(async (wallet: WalletOption) => {
    setConnecting(wallet.id);
    setError("");
    try {
      const accounts = (await wallet.provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (!Array.isArray(accounts) || !accounts[0]) {
        throw new Error("The wallet did not share an account.");
      }
      setAddress(accounts[0]);
      setSelectedWallet(wallet.name);
      setSelectedProvider(wallet.provider);
      return true;
    } catch (connectionError) {
      setError(
        connectionError instanceof Error
          ? connectionError.message
          : "Wallet connection was not completed.",
      );
      return false;
    } finally {
      setConnecting("");
    }
  }, []);

  const disconnect = () => {
    setAddress("");
    setSelectedWallet("");
    setSelectedProvider(null);
    setError("");
  };

  return {
    wallets,
    address,
    selectedWallet,
    connecting,
    error,
    connect,
    disconnect,
  };
}

function useAavePosition(address: string) {
  const [data, setData] = useState<AavePosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const refresh = useCallback(
    async (initial = false) => {
      if (!address) return;
      if (!initial && Date.now() < cooldownUntil) return;
      if (initial || !data) setLoading(true);
      else setRefreshing(true);
      if (!initial) {
        setCooldownUntil(Date.now() + 30_000);
        setCooldownSeconds(30);
      }
      try {
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
          throw new Error("The connected wallet returned an invalid address.");
        }
        console.debug("[Lobster Watch] Starting Aave monitor", {
          walletAddress: address,
          network: "Base",
          chainId: 8453,
          market: "Aave V3",
          pool: AAVE_V3_BASE_POOL,
        });
        const encodedAddress = encodeAddress(address);
        const accountResult = await readBaseContract(
          "account",
          AAVE_V3_BASE_POOL,
          `0x${GET_USER_ACCOUNT_DATA_SELECTOR}${encodedAddress}`,
        );
        const words = decodeWords(accountResult, 6);
        const totalSupplied = words[0];
        const totalBorrowed = words[1];
        const availableBorrow = words[2];
        const healthFactor = words[5];
        const hasPosition = totalSupplied > BigInt(0) || totalBorrowed > BigInt(0);
        const hasDebt = totalBorrowed > BigInt(0);

        if (!hasPosition) {
          setData({
            address,
            network: "Base",
            market: "Aave V3",
            hasPosition: false,
            totalSuppliedUsd: "0",
            totalBorrowedUsd: "0",
            availableBorrowUsd: "0",
            netApy: 0,
            healthFactor: null,
            hasDebt: false,
            assets: [],
            checkedAt: new Date().toISOString(),
          });
          setError("");
          return;
        }

        const calls = AAVE_BASE_ASSETS.flatMap((asset) => [
            {
              id: `${asset.symbol}-supply`,
              to: asset.aToken,
              data: `0x${BALANCE_OF_SELECTOR}${encodedAddress}`,
            },
            {
              id: `${asset.symbol}-borrow`,
              to: asset.variableDebtToken,
              data: `0x${BALANCE_OF_SELECTOR}${encodedAddress}`,
            },
            {
              id: `${asset.symbol}-reserve`,
              to: AAVE_V3_BASE_POOL,
              data: `0x${GET_RESERVE_DATA_SELECTOR}${encodeAddress(asset.underlying)}`,
            },
            {
              id: `${asset.symbol}-price`,
              to: AAVE_V3_BASE_ORACLE,
              data: `0x${GET_ASSET_PRICE_SELECTOR}${encodeAddress(asset.underlying)}`,
            },
          ]);
        const results = [
          ...(await readBaseContracts(calls.slice(0, 8))),
          ...(await readBaseContracts(calls.slice(8))),
        ];
        const resultMap = new Map(results);
        const readResult = (id: string) => {
          const result = resultMap.get(id);
          if (!result) throw new Error(`Base RPC did not return ${id}.`);
          return result;
        };
        const assets = AAVE_BASE_ASSETS.map((asset) => {
          const supplied = Number(
            formatBigIntUnits(decodeUint(readResult(`${asset.symbol}-supply`)), asset.decimals),
          );
          const borrowed = Number(
            formatBigIntUnits(decodeUint(readResult(`${asset.symbol}-borrow`)), asset.decimals),
          );
          const reserveWords = decodeWords(readResult(`${asset.symbol}-reserve`), 5);
          const price = Number(
            formatBigIntUnits(decodeUint(readResult(`${asset.symbol}-price`)), 8),
          );
          return {
            symbol: asset.symbol,
            supplied,
            borrowed,
            suppliedUsd: supplied * price,
            borrowedUsd: borrowed * price,
            supplyApy: rayToApy(reserveWords[2]),
            borrowApy: rayToApy(reserveWords[4]),
          };
        });
        const supportedSuppliedUsd = assets.reduce((sum, asset) => sum + asset.suppliedUsd, 0);
        const annualSupply = assets.reduce(
          (sum, asset) => sum + asset.suppliedUsd * (asset.supplyApy / 100),
          0,
        );
        const annualBorrow = assets.reduce(
          (sum, asset) => sum + asset.borrowedUsd * (asset.borrowApy / 100),
          0,
        );
        const netApy =
          supportedSuppliedUsd > 0
            ? ((annualSupply - annualBorrow) / supportedSuppliedUsd) * 100
            : 0;

        setData({
          address,
          network: "Base",
          market: "Aave V3",
          hasPosition,
          totalSuppliedUsd: formatBigIntUnits(totalSupplied, 8),
          totalBorrowedUsd: formatBigIntUnits(totalBorrowed, 8),
          availableBorrowUsd: formatBigIntUnits(availableBorrow, 8),
          netApy,
          healthFactor: hasDebt ? formatBigIntUnits(healthFactor, 18) : null,
          hasDebt,
          assets,
          checkedAt: new Date().toISOString(),
        });
        setError("");
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Aave monitoring is temporarily unavailable.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [address, cooldownUntil, data],
  );

  useEffect(() => {
    if (!address) {
      setData(null);
      setError("");
      setCooldownUntil(0);
      setCooldownSeconds(0);
      return;
    }
    setData(null);
    setError("");
    setLoading(false);
    setRefreshing(false);
    setCooldownUntil(0);
    setCooldownSeconds(0);
  }, [address]);

  useEffect(() => {
    if (!cooldownUntil) return;
    const updateCooldown = () => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownSeconds(remaining);
      if (remaining === 0) setCooldownUntil(0);
    };
    updateCooldown();
    const timer = window.setInterval(updateCooldown, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  return { data, loading, refreshing, error, cooldownSeconds, refresh };
}

async function readBaseContract(id: string, to: string, data: string) {
  const response = await fetch(BASE_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id,
      method: "eth_call",
      params: [{ to, data }, "latest"],
    }),
  });
  const body = (await readRpcBody(response)) as
    | { id?: string; result?: string; error?: { code?: number; message?: string } }
    | { id?: string; result?: string; error?: { code?: number; message?: string } }[];
  const rpcResponse = Array.isArray(body) ? body[0] : body;

  console.debug("[Lobster Watch] Aave V3 Base RPC response", {
    call: id,
    httpStatus: response.status,
    responseShape: Array.isArray(body) ? "array" : "object",
    hasResult: Boolean(rpcResponse?.result),
    rpcError: rpcResponse?.error ?? null,
  });

  if (response.status === 429) {
    throw new Error("Base RPC is busy. Please wait and try again.");
  }
  if (!response.ok) {
    throw new Error(`Base RPC HTTP error ${response.status}.`);
  }
  if (rpcResponse?.error) {
    throw new Error(
      `Base RPC error${rpcResponse.error.code ? ` ${rpcResponse.error.code}` : ""}: ${
        rpcResponse.error.message || "Unknown RPC error"
      }`,
    );
  }
  if (!rpcResponse?.result) {
    throw new Error(`Base RPC returned no result for ${id}.`);
  }
  return rpcResponse.result;
}

async function readBaseContracts(
  calls: { id: string; to: string; data: string }[],
): Promise<readonly (readonly [string, string])[]> {
  if (calls.length === 0) return [];
  const response = await fetch(BASE_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      calls.map((call) => ({
        jsonrpc: "2.0",
        id: call.id,
        method: "eth_call",
        params: [{ to: call.to, data: call.data }, "latest"],
      })),
    ),
  });
  const body = await readRpcBody(response);

  console.debug("[Lobster Watch] Aave V3 Base batch response", {
    calls: calls.map((call) => call.id),
    httpStatus: response.status,
    responseShape: Array.isArray(body) ? "array" : "object",
  });

  if (response.status === 429) {
    throw new Error("Base RPC is busy. Please wait and try again.");
  }
  if (!response.ok) {
    throw new Error(`Base RPC HTTP error ${response.status}.`);
  }
  if (!Array.isArray(body)) {
    const rpcError = body as { error?: { code?: number; message?: string } };
    throw new Error(
      rpcError.error?.message
        ? `Base RPC error: ${rpcError.error.message}`
        : "Base RPC returned an unexpected response.",
    );
  }
  const byId = new Map(body.map((item) => [String(item.id), item]));
  return calls.map((call) => {
    const item = byId.get(call.id);
    if (item?.error) throw new Error(`Base RPC error: ${item.error.message || call.id}`);
    if (!item?.result) throw new Error(`Base RPC returned no result for ${call.id}.`);
    return [call.id, item.result] as const;
  });
}

async function readRpcBody(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as
      | { id?: string; result?: string; error?: { code?: number; message?: string } }
      | { id?: string; result?: string; error?: { code?: number; message?: string } }[];
  } catch {
    return {};
  }
}

function encodeAddress(address: string) {
  return address.slice(2).toLowerCase().padStart(64, "0");
}

function decodeWords(hex: string, minimumWords = 1) {
  const body = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (body.length < 64 * minimumWords) throw new Error("Aave returned incomplete data.");
  return Array.from({ length: Math.floor(body.length / 64) }, (_, index) =>
    BigInt(`0x${body.slice(index * 64, (index + 1) * 64)}`),
  );
}

function decodeUint(hex: string) {
  return decodeWords(hex, 1)[0];
}

function rayToApy(rate: bigint) {
  const apr = Number(rate) / RAY;
  return (Math.exp(apr) - 1) * 100;
}

function formatBigIntUnits(value: bigint, decimals: number) {
  const padded = value.toString().padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const fraction = padded.slice(-decimals).replace(/0+$/, "");
  return `${whole}${fraction ? `.${fraction}` : ""}`;
}

function useTaipeiDate() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    if (!now) {
      return {
        heading: "Today · Asia/Taipei",
        month: "",
        day: "",
      };
    }

    return {
      heading: new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Taipei",
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(now),
      month: new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Taipei",
        month: "short",
      }).format(now).toUpperCase(),
      day: new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Taipei",
        day: "numeric",
      }).format(now),
    };
  }, [now]);
}

function createReminderAlerts(reminders: DcaReminder[], language: "zh-TW" | "en"): AlertItem[] {
  return reminders.map((reminder) => ({
    type: "DCA",
    title: language === "zh-TW" ? reminder.title : `${reminder.sourceAsset} DCA funding check`,
    detail: language === "zh-TW"
      ? `提醒時間：${formatSavedReminderDate(reminder, language)} · 預估定投：${formatMaybeDate(reminder.estimatedNextDcaTime, language)} · 預估金額：${reminder.amount || "0"} ${reminder.quoteCurrency}`
      : `Reminder time: ${formatSavedReminderDate(reminder, language)} · Estimated DCA: ${formatMaybeDate(reminder.estimatedNextDcaTime, language)} · Estimated amount: ${reminder.amount || "0"} ${reminder.quoteCurrency}`,
    time: formatRelativeReminderTime(reminder.createdAt, language),
    tone: "info",
    unread: reminder.status === "active",
    source: "Lobster DCA Manager",
    relatedView: "dca",
  }));
}

function formatRelativeReminderTime(value: string, language: "zh-TW" | "en") {
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return language === "zh-TW" ? "剛剛" : "Just now";
  const minutes = Math.max(0, Math.floor((Date.now() - time) / 60_000));
  if (minutes < 1) return language === "zh-TW" ? "剛剛" : "Just now";
  if (minutes < 60) return language === "zh-TW" ? `${minutes} 分鐘前` : `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return language === "zh-TW" ? `${hours} 小時前` : `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return language === "zh-TW" ? `${days} 天前` : `${days} days ago`;
}

export default function LobsterWatchPrototype() {
  const [view, setView] = useState<View>("dashboard");
  const [modal, setModal] = useState<Modal>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [alertFilter, setAlertFilter] = useState("All");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [quietEnabled, setQuietEnabled] = useState(true);
  const [language, setLanguage] = useState<"zh-TW" | "en">("zh-TW");
  const [walletModal, setWalletModal] = useState(false);
  const [dcaReminders, setDcaReminders] = useState<DcaReminder[]>([]);
  const [binanceDcaSync, setBinanceDcaSync] = useState<BinanceDcaSyncState | null>(null);
  const wallet = useWalletConnection();
  const aave = useAavePosition(wallet.address);

  useEffect(() => {
    const readLanguage = () => {
      setLanguage(window.localStorage.getItem("baby-hippo-language") === "en" ? "en" : "zh-TW");
    };
    const onLanguage = (event: Event) => {
      const next = (event as CustomEvent<"zh-TW" | "en">).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    readLanguage();
    window.addEventListener("baby-hippo-language-change", onLanguage);
    window.addEventListener("storage", readLanguage);
    return () => {
      window.removeEventListener("baby-hippo-language-change", onLanguage);
      window.removeEventListener("storage", readLanguage);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DCA_REMINDERS_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setDcaReminders(parsed.filter((item) => item && typeof item.sourceAsset === "string"));
      }
    } catch {
      setDcaReminders([]);
    }
  }, []);

  useEffect(() => {
    const readBinanceSync = () => setBinanceDcaSync(loadBinanceDcaSyncState());
    const onSync = (event: Event) => {
      setBinanceDcaSync((event as CustomEvent<BinanceDcaSyncState>).detail || loadBinanceDcaSyncState());
    };
    readBinanceSync();
    window.addEventListener("baby-hippo-binance-dca-sync", onSync);
    window.addEventListener("storage", readBinanceSync);
    return () => {
      window.removeEventListener("baby-hippo-binance-dca-sync", onSync);
      window.removeEventListener("storage", readBinanceSync);
    };
  }, []);

  const chooseLanguage = (next: "zh-TW" | "en") => {
    window.localStorage.setItem("baby-hippo-language", next);
    setLanguage(next);
    window.dispatchEvent(new CustomEvent("baby-hippo-language-change", { detail: next }));
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const addDcaReminder = (input: Omit<DcaReminder, "id" | "createdAt" | "updatedAt" | "status">) => {
    const now = new Date().toISOString();
    const reminder: DcaReminder = {
      ...input,
      id: `dca-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    const next = [reminder, ...dcaReminders];
    setDcaReminders(next);
    window.localStorage.setItem(DCA_REMINDERS_STORAGE_KEY, JSON.stringify(next));
  };

  const createFundingReminder = (asset: BinanceDcaAssetSummary) => {
    let reminderDate = asset.estimatedNextCheckTime ? new Date(asset.estimatedNextCheckTime).toISOString().slice(0, 10) : "";
    let reminderTime = asset.estimatedNextCheckTime ? new Date(asset.estimatedNextCheckTime).toTimeString().slice(0, 5) : "";
    if (!reminderDate) {
      const fallbackDate = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
      reminderDate = window.prompt(language === "zh-TW" ? "無法可靠推估下次定投時間，請輸入提醒日期（YYYY-MM-DD）" : "Next DCA time cannot be estimated reliably. Enter reminder date (YYYY-MM-DD).", fallbackDate) || "";
      if (!reminderDate) return;
    }
    if (!reminderTime) {
      reminderTime = window.prompt(language === "zh-TW" ? "請輸入提醒時間（HH:mm）" : "Enter reminder time (HH:mm).", "19:00") || "";
      if (!reminderTime) return;
    }
    addDcaReminder({
      sourceExchange: "binance",
      sourceAsset: asset.asset,
      type: "dca_funding_check",
      title: `${asset.asset} 定投資金檢查`,
      reminderDate,
      reminderTime,
      amount: asset.usualAmount || asset.totalAmount.toFixed(2),
      quoteCurrency: asset.quoteCurrency || "USDT",
      estimatedNextDcaTime: asset.estimatedNextDcaTime,
    });
    showToast(language === "zh-TW" ? `${asset.asset} 定投資金檢查已建立。` : `${asset.asset} funding check reminder created.`);
  };

  const go = (next: View) => {
    setView(next);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredAlerts = useMemo(
    () => {
      const reminderAlerts = createReminderAlerts(dcaReminders, language);
      const allAlerts = [...reminderAlerts, ...alerts];
      return alertFilter === "All"
        ? allAlerts
        : allAlerts.filter((alert) => alert.type === alertFilter);
    },
    [alertFilter, dcaReminders, language],
  );

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <button className="sidebar-close" onClick={() => setMobileNav(false)}>
          <X size={20} />
        </button>
        <Link className="back-to-baby-hippo" href="/">
          <ArrowLeft size={16} />
          Return to Baby Hippo
        </Link>
        <Brand />
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${view === item.id ? "active" : ""}`}
                onClick={() => go(item.id)}
              >
                <Icon size={19} strokeWidth={2} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <div className="sidebar-language">
            <PublicLanguageSwitcher />
          </div>
          <div className="system-state">
            <span className="live-dot" />
            <div>
              <strong>All systems calm</strong>
              <span>Local reminders stay on this device</span>
            </div>
          </div>
          <div className="read-only-chip">
            <Eye size={14} />
            Read-only prototype
          </div>
        </div>
      </aside>

      {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} />}

      <section className="page">
        <header className="mobile-header">
          <div className="mobile-brand-stack">
            <Link className="mobile-home-link" href="/">
              <ArrowLeft size={15} />
              Return Home
            </Link>
            <Brand compact />
          </div>
          <button className="icon-button" onClick={() => setMobileNav(true)} aria-label="Open menu">
            <Menu size={21} />
          </button>
        </header>

        <Breadcrumb view={view} />

        {view === "dashboard" && (
          <Dashboard
            onPrice={() => setModal("price")}
            onNavigate={go}
            onToast={showToast}
            walletAddress={wallet.address}
            walletName={wallet.selectedWallet}
            onConnectWallet={() => setWalletModal(true)}
            onDisconnectWallet={wallet.disconnect}
            aave={aave}
          />
        )}
        {view === "alerts" && (
          <AlertCenter
            filter={alertFilter}
            onFilter={setAlertFilter}
            alerts={filteredAlerts}
            language={language}
            onNavigate={go}
            onToast={showToast}
          />
        )}
        {view === "aave" && (
          <AavePage
            onToast={showToast}
            walletAddress={wallet.address}
            walletName={wallet.selectedWallet}
            onConnectWallet={() => setWalletModal(true)}
            onDisconnectWallet={wallet.disconnect}
            aave={aave}
          />
        )}
        {view === "dca" && (
          <RealDcaPage
            language={language}
            reminders={dcaReminders}
            binanceSync={binanceDcaSync}
            onCreateFundingReminder={createFundingReminder}
            onNew={() => setModal("reminder")}
            onToast={showToast}
          />
        )}
        {view === "settings" && (
          <SettingsPage
            language={language}
            onLanguage={chooseLanguage}
            emailEnabled={emailEnabled}
            quietEnabled={quietEnabled}
            onEmail={() => setEmailEnabled((value) => !value)}
            onQuiet={() => setQuietEnabled((value) => !value)}
            onToast={showToast}
          />
        )}
      </section>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => go(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge && <i>{item.badge}</i>}
            </button>
          );
        })}
      </nav>

      {modal === "price" && (
        <PriceAlertModal
          language={language}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null);
            showToast(language === "zh-TW" ? "價格提醒已建立。" : "Price alert added.");
          }}
        />
      )}
      {modal === "reminder" && (
        <ReminderModal
          language={language}
          onClose={() => setModal(null)}
          onSave={(reminder) => {
            addDcaReminder(reminder);
            setModal(null);
            showToast(language === "zh-TW" ? "提醒已建立。" : "Reminder created.");
          }}
        />
      )}
      {walletModal && (
        <WalletModal
          wallets={wallet.wallets}
          connecting={wallet.connecting}
          error={wallet.error}
          onClose={() => setWalletModal(false)}
          onConnect={async (option) => {
            const connected = await wallet.connect(option);
            if (connected) {
              setWalletModal(false);
              showToast(`${option.name} connected read-only.`);
            }
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
    </main>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand ${compact ? "compact" : ""}`} href="/" aria-label="Return to Baby Hippo homepage">
      <div className="brand-mark" aria-hidden="true">
        <span className="hippo-ear left" />
        <span className="hippo-ear right" />
        <span className="hippo-eye left" />
        <span className="hippo-eye right" />
        <span className="hippo-nose left" />
        <span className="hippo-nose right" />
      </div>
      <div>
        <strong>Lobster Watch</strong>
        {!compact && <span>by Baby Hippo</span>}
      </div>
    </Link>
  );
}

function Breadcrumb({ view }: { view: View }) {
  const current = {
    dashboard: "Dashboard",
    alerts: "Alerts",
    aave: "Aave Monitor",
    dca: "DCA Planner",
    settings: "Settings",
  }[view];

  return (
    <nav className="lobster-breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Baby Hippo</Link>
      <ChevronRight size={13} />
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        Lobster Watch
      </button>
      <ChevronRight size={13} />
      <strong key={view}>{current}</strong>
    </nav>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Dashboard({
  onPrice,
  onNavigate,
  onToast,
  walletAddress,
  walletName,
  onConnectWallet,
  onDisconnectWallet,
  aave,
}: {
  onPrice: () => void;
  onNavigate: (view: View) => void;
  onToast: (message: string) => void;
  walletAddress: string;
  walletName: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  aave: AaveMonitorState;
}) {
  const market = useMarketData();
  const taipeiDate = useTaipeiDate();
  const healthFactor = aave.data?.healthFactor ? Number(aave.data?.healthFactor) : null;
  const needsAaveWarning = healthFactor !== null && healthFactor < 2;

  return (
    <>
      <PageHeader
        eyebrow={taipeiDate.heading}
        title="Welcome back, Boss."
        description="Keep learning, stay disciplined, and let Lobster Watch handle the quiet checks."
        action={
          <div className="header-actions">
            <WalletButton
              address={walletAddress}
              walletName={walletName}
              onConnect={onConnectWallet}
              onDisconnect={onDisconnectWallet}
            />
            <button className="button primary" onClick={onPrice}>
              <Plus size={18} />
              Add price alert
            </button>
          </div>
        }
      />

      <section className="baby-hippo-welcome">
        <div className="mascot-scene" aria-label="Baby Hippo mascot wearing a reflective safety vest">
          <div className="mascot-glow" />
          <div className="mascot-body">
            <span className="mascot-ear left" />
            <span className="mascot-ear right" />
            <span className="mascot-glasses">
              <i />
              <b />
            </span>
            <span className="mascot-snout">
              <i />
              <b />
            </span>
            <span className="mascot-vest">
              <i />
            </span>
          </div>
          <div className="mascot-road">
            <span />
          </div>
        </div>
        <div className="founder-message">
          <span className="eyebrow">A note from Baby Hippo</span>
          <h2>Built for real life.</h2>
          <p>
            Built for truck drivers, teachers, workers and ordinary people
            who want a better future.
          </p>
          <div className="founder-values">
            <span><BookOpen size={14} /> Education first</span>
            <span><ShieldCheck size={14} /> Risk before leverage</span>
            <span><Sprout size={14} /> Grow step by step</span>
          </div>
        </div>
        <div className="founder-signoff">
          <strong>From Worker</strong>
          <span>To On-Chain Boss</span>
        </div>
      </section>

      {needsAaveWarning && (
        <div className="attention-banner danger">
          <div className="attention-icon">
            <CircleAlert size={22} />
          </div>
          <div>
            <span>Aave warning</span>
            <strong>Your Base Health Factor is below 2.00.</strong>
            <p>
              Current Health Factor: {healthFactor?.toFixed(2)} · read-only monitoring
            </p>
          </div>
          <button className="button dark" onClick={() => onNavigate("aave")}>
            Review Aave
            <ChevronRight size={17} />
          </button>
        </div>
      )}

      <section className="community-progress">
        <div className="community-intro">
          <div className="community-icon">
            <Users size={23} />
          </div>
          <div>
            <span className="eyebrow">Community progress</span>
            <h2>From Worker To On-Chain Boss</h2>
            <p>Small, responsible steps are how a community grows.</p>
          </div>
        </div>
        <div className="community-metrics">
          <CommunityMetric value="1,284" label="Community Members" note="Learning together" />
          <CommunityMetric value="6,420" label="Learning Tasks Completed" note="Knowledge compounds" />
          <CommunityMetric value="842" label="DCA Plans Created" note="Discipline in practice" />
        </div>
      </section>

      <div className="dashboard-grid">
        <AssetCard
          asset="BTC"
          name="Bitcoin"
          market={market.data?.bitcoin ?? null}
          loading={market.loading}
          refreshing={market.refreshing}
          error={market.error}
          onRetry={() => void market.refresh(false)}
          accent="orange"
          icon={<Bitcoin size={25} />}
          rules={[
            { label: "Above $70,000", state: "Triggered", tone: "warning" },
            { label: "Below $65,000", state: "Active", tone: "success" },
          ]}
          onAction={onPrice}
        />
        <AssetCard
          asset="ETH"
          name="Ethereum"
          market={market.data?.ethereum ?? null}
          loading={market.loading}
          refreshing={market.refreshing}
          error={market.error}
          onRetry={() => void market.refresh(false)}
          accent="blue"
          icon={<Coins size={25} />}
          rules={[{ label: "Below $3,000", state: "Triggered", tone: "warning" }]}
          onAction={onPrice}
        />
        <AaveCard
          walletAddress={walletAddress}
          aave={aave}
          onClick={() => onNavigate("aave")}
          onConnect={onConnectWallet}
        />
        <DcaCard
          month={taipeiDate.month}
          day={taipeiDate.day}
          onClick={() => onNavigate("dca")}
          onDone={() => onToast("Reminder marked as reviewed.")}
        />
      </div>

      <section className="recent-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Latest signals</span>
            <h2>Recent alerts</h2>
          </div>
          <button className="text-button" onClick={() => onNavigate("alerts")}>
            View all
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="activity-list">
          {alerts.slice(0, 3).map((alert) => (
            <AlertRow key={alert.title} alert={alert} compact />
          ))}
        </div>
      </section>
    </>
  );
}

function CommunityMetric({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note: string;
}) {
  return (
    <div className="community-metric">
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{note}</small>
    </div>
  );
}

function MetricCard({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note: string;
  trend?: "good" | "steady" | "warning";
}) {
  return (
    <div className="community-metric">
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{note}</small>
    </div>
  );
}

function WalletButton({
  address,
  walletName,
  onConnect,
  onDisconnect,
}: {
  address: string;
  walletName: string;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <button className="button wallet-button" disabled title="錢包連接開發中">
      <Clock3 size={17} />
      錢包連接開發中
    </button>
  );
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUsd(value: string | number) {
  const number = Number(value);
  return Number.isFinite(number) ? money.format(number) : "$0";
}

function formatTokenAmount(value: number) {
  if (!Number.isFinite(value) || value === 0) return "0";
  if (value < 0.0001) return "<0.0001";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 1 ? 6 : 4,
  }).format(value);
}

function getHealthState(healthFactor: number | null, hasDebt: boolean) {
  if (!hasDebt || healthFactor === null) {
    return {
      tone: "success",
      label: "No active debt",
      description: "No Health Factor is required without an active borrow.",
    };
  }
  if (healthFactor > 2) {
    return {
      tone: "success",
      label: "Green",
      description: "Health Factor is above 2.0.",
    };
  }
  if (healthFactor >= 1.5) {
    return {
      tone: "warning",
      label: "Yellow",
      description: "Health Factor is between 1.5 and 2.0.",
    };
  }
  return {
    tone: "danger",
    label: "Red",
    description: "Health Factor is below 1.5. Review your position.",
  };
}

function AssetCard({
  asset,
  name,
  market,
  loading,
  refreshing,
  error,
  onRetry,
  accent,
  icon,
  rules,
  onAction,
}: {
  asset: string;
  name: string;
  market: MarketAsset | null;
  loading: boolean;
  refreshing: boolean;
  error: string;
  onRetry: () => void;
  accent: string;
  icon: React.ReactNode;
  rules: { label: string; state: string; tone: string }[];
  onAction: () => void;
}) {
  const updatedLabel = market
    ? new Date(market.lastUpdatedAt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";
  const move =
    market?.change24h == null
      ? "24h unavailable"
      : `${market.change24h >= 0 ? "+" : ""}${market.change24h.toFixed(2)}%`;

  return (
    <article className="card asset-card">
      <div className="card-top">
        <div className={`coin-icon ${accent}`}>{icon}</div>
        <div className={`status-chip ${error ? "warning" : "success"}`}>
          {refreshing ? <RefreshCw className="spin" size={12} /> : <span />}
          {error ? "API issue" : refreshing ? "Refreshing" : "Live"}
        </div>
      </div>
      <div className="asset-label">
        <h3>{asset} Status</h3>
        <span>{name}</span>
      </div>
      {loading && !market ? (
        <div className="market-loading" aria-label={`Loading live ${asset} price`}>
          <span />
          <i />
          <small>Loading live market data...</small>
        </div>
      ) : market ? (
        <>
          <div className="price-line">
            <strong>{money.format(market.price)}</strong>
            <span
              className={
                market.change24h == null
                  ? "market-neutral"
                  : market.change24h >= 0
                    ? "positive"
                    : "negative"
              }
            >
              {move}
            </span>
          </div>
          <div className="updated">
            <Clock3 size={14} />
            CoinGecko · updated {updatedLabel}
          </div>
          {error && (
            <button className="market-error-inline" onClick={onRetry}>
              <CircleAlert size={13} />
              Refresh failed. Showing last live price.
              <RefreshCw size={12} />
            </button>
          )}
        </>
      ) : (
        <div className="market-error">
          <CircleAlert size={20} />
          <div>
            <strong>Live price unavailable</strong>
            <span>{error || "CoinGecko could not be reached."}</span>
          </div>
          <button onClick={onRetry}>
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}
      <div className="rule-list">
        {rules.map((rule) => (
          <div className="rule" key={rule.label}>
            <div>
              <span className={`rule-dot ${rule.tone}`} />
              {rule.label}
            </div>
            <strong className={rule.tone}>{rule.state}</strong>
          </div>
        ))}
      </div>
      <button className="card-action" onClick={onAction}>
        Manage alerts
        <ChevronRight size={16} />
      </button>
    </article>
  );
}

function LegacyAaveCard({
  walletAddress,
  aave,
  onClick,
  onConnect,
}: {
  walletAddress: string;
  aave: AaveMonitorState;
  onClick: () => void;
  onConnect: () => void;
}) {
  const healthFactor = aave.data?.healthFactor ? Number(aave.data?.healthFactor) : null;
  const health = getHealthState(healthFactor, aave.data?.hasDebt ?? false);

  return (
    <article className="card aave-card">
      <div className="card-top">
        <div className="coin-icon purple">
          <Landmark size={25} />
        </div>
        <div className={`status-chip ${health.tone}`}>
          {aave.refreshing ? <RefreshCw className="spin" size={12} /> : <span />}
          {!walletAddress ? "Not connected" : aave.loading ? "Loading" : health.label}
        </div>
      </div>
      <div className="asset-label">
        <h3>Aave Health Factor</h3>
        <span>Base · Aave V3 · read-only</span>
      </div>
      {!walletAddress ? (
        <div className="aave-connect-empty">
          <ShieldCheck size={22} />
          <strong>Connect a wallet to monitor Base.</strong>
          <span>No signature or transaction will be requested.</span>
          <button className="button secondary" onClick={onConnect}>
            <WalletCards size={16} />
            Connect Wallet
          </button>
        </div>
      ) : aave.loading && !aave.data ? (
        <div className="aave-card-loading">
          <RefreshCw className="spin" size={20} />
          Reading Aave V3 on Base??
        </div>
      ) : aave.error && !aave.data ? (
        <div className="market-error">
          <CircleAlert size={20} />
          <div>
            <strong>Aave data unavailable</strong>
            <span>{aave.error}</span>
          </div>
          <button
            disabled={aave.refreshing || aave.cooldownSeconds > 0}
            onClick={() => void aave.refresh(false)}
          >
            {aave.cooldownSeconds > 0 ? `Wait ${aave.cooldownSeconds}s` : "Retry"}
          </button>
        </div>
      ) : aave.data && !aave.data?.hasPosition ? (
        <div className="aave-connect-empty">
          <ShieldCheck size={22} />
          <strong>No Aave position found on Base</strong>
          <span>{shortAddress(walletAddress)} has no supplied or borrowed balance in Aave V3 Base.</span>
          <button className="button secondary" onClick={onClick}>
            View Base monitor
          </button>
        </div>
      ) : aave.data ? (
        <>
          <div className={`health-value ${health.tone}`}>
            <strong>{healthFactor?.toFixed(2) ?? "--"}</strong>
            <span>{health.description}</span>
          </div>
          <div className="aave-mini-totals">
            <Fact label="Supplied" value={formatUsd(aave.data?.totalSuppliedUsd ?? 0)} />
            <Fact label="Borrowed" value={formatUsd(aave.data?.totalBorrowedUsd ?? 0)} />
          </div>
          <div className="updated">
            <WalletCards size={14} />
            {shortAddress(walletAddress)} · checked{" "}
            {new Date(aave.data?.checkedAt ?? Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <button className="card-action" onClick={onClick}>
            View position details
            <ChevronRight size={16} />
          </button>
        </>
      ) : (
        <div className="aave-connect-empty">
          <Activity size={22} />
          <strong>Ready to check Aave V3 Base.</strong>
          <span>One manual check only. Lobster Watch will not refresh in the background.</span>
          <button
            className="button secondary"
            disabled={aave.refreshing || aave.cooldownSeconds > 0}
            onClick={() => void aave.refresh(false)}
          >
            <RefreshCw className={aave.refreshing ? "spin" : ""} size={16} />
            {aave.cooldownSeconds > 0
              ? `Refresh available in ${aave.cooldownSeconds}s`
              : "Refresh Aave Data"}
          </button>
        </div>
      )}
    </article>
  );
}

function AaveCard({
  onClick,
}: {
  walletAddress: string;
  aave: AaveMonitorState;
  onClick: () => void;
  onConnect: () => void;
}) {
  return (
    <article className="card aave-card">
      <div className="card-top">
        <div className="coin-icon purple"><Landmark size={25} /></div>
        <div className="status-chip neutral"><Clock3 size={12} /> Coming soon</div>
      </div>
      <div className="asset-label">
        <h3>Borrow health monitor</h3>
        <span>Aave · Ether.fi · Base · Ethereum</span>
      </div>
      <div className="aave-connect-empty">
        <ShieldCheck size={22} />
        <strong>Not open yet</strong>
        <span>Connect your wallet when monitoring opens.</span>
      </div>
      <button className="card-action" onClick={onClick}>
        View roadmap
        <ChevronRight size={16} />
      </button>
    </article>
  );
}

function DcaCard({
  month,
  day,
  onClick,
  onDone,
}: {
  month: string;
  day: string;
  onClick: () => void;
  onDone: () => void;
}) {
  return (
    <article className="card dca-card">
      <div className="card-top">
        <div className="coin-icon green">
          <CalendarClock size={25} />
        </div>
        <div className="status-chip neutral">Today</div>
      </div>
      <div className="asset-label">
        <h3>Next DCA Reminder</h3>
        <span>Monthly planning check-in</span>
      </div>
      <div className="dca-main">
        <div className="date-tile">
          <span>{month || "--"}</span>
          <strong>{day || "--"}</strong>
        </div>
        <div>
          <strong>Open Lobster DCA Manager</strong>
          <span>Use Binance synced records</span>
          <small>No auto-buy. No trading.</small>
        </div>
      </div>
      <div className="dca-actions">
        <button className="button soft" onClick={onDone}>
          <Check size={16} />
          Reviewed
        </button>
        <button className="button ghost" onClick={onClick}>
          View plan
        </button>
      </div>
      <p className="calm-note">No purchase happens automatically.</p>
    </article>
  );
}

function AlertCenter({
  filter,
  onFilter,
  alerts: visibleAlerts,
  language,
  onNavigate,
  onToast,
}: {
  filter: string;
  onFilter: (filter: string) => void;
  alerts: AlertItem[];
  language: "zh-TW" | "en";
  onNavigate: (view: View) => void;
  onToast: (message: string) => void;
}) {
  const [selected, setSelected] = useState<AlertItem | null>(null);
  const isZh = language === "zh-TW";
  const filters = [
    { id: "All", label: isZh ? "全部" : "All" },
    { id: "DCA", label: isZh ? "我的定投" : "My DCA" },
    { id: "Aave", label: "Aave" },
    { id: "BTC", label: "BTC" },
    { id: "ETH", label: "ETH" },
    { id: "System", label: "System" },
  ];
  const activeAlert = selected && visibleAlerts.some((alert) => alert.title === selected.title) ? selected : visibleAlerts[0] || null;
  return (
    <>
      <PageHeader
        eyebrow="Notification history"
        title="Alert Center"
        description="A calm record of what Lobster Watch noticed and reminded you about."
        action={
          <button className="button secondary" onClick={() => onToast("Reminders reviewed.")}>
            <Check size={17} />
            Mark all read
          </button>
        }
      />
      <div className="filter-row">
        {filters.map((item) => (
          <button
            key={item.id}
            className={filter === item.id ? "active" : ""}
            onClick={() => onFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="alerts-layout">
        <div className="activity-list alert-master">
          {visibleAlerts.map((alert) => (
            <button
              className={`alert-select ${activeAlert?.title === alert.title ? "selected" : ""}`}
              key={alert.title}
              onClick={() => setSelected(alert)}
            >
              <AlertRow alert={alert} />
            </button>
          ))}
          {visibleAlerts.length === 0 && (
            <EmptyState icon={<Bell />} title="No reminders in this group" text="Funding reminders created from Binance synced records will appear here." />
          )}
        </div>
        {activeAlert ? (
          <article className="alert-detail">
            <div className={`detail-icon ${activeAlert.tone}`}>
              {activeAlert.type === "Aave" ? <Gauge /> : activeAlert.type === "DCA" ? <CalendarClock /> : <Bell />}
            </div>
            <span className={`severity ${activeAlert.tone}`}>{activeAlert.tone}</span>
            <h2>{activeAlert.title}</h2>
            <p className="detail-lead">{activeAlert.detail}</p>
            <div className="detail-facts">
              <Fact label="Detected" value={activeAlert.time} />
              <Fact label="Source" value={activeAlert.source || "Lobster Watch"} />
              <Fact label="Delivery" value="In-app only" />
            </div>
            <div className="explanation-box">
              <Info size={18} />
              <div>
                <strong>What this means</strong>
                <p>
                  Lobster does not buy automatically. It only reminds you to check whether Binance funds are ready before the next DCA cycle.
                </p>
              </div>
            </div>
            <button
              className="button primary wide"
              onClick={() => onNavigate(activeAlert.relatedView || (activeAlert.type === "Aave" ? "aave" : activeAlert.type === "DCA" ? "dca" : "dashboard"))}
            >
              Review related page
              <ChevronRight size={17} />
            </button>
          </article>
        ) : (
          <article className="alert-detail">
            <EmptyState icon={<Bell />} title="No reminders yet" text="Create a funding check reminder from Lobster DCA Manager." />
          </article>
        )}
      </div>
    </>
  );
}

function AlertRow({ alert, compact = false }: { alert: AlertItem; compact?: boolean }) {
  return (
    <div className={`alert-row ${compact ? "compact" : ""}`}>
      <div className={`alert-symbol ${alert.tone}`}>
        {alert.type === "Aave" ? <Gauge size={18} /> : alert.type === "DCA" ? <CalendarClock size={18} /> : <Bell size={18} />}
      </div>
      <div className="alert-copy">
        <div>
          {alert.unread && <span className="unread-dot" />}
          <strong>{alert.title}</strong>
        </div>
        <span>{alert.detail}</span>
      </div>
      <time>{alert.time}</time>
      <ChevronRight className="row-chevron" size={17} />
    </div>
  );
}

function AavePage({
  onToast,
  walletAddress,
  walletName,
  onConnectWallet,
  onDisconnectWallet,
  aave,
}: {
  onToast: (message: string) => void;
  walletAddress: string;
  walletName: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  aave: AaveMonitorState;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Lobster Watch Beta"
        title="借貸健康監控"
        description="此功能仍在開發中。Lobster Watch 目前不會連接錢包、不會交易、不會執行借貸操作。"
      />
      <article className="aave-wallet-gate">
        <div className="wallet-gate-icon"><Clock3 size={31} /></div>
        <span className="eyebrow">Coming Soon</span>
        <h2>借貸健康監控尚未開放</h2>
        <p>Lobster Watch is read-only. It will never ask for your seed phrase, private key, or wallet signature in this disabled preview.</p>
        <div className="read-only-promises">
          <span><Check size={14} /> 預計支援 Aave</span>
          <span><Check size={14} /> 預計支援 Ether.fi</span>
          <span><Check size={14} /> Base 與 Ethereum</span>
        </div>
      </article>
      <div className="section-heading">
        <div><span className="eyebrow">未來功能</span><h2>預計支援的借貸監控項目</h2></div>
      </div>
      <div className="dashboard-grid">
        {[
          ["Health Factor", "?亙熒靽"],
          ["Borrow Ratio", "?狡瘥?"],
          ["Net APY", "瘛典僑???"],
          ["Liquidation Alerts", "皜?憸券??"],
        ].map(([title, detail]) => (
          <article className="card" key={title}>
            <div className="card-top">
              <div className="coin-icon green"><Gauge size={22} /></div>
              <div className="status-chip neutral"><span />Coming soon</div>
            </div>
            <div className="asset-label"><h3>{detail}</h3><span>{title}</span></div>
          </article>
        ))}
      </div>
    </>
  );

  const healthFactor = aave.data?.healthFactor ? Number(aave.data?.healthFactor) : null;
  const health = getHealthState(healthFactor, aave.data?.hasDebt ?? false);

  return (
    <>
      <PageHeader
        eyebrow="Read-only Base monitor"
        title="Aave Monitor"
        description="Monitor Aave V3 on Base without signatures, transactions, deposits, or borrowing."
        action={
          <WalletButton
            address={walletAddress}
            walletName={walletName}
            onConnect={onConnectWallet}
            onDisconnect={onDisconnectWallet}
          />
        }
      />
      {!walletAddress ? (
        <article className="aave-wallet-gate">
          <div className="wallet-gate-icon">
            <WalletCards size={31} />
          </div>
          <span className="eyebrow">Start with a public address</span>
          <h2>Connect Rabby or MetaMask</h2>
          <p>
            Lobster Watch will read your public Base Aave position. It will not request a
            signature or create a transaction.
          </p>
          <button className="button primary" onClick={onConnectWallet}>
            <WalletCards size={17} />
            Connect Wallet
          </button>
          <div className="read-only-promises">
            <span><Check size={14} /> No signatures</span>
            <span><Check size={14} /> No transactions</span>
            <span><Check size={14} /> No deposits or borrowing</span>
          </div>
        </article>
      ) : aave.loading && !aave.data ? (
        <article className="aave-wallet-gate loading">
          <RefreshCw className="spin" size={31} />
          <h2>Reading Aave V3 on Base</h2>
          <p>This may take a few seconds.</p>
        </article>
      ) : aave.error && !aave.data ? (
        <article className="aave-wallet-gate error">
          <CircleAlert size={31} />
          <h2>Aave data is unavailable</h2>
          <p>{aave.error}</p>
          <button
            className="button secondary"
            disabled={aave.refreshing || aave.cooldownSeconds > 0}
            onClick={() => void aave.refresh(false)}
          >
            <RefreshCw size={16} />
            {aave.cooldownSeconds > 0 ? `Try again in ${aave.cooldownSeconds}s` : "Refresh Aave Data"}
          </button>
        </article>
      ) : aave.data && !aave.data?.hasPosition ? (
        <article className="aave-wallet-gate empty-position">
          <div className="wallet-gate-icon">
            <ShieldCheck size={31} />
          </div>
          <span className="eyebrow">Base · Aave V3 · read-only</span>
          <h2>No Aave position found on Base</h2>
          <p>
            Wallet {shortAddress(walletAddress)} has no supplied or borrowed balance in the Aave
            V3 Base market. Nothing is wrong, and no wallet action is needed.
          </p>
          <div className="empty-position-address">
            <span>Connected wallet</span>
            <strong>{walletAddress}</strong>
          </div>
          <button
            className="button secondary"
            disabled={aave.refreshing || aave.cooldownSeconds > 0}
            onClick={() => void aave.refresh(false)}
          >
            <RefreshCw className={aave.refreshing ? "spin" : ""} size={16} />
            {aave.cooldownSeconds > 0 ? `Check again in ${aave.cooldownSeconds}s` : "Refresh Aave Data"}
          </button>
          <div className="read-only-promises">
            <span><Check size={14} /> Aave V3 Base</span>
            <span><Check size={14} /> Public data only</span>
            <span><Check size={14} /> Manual refresh only</span>
          </div>
        </article>
      ) : aave.data ? (
        <>
          {aave.error && (
            <article className="aave-critical-warning">
              <CircleAlert size={23} />
              <div>
                <span>Refresh could not be completed</span>
                <strong>{aave.error}</strong>
                <p>The last successfully loaded Aave data remains visible below.</p>
              </div>
            </article>
          )}
          {(healthFactor ?? Number.POSITIVE_INFINITY) < 2 && (
            <article className="aave-critical-warning">
              <CircleAlert size={23} />
              <div>
                <span>Health Factor warning</span>
                <strong>Your Health Factor is below 2.00.</strong>
                <p>
                  A lower Health Factor may mean greater liquidation risk. Lobster Watch is
                  read-only and cannot change your position.
                </p>
              </div>
            </article>
          )}

          <div className="aave-page-grid live">
            <article className={`health-hero ${health.tone}`}>
              <div className="health-hero-top">
                <div>
                  <span>Current Health Factor</span>
                  <strong>{healthFactor?.toFixed(2) ?? "--"}</strong>
                </div>
                <div className={`risk-stamp ${health.tone}`}>
                  <ShieldCheck size={20} />
                  {health.label}
                </div>
              </div>
              <div className="health-color-guide">
                <span className="green">Green <b>&gt; 2.0</b></span>
                <span className="yellow">Yellow <b>1.5??.0</b></span>
                <span className="red">Red <b>&lt; 1.5</b></span>
              </div>
              <div className="freshness">
                <Activity size={16} />
                <span>
                  Last checked{" "}
                  {new Date(aave.data?.checkedAt ?? Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <strong>Base data is current</strong>
              </div>
            </article>

            <article className="position-card live-position">
              <div className="section-heading small">
                <div>
                  <span className="eyebrow">Live read-only position</span>
                  <h2>Base · Aave V3</h2>
                </div>
                <button
                  className="icon-button"
                  disabled={aave.refreshing || aave.cooldownSeconds > 0}
                  onClick={() => {
                    void aave.refresh(false);
                    onToast("Refreshing Base Aave data.");
                  }}
                  aria-label={
                    aave.cooldownSeconds > 0
                      ? `Refresh available in ${aave.cooldownSeconds} seconds`
                      : "Refresh Aave data"
                  }
                >
                  {aave.cooldownSeconds > 0 ? (
                    <span className="cooldown-number">{aave.cooldownSeconds}</span>
                  ) : (
                    <RefreshCw className={aave.refreshing ? "spin" : ""} size={17} />
                  )}
                </button>
              </div>
              <Fact label="Wallet Address" value={walletAddress} />
              <Fact label="Total Supplied" value={formatUsd(aave.data?.totalSuppliedUsd ?? 0)} />
              <Fact label="Total Borrowed" value={formatUsd(aave.data?.totalBorrowedUsd ?? 0)} />
              <Fact label="Available Borrow" value={formatUsd(aave.data?.availableBorrowUsd ?? 0)} />
              <Fact
                label="Net APY"
                value={`${(aave.data?.netApy ?? 0) >= 0 ? "+" : ""}${(aave.data?.netApy ?? 0).toFixed(2)}%`}
              />
              <Fact
                label="Health Factor"
                value={healthFactor?.toFixed(2) ?? "No active borrow"}
              />
            </article>
          </div>

          <section className="aave-assets-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Supported Base positions</span>
                <h2>ETH, weETH, cbBTC and USDC</h2>
              </div>
              <span className="limit-copy">Live · manual refresh only</span>
            </div>
            <div className="aave-assets-grid">
              {aave.data?.assets.map((asset) => (
                <article className="aave-asset-position" key={asset.symbol}>
                  <div className="aave-asset-title">
                    <span>{asset.symbol.slice(0, 1)}</span>
                    <div>
                      <strong>{asset.symbol}</strong>
                      <small>Aave V3 · Base</small>
                    </div>
                  </div>
                  <div className="aave-asset-values">
                    <Fact
                      label="Supplied"
                      value={`${formatTokenAmount(asset.supplied)} ${asset.symbol}`}
                    />
                    <Fact
                      label="Borrowed"
                      value={`${formatTokenAmount(asset.borrowed)} ${asset.symbol}`}
                    />
                    <Fact label="Supply APY" value={`${asset.supplyApy.toFixed(2)}%`} />
                    <Fact label="Borrow APY" value={`${asset.borrowApy.toFixed(2)}%`} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <article className="explain-card aave-explanation">
            <div className="lobster-orbit">
              <ShieldCheck size={28} />
            </div>
            <div>
              <span className="eyebrow">Plain-language guide</span>
              <h2>{health.description}</h2>
              <p>
                This page only reads public Aave V3 data from Base. It cannot deposit, borrow,
                repay, withdraw, approve, or sign anything.
              </p>
            </div>
          </article>
        </>
      ) : (
        <article className="aave-wallet-gate ready">
          <div className="wallet-gate-icon">
            <Activity size={31} />
          </div>
          <span className="eyebrow">Connected wallet · Base chain ID 8453</span>
          <h2>Ready to check Aave V3 Base</h2>
          <p>
            Lobster Watch will make one read-only check for {shortAddress(walletAddress)}. There
            are no automatic refreshes or retry loops.
          </p>
          <div className="empty-position-address">
            <span>Connected wallet</span>
            <strong>{walletAddress}</strong>
          </div>
          <button
            className="button primary"
            disabled={aave.refreshing || aave.cooldownSeconds > 0}
            onClick={() => void aave.refresh(false)}
          >
            <RefreshCw className={aave.refreshing ? "spin" : ""} size={17} />
            {aave.cooldownSeconds > 0
              ? `Refresh available in ${aave.cooldownSeconds}s`
              : "Refresh Aave Data"}
          </button>
          <div className="read-only-promises">
            <span><Check size={14} /> No signatures</span>
            <span><Check size={14} /> No transactions</span>
            <span><Check size={14} /> Manual checks only</span>
          </div>
        </article>
      )}
    </>
  );
}

function RealDcaPage({
  language,
  reminders,
  binanceSync,
  onCreateFundingReminder,
  onNew,
  onToast,
}: {
  language: "zh-TW" | "en";
  reminders: DcaReminder[];
  binanceSync: BinanceDcaSyncState | null;
  onCreateFundingReminder: (asset: BinanceDcaAssetSummary) => void;
  onNew: () => void;
  onToast: (message: string) => void;
}) {
  const isZh = language === "zh-TW";
  const syncedAssets = groupBinanceDcaRecordsByAsset(binanceSync?.records || []);
  const nextReminder = reminders[0];
  return (
    <>
      <PageHeader
        eyebrow={isZh ? "Binance 同步資料，不自動買入" : "Binance synced data, no auto-buy"}
        title={isZh ? "Lobster DCA Manager" : "Lobster DCA Manager"}
        description={isZh ? "DCA Passport 驗證你已經完成的定投紀錄；Lobster DCA Manager 提醒你在下一次定投前檢查資金。" : "DCA Passport verifies completed DCA records. Lobster DCA Manager helps you check funds before the next DCA cycle."}
      />

      <article className="next-reminder">
        <div className="next-icon"><RefreshCw size={27} /></div>
        <div className="next-copy">
          <span>{isZh ? "Binance DCA Manager" : "Binance DCA Manager"}</span>
          <h2>{binanceSync?.records.length ? (isZh ? "已同步 Binance 定投紀錄" : "Binance DCA records synced") : (isZh ? "尚未同步 Binance 定投紀錄。" : "No Binance DCA records synced yet.")}</h2>
          <p>
            {binanceSync?.records.length
              ? `${isZh ? "已同步資產" : "Synced assets"}: ${syncedAssets.map((asset) => asset.asset).join(", ")} · ${isZh ? "最後同步" : "Last sync"}: ${binanceSync.lastSyncTime || "-"}`
              : (isZh ? "請先到成就積分連接 Binance。" : "Please connect Binance from the Points page first.")}
          </p>
        </div>
        <div className="next-actions">
          <Link className="button primary" href="/points">
            <Award size={17} />
            {isZh ? "前往成就積分" : "Open Points"}
          </Link>
        </div>
      </article>

      <div className="summary-grid">
        <MetricCard label={isZh ? "已連接交易所" : "Connected exchange"} value={binanceSync?.connected ? "Binance" : "-"} note={isZh ? "唯讀同步" : "Read-only sync"} trend="steady" />
        <MetricCard label={isZh ? "已同步資產" : "Synced assets"} value={String(syncedAssets.length)} note={syncedAssets.map((asset) => asset.asset).join(", ") || (isZh ? "尚無資料" : "No data")} trend="good" />
        <MetricCard label={isZh ? "已驗證紀錄" : "Verified records"} value={String(binanceSync?.summary.verifiedDcaOrders || 0)} note={isZh ? "來自 Binance records" : "From Binance records"} trend="steady" />
        <MetricCard label={isZh ? "BHC 積分" : "BHC Points"} value={String(binanceSync?.summary.bhcPoints || 0)} note={binanceSync?.summary.currentLevel || "L0"} trend="good" />
      </div>

      <article className="calm-panel">
        <ShieldCheck size={21} />
        <div>
          <strong>{isZh ? "Lobster 不會自動買入。" : "Lobster never buys automatically."}</strong>
          <p>{isZh ? "Lobster 會提醒你在定投日前檢查資金是否足夠。頻率與下一次檢查時間若無法可靠推估，會明確標示為待確認。" : "Lobster reminds you to check whether funds are ready before the next DCA date. If frequency or next check time cannot be inferred reliably, it is clearly marked as unconfirmed."}</p>
        </div>
      </article>

      <div className="section-heading">
        <div>
          <span className="eyebrow">{isZh ? "來自 Binance 的真實紀錄" : "Real Binance synced records"}</span>
          <h2>{isZh ? "即將檢查的 DCA 習慣" : "Upcoming DCA check suggestions"}</h2>
        </div>
        <span className="limit-copy">{isZh ? `${syncedAssets.length} 個資產` : `${syncedAssets.length} assets`}</span>
      </div>
      <div className="reminder-grid">
        {syncedAssets.map((asset) => (
          <BinanceDcaAssetCard
            key={asset.asset}
            language={language}
            asset={asset}
            onCreate={() => onCreateFundingReminder(asset)}
          />
        ))}
        {syncedAssets.length === 0 && (
          <article className="card reminder-card">
            <div className="card-top">
              <div className="coin-icon blue"><RefreshCw size={24} /></div>
              <div className="status-chip"><span />{isZh ? "等待同步" : "Waiting"}</div>
            </div>
            <h3>{isZh ? "尚未同步 Binance 定投紀錄。" : "No Binance DCA records synced yet."}</h3>
            <p className="calm-note">{isZh ? "請先到成就積分連接 Binance。同步後，這裡只會顯示 Binance 回傳的資產紀錄。" : "Connect Binance from the Points page first. After sync, only Binance-returned asset records will appear here."}</p>
          </article>
        )}
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">{isZh ? "本機提醒，只提醒不交易" : "Local reminders, no trading"}</span>
          <h2>{isZh ? "補資金提醒" : "Funding check reminders"}</h2>
        </div>
        <span className="limit-copy">{isZh ? `${reminders.length} 個提醒` : `${reminders.length} reminders`}</span>
      </div>
      <div className="reminder-grid">
        {reminders.map((reminder) => (
          <SavedDcaReminderCard
            key={reminder.id}
            language={language}
            reminder={reminder}
            onEdit={() => onToast(isZh ? `${reminder.sourceAsset} 提醒已選取。` : `${reminder.sourceAsset} reminder selected.`)}
          />
        ))}
        {reminders.length === 0 && (
          <article className="card reminder-card">
            <div className="card-top">
              <div className="coin-icon blue"><CalendarClock size={24} /></div>
              <div className="status-chip"><span />{isZh ? "空白狀態" : "Empty"}</div>
            </div>
            <h3>{isZh ? "尚未建立補資金提醒。" : "No funding check reminders yet."}</h3>
            <p className="calm-note">{isZh ? "請從上方已同步資產建立提醒。這裡不會預設顯示 BTC 或 ETH。" : "Create reminders from synced assets above. BTC or ETH will not appear by default."}</p>
          </article>
        )}
      </div>
    </>
  );
}

function BinanceDcaAssetCard({
  language,
  asset,
  onCreate,
}: {
  language: "zh-TW" | "en";
  asset: BinanceDcaAssetSummary;
  onCreate: () => void;
}) {
  const isZh = language === "zh-TW";
  return (
    <article className="card reminder-card">
      <div className="card-top">
        <div className={`coin-icon ${getSavedReminderAccent(asset.asset)}`}><Coins size={24} /></div>
        <div className="status-chip success"><span />{isZh ? "已同步" : "Synced"}</div>
      </div>
      <h3>{asset.asset} {isZh ? "定投檢查" : "DCA check"}</h3>
      <p className="calm-note">
        {isZh
          ? `已同步 ${asset.verifiedRecords} 筆紀錄。建議提前一天檢查 Binance 餘額是否足夠。`
          : `${asset.verifiedRecords} synced records. Suggested action: check Binance balance one day before the next DCA cycle.`}
      </p>
      <div className="reminder-facts">
        <Fact label={isZh ? "最近一次" : "Latest"} value={formatMaybeDate(asset.latestExecutionTime, language)} />
        <Fact label={isZh ? "累積" : "Total"} value={`${asset.totalAmount.toFixed(2)} ${asset.quoteCurrency}`} />
        <Fact label={isZh ? "頻率" : "Frequency"} value={formatDetectedFrequency(asset.frequency, language)} />
        <Fact label={isZh ? "Lobster 推估下次檢查" : "Estimated next check"} value={asset.estimatedNextCheckTime ? formatMaybeDate(asset.estimatedNextCheckTime, language) : (isZh ? "待確認" : "To confirm")} />
      </div>
      <button className="card-action" onClick={onCreate}>
        {isZh ? "建立補資金提醒" : "Create funding reminder"}
        <ChevronRight size={16} />
      </button>
    </article>
  );
}

function SavedDcaReminderCard({
  language,
  reminder,
  onEdit,
}: {
  language: "zh-TW" | "en";
  reminder: DcaReminder;
  onEdit: () => void;
}) {
  const isZh = language === "zh-TW";
  const accent = getSavedReminderAccent(reminder.sourceAsset);
  return (
    <article className="card reminder-card">
      <div className="card-top">
        <div className={`coin-icon ${accent}`}>{reminder.sourceAsset === "BTC" ? <Bitcoin size={24} /> : <Coins size={24} />}</div>
        <div className="status-chip success"><span />{isZh ? "啟用中" : "Active"}</div>
      </div>
      <h3>{isZh ? reminder.title : `${reminder.sourceAsset} DCA funding check`}</h3>
      <div className="reminder-facts">
        <Fact label={isZh ? "提醒時間" : "Reminder time"} value={formatSavedReminderDate(reminder, language)} />
        <Fact label={isZh ? "預估定投" : "Estimated DCA"} value={formatMaybeDate(reminder.estimatedNextDcaTime, language)} />
        <Fact label={isZh ? "預估金額" : "Estimated amount"} value={`${reminder.amount || "0"} ${reminder.quoteCurrency}`} />
        <Fact label={isZh ? "狀態" : "Status"} value={isZh ? "啟用中" : "Active"} />
      </div>
      <button className="card-action" onClick={onEdit}>
        {isZh ? "查看提醒" : "View reminder"}
        <ChevronRight size={16} />
      </button>
    </article>
  );
}

function formatSavedReminderDate(reminder: DcaReminder, language: "zh-TW" | "en") {
  const date = reminder.reminderDate || new Date().toISOString().slice(0, 10);
  const time = reminder.reminderTime || "19:00";
  try {
    const formattedDate = new Date(`${date}T${time}:00`).toLocaleDateString(language === "zh-TW" ? "zh-TW" : "en-US", {
      month: "short",
      day: "numeric",
    });
    return `${formattedDate} · ${time}`;
  } catch {
    return `${date} · ${time}`;
  }
}

function formatMaybeDate(value: string | null, language: "zh-TW" | "en") {
  if (!value) return language === "zh-TW" ? "待確認" : "To confirm";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return language === "zh-TW" ? "待確認" : "To confirm";
  return date.toLocaleString(language === "zh-TW" ? "zh-TW" : "en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDetectedFrequency(frequency: string, language: "zh-TW" | "en") {
  const zh: Record<string, string> = {
    daily: "每日",
    weekly: "每週",
    biweekly: "每兩週",
    monthly: "每月",
    unknown: "頻率待確認",
  };
  const en: Record<string, string> = {
    daily: "Daily",
    weekly: "Weekly",
    biweekly: "Every 2 weeks",
    monthly: "Monthly",
    unknown: "Frequency to confirm",
  };
  return (language === "zh-TW" ? zh : en)[frequency] || (language === "zh-TW" ? "頻率待確認" : "Frequency to confirm");
}

function getSavedReminderAccent(asset: string) {
  if (asset === "BTC") return "orange";
  if (asset === "ETH" || asset === "LINK") return "blue";
  if (asset === "BNB" || asset === "DOGE") return "yellow";
  if (asset === "SOL" || asset === "HYP") return "purple";
  return "green";
}

function SettingsPage({
  language,
  onLanguage,
  emailEnabled,
  quietEnabled,
  onEmail,
  onQuiet,
  onToast,
}: {
  language: "zh-TW" | "en";
  onLanguage: (language: "zh-TW" | "en") => void;
  emailEnabled: boolean;
  quietEnabled: boolean;
  onEmail: () => void;
  onQuiet: () => void;
  onToast: (message: string) => void;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Your preferences"
        title="Settings"
        description="Control language, time, notifications, and privacy."
      />
      <div className="settings-stack">
        <SettingsSection icon={<Mail />} title="Account">
          <div className="setting-row">
            <div>
              <strong>Email address</strong>
              <span>founder@babyhippo.community</span>
            </div>
            <button className="text-button" onClick={() => onToast("Sign out is disabled in the prototype.")}>Sign out</button>
          </div>
        </SettingsSection>
        <SettingsSection icon={<Clock3 />} title="Language & time">
          <label className="field">
            <span>Language</span>
            <select value={language} onChange={(event) => onLanguage(event.target.value as "zh-TW" | "en")}>
              <option value="zh-TW">繁體中文 🇹🇼</option>
              <option value="en">English 🇺🇸</option>
            </select>
          </label>
          <label className="field">
            <span>Timezone</span>
            <select defaultValue="Asia/Taipei">
              <option>Asia/Taipei</option>
              <option>America/Los_Angeles</option>
              <option>Europe/London</option>
            </select>
          </label>
        </SettingsSection>
        <SettingsSection icon={<Bell />} title="Notifications">
          <Toggle label="Email notifications" detail="Price, Aave, and DCA alerts" enabled={emailEnabled} onClick={onEmail} />
          <Toggle label="Quiet hours" detail="22:00–7:00 · Asia/Taipei" enabled={quietEnabled} onClick={onQuiet} />
          <Toggle label="Urgent Aave bypass" detail="Allow urgent alerts during quiet hours" />
          <button className="button secondary" onClick={() => onToast(language === "zh-TW" ? "測試通知已送出。" : "Test notification sent.")}>
            <Mail size={17} />
            Send test email
          </button>
        </SettingsSection>
        <SettingsSection icon={<ShieldCheck />} title="Safety & privacy">
          <div className="safety-message">
            <ShieldCheck size={22} />
            <div>
              <strong>Lobster Watch is read-only.</strong>
              <span>It will never ask for your seed phrase, private key, or wallet signature.</span>
            </div>
          </div>
        </SettingsSection>
        <div className="settings-save">
          <button className="button primary" onClick={() => onToast(language === "zh-TW" ? "設定已儲存。" : "Settings saved.")}>Save settings</button>
          <button className="button danger" onClick={() => onToast("Account deletion is disabled in the prototype.")}>Delete account</button>
        </div>
      </div>
    </>
  );
}

function SettingsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="settings-section">
      <div className="settings-title">
        {icon}
        <h2>{title}</h2>
      </div>
      <div className="settings-content">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  detail,
  enabled = false,
  onClick,
}: {
  label: string;
  detail: string;
  enabled?: boolean;
  onClick?: () => void;
}) {
  const [local, setLocal] = useState(enabled);
  const active = onClick ? enabled : local;
  return (
    <button
      className="toggle-row"
      onClick={() => {
        if (onClick) onClick();
        else setLocal((value) => !value);
      }}
      type="button"
    >
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <i className={active ? "on" : ""}><b /></i>
    </button>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="empty-state">
      {icon}
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function WalletModal({
  wallets,
  connecting,
  error,
  onClose,
  onConnect,
}: {
  wallets: WalletOption[];
  connecting: string;
  error: string;
  onClose: () => void;
  onConnect: (wallet: WalletOption) => Promise<void>;
}) {
  const walletByName = (name: "Rabby" | "MetaMask") =>
    wallets.find((wallet) => wallet.name === name);

  return (
    <ModalShell
      title="Connect Wallet"
      subtitle="Choose a public address to monitor. Lobster Watch will not request a signature."
      onClose={onClose}
    >
      <div className="wallet-options">
        {(["Rabby", "MetaMask"] as const).map((name) => {
          const wallet = walletByName(name);
          const isConnecting = wallet && connecting === wallet.id;
          return (
            <button
              key={name}
              className="wallet-option"
              disabled={!wallet || Boolean(connecting)}
              onClick={() => wallet && void onConnect(wallet)}
            >
              <span className={`wallet-logo ${name.toLowerCase()}`}>
                {wallet?.icon ? <img src={wallet.icon} alt="" /> : name === "Rabby" ? "R" : "M"}
              </span>
              <span>
                <strong>{name}</strong>
                <small>{wallet ? "Detected in this browser" : "Extension not detected"}</small>
              </span>
              {isConnecting ? (
                <RefreshCw className="spin" size={18} />
              ) : wallet ? (
                <ChevronRight size={18} />
              ) : (
                <span className="not-installed">Not found</span>
              )}
            </button>
          );
        })}
      </div>
      {error && (
        <div className="wallet-error">
          <CircleAlert size={17} />
          {error}
        </div>
      )}
      <div className="wallet-safety">
        <ShieldCheck size={18} />
        <div>
          <strong>Read-only connection</strong>
          <span>No transactions, deposits, borrowing, repayment, or wallet signatures.</span>
        </div>
      </div>
    </ModalShell>
  );
}

function PriceAlertModal({
  language,
  onClose,
  onSave,
}: {
  language: "zh-TW" | "en";
  onClose: () => void;
  onSave: () => void;
}) {
  const [asset, setAsset] = useState("BTC");
  const [direction, setDirection] = useState("Above");
  const [target, setTarget] = useState("72000");
  return (
    <ModalShell title="Add price alert" subtitle="You will receive one calm notification when the rule is crossed." onClose={onClose}>
      <div className="choice-group">
        <span>Asset</span>
        <div>
          {["BTC", "ETH"].map((item) => (
            <button className={asset === item ? "selected" : ""} onClick={() => setAsset(item)} key={item}>{item}</button>
          ))}
        </div>
      </div>
      <div className="choice-group">
        <span>Condition</span>
        <div>
          {["Above", "Below"].map((item) => (
            <button className={direction === item ? "selected" : ""} onClick={() => setDirection(item)} key={item}>{item}</button>
          ))}
        </div>
      </div>
      <label className="field">
        <span>Target price · USD</span>
        <input value={target} onChange={(event) => setTarget(event.target.value)} inputMode="numeric" />
      </label>
      <Toggle label="Email notification" detail="Also send this alert to your inbox" enabled />
      <div className="modal-preview">
        <Bell size={18} />
        {language === "zh-TW"
          ? `${asset} ${direction === "Above" ? "高於" : "低於"} ${money.format(Number(target || 0))} 時提醒我一次。`
          : `Notify me once when ${asset} moves ${direction.toLowerCase()} ${money.format(Number(target || 0))}.`}
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>Cancel</button>
        <button className="button primary" onClick={onSave}>Save alert</button>
      </div>
    </ModalShell>
  );
}

function LegacyReminderModal({
  language,
  onClose,
  onSave,
}: {
  language: "zh-TW" | "en";
  onClose: () => void;
  onSave: () => void;
}) {
  const [asset, setAsset] = useState("BTC");
  return (
    <ModalShell title="New DCA reminder" subtitle="This schedules a review only. It never buys an asset." onClose={onClose}>
      <div className="choice-group">
        <span>Asset</span>
        <div>
          {["BTC", "ETH"].map((item) => (
            <button className={asset === item ? "selected" : ""} onClick={() => setAsset(item)} key={item}>{item}</button>
          ))}
        </div>
      </div>
      <label className="field">
        <span>Frequency</span>
        <select defaultValue="Monthly">
          <option>Weekly</option>
          <option>Every 2 weeks</option>
          <option>Monthly</option>
        </select>
      </label>
      <div className="field-grid">
        <label className="field">
          <span>Date</span>
          <input type="date" defaultValue="2026-07-21" />
        </label>
        <label className="field">
          <span>Time</span>
          <input type="time" defaultValue="19:00" />
        </label>
      </div>
      <label className="field">
        <span>Planning amount · optional</span>
        <input defaultValue="100" inputMode="numeric" />
      </label>
      <div className="modal-preview">
        <CalendarClock size={18} />
        {language === "zh-TW"
          ? `提醒我檢查 ${asset} 計畫，不會自動買入。`
          : `Remind me to review my ${asset} plan. No purchase happens automatically.`}
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>Cancel</button>
        <button className="button primary" onClick={onSave}>Save reminder</button>
      </div>
    </ModalShell>
  );
}

function ReminderModal({
  language,
  onClose,
  onSave,
}: {
  language: "zh-TW" | "en";
  onClose: () => void;
  onSave: (reminder: Omit<DcaReminder, "id" | "createdAt" | "updatedAt" | "status">) => void;
}) {
  const isZh = language === "zh-TW";
  const [asset, setAsset] = useState("BNB");
  const [reminderDate, setReminderDate] = useState(new Date(Date.now() + 86_400_000).toISOString().slice(0, 10));
  const [reminderTime, setReminderTime] = useState("19:00");
  const [amount, setAmount] = useState("100");

  return (
    <ModalShell
      title={isZh ? "建立補資金提醒" : "Create funding check reminder"}
      subtitle={isZh ? "這只會建立本機提醒，不會交易、不會提幣、不會連接交易所。" : "This creates a local reminder only. It never trades, withdraws, or connects to an exchange."}
      onClose={onClose}
    >
      <div className="choice-group">
        <span>{isZh ? "資產" : "Asset"}</span>
        <div>
          {["BNB", "SOL", "BTC", "ETH", "LINK"].map((item) => (
            <button className={asset === item ? "selected" : ""} onClick={() => setAsset(item)} key={item}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="field-grid">
        <label className="field">
          <span>{isZh ? "提醒日期" : "Reminder date"}</span>
          <input type="date" value={reminderDate} onChange={(event) => setReminderDate(event.target.value)} />
        </label>
        <label className="field">
          <span>{isZh ? "提醒時間" : "Reminder time"}</span>
          <input type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} />
        </label>
      </div>
      <label className="field">
        <span>{isZh ? "準備金額（選填）" : "Amount to prepare (optional)"}</span>
        <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" />
      </label>
      <div className="modal-preview">
        <CalendarClock size={18} />
        {isZh ? `提醒我檢查 ${asset} 定投資金是否足夠。` : `Remind me to check whether ${asset} DCA funds are ready.`}
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>{isZh ? "取消" : "Cancel"}</button>
        <button
          className="button primary"
          onClick={() => onSave({
            sourceExchange: "binance",
            sourceAsset: asset,
            type: "dca_funding_check",
            title: `${asset} 定投資金檢查`,
            reminderDate,
            reminderTime,
            amount,
            quoteCurrency: "USDT",
            estimatedNextDcaTime: null,
          })}
        >
          {isZh ? "儲存提醒" : "Save reminder"}
        </button>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}
