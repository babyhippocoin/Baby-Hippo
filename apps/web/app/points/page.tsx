"use client";

import {
  ArrowDown,
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bot,
  CheckCircle2,
  LockKeyhole,
  PlugZap,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicHeader } from "../components/public-header";

type Language = "zh-TW" | "en";
type Localized = { zh: string; en: string };
type ExchangeId = "binance" | "okx" | "bitopro";
type ExchangeConnector = {
  id: ExchangeId;
  name: string;
  priority: number;
  logo: string;
  description: Localized;
  enabled: boolean;
};
type BinanceSummary = {
  connectedExchanges: number;
  verifiedDcaOrders: number;
  currentStreak: number;
  verifiedAmount: string;
  bhcPoints: number;
  currentLevel: string;
};
type SyncResponse = {
  connected: boolean;
  exchange: "binance";
  records?: SyncedDcaRecord[];
  summary?: BinanceSummary;
  message?: string;
  error?: string;
  warnings?: string[];
};
type SyncedDcaRecord = {
  id: string;
  exchange: "binance";
  asset: string;
  amount: string;
  quoteCurrency: string;
  frequency: string;
  executedAt: string;
  status: string;
  source: string;
  verificationState: string;
};
type AssetPassportRow = {
  asset: string;
  records: number;
  amountUsdt: string;
  lastSync: string;
};

const LANGUAGE_KEY = "baby-hippo-language";
const l = (zh: string, en: string): Localized => ({ zh, en });

const exchanges: ExchangeConnector[] = [
  {
    id: "binance",
    name: "Binance",
    priority: 1,
    logo: "B",
    enabled: true,
    description: l("V1 第一個真實唯讀連接。同步 recurring buy、auto-invest 與支援資產的現貨買入紀錄。", "The first real V1 read-only connector. Syncs recurring buy, auto-invest, and supported spot buy history."),
  },
  {
    id: "okx",
    name: "OKX",
    priority: 2,
    logo: "O",
    enabled: false,
    description: l("下一階段支援。此任務不實作 OKX。", "Next phase support. OKX is not implemented in this task."),
  },
  {
    id: "bitopro",
    name: "BitoPro",
    priority: 3,
    logo: "P",
    enabled: false,
    description: l("台灣入金路線的未來支援。此任務不實作 BitoPro。", "Future support for the Taiwan on-ramp path. BitoPro is not implemented in this task."),
  },
];

const futureExchanges = ["Bitunix", "Bybit", "Bitget", "Hyperliquid"];

const safetyBadges = [
  l("只讀取定投與訂單紀錄", "Only reads DCA and order records"),
  l("不會交易", "No trading"),
  l("不會提幣", "No withdrawals"),
  l("不會轉帳", "No transfers"),
];

const connectSteps = [
  l("登入 Binance", "Log in to Binance"),
  l("建立 Binance 唯讀 API", "Create a Binance read-only API"),
  l("Lobster 讀取 DCA / recurring buy / 訂單紀錄", "Lobster reads DCA / recurring buy / order history"),
  l("Lobster 定投護照自動更新", "Lobster DCA Passport updates automatically"),
];

const flow = [
  l("連接交易所", "Connect Exchange"),
  l("安全連接（唯讀）", "Safe read-only connection"),
  l("同步定投紀錄", "Sync DCA Records"),
  l("定投護照預覽", "DCA Passport preview"),
  l("BHC 積分 / 等級預覽", "BHC Points / Level preview"),
];

const detectedFields = [
  l("資產", "Asset"),
  l("金額", "Amount"),
  l("頻率", "Frequency"),
  l("執行時間", "Execution time"),
  l("執行狀態", "Execution status"),
  l("交易所", "Exchange"),
  l("Recurring Buy / Auto-Invest / Spot Order", "Recurring Buy / Auto-Invest / Spot Order"),
];

const scorePreview = [
  l("1 筆候選定投紀錄 = +10 BHC 積分", "1 verified candidate DCA record = +10 BHC Points"),
  l("同資產 4 筆以上 = streak candidate", "4+ records in the same asset = streak candidate"),
  l("L0 = 0 records", "L0 = 0 records"),
  l("L1 = 1-3 records", "L1 = 1-3 records"),
  l("L2 = 4-11 records", "L2 = 4-11 records"),
  l("L3/L4 = 12+ records", "L3/L4 = 12+ records"),
];

const architecture = [
  {
    title: l("Exchange Connector", "Exchange Connector"),
    body: l("Binance 連接只在 server route 執行，UI 只接收標準化紀錄。", "Binance connection runs only in server routes. The UI only receives normalized records."),
  },
  {
    title: l("Binance Adapter", "Binance Adapter"),
    body: l("測試連接、讀取紀錄，並轉成統一 BhcDcaRecord。", "Tests connection, fetches records, and normalizes everything into BhcDcaRecord."),
  },
  {
    title: l("Score Engine", "Score Engine"),
    body: l("暫時計分：候選定投紀錄每筆 +10 BHC 積分。", "Temporary scoring: each candidate DCA record grants +10 BHC Points."),
  },
  {
    title: l("Future AI Engine", "Future AI Engine"),
    body: l("未來辨識真實定投、單次買入、異常紀錄與重複作弊。", "Future AI can detect real DCA, one-time buys, abnormal records, and repeated cheating."),
  },
];

const copy = {
  "zh-TW": {
    eyebrow: "BHC Verified Growth",
    title: "Lobster 定投護照",
    lead: "BHC 不驗證你擁有哪個交易所帳號。BHC 驗證的是你是否長期、穩定、真實地執行 DCA。",
    principle: "Connect once → Verify forever。Binance V1 使用安全連接（唯讀）讀取定投與訂單紀錄。",
    connectExchange: "連接交易所",
    learnFirst: "先學習",
    flowTitle: "最簡單的定投驗證流程",
    flowLead: "使用者不需要提交報告。連接 Binance 後，Lobster 會透過 server route 嘗試同步定投紀錄。",
    supportedTitle: "支援交易所 V1",
    supportedLead: "此版本只實作 Binance 唯讀連接。OKX 與 BitoPro 仍為未來階段。",
    statusNotConnected: "Not Connected",
    statusConnected: "Connected",
    statusComingSoon: "Coming Soon",
    connect: "Connect",
    safeConnection: "安全連接（唯讀）",
    syncReady: "Lobster 同步準備完成",
    noRecords: "已連接 Binance，但尚未找到可驗證的定投紀錄。",
    syncedState: "已同步 Binance 定投紀錄",
    connectedExchange: "Connected Exchange",
    syncedAssets: "已同步資產",
    lastSyncTime: "最後同步時間",
    assetRowsTitle: "已同步資產紀錄",
    verifiedRecordsUnit: "筆已驗證紀錄",
    syncFailed: "同步失敗，請確認 Binance API 是否為唯讀且具有訂單紀錄讀取權限。",
    futureExchanges: "未來支援交易所",
    comingSoon: "未來支援",
    passportTitle: "DCA Passport preview",
    connectedExchanges: "已連接交易所",
    verifiedOrders: "已驗證定投紀錄",
    currentStreak: "目前連續紀錄",
    verifiedAmount: "已驗證金額",
    bhcPoints: "BHC 積分",
    currentLevel: "目前等級",
    scoringTitle: "BHC 積分獎勵的是經過驗證的紀律，而不是交易量。",
    betaFormula: "積分公式仍為 Beta，未來可能調整。",
    detectedTitle: "Lobster 會自動偵測",
    architectureTitle: "Binance Read-only Connector V1",
    architectureLead: "此版本建立第一個真實交易所唯讀連接，但不儲存憑證、不執行交易、不新增資料庫。",
    safetyTitle: "安全聲明",
    safetyText: "BHC 永遠不會要求你的交易所密碼、助記詞、交易權限、提領權限、轉帳權限、合約權限或資產管理權限。",
    tokenTitle: "Points 不是代幣",
    tokenText: "BHC 積分是成長聲譽，不代表投資報酬、token 所有權、空投承諾或金融建議。",
    modalTitle: "Binance 唯讀連接",
    apiKey: "API Key",
    apiSecret: "Secret Key",
    modalSecurity: "請只使用 Binance 建立的唯讀 API。BHC 不需要交易、提幣、轉帳、合約或資產管理權限。你的 API Secret 不會顯示在瀏覽器端程式碼中。",
    sessionOnly: "Beta / Session only：目前不儲存 API 憑證，重新整理後需要重新輸入。",
    cancel: "取消",
    testConnection: "測試連接",
    connectBinance: "連接 Binance",
    syncDcaRecords: "同步定投紀錄",
    testing: "測試中...",
    syncing: "同步中...",
    testOk: "Binance 連接測試成功。",
    footer: "Lobster 定投護照的方向是：簡單、唯讀、自動、長期。",
  },
  en: {
    eyebrow: "BHC Verified Growth",
    title: "Lobster DCA Passport",
    lead: "BHC does not verify exchange ownership. BHC verifies whether a user consistently performs real long-term DCA behavior.",
    principle: "Connect once → Verify forever. Binance V1 uses a safe read-only connection to read DCA and order records.",
    connectExchange: "Connect Exchange",
    learnFirst: "Learn First",
    flowTitle: "The simplest DCA verification flow",
    flowLead: "Users do not submit reports. After connecting Binance, Lobster uses server routes to attempt DCA record sync.",
    supportedTitle: "Supported Exchanges V1",
    supportedLead: "This version only implements Binance read-only connection. OKX and BitoPro remain future phases.",
    statusNotConnected: "Not Connected",
    statusConnected: "Connected",
    statusComingSoon: "Coming Soon",
    connect: "Connect",
    safeConnection: "Safe read-only connection",
    syncReady: "Lobster sync ready",
    noRecords: "Connected, but no DCA records found yet.",
    syncedState: "Binance DCA records synced",
    connectedExchange: "Connected Exchange",
    syncedAssets: "Synced Assets",
    lastSyncTime: "Last Sync Time",
    assetRowsTitle: "Synced Asset Records",
    verifiedRecordsUnit: "verified records",
    syncFailed: "Sync failed. Confirm the Binance API is read-only and can read order history.",
    futureExchanges: "Future Exchanges",
    comingSoon: "Coming Soon",
    passportTitle: "DCA Passport preview",
    connectedExchanges: "Connected Exchanges",
    verifiedOrders: "Verified DCA Orders",
    currentStreak: "Current Streak",
    verifiedAmount: "Verified Amount",
    bhcPoints: "BHC Points",
    currentLevel: "Current Level",
    scoringTitle: "BHC Points reward verified consistency, not trading volume.",
    betaFormula: "Points formula is Beta and may change.",
    detectedTitle: "Lobster automatically detects",
    architectureTitle: "Binance Read-only Connector V1",
    architectureLead: "This version creates the first real exchange read-only connector, without storing credentials, executing trades, or adding a database.",
    safetyTitle: "Safety Notice",
    safetyText: "BHC never asks for your exchange password, seed phrase, trading permission, withdrawal permission, transfer permission, futures permission, or asset-management permission.",
    tokenTitle: "Points are not tokens",
    tokenText: "BHC Points are growth reputation. They do not represent investment returns, token ownership, airdrop promises, or financial advice.",
    modalTitle: "Binance Read-only Connection",
    apiKey: "API Key",
    apiSecret: "Secret Key",
    modalSecurity: "Only use a Binance read-only API. BHC does not need trading, withdrawal, transfer, futures, or asset-management permission. Your API Secret is not exposed in browser-side code.",
    sessionOnly: "Beta / Session only: API credentials are not stored. Refreshing the page requires entering them again.",
    cancel: "Cancel",
    testConnection: "Test Connection",
    connectBinance: "Connect Binance",
    syncDcaRecords: "Sync DCA Records",
    testing: "Testing...",
    syncing: "Syncing...",
    testOk: "Binance connection test succeeded.",
    footer: "Lobster DCA Passport is designed to be simple, read-only, automatic, and long-term.",
  },
} as const;

function text(value: Localized | string, language: Language) {
  return typeof value === "string" ? value : language === "zh-TW" ? value.zh : value.en;
}

export default function PointsPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [binanceConnected, setBinanceConnected] = useState(false);
  const [activeExchange, setActiveExchange] = useState<ExchangeConnector | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading, setLoading] = useState<"test" | "sync" | "">("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState<BinanceSummary | null>(null);
  const [syncedRecords, setSyncedRecords] = useState<SyncedDcaRecord[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState("");

  useEffect(() => {
    setLanguage(window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-TW");
    const updateLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    window.addEventListener("baby-hippo-language-change", updateLanguage);
    return () => window.removeEventListener("baby-hippo-language-change", updateLanguage);
  }, []);

  const t = copy[language];
  const passportItems = useMemo(() => [
    { label: t.connectedExchanges, value: `${summary?.connectedExchanges || (binanceConnected ? 1 : 0)} / 3` },
    { label: t.connectedExchange, value: binanceConnected ? "Binance" : "-" },
    { label: t.syncedAssets, value: String(new Set(syncedRecords.map((record) => record.asset)).size) },
    { label: t.verifiedOrders, value: String(summary?.verifiedDcaOrders || 0) },
    { label: t.currentStreak, value: language === "zh-TW" ? `${summary?.currentStreak || 0} 週` : `${summary?.currentStreak || 0} weeks` },
    { label: t.verifiedAmount, value: `${summary?.verifiedAmount || "0"} USDT` },
    { label: t.bhcPoints, value: String(summary?.bhcPoints || 0) },
    { label: t.currentLevel, value: summary?.currentLevel || "L0" },
    { label: t.lastSyncTime, value: lastSyncTime || "-" },
  ], [binanceConnected, language, lastSyncTime, summary, syncedRecords, t]);

  const assetRows = useMemo<AssetPassportRow[]>(() => {
    const grouped = new Map<string, { records: number; amount: number; lastTime: number }>();
    for (const record of syncedRecords) {
      const current = grouped.get(record.asset) || { records: 0, amount: 0, lastTime: 0 };
      const amount = record.quoteCurrency === "USDT" ? Number(record.amount) : 0;
      const time = new Date(record.executedAt).getTime();
      grouped.set(record.asset, {
        records: current.records + (record.verificationState === "verified_candidate" ? 1 : 0),
        amount: current.amount + (Number.isFinite(amount) ? amount : 0),
        lastTime: Math.max(current.lastTime, Number.isFinite(time) ? time : 0),
      });
    }
    return Array.from(grouped.entries())
      .map(([asset, row]) => ({
        asset,
        records: row.records,
        amountUsdt: row.amount.toFixed(2),
        lastSync: row.lastTime ? new Date(row.lastTime).toLocaleString(language === "zh-TW" ? "zh-TW" : "en-US") : "-",
      }))
      .sort((a, b) => a.asset.localeCompare(b.asset));
  }, [language, syncedRecords]);

  const closeModal = () => {
    setActiveExchange(null);
    setMessage("");
  };

  const testConnection = async () => {
    setLoading("test");
    setMessage("");
    try {
      const response = await fetch("/api/lobster/binance/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, apiSecret }),
      });
      const body = await response.json() as { connected?: boolean; error?: string };
      setMessage(body.connected ? t.testOk : body.error || t.syncFailed);
    } catch {
      setMessage(t.syncFailed);
    } finally {
      setLoading("");
    }
  };

  const connectBinance = async () => {
    setLoading("sync");
    setMessage("");
    try {
      const response = await fetch("/api/lobster/binance/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, apiSecret }),
      });
      const body = await response.json() as SyncResponse;
      if (!body.connected) {
        setMessage(body.error || t.syncFailed);
        return;
      }
      setBinanceConnected(true);
      setSummary(body.summary || null);
      setSyncedRecords(body.records || []);
      setLastSyncTime(new Date().toLocaleString(language === "zh-TW" ? "zh-TW" : "en-US"));
      setMessage(body.records?.length ? body.message || t.syncedState : t.noRecords);
      setActiveExchange(null);
      setApiSecret("");
    } catch {
      setMessage(t.syncFailed);
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="points-site" data-language-static>
      <PublicHeader />
      <main>
        <section className="points-hero">
          <div className="points-container points-hero-grid">
            <div>
              <span className="points-eyebrow">{t.eyebrow}</span>
              <h1>{t.title}</h1>
              <p className="points-lead">{t.lead}</p>
              <div className="points-notice">
                <ShieldCheck size={18} />
                <strong>{t.principle}</strong>
              </div>
              <div className="points-hero-actions">
                <a className="points-primary-cta" href="#connect">
                  {t.connectExchange} <ArrowRight size={17} />
                </a>
                <Link className="points-secondary-cta" href="/learn">
                  {t.learnFirst}
                </Link>
              </div>
            </div>

            <PassportCard
              title={t.passportTitle}
              items={passportItems}
              syncReady={binanceConnected ? (syncedRecords.length ? t.syncedState : t.noRecords) : ""}
              assetRows={assetRows}
              assetRowsTitle={t.assetRowsTitle}
              verifiedRecordsUnit={t.verifiedRecordsUnit}
            />
          </div>
        </section>

        <section className="points-dca-section">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">Connect once → Verify forever</span>
              <h2>{t.flowTitle}</h2>
              <p>{t.flowLead}</p>
            </div>
            <div className="points-flow-grid">
              {flow.map((item, index) => (
                <div className="points-flow-step" key={item.en}>
                  <article>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{text(item, language)}</strong>
                  </article>
                  {index < flow.length - 1 && <ArrowDown size={18} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="points-connect-section" id="connect">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">{t.safeConnection}</span>
              <h2>{t.supportedTitle}</h2>
              <p>{t.supportedLead}</p>
            </div>

            <div className="points-exchange-grid">
              {exchanges.map((exchange) => {
                const isBinance = exchange.id === "binance";
                const isConnected = isBinance && binanceConnected;
                return (
                  <article className={`points-exchange-card ${exchange.id} ${isConnected ? "connected" : ""}`} key={exchange.id}>
                    <div className="points-exchange-top">
                      <span className="points-exchange-logo">{exchange.logo}</span>
                      <div>
                        <small>Priority {exchange.priority}</small>
                        <h3>{exchange.name}</h3>
                      </div>
                    </div>
                    <span className={`points-status-badge ${isConnected ? "manual" : ""}`}><i /> {isConnected ? t.statusConnected : exchange.enabled ? t.statusNotConnected : t.statusComingSoon}</span>
                    <p>{text(exchange.description, language)}</p>
                    <div className="points-safety-badges">
                      {safetyBadges.map((badge) => <span key={badge.en}>{text(badge, language)}</span>)}
                    </div>
                    <button
                      className="points-connect-button"
                      type="button"
                      onClick={() => exchange.enabled && setActiveExchange(exchange)}
                      disabled={!exchange.enabled}
                    >
                      {t.connect}
                    </button>
                  </article>
                );
              })}
            </div>

            {message && <div className="points-sync-ready points-page-message"><CheckCircle2 size={18} /><strong>{message}</strong></div>}

            <div className="points-future-exchanges">
              <h3>{t.futureExchanges}</h3>
              <div>
                {futureExchanges.map((name) => (
                  <article key={name}>
                    <strong>{name}</strong>
                    <span>{t.comingSoon}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="points-dca-section">
          <div className="points-container points-dca-dashboard-grid">
            <article className="points-dca-model-card">
              <div className="points-card-heading">
                <PlugZap size={23} />
                <div>
                  <span>{t.detectedTitle}</span>
                  <h3>{t.detectedTitle}</h3>
                </div>
              </div>
              <div className="points-field-grid">
                {detectedFields.map((field) => <span key={field.en}>{text(field, language)}</span>)}
              </div>
            </article>

            <article className="points-dca-passport-card">
              <div className="points-card-heading">
                <Trophy size={23} />
                <div>
                  <span>{t.bhcPoints}</span>
                  <h3>{t.scoringTitle}</h3>
                  <p>{t.betaFormula}</p>
                </div>
              </div>
              <div className="points-state-row">
                {scorePreview.map((item, index) => (
                  <span className={`state-${index % 5}`} key={item.en}>{text(item, language)}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="points-roadmap-section">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">Architecture</span>
              <h2>{t.architectureTitle}</h2>
              <p>{t.architectureLead}</p>
            </div>
            <div className="points-engine-grid">
              {architecture.map((layer, index) => (
                <article className="points-engine-card" key={layer.title.en}>
                  {index === 0 && <PlugZap size={24} />}
                  {index === 1 && <BadgeCheck size={24} />}
                  {index === 2 && <BarChart3 size={24} />}
                  {index === 3 && <Bot size={24} />}
                  <h3>{text(layer.title, language)}</h3>
                  <p>{text(layer.body, language)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="points-principles">
          <div className="points-container points-principle-grid">
            <article>
              <LockKeyhole size={24} />
              <h2>{t.safetyTitle}</h2>
              <p>{t.safetyText}</p>
            </article>
            <article>
              <Sparkles size={24} />
              <h2>{t.tokenTitle}</h2>
              <p>{t.tokenText}</p>
            </article>
          </div>
        </section>
      </main>
      <footer className="points-footer">
        <div className="points-container">
          <strong>Baby Hippo Coin</strong>
          <p>{t.footer}</p>
        </div>
      </footer>

      {activeExchange?.id === "binance" && (
        <div className="points-modal-backdrop" role="dialog" aria-modal="true" aria-label={t.modalTitle}>
          <div className="points-connect-modal">
            <button className="points-modal-close" type="button" onClick={closeModal} aria-label={t.cancel}>
              <X size={18} />
            </button>
            <div className="points-exchange-top">
              <span className="points-exchange-logo">B</span>
              <div>
                <small>{t.safeConnection}</small>
                <h3>{t.modalTitle}</h3>
              </div>
            </div>
            <ol>
              {connectSteps.map((step) => <li key={step.en}>{text(step, language)}</li>)}
            </ol>
            <label className="points-secret-field">
              <span>{t.apiKey}</span>
              <input value={apiKey} onChange={(event) => setApiKey(event.target.value)} autoComplete="off" />
            </label>
            <label className="points-secret-field">
              <span>{t.apiSecret}</span>
              <input value={apiSecret} onChange={(event) => setApiSecret(event.target.value)} type="password" autoComplete="off" />
            </label>
            <div className="points-modal-security">
              <ShieldAlert size={20} />
              <p>{t.modalSecurity}</p>
            </div>
            <div className="points-modal-security session">
              <ShieldCheck size={20} />
              <p>{t.sessionOnly}</p>
            </div>
            {message && <div className="points-sync-ready"><CheckCircle2 size={18} /><strong>{message}</strong></div>}
            <div className="points-modal-actions">
              <button className="points-secondary-cta" type="button" onClick={closeModal}>{t.cancel}</button>
              <button className="points-secondary-cta" type="button" onClick={testConnection} disabled={loading !== "" || !apiKey || !apiSecret}>
                {loading === "test" ? t.testing : t.testConnection}
              </button>
              <button className="points-primary-cta" type="button" onClick={connectBinance} disabled={loading !== "" || !apiKey || !apiSecret}>
                {loading === "sync" ? t.syncing : t.connectBinance}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PassportCard({
  title,
  items,
  syncReady,
  assetRows,
  assetRowsTitle,
  verifiedRecordsUnit,
}: {
  title: string;
  items: Array<{ label: string; value: string }>;
  syncReady: string;
  assetRows: AssetPassportRow[];
  assetRowsTitle: string;
  verifiedRecordsUnit: string;
}) {
  return (
    <article className="points-passport-card" id="dca-passport">
      <div className="points-passport-head">
        <Award size={34} />
        <div>
          <span>Lobster</span>
          <h2>{title}</h2>
        </div>
      </div>
      {syncReady && (
        <div className="points-sync-ready">
          <CheckCircle2 size={18} />
          <strong>{syncReady}</strong>
        </div>
      )}
      <div className="points-passport-grid">
        {items.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      {assetRows.length > 0 && (
        <div className="points-asset-sync-list">
          <h3>{assetRowsTitle}</h3>
          {assetRows.map((row) => (
            <article key={row.asset}>
              <div>
                <strong>{row.asset}</strong>
                <span>{row.records} {verifiedRecordsUnit}</span>
              </div>
              <div>
                <strong>{row.amountUsdt} USDT</strong>
                <span>{row.lastSync}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </article>
  );
}
