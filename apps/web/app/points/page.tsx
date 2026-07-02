"use client";

import {
  ArrowDown,
  ArrowRight,
  Award,
  CheckCircle2,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicHeader } from "../components/public-header";
import type { BhcDcaRecord } from "../../lib/lobster/types";
import {
  createBinanceDcaSummary,
  groupBinanceDcaRecordsByAsset,
  loadBinanceDcaSyncState,
  saveBinanceDcaSyncState,
  type BinanceDcaSyncSummary,
} from "../../lib/lobster/client-sync-store";

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
type SyncResponse = {
  connected: boolean;
  exchange: "binance";
  records?: BhcDcaRecord[];
  summary?: BinanceDcaSyncSummary;
  message?: string;
  error?: string;
};

const LANGUAGE_KEY = "baby-hippo-language";
const l = (zh: string, en: string): Localized => ({ zh, en });
const text = (value: Localized | string, language: Language) =>
  typeof value === "string" ? value : language === "zh-TW" ? value.zh : value.en;

const exchanges: ExchangeConnector[] = [
  {
    id: "binance",
    name: "Binance",
    priority: 1,
    logo: "B",
    enabled: true,
    description: l(
      "第一個實際唯讀連接器，用來同步 recurring buy、auto-invest 與支援的現貨買入紀錄。",
      "The first real read-only connector. It syncs recurring buy, auto-invest, and supported spot buy history.",
    ),
  },
  {
    id: "okx",
    name: "OKX",
    priority: 2,
    logo: "O",
    enabled: true,
    description: l(
      "下一個支援的交易所連接器。此版本只開啟說明視窗，尚不會同步 OKX 資料。",
      "The next exchange connector. This version opens an explanation modal but does not sync real OKX data yet.",
    ),
  },
  {
    id: "bitopro",
    name: "BitoPro",
    priority: 3,
    logo: "P",
    enabled: false,
    description: l(
      "未來支援台灣入金路線。BitoPro 尚未在此版本開放。",
      "Future support for the Taiwan on-ramp path. BitoPro is not implemented in this version.",
    ),
  },
];

const futureExchanges = ["Bybit", "Bitget", "Bitunix"];
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
  l("定投護照更新", "DCA Passport updates"),
  l("BHC 積分 / 等級預覽", "BHC Points / Level preview"),
];
const scorePreview = [
  l("1 筆可驗證候選定投紀錄 = +10 BHC 積分", "1 verified candidate DCA record = +10 BHC Points"),
  l("同一資產 4 筆以上 = 連續紀律候選", "4+ records in the same asset = streak candidate"),
  l("L0 = 0 筆紀錄", "L0 = 0 records"),
  l("L1 = 1-3 筆紀錄", "L1 = 1-3 records"),
  l("L2 = 4-11 筆紀錄", "L2 = 4-11 records"),
  l("L3/L4 = 12 筆以上", "L3/L4 = 12+ records"),
];

const copy = {
  "zh-TW": {
    eyebrow: "BHC Verified Growth",
    title: "Lobster 定投護照",
    lead: "BHC 不驗證你擁有哪個交易所帳號，而是驗證你是否持續執行真實的長期 DCA 行為。",
    principle: "Connect once → Verify forever。Binance V1 使用安全唯讀連接，只讀取定投與訂單紀錄。",
    connectExchange: "連接交易所",
    learnFirst: "先了解",
    flowEyebrow: "Connect once → Verify forever",
    flowTitle: "最簡單的定投驗證流程",
    flowLead: "使用者不用提交報告。連接 Binance 後，Lobster 會透過 server route 嘗試同步定投紀錄。",
    supportedTitle: "支援交易所 V1",
    supportedLead: "此版本以 Binance 作為主要真實同步來源。OKX 目前會開啟說明視窗，BitoPro 則保留為未來支援。",
    statusNotConnected: "尚未連接",
    statusConnected: "已連接",
    statusComingSoon: "即將推出",
    connect: "連接",
    safeConnection: "安全連接（唯讀）",
    noRecords: "已連接 Binance，但尚未找到可驗證的定投紀錄。",
    emptyPassport: "尚未找到已驗證定投紀錄。",
    syncedState: "已同步 Binance 定投紀錄",
    connectedExchange: "已連接交易所",
    syncedAssets: "已同步資產",
    lastSyncTime: "最後同步時間",
    assetRowsTitle: "已同步資產紀錄",
    verifiedRecordsUnit: "筆紀錄",
    syncFailed: "同步失敗。請確認 Binance API 為唯讀，且可讀取訂單紀錄。",
    futureExchanges: "未來支援交易所",
    comingSoon: "即將支援",
    passportTitle: "DCA Passport 預覽",
    connectedExchanges: "已連接交易所",
    verifiedOrders: "已驗證定投紀錄",
    currentStreak: "目前連續紀錄",
    verifiedAmount: "已驗證金額",
    bhcPoints: "BHC 積分",
    currentLevel: "目前等級",
    scoringTitle: "BHC 積分獎勵的是經過驗證的紀律，而不是交易量。",
    betaFormula: "積分公式仍為 Beta，未來可能調整。",
    safetyTitle: "安全提醒",
    safetyText: "BHC 永遠不會要求你的交易所密碼、助記詞、交易權限、提幣權限、轉帳權限、合約權限或資產管理權限。",
    tokenTitle: "Points 不是代幣",
    tokenText: "BHC 積分是成長聲譽，不代表投資報酬、代幣所有權、空投承諾或財務建議。",
    modalTitle: "Binance 唯讀連接",
    okxModalTitle: "OKX connector is coming next.",
    okxModalText: "OKX 會是下一個支援的連接器。此版本不會要求 API Key，也不會同步 OKX 資料。",
    apiKey: "API Key",
    apiSecret: "Secret Key",
    modalSecurity: "請只使用 Binance 建立的唯讀 API。BHC 不需要交易、提幣、轉帳、合約或資產管理權限。你的 API Secret 不會出現在瀏覽器端程式碼中。",
    sessionOnly: "Beta / Session only：API 憑證不會被儲存。重新整理頁面後需要再次輸入。",
    cancel: "取消",
    close: "關閉",
    testConnection: "測試連接",
    connectBinance: "連接 Binance",
    testing: "測試中...",
    syncing: "同步中...",
    testOk: "Binance 連接測試成功。",
    footer: "Lobster 定投護照的設計目標是簡單、唯讀、自動、長期。",
  },
  en: {
    eyebrow: "BHC Verified Growth",
    title: "Lobster DCA Passport",
    lead: "BHC does not verify exchange ownership. BHC verifies whether a user consistently performs real long-term DCA behavior.",
    principle: "Connect once → Verify forever. Binance V1 uses a safe read-only connection to read DCA and order records.",
    connectExchange: "Connect Exchange",
    learnFirst: "Learn First",
    flowEyebrow: "Connect once → Verify forever",
    flowTitle: "The simplest DCA verification flow",
    flowLead: "Users do not submit reports. After connecting Binance, Lobster uses server routes to attempt DCA record sync.",
    supportedTitle: "Supported Exchanges V1",
    supportedLead: "This version uses Binance as the primary real sync source. OKX opens an explanation modal, and BitoPro remains future support.",
    statusNotConnected: "Not Connected",
    statusConnected: "Connected",
    statusComingSoon: "Coming Soon",
    connect: "Connect",
    safeConnection: "Safe read-only connection",
    noRecords: "Connected to Binance, but no verifiable DCA records were found yet.",
    emptyPassport: "No verified DCA records found yet.",
    syncedState: "Binance DCA records synced",
    connectedExchange: "Connected Exchange",
    syncedAssets: "Synced Assets",
    lastSyncTime: "Last Sync Time",
    assetRowsTitle: "Synced Asset Records",
    verifiedRecordsUnit: "records",
    syncFailed: "Sync failed. Confirm the Binance API is read-only and can read order history.",
    futureExchanges: "Future Exchanges",
    comingSoon: "Coming Soon",
    passportTitle: "DCA Passport Preview",
    connectedExchanges: "Connected Exchanges",
    verifiedOrders: "Verified DCA Orders",
    currentStreak: "Current Streak",
    verifiedAmount: "Verified Amount",
    bhcPoints: "BHC Points",
    currentLevel: "Current Level",
    scoringTitle: "BHC Points reward verified consistency, not trading volume.",
    betaFormula: "Points formula is Beta and may change.",
    safetyTitle: "Safety Notice",
    safetyText: "BHC never asks for your exchange password, seed phrase, trading permission, withdrawal permission, transfer permission, futures permission, or asset-management permission.",
    tokenTitle: "Points are not tokens",
    tokenText: "BHC Points are growth reputation. They do not represent investment returns, token ownership, airdrop promises, or financial advice.",
    modalTitle: "Binance Read-only Connection",
    okxModalTitle: "OKX connector is coming next.",
    okxModalText: "OKX will be the next supported connector. This version does not request API keys or sync OKX data.",
    apiKey: "API Key",
    apiSecret: "Secret Key",
    modalSecurity: "Only use a Binance read-only API. BHC does not need trading, withdrawal, transfer, futures, or asset-management permission. Your API Secret is not exposed in browser-side code.",
    sessionOnly: "Beta / Session only: API credentials are not stored. Refreshing the page requires entering them again.",
    cancel: "Cancel",
    close: "Close",
    testConnection: "Test Connection",
    connectBinance: "Connect Binance",
    testing: "Testing...",
    syncing: "Syncing...",
    testOk: "Binance connection test succeeded.",
    footer: "Lobster DCA Passport is designed to be simple, read-only, automatic, and long-term.",
  },
} as const;

export default function PointsPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [binanceConnected, setBinanceConnected] = useState(false);
  const [activeExchange, setActiveExchange] = useState<ExchangeConnector | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading, setLoading] = useState<"test" | "sync" | "">("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState<BinanceDcaSyncSummary | null>(null);
  const [syncedRecords, setSyncedRecords] = useState<BhcDcaRecord[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState("");

  useEffect(() => {
    setLanguage(window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-TW");
    const saved = loadBinanceDcaSyncState();
    if (saved) {
      setBinanceConnected(saved.connected);
      setSyncedRecords(saved.records);
      setSummary(saved.summary);
      setLastSyncTime(saved.lastSyncTime);
    }
    const updateLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    window.addEventListener("baby-hippo-language-change", updateLanguage);
    return () => window.removeEventListener("baby-hippo-language-change", updateLanguage);
  }, []);

  const t = copy[language];
  const assetRows = useMemo(() => groupBinanceDcaRecordsByAsset(syncedRecords), [syncedRecords]);
  const activeSummary = summary || createBinanceDcaSummary(syncedRecords);
  const passportItems = [
    { label: t.connectedExchanges, value: `${activeSummary.connectedExchanges || (binanceConnected ? 1 : 0)} / 3` },
    { label: t.connectedExchange, value: binanceConnected ? "Binance" : "-" },
    { label: t.syncedAssets, value: String(assetRows.length) },
    { label: t.verifiedOrders, value: String(activeSummary.verifiedDcaOrders || 0) },
    { label: t.currentStreak, value: language === "zh-TW" ? `${activeSummary.currentStreak || 0} 週` : `${activeSummary.currentStreak || 0} weeks` },
    { label: t.verifiedAmount, value: `${activeSummary.verifiedAmount || "0"} USDT` },
    { label: t.bhcPoints, value: String(activeSummary.bhcPoints || 0) },
    { label: t.currentLevel, value: activeSummary.currentLevel || "L0" },
    { label: t.lastSyncTime, value: lastSyncTime || "-" },
  ];

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
      const records = body.records || [];
      const syncTime = new Date().toLocaleString(language === "zh-TW" ? "zh-TW" : "en-US");
      const nextSummary = body.summary || createBinanceDcaSummary(records);
      setBinanceConnected(true);
      setSummary(nextSummary);
      setSyncedRecords(records);
      setLastSyncTime(syncTime);
      saveBinanceDcaSyncState({ records, summary: nextSummary, lastSyncTime: syncTime });
      setMessage(records.length ? body.message || t.syncedState : t.noRecords);
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
              emptyText={t.emptyPassport}
              assetRows={assetRows}
              assetRowsTitle={t.assetRowsTitle}
              verifiedRecordsUnit={t.verifiedRecordsUnit}
              language={language}
            />
          </div>
        </section>

        <section className="points-dca-section">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">{t.flowEyebrow}</span>
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
                    <span className={`points-status-badge ${isConnected ? "manual" : ""}`}>
                      <i /> {isConnected ? t.statusConnected : exchange.enabled ? t.statusNotConnected : t.statusComingSoon}
                    </span>
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
          <div className="points-container">
            <article className="points-dca-passport-card">
              <div className="points-card-heading">
                <Sparkles size={23} />
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

      {activeExchange?.id === "okx" && (
        <div className="points-modal-backdrop" role="dialog" aria-modal="true" aria-label={t.okxModalTitle}>
          <div className="points-connect-modal">
            <button className="points-modal-close" type="button" onClick={closeModal} aria-label={t.close}>
              <X size={18} />
            </button>
            <div className="points-exchange-top">
              <span className="points-exchange-logo">O</span>
              <div>
                <small>{t.safeConnection}</small>
                <h3>{t.okxModalTitle}</h3>
              </div>
            </div>
            <div className="points-modal-security session">
              <ShieldCheck size={20} />
              <p>{t.okxModalText}</p>
            </div>
            <div className="points-modal-actions">
              <button className="points-primary-cta" type="button" onClick={closeModal}>{t.close}</button>
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
  emptyText,
  assetRows,
  assetRowsTitle,
  verifiedRecordsUnit,
  language,
}: {
  title: string;
  items: Array<{ label: string; value: string }>;
  syncReady: string;
  emptyText: string;
  assetRows: ReturnType<typeof groupBinanceDcaRecordsByAsset>;
  assetRowsTitle: string;
  verifiedRecordsUnit: string;
  language: Language;
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
      {assetRows.length > 0 ? (
        <div className="points-asset-sync-list">
          <h3>{assetRowsTitle}</h3>
          {assetRows.map((row) => (
            <article key={row.asset}>
              <div>
                <strong>{language === "zh-TW" ? `${row.asset} 定投` : `${row.asset} DCA`}</strong>
                <span>{row.verifiedRecords} {verifiedRecordsUnit}</span>
              </div>
              <div>
                <strong>{row.totalAmount.toFixed(2)} USDT</strong>
                <span>{row.latestExecutionTime ? new Date(row.latestExecutionTime).toLocaleString(language === "zh-TW" ? "zh-TW" : "en-US") : "-"}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="points-sync-ready points-page-message">
          <CheckCircle2 size={18} />
          <strong>{emptyText}</strong>
        </div>
      )}
    </article>
  );
}
