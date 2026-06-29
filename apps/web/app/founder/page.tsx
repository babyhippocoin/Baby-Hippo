"use client";

import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  Check,
  ClipboardCheck,
  Clock3,
  LockKeyhole,
  NotebookPen,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicLanguageSwitcher } from "../components/public-language";

type Language = "zh-TW" | "en";
type BinanceBalance = {
  asset: string;
  displayAsset: string;
  free: string;
  locked: string;
  total: string;
  freeValueUsdt: string;
  lockedValueUsdt: string;
  totalValueUsdt: string;
  estimatedValueUsdt: string;
  portfolioPercentage: string;
  dailyPnlUsdt: string;
};
type BinanceDcaPlan = {
  id: string;
  name: string;
  status: "running" | "paused" | "ended" | "unknown";
  investmentAmount: string;
  investmentAsset: string;
  frequency: string;
  nextExecutionTime: string | null;
  startDate: string | null;
  targetAllocations: Array<{
    asset: string;
    percentage: number | null;
  }>;
  totalInvestedUsdt: string | null;
  currentHoldingUsdt: string | null;
  averageCostUsdt: string | null;
  triggerCount: number | null;
  dcaCompletedThisCycle: true | false | "unknown";
  pointsEligible: true | false | "unknown";
};
type LobsterDcaProfile = {
  lobsterPlanId: string;
  displayName: string;
  targetAssets: string[];
  sourceAsset: string;
  latestInvestmentAmount: string;
  frequency: string;
  firstSeenDate: string | null;
  lastExecutionDate: string | null;
  estimatedNextExecutionDate: string | null;
  estimatedNextExecutionSource: "lobster_estimated" | null;
  executionCount: number;
  totalInvestedUsdt: string | null;
  estimatedCurrentValueUsdt: string | null;
  averageCostUsdt: string | null;
  latestExecutionStatus: string;
  failedLatestExecution: boolean;
  thisWeekCompleted: true | false | "unknown";
  pointsEligible: true | false | "unknown";
  dataSource: "binance_auto_invest_history";
};
type BinanceStatus = "idle" | "loading" | "connected" | "missing_env" | "error";
type BinanceResponse = {
  connector: "binance";
  status: "connected" | "missing_env" | "error";
  accountType: "spot";
  summary: {
    totalEstimatedValueUsdt: string;
    nonZeroAssetCount: number;
    usdtAvailable: string;
    usdtLocked: string;
  };
  balances: BinanceBalance[];
  dcaPlans: {
    status: "loaded" | "unavailable" | "error";
    autoInvestStatus: "connected" | "unavailable" | "error";
    autoInvestErrorMessage?: string;
    autoInvestHttpStatus?: number;
    autoInvestBinanceCode?: number;
    autoInvestBinanceMessage?: string;
    plans: BinanceDcaPlan[];
    lobsterProfiles: LobsterDcaProfile[];
    dcaCompletedThisCycle: boolean | "unknown";
    pointsEligible: boolean | "unknown";
    error?: string;
  };
  updatedAt: string;
  error?: string;
};

const assets = ["BTC", "ETH", "SOL", "LINK", "BNB", "HYP", "TAO", "IO", "DOGE"];
const storageKey = "lobster-watch-discipline-v1";

const assetNames: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  BNB: "BNB",
  SOL: "Solana",
  LINK: "Chainlink",
  TAO: "Bittensor",
  IO: "io.net",
  DOGE: "Dogecoin",
  USDT: "Tether USD",
  AIGENSYN: "AigenSyn",
  GENIUS: "Genius",
};

const assetIcons: Record<string, { label: string; className: string }> = {
  BTC: { label: "\u20bf", className: "btc" },
  ETH: { label: "\u25c7", className: "eth" },
  BNB: { label: "BNB", className: "bnb" },
  SOL: { label: "SOL", className: "sol" },
  LINK: { label: "LINK", className: "link" },
  TAO: { label: "T", className: "tao" },
  IO: { label: "IO", className: "io" },
  DOGE: { label: "\u00d0", className: "doge" },
  USDT: { label: "\u20ae", className: "usdt" },
  AIGENSYN: { label: "AI", className: "aigensyn" },
  GENIUS: { label: "G", className: "genius" },
};

const copy = {
  "zh-TW": {
    private: "私人測試區",
    back: "返回 Baby Hippo",
    eyebrow: "努力生活者的鏈上紀律工具",
    title: "Lobster Watch",
    lead: "幫助努力生活的人建立長期投資紀律。",
    verbs: ["提醒。", "記錄。", "驗證。", "學習。"],
    limits: ["不交易", "不代管資金", "不保證獲利"],
    weekly: "每週 DCA 紀律",
    completed: "已完成",
    incomplete: "未完成",
    rate: "每週完成率",
    note: "穩定行動，比猜市場更重要。",
    journal: "每日紀律紀錄",
    journalHelp: "記錄今天做了什麼、學到什麼、下次要避免什麼。不是曬收益截圖。",
    prompts: ["今天完成的行動", "今天學到的事", "下次要避免的錯誤"],
    score: "紀律分數",
    scoreHelp: "分數反映一致性與反思，不代表投資報酬。",
    beta: "Lobster Watch Beta",
    betaText: "目前正式開放 DCA 提醒。驗證、鏈上同步與借貸監控仍在開發中。",
    footer: "教育、紀律與工具。永遠不代操。",
    binanceLabel: "Founder Connector",
    binanceTitle: "Binance Portfolio",
    binanceLead: "只讀取 Binance 現貨餘額與可用的定投資料。不交易、不提領、不保管資金。",
    loading: "讀取 Binance 狀態中…",
    connected: "已連線",
    missingEnv: "尚未設定環境變數",
    error: "讀取失敗",
    lastUpdated: "更新時間",
    totalValue: "預估總資產",
    assetCount: "非零資產數",
    usdtAvailable: "USDT 可用",
    usdtLocked: "USDT 鎖定",
    spotBalances: "現貨資產",
    asset: "資產",
    free: "可用",
    locked: "鎖定",
    total: "總計",
    value: "估值（USDT）",
    allocation: "占比",
    dailyPnl: "今日盈虧",
    search: "搜尋資產",
    hideZero: "隱藏零餘額",
    noBalances: "目前沒有符合條件的現貨資產。",
    refresh: "重新讀取",
    safety: "Read-only. No trading. No withdrawals.",
    dcaTitle: "Binance Auto-Invest / Recurring Buy",
    dcaUnavailable: "DCA plan API unavailable",
    dcaNoPlans: "目前沒有可顯示的 Binance 定投計畫。",
    amount: "投入金額",
    frequency: "頻率",
    nextTime: "下次執行",
    startDate: "開始日期",
    allocationPlan: "目標配置",
    invested: "累計投入",
    holding: "目前持有價值",
    pnl: "P/L",
    pointsNote: "完成定投後，未來可用於 BHC Points 任務驗證。此版本只讀取資料，不自動發放積分。",
    dcaCompleted: "本週完成狀態",
    pointsEligible: "積分資格",
    unknown: "未知",
    yes: "是",
    no: "否",
    openLearn: "開啟學習中心",
  },
  en: {
    private: "Private testing space",
    back: "Back to Baby Hippo",
    eyebrow: "A discipline tool for hardworking people",
    title: "Lobster Watch",
    lead: "Helping hardworking people build long-term investing discipline.",
    verbs: ["Remind.", "Record.", "Verify.", "Learn."],
    limits: ["No trading", "No managed funds", "No guaranteed profit"],
    weekly: "Weekly DCA Discipline",
    completed: "Completed",
    incomplete: "Not completed",
    rate: "Weekly completion",
    note: "Consistent action matters more than guessing the market.",
    journal: "Daily Discipline Record",
    journalHelp: "Record actions and lessons, not profit screenshots.",
    prompts: ["Action completed today", "Lesson learned today", "Mistake to avoid"],
    score: "Discipline Score",
    scoreHelp: "The score reflects consistency and reflection, never returns.",
    beta: "Lobster Watch Beta",
    betaText: "DCA reminders are live. Verification, on-chain sync, and lending monitoring remain in development.",
    footer: "Education, discipline, and tools. Never managed investing.",
    binanceLabel: "Founder Connector",
    binanceTitle: "Binance Portfolio",
    binanceLead: "Reads Binance spot balances and available recurring plan data only. No trading, no withdrawals, no custody.",
    loading: "Loading Binance status…",
    connected: "Connected",
    missingEnv: "Environment variables missing",
    error: "Read failed",
    lastUpdated: "Last updated",
    totalValue: "Estimated total value",
    assetCount: "Non-zero assets",
    usdtAvailable: "USDT available",
    usdtLocked: "USDT locked",
    spotBalances: "Spot portfolio",
    asset: "Asset",
    free: "Free",
    locked: "Locked",
    total: "Total",
    value: "Estimated Value (USDT)",
    allocation: "Allocation",
    dailyPnl: "Daily P/L",
    search: "Search assets",
    hideZero: "Hide zero balances",
    noBalances: "No matching spot assets.",
    refresh: "Refresh",
    safety: "Read-only. No trading. No withdrawals.",
    dcaTitle: "Binance Auto-Invest / Recurring Buy",
    dcaUnavailable: "DCA plan API unavailable",
    dcaNoPlans: "No Binance DCA plans are available to display.",
    amount: "Investment amount",
    frequency: "Frequency",
    nextTime: "Next execution",
    startDate: "Start date",
    allocationPlan: "Target allocation",
    invested: "Total invested",
    holding: "Current holding value",
    pnl: "P/L",
    pointsNote: "Completed DCA actions can later be used for BHC Points verification. This version only reads data and does not automatically grant points.",
    dcaCompleted: "Completed this cycle",
    pointsEligible: "Points eligible",
    unknown: "Unknown",
    yes: "Yes",
    no: "No",
    openLearn: "Open Learning Hub",
  },
} as const;

const dcaHubCopy = {
  "zh-TW": {
    title: "定投計畫",
    unavailable: "目前 Binance Auto-Invest API 未回傳可用計畫，或此 API 權限尚未開放。資產讀取仍正常，DCA 同步可稍後再驗證。",
    noPlans: "目前沒有可顯示的 Binance 定投計畫。",
    status: "狀態",
    amount: "投資金額",
    frequency: "頻率",
    nextTime: "下一次交易時間",
    startDate: "計畫開始日期",
    allocation: "配置",
    invested: "總投入",
    holding: "目前持有估值",
    averageCost: "平均成本",
    triggerCount: "觸發次數",
    thisCycle: "本週完成狀態",
    points: "積分資格",
    syncedPlans: "已同步計畫",
    completedThisWeek: "本週已完成",
    totalDcaInvested: "定投總投入",
    eligibleThisWeek: "本週積分資格",
    derived: "歷史推算",
    synced: "已同步",
    lastExecution: "最近扣款",
    noNextExecution: "Binance 歷史資料未提供下一次扣款時間",
    diagnostics: "安全診斷",
    httpStatus: "HTTP 狀態",
    binanceCode: "Binance 代碼",
    binanceMessage: "Binance 訊息",
    nullValue: "未提供",
    pointsNote: "Lobster Watch 會用 Binance Auto-Invest 歷史資料推算你的定投紀律。若 Binance API 未提供下一次扣款時間，Lobster 不會假造資料，只會顯示已同步到的歷史紀錄。",
  },
  en: {
    title: "DCA Plans",
    unavailable: "Binance Auto-Invest API did not return available plans, or this API permission is not enabled. Portfolio reading still works, and DCA sync can be verified later.",
    noPlans: "No Binance DCA plans are available to display.",
    status: "Status",
    amount: "Investment Amount",
    frequency: "Frequency",
    nextTime: "Next Execution",
    startDate: "Start Date",
    allocation: "Allocation",
    invested: "Total Invested",
    holding: "Current Holding Value",
    averageCost: "Average Cost",
    triggerCount: "Trigger Count",
    thisCycle: "This Cycle",
    points: "Points Eligibility",
    syncedPlans: "Synced DCA plans",
    completedThisWeek: "Completed this week",
    totalDcaInvested: "Total invested via DCA",
    eligibleThisWeek: "BHC Points eligible this week",
    derived: "Derived from History",
    synced: "Synced",
    lastExecution: "Last Execution",
    noNextExecution: "Binance history does not provide next execution time",
    diagnostics: "Safe diagnostics",
    httpStatus: "HTTP status",
    binanceCode: "Binance code",
    binanceMessage: "Binance message",
    nullValue: "Not provided",
    pointsNote: "Lobster Watch derives your DCA discipline from Binance Auto-Invest history. If Binance does not provide the next execution time, Lobster will not invent it and will only show synced history.",
  },
} as const;

const dcaHubCopyV2 = {
  "zh-TW": {
    title: "定投紀律儀表板",
    unavailable: "目前 Binance Auto-Invest API 未回傳可用計畫，或此 API 權限尚未開放。資產讀取仍正常，DCA 同步可稍後再驗證。",
    noPlans: "目前沒有可顯示的 Lobster 定投紀律資料。",
    status: "狀態",
    amount: "投資金額",
    frequency: "頻率",
    nextTime: "Lobster 推估下次扣款",
    startDate: "首次同步日期",
    invested: "累積投入",
    averageCost: "平均成本",
    triggerCount: "執行次數",
    thisCycle: "本週完成狀態",
    points: "BHC Points 狀態",
    syncedPlans: "已同步計畫",
    completedThisWeek: "本週已完成",
    attentionNeeded: "需要注意",
    totalDcaInvested: "同步歷史總投入",
    eligibleThisWeek: "本週預估積分",
    estimatedOnly: "預估，不自動發放",
    derived: "歷史推算",
    synced: "已同步",
    completed: "本週已完成",
    waiting: "等待下次扣款",
    attention: "注意",
    lastExecution: "最近扣款",
    latestStatus: "最近狀態",
    estimatedNext: "Lobster 推估下次扣款",
    diagnostics: "安全診斷",
    httpStatus: "HTTP 狀態",
    binanceCode: "Binance 代碼",
    binanceMessage: "Binance 訊息",
    nullValue: "未提供",
    pointsNote: "Lobster Watch 會根據 Binance Auto-Invest 歷史紀錄推估定投週期與完成狀態。推估資料只用於紀律追蹤，不代表 Binance 官方排程。",
  },
  en: {
    title: "DCA Discipline Dashboard",
    unavailable: "Binance Auto-Invest API did not return available plans, or this API permission is not enabled. Portfolio reading still works, and DCA sync can be verified later.",
    noPlans: "No Lobster DCA discipline data is available to display.",
    status: "Status",
    amount: "Investment Amount",
    frequency: "Frequency",
    nextTime: "Lobster-estimated next execution",
    startDate: "First Synced Date",
    invested: "Total Invested",
    averageCost: "Average Cost",
    triggerCount: "Execution Count",
    thisCycle: "This Week",
    points: "BHC Points Status",
    syncedPlans: "Synced plans",
    completedThisWeek: "Completed this week",
    attentionNeeded: "Needs attention",
    totalDcaInvested: "Total invested from synced history",
    eligibleThisWeek: "Estimated points this week",
    estimatedOnly: "Estimated only, not awarded",
    derived: "Derived from History",
    synced: "Synced",
    completed: "Completed",
    waiting: "Waiting",
    attention: "Attention",
    lastExecution: "Last Execution",
    latestStatus: "Latest Status",
    estimatedNext: "Lobster-estimated next execution",
    diagnostics: "Safe diagnostics",
    httpStatus: "HTTP status",
    binanceCode: "Binance code",
    binanceMessage: "Binance message",
    nullValue: "Not provided",
    pointsNote: "Lobster Watch estimates DCA cycles from Binance Auto-Invest history. Estimated data is for discipline tracking only and does not represent Binance's official schedule.",
  },
} as const;

const emptyBinance: BinanceResponse = {
  connector: "binance",
  status: "error",
  accountType: "spot",
  summary: {
    totalEstimatedValueUsdt: "0.00",
    nonZeroAssetCount: 0,
    usdtAvailable: "0",
    usdtLocked: "0",
  },
  balances: [],
  dcaPlans: {
    status: "unavailable",
    autoInvestStatus: "unavailable",
    plans: [],
    lobsterProfiles: [],
    dcaCompletedThisCycle: "unknown",
    pointsEligible: "unknown",
  },
  updatedAt: "",
};

const formatDateTime = (value?: string) => {
  if (!value || value === "—") return "—";
  const numericValue = Number(value);
  const date = Number.isFinite(numericValue) && numericValue > 1000000000
    ? new Date(numericValue)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const formatBool = (value: boolean | "unknown", t: { yes: string; no: string; unknown: string }) => {
  if (value === "unknown") return t.unknown;
  return value ? t.yes : t.no;
};

const formatNullable = (value: string | number | null | undefined, fallback: string) => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

const formatAllocations = (
  allocations: BinanceDcaPlan["targetAllocations"],
  fallback: string,
) => {
  if (!allocations.length) return fallback;
  return allocations
    .map((allocation) => allocation.percentage === null
      ? allocation.asset
      : `${allocation.asset} ${allocation.percentage}%`)
    .join(", ");
};

const parsePercent = (value: string) => {
  const parsed = Number(value.replace("%", ""));
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
};

const parseValue = (value: string) => {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value: string) => `$${value}`;

const getDcaCardStatus = (
  plan: LobsterDcaProfile,
  labels: typeof dcaHubCopyV2["zh-TW"] | typeof dcaHubCopyV2["en"],
) => {
  if (plan.failedLatestExecution) return { className: "attention", label: labels.attention };
  if (plan.thisWeekCompleted === true) return { className: "completed", label: labels.completed };
  if (plan.estimatedNextExecutionDate) return { className: "waiting", label: labels.waiting };
  return { className: "derived", label: labels.derived };
};

export default function LobsterWatchDiscipline() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [done, setDone] = useState<string[]>(["BTC", "ETH", "SOL"]);
  const [notes, setNotes] = useState(["", "", ""]);
  const [ready, setReady] = useState(false);
  const [binance, setBinance] = useState<BinanceResponse>(emptyBinance);
  const [binanceStatus, setBinanceStatus] = useState<BinanceStatus>("idle");
  const [assetSearch, setAssetSearch] = useState("");
  const [hideZeroBalances, setHideZeroBalances] = useState(true);

  const loadBinance = async () => {
    setBinanceStatus("loading");
    try {
      const response = await fetch("/api/founder/binance", { cache: "no-store" });
      const data = await response.json() as BinanceResponse;
      setBinance(data);
      setBinanceStatus(data.status);
    } catch {
      setBinance(emptyBinance);
      setBinanceStatus("error");
    }
  };

  useEffect(() => {
    const readLanguage = () => setLanguage(localStorage.getItem("baby-hippo-language") === "en" ? "en" : "zh-TW");
    readLanguage();
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (Array.isArray(saved.done)) setDone(saved.done);
      if (Array.isArray(saved.notes)) setNotes(saved.notes);
    } catch {}
    setReady(true);
    void loadBinance();
    window.addEventListener("storage", readLanguage);
    window.addEventListener("baby-hippo-language-change", readLanguage);
    return () => {
      window.removeEventListener("storage", readLanguage);
      window.removeEventListener("baby-hippo-language-change", readLanguage);
    };
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify({ done, notes }));
  }, [done, notes, ready]);

  const t = copy[language];
  const dcaT = dcaHubCopyV2[language];
  const completion = Math.round((done.length / assets.length) * 100);
  const written = notes.filter((note) => note.trim()).length;
  const score = useMemo(() => Math.min(100, Math.round(completion * 0.75) + written * 8), [completion, written]);
  const visibleBalances = useMemo(() => {
    const query = assetSearch.trim().toLowerCase();
    return binance.balances.filter((balance) => {
      const name = assetNames[balance.displayAsset] || balance.displayAsset;
      const matchesSearch = !query
        || balance.displayAsset.toLowerCase().includes(query)
        || name.toLowerCase().includes(query);
      const hasValue = parseValue(balance.totalValueUsdt) > 0 || Number(balance.total.replace(/,/g, "")) > 0;
      return matchesSearch && (!hideZeroBalances || hasValue);
    });
  }, [assetSearch, binance.balances, hideZeroBalances]);
  const dcaSummary = useMemo(() => {
    const profiles = binance.dcaPlans.lobsterProfiles || [];
    const totalInvested = profiles.reduce((sum, profile) => {
      const value = profile.totalInvestedUsdt ? parseValue(profile.totalInvestedUsdt) : 0;
      return sum + value;
    }, 0);

    return {
      profiles,
      syncedCount: profiles.length,
      completedThisWeek: profiles.filter((profile) => profile.thisWeekCompleted === true).length,
      attentionNeeded: profiles.filter((profile) => profile.failedLatestExecution).length,
      totalInvested: totalInvested.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      eligibleThisWeek: profiles.filter((profile) => profile.pointsEligible === true).length * 10,
    };
  }, [binance.dcaPlans.lobsterProfiles]);

  const toggle = (asset: string) => {
    setDone((current) => current.includes(asset) ? current.filter((item) => item !== asset) : [...current, asset]);
  };

  const statusText = binanceStatus === "loading"
    ? t.loading
    : binanceStatus === "connected"
      ? t.connected
      : binanceStatus === "missing_env"
        ? t.missingEnv
        : binanceStatus === "error"
          ? t.error
          : "—";

  return (
    <main className="founder-dashboard discipline-dashboard">
      <header className="founder-topbar">
        <Link className="founder-brand" href="/">
          <span className="founder-hippo" aria-hidden="true"><i /><b /><em /></span>
          <span><strong>Lobster Watch</strong><small>by Baby Hippo</small></span>
        </Link>
        <div className="founder-top-actions">
          <span className="private-badge"><LockKeyhole size={13} />{t.private}</span>
          <PublicLanguageSwitcher />
          <Link className="founder-home-link" href="/"><ArrowLeft size={15} />{t.back}</Link>
        </div>
      </header>

      <div className="founder-container">
        <section className="discipline-hero">
          <span className="founder-eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
          <div className="discipline-verbs">{t.verbs.map((item) => <strong key={item}>{item}</strong>)}</div>
          <div className="discipline-limits">{t.limits.map((item) => <span key={item}><ShieldCheck size={15} />{item}</span>)}</div>
        </section>

        <section className="founder-panel">
          <div className="panel-heading">
            <div className="panel-heading-icon"><WalletCards size={20} /></div>
            <div><span>{t.binanceLabel}</span><h2>{t.binanceTitle}</h2></div>
            <div className="panel-heading-side"><span className="completion-pill">{statusText}</span></div>
          </div>
          <p className="journal-intro">{t.binanceLead}</p>

          <div className="founder-summary binance-summary-grid">
            <article className="summary-card green"><span>{t.totalValue}</span><strong>{binance.summary.totalEstimatedValueUsdt}</strong><small>USDT</small></article>
            <article className="summary-card blue"><span>{t.assetCount}</span><strong>{binance.summary.nonZeroAssetCount}</strong><small>{t.spotBalances}</small></article>
            <article className="summary-card amber"><span>{t.usdtAvailable}</span><strong>{binance.summary.usdtAvailable}</strong><small>USDT</small></article>
            <article className="summary-card purple"><span>{t.usdtLocked}</span><strong>{binance.summary.usdtLocked}</strong><small>USDT</small></article>
            <article className="summary-card green"><span>{t.lastUpdated}</span><strong style={{ fontSize: 16 }}>{formatDateTime(binance.updatedAt)}</strong><small>{t.safety}</small></article>
          </div>

          <div className="score-components">
            <div className={`score-row ${binanceStatus === "connected" ? "complete" : ""}`}>
              <i>{binanceStatus === "connected" && <Check size={13} />}</i>
              <span><strong>{t.safety}</strong><small>{binance.error || statusText}</small></span>
              <b>{binance.accountType?.toUpperCase() || "SPOT"}</b>
            </div>
            <div className="score-row">
              <i><Clock3 size={13} /></i>
              <span><strong>{t.lastUpdated}</strong><small>{formatDateTime(binance.updatedAt)}</small></span>
              <button type="button" onClick={() => void loadBinance()} disabled={binanceStatus === "loading"}>
                <RefreshCw size={13} /> {t.refresh}
              </button>
            </div>
          </div>

          <div className="binance-toolbar">
            <label className="binance-search">
              <Search size={15} />
              <input value={assetSearch} onChange={(event) => setAssetSearch(event.target.value)} placeholder={t.search} />
            </label>
            <button type="button" className={hideZeroBalances ? "active" : ""} onClick={() => setHideZeroBalances((value) => !value)}>
              {t.hideZero}
            </button>
          </div>

          <div className="binance-table-shell">
            {visibleBalances.length ? (
              <table className="binance-portfolio-table">
                <thead>
                  <tr>
                    {[t.asset, t.free, t.locked, t.total, t.value, t.allocation, t.dailyPnl].map((heading) => (
                      <th key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleBalances.map((balance) => {
                    const name = assetNames[balance.displayAsset] || balance.displayAsset;
                    const icon = assetIcons[balance.displayAsset] || {
                      label: balance.displayAsset.slice(0, 1),
                      className: "default",
                    };
                    const allocation = parsePercent(balance.portfolioPercentage);
                    return (
                      <tr key={balance.asset}>
                        <td>
                          <div className="asset-identity">
                            <span className={`asset-token-icon ${icon.className}`}>{icon.label}</span>
                            <span className="asset-name-stack"><strong>{balance.displayAsset}</strong><small>{name}</small></span>
                          </div>
                        </td>
                        <td><strong>{balance.free} {balance.displayAsset}</strong><small>{"\u2248"} {balance.freeValueUsdt} USDT</small></td>
                        <td><strong>{balance.locked} {balance.displayAsset}</strong><small>{"\u2248"} {balance.lockedValueUsdt} USDT</small></td>
                        <td><strong>{balance.total} {balance.displayAsset}</strong><small>{"\u2248"} {balance.totalValueUsdt} USDT</small></td>
                        <td><strong className="estimated-value">{money(balance.estimatedValueUsdt)}</strong></td>
                        <td>
                          <strong>{balance.portfolioPercentage}</strong>
                          <span className="allocation-track"><i style={{ width: `${allocation}%` }} /></span>
                        </td>
                        <td><strong>{balance.dailyPnlUsdt || "--"}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="journal-intro">{binanceStatus === "loading" ? t.loading : t.noBalances}</p>
            )}
          </div>
        </section>

        <section className="founder-panel dca-hub-panel">
          <div className="panel-heading">
            <div className="panel-heading-icon"><CalendarCheck size={20} /></div>
            <div><span>Binance Auto-Invest</span><h2>{dcaT.title}</h2></div>
            <div className="panel-heading-side"><span className="completion-pill">{binance.dcaPlans.autoInvestStatus}</span></div>
          </div>
          <p className="journal-intro">{dcaT.pointsNote}</p>
          <div className="dca-summary-grid">
            <article className="dca-summary-card"><span>{dcaT.syncedPlans}</span><strong>{dcaSummary.syncedCount}</strong><small>{dcaT.synced}</small></article>
            <article className="dca-summary-card"><span>{dcaT.completedThisWeek}</span><strong>{dcaSummary.completedThisWeek}</strong><small>{dcaT.thisCycle}</small></article>
            <article className="dca-summary-card attention"><span>{dcaT.attentionNeeded}</span><strong>{dcaSummary.attentionNeeded}</strong><small>{dcaT.attention}</small></article>
            <article className="dca-summary-card"><span>{dcaT.totalDcaInvested}</span><strong>${dcaSummary.totalInvested}</strong><small>USDT</small></article>
            <article className="dca-summary-card"><span>{dcaT.eligibleThisWeek}</span><strong>{dcaSummary.eligibleThisWeek}</strong><small>{dcaT.estimatedOnly}</small></article>
          </div>
          {binance.dcaPlans.status !== "loaded" ? (
            <div className="dca-unavailable-card">
              <p>{binance.dcaPlans.autoInvestErrorMessage || dcaT.unavailable}</p>
              {(binance.dcaPlans.autoInvestHttpStatus || binance.dcaPlans.autoInvestBinanceCode || binance.dcaPlans.autoInvestBinanceMessage) && (
                <dl>
                  <dt>{dcaT.diagnostics}</dt>
                  <dd>
                    {[
                      binance.dcaPlans.autoInvestHttpStatus ? `${dcaT.httpStatus}: ${binance.dcaPlans.autoInvestHttpStatus}` : "",
                      binance.dcaPlans.autoInvestBinanceCode ? `${dcaT.binanceCode}: ${binance.dcaPlans.autoInvestBinanceCode}` : "",
                      binance.dcaPlans.autoInvestBinanceMessage ? `${dcaT.binanceMessage}: ${binance.dcaPlans.autoInvestBinanceMessage}` : "",
                    ].filter(Boolean).join(" / ")}
                  </dd>
                </dl>
              )}
            </div>
          ) : dcaSummary.profiles.length ? (
            <div className="dca-plan-grid">
              {dcaSummary.profiles.map((plan) => {
                const cardStatus = getDcaCardStatus(plan, dcaT);
                return (
                <article className="dca-plan-card lobster-dca-card" key={plan.lobsterPlanId}>
                  <div className="dca-plan-top">
                    <div><strong>{plan.displayName}</strong><small>{dcaT.status}: {formatNullable(plan.latestExecutionStatus, dcaT.nullValue)}</small></div>
                    <span className={`dca-status-badge ${cardStatus.className}`}>{cardStatus.label}</span>
                  </div>
                  <div className="lobster-dca-middle">
                    <div><span>{dcaT.amount}</span><strong>{formatNullable(plan.latestInvestmentAmount, dcaT.nullValue)} {plan.sourceAsset}</strong></div>
                    <div><span>{dcaT.frequency}</span><strong>{formatNullable(plan.frequency, dcaT.nullValue)}</strong></div>
                    <div><span>{dcaT.lastExecution}</span><strong>{formatDateTime(plan.lastExecutionDate || undefined)}</strong></div>
                    <div><span>{dcaT.estimatedNext}</span><strong>{plan.estimatedNextExecutionDate ? formatDateTime(plan.estimatedNextExecutionDate) : dcaT.nullValue}</strong></div>
                  </div>
                  <dl className="dca-plan-details">
                    {[
                      [dcaT.startDate, formatDateTime(plan.firstSeenDate || undefined)],
                      [dcaT.invested, formatNullable(plan.totalInvestedUsdt, dcaT.nullValue)],
                      [dcaT.triggerCount, plan.executionCount],
                      [dcaT.latestStatus, formatNullable(plan.latestExecutionStatus, dcaT.nullValue)],
                      ...(plan.averageCostUsdt ? [[dcaT.averageCost, plan.averageCostUsdt]] : []),
                      [dcaT.thisCycle, formatBool(plan.thisWeekCompleted, t)],
                      [dcaT.points, formatBool(plan.pointsEligible, t)],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <dt style={{ color: "#91a7ae" }}>{label}</dt>
                        <dd style={{ margin: 0 }}>{value || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="lobster-dca-bottom">
                    <div className="dca-asset-chips">
                      {(plan.targetAssets.length ? plan.targetAssets : [dcaT.nullValue]).map((asset) => (
                        <span key={asset}>{asset}</span>
                      ))}
                    </div>
                    <div className="dca-proof-row">
                      <span>{dcaT.thisCycle}: {formatBool(plan.thisWeekCompleted, t)}</span>
                      <span>{dcaT.points}: {formatBool(plan.pointsEligible, t)}</span>
                    </div>
                  </div>
                </article>
              );})}
            </div>
          ) : (
            <p className="journal-intro">{dcaT.noPlans}</p>
          )}
        </section>

        <section className="founder-panel">
          <div className="panel-heading">
            <div className="panel-heading-icon"><CalendarCheck size={20} /></div>
            <div><span>DCA Reminder</span><h2>{t.weekly}</h2></div>
            <div className="panel-heading-side"><span className="completion-pill">{done.length}/{assets.length}</span></div>
          </div>
          <div className="weekly-progress">
            <div><span>{t.rate}</span><strong>{completion}%</strong></div>
            <div className="progress-track"><span style={{ width: `${completion}%` }} /></div>
            <small>{t.note}</small>
          </div>
          <div className="discipline-asset-grid">
            {assets.map((asset) => {
              const complete = done.includes(asset);
              return (
                <button className={`dca-check ${complete ? "completed" : ""}`} onClick={() => toggle(asset)} key={asset}>
                  <span className="asset-mini-icon teal">{asset.slice(0, 1)}</span>
                  <span><strong>{asset}</strong><small>{complete ? t.completed : t.incomplete}</small></span>
                  <i>{complete && <Check size={15} />}</i>
                </button>
              );
            })}
          </div>
        </section>

        <div className="discipline-lower-grid">
          <section className="founder-panel journal-panel">
            <div className="panel-heading">
              <div className="panel-heading-icon"><NotebookPen size={20} /></div>
              <div><span>Record</span><h2>{t.journal}</h2></div>
            </div>
            <p className="journal-intro">{t.journalHelp}</p>
            <div className="journal-grid discipline-journal">
              {t.prompts.map((prompt, index) => (
                <label className="journal-field" key={prompt}>
                  <span>{prompt}</span>
                  <textarea value={notes[index]} onChange={(event) => setNotes((current) => current.map((item, i) => i === index ? event.target.value : item))} rows={4} />
                </label>
              ))}
            </div>
          </section>

          <section className="founder-panel score-panel">
            <div className="panel-heading">
              <div className="panel-heading-icon"><ClipboardCheck size={20} /></div>
              <div><span>Discipline</span><h2>{t.score}</h2></div>
            </div>
            <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{score}</strong><span>/ 100</span></div>
            </div>
            <p>{t.scoreHelp}</p>
            <div className="score-components">
              <div className="score-row complete"><i><Check size={13} /></i><span><strong>DCA</strong><small>{completion}%</small></span><b>+{Math.round(completion * .75)}</b></div>
              <div className={`score-row ${written ? "complete" : ""}`}><i>{written > 0 && <Check size={13} />}</i><span><strong>Journal</strong><small>{written}/3</small></span><b>+{written * 8}</b></div>
            </div>
          </section>
        </div>

        <section className="founder-future discipline-beta">
          <div className="future-icon"><Clock3 size={26} /></div>
          <div><span className="alpha-badge">Beta</span><h2>{t.beta}</h2><p>{t.betaText}</p></div>
          <Link className="future-promise" href="/learn"><BookOpen size={17} /><span>{t.openLearn}</span></Link>
        </section>

        <footer className="founder-footer"><Sparkles size={16} /><span>{t.footer}</span></footer>
      </div>
    </main>
  );
}
