"use client";

import {
  ArrowDown,
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock3,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  MessageCircle,
  PlugZap,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicHeader } from "../components/public-header";

type Language = "zh-TW" | "en";
type Localized = { zh: string; en: string };

const LANGUAGE_KEY = "baby-hippo-language";
const l = (zh: string, en: string): Localized => ({ zh, en });

const exchangeConnectors = ["Binance", "OKX", "Bybit", "Bitget"];
const walletConnectors = ["Rabby", "MetaMask", "WalletConnect"];
const communityConnectors = ["Telegram", "X"];

const roadmap = [
  l("L1 測驗", "L1 Quiz"),
  l("L2 人工審核", "L2 Manual Review"),
  l("L3 交易所 API", "L3 Exchange API"),
  l("L4 錢包驗證", "L4 Wallet Verification"),
  l("L5 Telegram Bot", "L5 Telegram Bot"),
  l("L6 AI 驗證", "L6 AI Verification"),
];

const passportItems = [
  { label: l("學習", "Learning"), value: l("0%", "0%") },
  { label: l("定投", "DCA"), value: l("0 筆紀錄", "0 Records") },
  { label: l("鏈上收益", "DeFi"), value: l("0 個平台", "0 Platforms") },
  { label: l("社群", "Community"), value: l("尚未連結", "Not Connected") },
  { label: l("小龍蝦", "Lobster"), value: l("尚未啟用", "Inactive") },
  { label: l("聲譽值", "Reputation"), value: l("0", "0") },
  { label: l("驗證等級", "Verification Level"), value: l("L0", "L0") },
];

const dcaDataFields = [
  l("交易所", "Exchange"),
  l("資產", "Asset"),
  l("訂單類型", "Order type"),
  l("定投日期", "DCA date"),
  l("金額", "Amount"),
  l("計價貨幣", "Quote currency"),
  l("頻率", "Frequency"),
  l("執行狀態", "Execution status"),
  l("證明來源", "Proof source"),
  l("驗證狀態", "Verification status"),
];

const supportedAssets = ["BTC", "ETH", "SOL", "BNB", "LINK"];

const dcaPassportItems = [
  { label: l("BTC 定投", "BTC DCA"), value: l("0 筆紀錄", "0 records") },
  { label: l("ETH 定投", "ETH DCA"), value: l("0 筆紀錄", "0 records") },
  { label: l("最長連續紀錄", "Longest streak"), value: l("0 週", "0 weeks") },
  { label: l("已驗證金額", "Verified amount"), value: l("0 USDT", "0 USDT") },
  { label: l("驗證等級", "Verification level"), value: l("L0", "L0") },
];

const futureStates = [
  l("等待審核", "Pending Review"),
  l("API 已同步", "API Synced"),
  l("已驗證", "Verified"),
  l("已拒絕", "Rejected"),
  l("偵測到重複資料", "Duplicate Detected"),
];

const copy = {
  "zh-TW": {
    eyebrow: "BHC 成長驗證系統",
    title: "成長驗證中心",
    lead: "一切都從連結驗證開始。BHC Points 是可驗證的成長聲譽，不是代幣。未來的聲譽值會來自官方驗證證據，而不是手動領點。",
    notice: "BHC 驗證的是成長。它不獎勵簡單點擊、每日簽到或假活動。未來每一個聲譽分數都會建立在可驗證證據之上。",
    start: "開始成長旅程",
    learn: "先了解",
    passportPreview: "成長護照預覽",
    passportTitle: "成長護照",
    connectEyebrow: "先連結驗證",
    connectTitle: "官方驗證管道",
    connectLead: "這些卡片目前只是前端架構。未來任務會把每一個停用按鈕替換成真正的整合功能。",
    exchangeTitle: "交易所驗證",
    exchangeDescription: "透過支援的交易所驗證長期定投行為。",
    walletTitle: "錢包驗證",
    walletDescription: "驗證鏈上活動。",
    communityTitle: "社群驗證",
    communityDescription: "驗證社群參與。",
    statusNotConnected: "狀態：尚未連結",
    future: "未來",
    exchangeFuture: "交易所 API 驗證",
    walletFuture: "錢包簽章驗證",
    communityFuture: "OAuth / Bot 驗證",
    comingSoon: "即將推出",
    connect: "連結",
    connectWallet: "連結錢包",
    dcaEyebrow: "定投驗證",
    dcaTitle: "DCA Verification",
    dcaLead: "BHC 驗證的是定投行為，不是交易所帳戶所有權。Binance 和 OKX 只是資料來源，未來只會使用唯讀驗證。",
    sourceSelection: "選擇資料來源",
    manualUpload: "手動上傳",
    primarySource: "主要資料來源",
    fallbackSource: "備用資料來源",
    availableSoon: "即將開放",
    verificationMethod: "驗證方式",
    exchangeApi: "交易所 API",
    manualMethod: "截圖 / email 證明",
    reviewMethod: "審核方式",
    manualAiReview: "先人工審核，未來加入 AI 驗證",
    permissionsLater: "未來需要權限",
    readOnlyOrderHistory: "唯讀訂單紀錄",
    permissionsNotRequired: "不需要權限",
    tradingWithdrawalTransfer: "交易權限、提幣權限、轉帳權限",
    dcaModelTitle: "定投資料模型",
    dcaModelLead: "未來 BHC 會檢查這些欄位，用來判斷一筆定投紀錄是否可信。",
    supportedAssetsTitle: "V1 支援資產",
    dcaPassportTitle: "定投護照預覽",
    futureStatesTitle: "未來驗證狀態範例",
    futureStatesLead: "以下只是 UI 狀態範例，尚未連接真實審核或 API 同步。",
    safetyNotice: "BHC 只會使用唯讀驗證。永遠不要分享交易所密碼、助記詞、提幣權限或交易權限。",
    tokenNotice: "DCA 驗證只建立成長聲譽。它不保證代幣獎勵、空投、投資報酬或財務建議。",
    roadmapEyebrow: "驗證路線圖",
    roadmapTitle: "未來解鎖順序",
    roadmapLead: "成長驗證中心會先從簡單架構開始，逐步走向更強的證據驗證。本版本沒有啟用後端或任何連接器。",
    noTokenTitle: "Points 不是代幣",
    noTokenText: "BHC Points 是用來表示已驗證學習、定投紀律、DeFi 練習、社群貢獻與 Lobster Watch 使用情況的聲譽訊號。它不代表代幣所有權、代幣權利或保證未來空投。",
    futureTokenTitle: "未來代幣關係",
    futureTokenText: "如果 BHC 未來推出代幣，Points 可能會成為資格或聲譽的其中一項參考，但代幣分配會使用獨立規則、反女巫檢查，以及創辦人與社群批准。",
    footer: "成長驗證中心目前只是前端架構。尚未啟用登入、後端、資料庫、錢包、OAuth、AI 或交易所連線。",
  },
  en: {
    eyebrow: "BHC Verified Growth System",
    title: "Verified Growth Hub",
    lead: "Everything starts from Connect. BHC Points are verified growth reputation, not tokens. Future reputation will come from official evidence, not manual point claiming.",
    notice: "BHC verifies growth. It does not reward simple clicks, daily check-ins, or fake activity. Every future reputation score is built from verified evidence.",
    start: "Start Verified Journey",
    learn: "Learn First",
    passportPreview: "Passport Preview",
    passportTitle: "Growth Passport",
    connectEyebrow: "Connect first",
    connectTitle: "Official verification channels",
    connectLead: "These cards are frontend architecture only. Future tasks will replace each disabled button with real integrations.",
    exchangeTitle: "Exchange Verification",
    exchangeDescription: "Verify long-term DCA behavior through supported exchanges.",
    walletTitle: "Wallet Verification",
    walletDescription: "Verify on-chain activity.",
    communityTitle: "Community Verification",
    communityDescription: "Verify community participation.",
    statusNotConnected: "Status: Not Connected",
    future: "Future",
    exchangeFuture: "Exchange API Verification",
    walletFuture: "Wallet Signature Verification",
    communityFuture: "OAuth / Bot Verification",
    comingSoon: "Coming Soon",
    connect: "Connect",
    connectWallet: "Connect Wallet",
    dcaEyebrow: "DCA Verification",
    dcaTitle: "DCA Verification",
    dcaLead: "BHC verifies DCA behavior, not exchange ownership. Binance and OKX are only data sources, and future verification will use read-only access only.",
    sourceSelection: "Source Selection",
    manualUpload: "Manual Upload",
    primarySource: "Primary source",
    fallbackSource: "Fallback source",
    availableSoon: "Available soon",
    verificationMethod: "Verification method",
    exchangeApi: "Exchange API",
    manualMethod: "Screenshot / email proof",
    reviewMethod: "Review method",
    manualAiReview: "Manual review first, AI verification later",
    permissionsLater: "Permissions required later",
    readOnlyOrderHistory: "Read-only order history",
    permissionsNotRequired: "Permissions not required",
    tradingWithdrawalTransfer: "Trading, withdrawal, transfer",
    dcaModelTitle: "DCA Data Model",
    dcaModelLead: "BHC will inspect these fields later to decide whether a DCA record is trustworthy.",
    supportedAssetsTitle: "Supported assets V1",
    dcaPassportTitle: "DCA Passport Preview",
    futureStatesTitle: "Future verified states",
    futureStatesLead: "These are UI examples only. No real review or API sync is connected yet.",
    safetyNotice: "BHC will only use read-only verification. Never share exchange passwords, seed phrases, withdrawal permissions, or trading permissions.",
    tokenNotice: "DCA verification builds growth reputation only. It does not guarantee token rewards, airdrops, investment returns, or financial advice.",
    roadmapEyebrow: "Verification roadmap",
    roadmapTitle: "Future unlock order",
    roadmapLead: "The Hub starts simple and grows toward stronger evidence. No backend or connector is active in this version.",
    noTokenTitle: "Points are not tokens",
    noTokenText: "BHC Points are reputation signals for verified learning, DCA discipline, DeFi practice, community contribution, and Lobster Watch usage. They do not represent token ownership, token rights, or a guaranteed future airdrop.",
    futureTokenTitle: "Future Token Relationship",
    futureTokenText: "If BHC launches a token in the future, Points may be one input for eligibility or reputation, but token distribution will use separate rules, anti-Sybil checks, and founder/community approval.",
    footer: "Verified Growth Hub is frontend architecture only. No authentication, backend, database, wallet, OAuth, AI, or exchange connection is active.",
  },
} as const;

function ComingSoonBadge({ label }: { label: string }) {
  return <span className="points-status-badge"><i /> {label}</span>;
}

function DisabledConnectButton({ label = "Connect" }: { label?: string }) {
  return (
    <button className="points-disabled-button" type="button" disabled>
      {label}
    </button>
  );
}

export default function PointsPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");

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
  const text = (value: Localized) => language === "zh-TW" ? value.zh : value.en;

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
                <strong>{t.notice}</strong>
              </div>
              <div className="points-hero-actions">
                <Link className="points-primary-cta" href="/points#dca-verification">
                  {t.start} <ArrowRight size={17} />
                </Link>
                <Link className="points-secondary-cta" href="/learn">
                  {t.learn}
                </Link>
              </div>
            </div>

            <article className="points-passport-card">
              <div className="points-passport-head">
                <Award size={34} />
                <div>
                  <span>{t.passportPreview}</span>
                  <h2>{t.passportTitle}</h2>
                </div>
              </div>
              <div className="points-passport-grid">
                {passportItems.map((item) => (
                  <div key={item.label.en}>
                    <span>{text(item.label)}</span>
                    <strong>{text(item.value)}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="points-dca-section" id="dca-verification">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">{t.dcaEyebrow}</span>
              <h2>{t.dcaTitle}</h2>
              <p>{t.dcaLead}</p>
            </div>

            <div className="points-dca-source-grid">
              {["Binance", "OKX"].map((name) => (
                <article className="points-dca-source primary" key={name}>
                  <div className="points-dca-source-top">
                    <BarChart3 size={25} />
                    <div>
                      <span>{t.primarySource}</span>
                      <h3>{name}</h3>
                    </div>
                  </div>
                  <ComingSoonBadge label={t.comingSoon} />
                  <dl>
                    <div><dt>{t.statusNotConnected}</dt><dd>{t.verificationMethod}: {t.exchangeApi}</dd></div>
                    <div><dt>{t.permissionsLater}</dt><dd>{t.readOnlyOrderHistory}</dd></div>
                    <div><dt>{t.permissionsNotRequired}</dt><dd>{t.tradingWithdrawalTransfer}</dd></div>
                  </dl>
                  <DisabledConnectButton label={t.connect} />
                </article>
              ))}

              <article className="points-dca-source fallback">
                <div className="points-dca-source-top">
                  <UploadCloud size={25} />
                  <div>
                    <span>{t.fallbackSource}</span>
                    <h3>{t.manualUpload}</h3>
                  </div>
                </div>
                <span className="points-status-badge manual"><i /> {t.availableSoon}</span>
                <dl>
                  <div><dt>{t.statusNotConnected}</dt><dd>{t.verificationMethod}: {t.manualMethod}</dd></div>
                  <div><dt>{t.reviewMethod}</dt><dd>{t.manualAiReview}</dd></div>
                </dl>
                <DisabledConnectButton label={t.manualUpload} />
              </article>
            </div>

            <div className="points-dca-dashboard-grid">
              <article className="points-dca-model-card">
                <div className="points-card-heading">
                  <FileCheck2 size={23} />
                  <div>
                    <span>{t.sourceSelection}</span>
                    <h3>{t.dcaModelTitle}</h3>
                    <p>{t.dcaModelLead}</p>
                  </div>
                </div>
                <div className="points-field-grid">
                  {dcaDataFields.map((field) => <span key={field.en}>{text(field)}</span>)}
                </div>
              </article>

              <article className="points-dca-passport-card">
                <div className="points-card-heading">
                  <Award size={23} />
                  <div>
                    <span>{t.supportedAssetsTitle}</span>
                    <h3>{t.dcaPassportTitle}</h3>
                  </div>
                </div>
                <div className="points-asset-row">
                  {supportedAssets.map((asset) => <b key={asset}>{asset}</b>)}
                </div>
                <div className="points-dca-passport-grid">
                  {dcaPassportItems.map((item) => (
                    <div key={item.label.en}>
                      <span>{text(item.label)}</span>
                      <strong>{text(item.value)}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <article className="points-state-card">
              <div className="points-card-heading">
                <Clock3 size={23} />
                <div>
                  <span>{t.futureStatesTitle}</span>
                  <h3>{t.futureStatesTitle}</h3>
                  <p>{t.futureStatesLead}</p>
                </div>
              </div>
              <div className="points-state-row">
                {futureStates.map((state, index) => (
                  <span className={`state-${index}`} key={state.en}>{text(state)}</span>
                ))}
              </div>
            </article>

            <div className="points-warning-grid">
              <article>
                <ShieldAlert size={22} />
                <p>{t.safetyNotice}</p>
              </article>
              <article>
                <ShieldCheck size={22} />
                <p>{t.tokenNotice}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="points-connect-section" id="connect">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">{t.connectEyebrow}</span>
              <h2>{t.connectTitle}</h2>
              <p>{t.connectLead}</p>
            </div>

            <div className="points-connector-grid">
              <article className="points-connector-panel">
                <div className="points-panel-heading">
                  <BarChart3 size={26} />
                  <div>
                    <span>{t.exchangeTitle}</span>
                    <h3>{t.exchangeDescription}</h3>
                  </div>
                </div>
                <div className="points-card-list">
                  {exchangeConnectors.map((name) => (
                    <div className="points-connection-card" key={name}>
                      <div>
                        <strong>{name}</strong>
                        <small>{t.statusNotConnected}</small>
                        <p>{t.future}: {t.exchangeFuture}</p>
                      </div>
                      <ComingSoonBadge label={t.comingSoon} />
                      <DisabledConnectButton label={t.connect} />
                    </div>
                  ))}
                </div>
              </article>

              <article className="points-connector-panel">
                <div className="points-panel-heading">
                  <WalletCards size={26} />
                  <div>
                    <span>{t.walletTitle}</span>
                    <h3>{t.walletDescription}</h3>
                  </div>
                </div>
                <div className="points-card-list">
                  {walletConnectors.map((name) => (
                    <div className="points-connection-card" key={name}>
                      <div>
                        <strong>{name}</strong>
                        <small>{t.statusNotConnected}</small>
                        <p>{t.future}: {t.walletFuture}</p>
                      </div>
                      <ComingSoonBadge label={t.comingSoon} />
                      <DisabledConnectButton label={t.connectWallet} />
                    </div>
                  ))}
                </div>
              </article>

              <article className="points-connector-panel">
                <div className="points-panel-heading">
                  <MessageCircle size={26} />
                  <div>
                    <span>{t.communityTitle}</span>
                    <h3>{t.communityDescription}</h3>
                  </div>
                </div>
                <div className="points-card-list">
                  {communityConnectors.map((name) => (
                    <div className="points-connection-card" key={name}>
                      <div>
                        <strong>{name}</strong>
                        <small>{t.statusNotConnected}</small>
                        <p>{t.future}: {t.communityFuture}</p>
                      </div>
                      <ComingSoonBadge label={t.comingSoon} />
                      <DisabledConnectButton label={t.connect} />
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="points-roadmap-section">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">{t.roadmapEyebrow}</span>
              <h2>{t.roadmapTitle}</h2>
              <p>{t.roadmapLead}</p>
            </div>
            <div className="points-roadmap">
              {roadmap.map((step, index) => (
                <div className="points-roadmap-step" key={step.en}>
                  <article>
                    {index === 0 && <CheckCircle2 size={22} />}
                    {index === 1 && <Clock3 size={22} />}
                    {index === 2 && <PlugZap size={22} />}
                    {index === 3 && <KeyRound size={22} />}
                    {index === 4 && <Bot size={22} />}
                    {index === 5 && <Sparkles size={22} />}
                    <strong>{text(step)}</strong>
                  </article>
                  {index < roadmap.length - 1 && <ArrowDown size={18} />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="points-principles">
          <div className="points-container points-principle-grid">
            <article>
              <LockKeyhole size={24} />
              <h2>{t.noTokenTitle}</h2>
              <p>{t.noTokenText}</p>
            </article>
            <article>
              <ShieldCheck size={24} />
              <h2>{t.futureTokenTitle}</h2>
              <p>{t.futureTokenText}</p>
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
    </div>
  );
}
