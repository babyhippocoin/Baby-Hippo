"use client";

import {
  AlertTriangle, ArrowRight, BookOpen, CheckCircle2, CircleHelp,
  ExternalLink, Filter, Gauge, Landmark, Layers3, Network,
  ShieldCheck, Sprout, Waves,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicHeader } from "../components/public-header";
import { useLearningMode } from "../components/public-learning-mode";
import { LobsterJourney } from "../components/lobster-journey";

type Language = "zh-TW" | "en";
type FilterId = "all" | "beginner" | "eth" | "solana" | "lending" | "staking" | "risk";
type ProtocolId = "etherfi" | "aave" | "hyperlend" | "kamino";

type Localized = { zh: string; en: string };
type Protocol = {
  id: ProtocolId;
  name: string;
  icon: typeof Landmark;
  accent: string;
  ecosystem: Localized;
  what: Localized;
  useCase: Localized;
  beginner: Localized;
  beginnerScore: "friendly" | "intermediate" | "advanced";
  risk: Localized;
  riskScore: "medium" | "medium-high" | "high";
  yieldSource: Localized;
  yieldType: Localized;
  risks: Localized[];
  exit: Localized;
  exitScore: "easy" | "moderate" | "complex";
  bestFor: Localized;
  note: Localized;
  tags: FilterId[];
  docs: string;
};

const LANGUAGE_KEY = "baby-hippo-language";
const l = (zh: string, en: string): Localized => ({ zh, en });

const protocols: Protocol[] = [
  {
    id: "etherfi", name: "Ether.fi", icon: Sprout, accent: "mint",
    ecosystem: l("以太坊生態系", "Ethereum ecosystem"),
    what: l("以 ETH 質押與再質押為核心的流動性質押協議，使用者取得代表部位的 eETH 或 weETH。", "A liquid staking protocol built around ETH staking and restaking, with eETH or weETH representing the position."),
    useCase: l("讓質押部位保持流動性，並可在相容的 DeFi 應用中使用。", "Keep a staking position liquid and potentially usable across compatible DeFi applications."),
    beginner: l("中階。先理解 ETH 質押、流動性憑證與再質押層次。", "Intermediate. Learn ETH staking, liquid receipt tokens, and restaking layers first."),
    beginnerScore: "intermediate",
    risk: l("中高", "Medium-high"), riskScore: "medium-high",
    yieldSource: l("ETH 驗證者獎勵、再質押獎勵，以及可能的協議獎勵。", "ETH validator rewards, restaking rewards, and possible protocol incentives."),
    yieldType: l("流動性質押／再質押", "Liquid staking / restaking"),
    risks: [
      l("智慧合約、驗證者與再質押風險。", "Smart-contract, validator, and restaking risk."),
      l("weETH 等憑證與 ETH 的兌換率、流動性及整合風險。", "Exchange-rate, liquidity, and integration risk between receipt tokens such as weETH and ETH."),
    ],
    exit: l("中等：通常需要交換流動性憑證或依協議流程贖回，時間與價格可能變動。", "Moderate: usually requires swapping the liquid token or following a redemption process; timing and price may vary."),
    exitScore: "moderate",
    bestFor: l("已懂 ETH 基礎，想研究質押與 DeFi 可組合性的人。", "Learners who understand ETH basics and want to study staking and DeFi composability."),
    note: l("先畫出每一層依賴，再考慮任何行動。", "Map every dependency layer before considering any action."),
    tags: ["eth", "staking", "risk"], docs: "https://www.ether.fi/",
  },
  {
    id: "aave", name: "Aave", icon: Landmark, accent: "violet",
    ecosystem: l("以太坊與多鏈生態系", "Ethereum and multichain ecosystems"),
    what: l("非託管借貸協議。使用者可提供資產取得浮動利息，或以抵押品借入資產。", "A non-custodial lending protocol where users can supply assets for variable interest or borrow against collateral."),
    useCase: l("學習提供資產、借款、抵押品、浮動利率與健康度。", "Learn supplying, borrowing, collateral, variable rates, and Health Factor."),
    beginner: l("提供資產屬中階；借款與槓桿不適合初學者。", "Supplying is intermediate; borrowing and leverage are not beginner-level."),
    beginnerScore: "intermediate",
    risk: l("中等至中高", "Medium to medium-high"), riskScore: "medium-high",
    yieldSource: l("借款人支付的浮動利息，以及可能的市場獎勵。", "Variable interest paid by borrowers plus possible market incentives."),
    yieldType: l("去中心化借貸", "Decentralized lending"),
    risks: [
      l("智慧合約、預言機、資產與網路風險。", "Smart-contract, oracle, asset, and network risk."),
      l("借款會面臨健康度下降與清算風險。", "Borrowing introduces Health Factor deterioration and liquidation risk."),
    ],
    exit: l("相對容易：市場有足夠流動性時可提領；高使用率時可能受限。", "Relatively easy when market liquidity is available; high utilization may restrict withdrawals."),
    exitScore: "easy",
    bestFor: l("想先理解成熟 DeFi 借貸結構與風險的人。", "Learners who want to understand established DeFi lending structures and risks."),
    note: l("提供資產與借款是兩種不同風險，不要混在一起看。", "Supplying and borrowing are different risk activities—do not treat them as one."),
    tags: ["beginner", "eth", "lending"], docs: "https://aave.com/docs",
  },
  {
    id: "hyperlend", name: "HyperLend", icon: Gauge, accent: "coral",
    ecosystem: l("Hyperliquid 生態系", "Hyperliquid ecosystem"),
    what: l("服務 Hyperliquid 生態系的借貸協議，強調資金效率、動態利率與進階信用工具。", "A lending protocol for the Hyperliquid ecosystem focused on capital efficiency, dynamic rates, and advanced credit tools."),
    useCase: l("研究快速交易生態中的借貸、抵押與流動性運作。", "Study lending, collateral, and liquidity inside a fast trading ecosystem."),
    beginner: l("進階。較適合已理解借貸、預言機與清算的人。", "Advanced. Better for learners who already understand lending, oracles, and liquidation."),
    beginnerScore: "advanced",
    risk: l("高", "High"), riskScore: "high",
    yieldSource: l("借款利息、資金使用率，以及可能的市場獎勵。", "Borrow interest, market utilization, and possible incentives."),
    yieldType: l("進階借貸", "Advanced lending"),
    risks: [
      l("槓桿與進階功能可能放大損失及清算風險。", "Leverage and advanced features can magnify losses and liquidation risk."),
      l("較新的生態系、動態利率、預言機與流動性風險。", "Newer-ecosystem, dynamic-rate, oracle, and liquidity risk."),
    ],
    exit: l("中等至複雜：取決於市場流動性、資金使用率與部位結構。", "Moderate to complex depending on market liquidity, utilization, and position structure."),
    exitScore: "complex",
    bestFor: l("已有 DeFi 借貸經驗，想研究 Hyperliquid 生態的人。", "Experienced DeFi lending learners studying the Hyperliquid ecosystem."),
    note: l("不建議當作第一個 DeFi 借貸工具。先觀察、再學習。", "Not recommended as a first DeFi lending tool. Observe and learn first."),
    tags: ["lending", "risk"], docs: "https://docs.hyperlend.finance/",
  },
  {
    id: "kamino", name: "Kamino", icon: Waves, accent: "sky",
    ecosystem: l("Solana 生態系", "Solana ecosystem"),
    what: l("Solana 上的 DeFi 協議，包含借貸市場、流動性產品與管理型金庫。", "A Solana DeFi protocol with lending markets, liquidity products, and managed vaults."),
    useCase: l("比較直接借貸、金庫份額與策略型資產配置。", "Compare direct lending, vault shares, and strategy-driven asset allocation."),
    beginner: l("中階。先理解 Solana 錢包、金庫份額與清算。", "Intermediate. Learn Solana wallets, vault shares, and liquidation first."),
    beginnerScore: "intermediate",
    risk: l("中高", "Medium-high"), riskScore: "medium-high",
    yieldSource: l("借款利息、流動性策略、金庫配置與可能的獎勵。", "Borrow interest, liquidity strategies, vault allocation, and possible incentives."),
    yieldType: l("借貸／金庫策略", "Lending / vault strategies"),
    risks: [
      l("智慧合約、Solana 網路、預言機與代幣風險。", "Smart-contract, Solana network, oracle, and token risk."),
      l("金庫增加策略、管理、配置與外部依賴風險。", "Vaults add strategy, management, allocation, and dependency risk."),
    ],
    exit: l("中等：直接借貸與金庫的提領條件不同，也受流動性影響。", "Moderate: direct lending and vaults have different withdrawal rules and both depend on liquidity."),
    exitScore: "moderate",
    bestFor: l("已熟悉 Solana，想比較借貸與金庫策略的人。", "Learners familiar with Solana who want to compare lending and vault strategies."),
    note: l("先確認你持有的是資產、存款憑證，還是金庫份額。", "First identify whether you hold an asset, deposit receipt, or vault share."),
    tags: ["solana", "lending", "risk"], docs: "https://kamino.com/docs",
  },
];

const copy = {
  zh: {
    eyebrow: "Baby Hippo 收益學習比較器", title: "先比較風險，再認識收益。",
    lead: "用同一套問題比較 Ether.fi、Aave、HyperLend 與 Kamino。這裡不排名、不推薦，也不顯示即時 APR。",
    mock: "教育資料・非即時 APR", noWallet: "不連接錢包、不存入資產、不執行交易。",
    modeTitle: "先選擇適合你的學習深度",
    beginnerMode: "初學模式", advancedMode: "進階模式",
    beginnerModeText: "先從 Ether.fi 認識 ETH 質押、流動性憑證與再質押。只學概念，不需要存入任何資產。",
    advancedModeText: "比較 Aave、Kamino、HyperLend 的借貸、金庫、清算與流動性風險。建議先完成基礎課程。",
    filters: "快速篩選", all: "全部", beginner: "初學較友善", eth: "ETH 生態系",
    solana: "Solana 生態系", lending: "借貸", staking: "流動性質押", risk: "較高風險",
    showing: "目前顯示", protocols: "個協議", clear: "清除篩選", noResults: "目前沒有符合這個篩選的協議。",
    cardsTitle: "用相同問題看懂每個協議", cardsLead: "資料為教育整理，不是即時狀態。協議規則、支援資產與風險都可能改變。",
    what: "它是什麼", ecosystem: "支援生態系", useCase: "主要用途", beginnerLevel: "初學者適合度",
    riskLevel: "估計風險", yieldSource: "收益來源", mainRisks: "主要風險", exit: "退出難度", bestFor: "適合誰",
    official: "查看官方資料", learnBasics: "學習基礎觀念", readRiskGuide: "閱讀風險指南",
    compare: "協議比較表", compareLead: "表格是學習捷徑，不代表哪個協議比較好。",
    protocol: "協議", beginnerCol: "初學程度", riskCol: "風險", yieldType: "收益類型", liquidity: "流動性／退出",
    note: "Baby Hippo 提醒", warnings: "收益教育提醒", warningTitle: "收益不是免費的午餐。",
    warningLead: "看到 APR 前，先看本金可能承擔什麼風險。",
    w1: "收益不保證", w1t: "任何顯示或估計收益都可能下降、停止，甚至無法彌補本金損失。",
    w2: "APR 會隨時間改變", w2t: "借貸需求、獎勵、資金使用率與市場狀況都會讓 APR 改變。",
    w3: "智慧合約有風險", w3t: "程式漏洞、預言機、跨協議整合或管理權限都可能出問題。",
    w4: "DeFi 不是銀行存款", w4t: "多數 DeFi 部位沒有存款保險，也不保證能隨時原價退出。",
    w5: "只使用承受得起損失的資金", w5t: "不要存入生活費、緊急預備金，或近期一定會用到的錢。",
    learn: "前往河馬學院", footer: "僅供教育用途。沒有即時 APR、投資建議、錢包連接或交易。",
  },
  en: {
    eyebrow: "Baby Hippo yield learning comparison", title: "Compare risk before exploring yield.",
    lead: "Compare Ether.fi, Aave, HyperLend, and Kamino using the same beginner questions. No ranking, recommendations, or live APR.",
    mock: "Educational data · No live APR", noWallet: "No wallet connection, deposits, or transactions.",
    modeTitle: "Choose the right learning depth",
    beginnerMode: "Beginner mode", advancedMode: "Advanced mode",
    beginnerModeText: "Start with Ether.fi to understand ETH staking, liquid receipt assets, and restaking. Learn the ideas only—no deposit is needed.",
    advancedModeText: "Compare lending, vault, liquidation, and liquidity risks across Aave, Kamino, and HyperLend. Complete the basics first if these ideas are new.",
    filters: "Quick filters", all: "All", beginner: "Beginner friendly", eth: "ETH ecosystem",
    solana: "Solana ecosystem", lending: "Lending", staking: "Liquid staking", risk: "Higher risk",
    showing: "Showing", protocols: "protocols", clear: "Clear filter", noResults: "No protocols match this filter.",
    cardsTitle: "Use the same questions for every protocol", cardsLead: "This is educational reference data, not live protocol state. Rules, supported assets, and risks can change.",
    what: "What it is", ecosystem: "Supported ecosystem", useCase: "Main use case", beginnerLevel: "Beginner suitability",
    riskLevel: "Estimated risk", yieldSource: "Yield source", mainRisks: "Main risks", exit: "Exit difficulty", bestFor: "Best for who",
    official: "Official resources", learnBasics: "Learn the basics", readRiskGuide: "Read Risk Guide",
    compare: "Protocol comparison table", compareLead: "The table is a learning shortcut, not a ranking.",
    protocol: "Protocol", beginnerCol: "Beginner level", riskCol: "Risk", yieldType: "Yield type", liquidity: "Liquidity / exit",
    note: "Baby Hippo note", warnings: "Yield education warnings", warningTitle: "Yield is not a free lunch.",
    warningLead: "Before looking at APR, ask what can happen to the principal.",
    w1: "Yield is not guaranteed", w1t: "Displayed or estimated yield can fall, stop, or fail to offset principal loss.",
    w2: "APR changes over time", w2t: "Borrow demand, incentives, utilization, and market conditions all change APR.",
    w3: "Smart-contract risk exists", w3t: "Code, oracles, integrations, or admin controls can fail.",
    w4: "DeFi is not a bank deposit", w4t: "Most DeFi positions have no deposit insurance and may not exit at full value on demand.",
    w5: "Never deposit money you cannot afford to lose", w5t: "Do not use living costs, emergency cash, or money needed soon.",
    learn: "Continue in Hippo Academy", footer: "Educational only. No live APR, financial advice, wallet connection, or transactions.",
  },
} as const;

export default function EarnPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [filter, setFilter] = useState<FilterId>("all");
  const { isBeginner } = useLearningMode();
  const mode = isBeginner ? "beginner" : "advanced";
  const t = language === "zh-TW" ? copy.zh : copy.en;
  const text = (value: Localized) => language === "zh-TW" ? value.zh : value.en;

  useEffect(() => {
    setLanguage(window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-TW");
    const updateLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    window.addEventListener("baby-hippo-language-change", updateLanguage);
    return () => window.removeEventListener("baby-hippo-language-change", updateLanguage);
  }, []);

  const filtered = useMemo(() => {
    const order: ProtocolId[] = isBeginner
      ? ["etherfi"]
      : ["etherfi", "aave", "kamino", "hyperlend"];
    const modeProtocols = order
      .map((id) => protocols.find((protocol) => protocol.id === id))
      .filter((protocol): protocol is Protocol => Boolean(protocol));
    return filter === "all"
      ? modeProtocols
      : modeProtocols.filter((protocol) => protocol.tags.includes(filter));
  }, [filter, isBeginner]);

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: t.all }, { id: "beginner", label: t.beginner },
    { id: "eth", label: t.eth }, { id: "solana", label: t.solana },
    { id: "lending", label: t.lending }, { id: "staking", label: t.staking },
    { id: "risk", label: t.risk },
  ];

  return (
    <div className="earn-v2-site" data-language-static>
      <PublicHeader />
      <main>
        <section className="earn-v2-hero">
          <div className="earn-v2-container earn-v2-hero-grid">
            <div>
              <span className="earn-v2-eyebrow">{t.eyebrow}</span><h1>{t.title}</h1>
              <p className="earn-v2-lead">{t.lead}</p>
              <div className="earn-v2-hero-notes">
                <span><BookOpen size={16} /> {t.mock}</span><span><ShieldCheck size={16} /> {t.noWallet}</span>
              </div>
            </div>
            <div className="earn-v2-hero-art" aria-hidden="true">
              <div className="earn-v2-orbit one" /><div className="earn-v2-orbit two" />
              <span className="earn-v2-center"><Gauge size={42} /><strong>4</strong><small>protocols</small></span>
              <i className="n1"><Sprout size={19} /></i><i className="n2"><Landmark size={19} /></i>
              <i className="n3"><Gauge size={19} /></i><i className="n4"><Waves size={19} /></i>
            </div>
          </div>
        </section>

        <LobsterJourney compact />

        <section className="earn-v2-filter-section">
          <div className="earn-v2-container">
            <div className="earn-v2-mode-section">
              <strong>{t.modeTitle}</strong>
              <div className="earn-v2-current-mode">{isBeginner ? t.beginnerMode
                : (language === "zh-TW" ? "成長模式" : "Growth Mode")}</div>
              <p><BookOpen size={16} /> {mode === "beginner" ? t.beginnerModeText : t.advancedModeText}</p>
            </div>
            {isBeginner && <div className="earn-v2-beginner-road" data-language-static>
              <article><small>01</small><strong>{language === "zh-TW" ? "被動收入是什麼？" : "What is passive income?"}</strong>
                <p>{language === "zh-TW" ? "像讓店面或貨車工作產生收入。鏈上工具可能產生收益，但也可能虧損。" : "Like putting a shop or truck to work. On-chain tools may produce income, but can also lose money."}</p></article>
              <article><small>02</small><strong>{language === "zh-TW" ? "新手先看 Ether.fi" : "Beginners start with Ether.fi"}</strong>
                <p>{language === "zh-TW" ? "先理解長期 ETH 如何參與質押，不需要立刻存入資產。" : "First understand how long-term ETH can join staking. No deposit is needed to learn."}</p></article>
              <article><small>03</small><strong>{language === "zh-TW" ? "進階再看 Aave" : "Study Aave next"}</strong>
                <p>{language === "zh-TW" ? "Aave 像線上抵押借貸市場。借款前要先懂清算與借款安全分數。" : "Aave is like an online collateral market. Learn liquidation and borrowing safety before borrowing."}</p></article>
              <article><small>04</small><strong>{language === "zh-TW" ? "高階才看 Kamino／HyperLend" : "Kamino / HyperLend come later"}</strong>
                <p>{language === "zh-TW" ? "它們有更多鏈別、金庫與借貸風險，不適合作為第一步。" : "They add network, vault, and lending risks, so they are not the first step."}</p></article>
            </div>}
            <div className="earn-v2-filter-heading"><span><Filter size={17} /> {t.filters}</span>
              <small>{t.showing} {filtered.length} {t.protocols}</small></div>
            <div className="earn-v2-filters" role="group" aria-label={t.filters}>
              {filters.map((item) => <button type="button" key={item.id}
                className={filter === item.id ? "active" : ""} aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}>{item.label}</button>)}
            </div>
          </div>
        </section>

        <section className="earn-v2-protocols">
          <div className="earn-v2-container">
            <div className="earn-v2-section-heading"><span className="earn-v2-eyebrow">{t.cardsTitle}</span>
              <h2>{t.cardsTitle}</h2><p>{t.cardsLead}</p></div>
            {filtered.length === 0 ? <div className="earn-v2-empty">{t.noResults}</div> :
              <div className="earn-v2-card-grid">{filtered.map((protocol) =>
                <ProtocolCard key={protocol.id} protocol={protocol} text={text} t={t} />)}</div>}
          </div>
        </section>

        <section className="earn-v2-compare">
          <div className="earn-v2-container">
            <div className="earn-v2-section-heading"><span className="earn-v2-eyebrow">{t.compare}</span>
              <h2>{t.compare}</h2><p>{t.compareLead}</p></div>
            <div className="earn-v2-table-wrap">
              <table><thead><tr><th>{t.protocol}</th><th>{t.ecosystem}</th><th>{t.beginnerCol}</th>
                <th>{t.riskCol}</th><th>{t.yieldType}</th><th>{t.liquidity}</th><th>{t.note}</th></tr></thead>
                <tbody>{filtered.map((protocol) => <tr key={protocol.id}>
                  <th>{protocol.name}</th><td>{text(protocol.ecosystem)}</td>
                  <td><LevelBadge value={protocol.beginnerScore} label={text(protocol.beginner)} /></td>
                  <td><RiskBadge value={protocol.riskScore} label={text(protocol.risk)} /></td>
                  <td>{text(protocol.yieldType)}</td><td>{text(protocol.exit)}</td><td>{text(protocol.note)}</td>
                </tr>)}</tbody></table>
            </div>
          </div>
        </section>

        <section className="earn-v2-payment-example" data-language-static>
          <div className="earn-v2-container">
            <div className="earn-v2-section-heading">
              <span className="earn-v2-eyebrow">{language === "zh-TW" ? "加密支付層" : "Crypto Payment Layer"}</span>
              <h2>{language === "zh-TW" ? "回饋要用實際金額看懂。" : "Understand rewards with a real amount."}</h2>
              <p>{language === "zh-TW"
                ? "以下只是固定比例的教育試算，不代表 Ether.fi Card 現在或未來一定提供 3% 回饋。方案、地區與資格都可能改變。"
                : "This is a fixed-rate educational example. It does not claim Ether.fi Card currently or permanently provides 3%; programs, regions, and eligibility can change."}</p>
            </div>
            <div className="earn-v2-payment-grid">
              <article><small>{language === "zh-TW" ? "消費金額" : "Spending"}</small><strong>NT$10,000</strong></article>
              <article><small>{language === "zh-TW" ? "一般信用卡・假設 1%" : "Typical card · assumed 1%"}</small><strong>NT$100</strong></article>
              <article><small>Ether.fi Card · {language === "zh-TW" ? "假設 3%" : "assumed 3%"}</small><strong>NT$300</strong></article>
              <article className="difference"><small>{language === "zh-TW" ? "示意差額" : "Illustrative difference"}</small><strong>NT$200</strong></article>
            </div>
            <blockquote>{language === "zh-TW"
              ? "很多人抱怨手續費，卻沒有計算長期回饋。"
              : "Many people complain about fees without calculating long-term rewards."}</blockquote>
            <p className="earn-v2-payment-note"><AlertTriangle size={17} /> {language === "zh-TW"
              ? "回饋不等於免費獲利。仍要比較年費、匯率、稅務、資格、資產價格與平台風險。"
              : "Rewards are not free profit. Compare annual fees, exchange rates, taxes, eligibility, asset prices, and platform risk."}</p>
          </div>
        </section>

        <section className="earn-v2-warnings">
          <div className="earn-v2-container">
            <div className="earn-v2-section-heading"><span className="earn-v2-eyebrow">{t.warnings}</span>
              <h2>{t.warningTitle}</h2><p>{t.warningLead}</p></div>
            <div className="earn-v2-warning-grid">
              <Warning icon={AlertTriangle} title={t.w1} text={t.w1t} />
              <Warning icon={Gauge} title={t.w2} text={t.w2t} />
              <Warning icon={Layers3} title={t.w3} text={t.w3t} />
              <Warning icon={Landmark} title={t.w4} text={t.w4t} />
              <Warning icon={ShieldCheck} title={t.w5} text={t.w5t} important />
            </div>
            <Link className="earn-v2-learn-link" href="/learn">{t.learn} <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>
      <footer className="earn-v2-footer"><div className="earn-v2-container"><strong>Baby Hippo</strong><p>{t.footer}</p></div></footer>
    </div>
  );
}

function ProtocolCard({ protocol, text, t }: {
  protocol: Protocol; text: (value: Localized) => string; t: typeof copy.zh | typeof copy.en;
}) {
  const Icon = protocol.icon;
  const lessonHref = protocol.id === "etherfi" ? "/learn#etherfi"
    : protocol.id === "aave" ? "/learn#aave" : "/learn#risk";
  const lessonLabel = protocol.id === "etherfi" || protocol.id === "aave"
    ? `${t.learnBasics}: ${protocol.name}` : t.readRiskGuide;
  return (
    <article className={`earn-v2-card ${protocol.accent}`} id={protocol.id}>
      <header><span className="earn-v2-card-icon"><Icon size={27} /></span><div><small>{text(protocol.yieldType)}</small>
        <h3>{protocol.name}</h3><span><Network size={13} /> {text(protocol.ecosystem)}</span></div>
        <RiskBadge value={protocol.riskScore} label={text(protocol.risk)} /></header>
      <section className="earn-v2-what"><Label icon={CircleHelp} text={t.what} /><p>{text(protocol.what)}</p></section>
      <div className="earn-v2-fact-grid">
        <Fact label={t.useCase} value={text(protocol.useCase)} />
        <Fact label={t.beginnerLevel} value={text(protocol.beginner)} />
        <Fact label={t.yieldSource} value={text(protocol.yieldSource)} />
        <Fact label={t.exit} value={text(protocol.exit)} />
      </div>
      <section className="earn-v2-risk-list"><Label icon={AlertTriangle} text={t.mainRisks} />
        <ul>{protocol.risks.map((risk) => <li key={text(risk)}><AlertTriangle size={14} /> {text(risk)}</li>)}</ul></section>
      <section className="earn-v2-best"><Label icon={CheckCircle2} text={t.bestFor} /><p>{text(protocol.bestFor)}</p>
        <small>{text(protocol.note)}</small></section>
      <div className="earn-v2-card-actions">
        <Link href={lessonHref}>{lessonLabel} <ArrowRight size={14} /></Link>
        <a href={protocol.docs} target="_blank" rel="noreferrer">{t.official} <ExternalLink size={14} /></a>
      </div>
    </article>
  );
}

function Label({ icon: Icon, text }: { icon: typeof CircleHelp; text: string }) {
  return <span className="earn-v2-label"><Icon size={14} /> {text}</span>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section><strong>{label}</strong><p>{value}</p></section>;
}

function LevelBadge({ value, label }: { value: Protocol["beginnerScore"]; label: string }) {
  return <span className={`earn-v2-badge level-${value}`} title={label}>{label.split(/[。.]/)[0]}</span>;
}

function RiskBadge({ value, label }: { value: Protocol["riskScore"]; label: string }) {
  return <span className={`earn-v2-badge risk-${value}`}>{label}</span>;
}

function Warning({ icon: Icon, title, text, important = false }: {
  icon: typeof AlertTriangle; title: string; text: string; important?: boolean;
}) {
  return <article className={important ? "important" : ""}><span><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></article>;
}
