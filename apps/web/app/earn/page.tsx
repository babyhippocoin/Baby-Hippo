"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  ExternalLink,
  Filter,
  Gauge,
  Landmark,
  Layers3,
  Network,
  ShieldCheck,
  Sprout,
  Waves,
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
    id: "etherfi",
    name: "Ether.fi",
    icon: Sprout,
    accent: "mint",
    ecosystem: l("以太坊生態系", "Ethereum ecosystem"),
    what: l(
      "Ether.fi 讓使用者學習以太幣質押、再質押與流動性憑證。它也能搭配加密卡片教育，理解傳統現金回饋與 WETH 資產回饋的差別。",
      "Ether.fi helps learners understand ETH staking, restaking, and liquid receipt assets. It also gives a useful case study for comparing traditional cashback with crypto asset rewards paid in WETH.",
    ),
    useCase: l(
      "理解 WETH 回饋、weETH、質押／再質押，以及進階使用者如何把資產放入 Aave 作為抵押品。",
      "Learn how WETH rewards, weETH, staking, restaking, and Aave collateral can fit into a more advanced on-chain asset strategy.",
    ),
    beginner: l(
      "適合先學概念。新手不需要立刻操作，應先理解波動、費用、平台風險與智慧合約風險。",
      "Good for learning the concepts first. Beginners should not rush; understand volatility, fees, platform risk, and smart-contract risk before acting.",
    ),
    beginnerScore: "intermediate",
    risk: l("中等偏高", "Medium-high"),
    riskScore: "medium-high",
    yieldSource: l(
      "可能來自質押、再質押、協議獎勵或加密卡片回饋；實際條件會變動，並不保證。",
      "May come from staking, restaking, protocol incentives, or crypto card rewards. Terms can change and nothing is guaranteed.",
    ),
    yieldType: l("質押／再質押／WETH 回饋", "Staking / restaking / WETH rewards"),
    risks: [
      l(
        "WETH 是會波動的加密資產，不是固定現金；價格可能上漲，也可能下跌。",
        "WETH is a volatile crypto asset, not fixed cash. Its value can rise or fall.",
      ),
      l(
        "質押、再質押與 weETH 會增加協議、流動性、兌換率與智慧合約風險。",
        "Staking, restaking, and weETH add protocol, liquidity, exchange-rate, and smart-contract risk.",
      ),
      l(
        "若把 WETH 或 weETH 放入 Aave 作為抵押品，還會增加清算風險與借貸風險。",
        "Using WETH or weETH as Aave collateral adds liquidation risk and lending-market risk.",
      ),
    ],
    exit: l(
      "中等。可能需要兌換、解除質押或依照協議規則退出，價格與時間都可能不同。",
      "Moderate. Exiting may require swapping, unstaking, or following protocol withdrawal rules; timing and pricing can vary.",
    ),
    exitScore: "moderate",
    bestFor: l(
      "想理解加密回饋如何從現金回饋延伸到資產累積、質押與進階 DeFi 的學習者。",
      "Learners who want to understand how rewards can move from cash-style rebates into asset accumulation, staking, and advanced DeFi.",
    ),
    note: l(
      "Baby Hippo 的重點不是推廣操作，而是幫你看懂每一層風險，再決定是否前進。",
      "Baby Hippo is not here to push action. The goal is to help you understand each risk layer before moving forward.",
    ),
    tags: ["eth", "staking", "risk"],
    docs: "https://www.ether.fi/",
  },
  {
    id: "aave",
    name: "Aave",
    icon: Landmark,
    accent: "violet",
    ecosystem: l("以太坊與多鏈生態系", "Ethereum and multichain ecosystems"),
    what: l("Aave 是非託管借貸協議，使用者可以提供資產，也可以用抵押品借款。", "Aave is a non-custodial lending protocol where users can supply assets or borrow against collateral."),
    useCase: l("學習存款、借款、抵押品、變動利率、健康係數與清算風險。", "Learn supplying, borrowing, collateral, variable rates, Health Factor, and liquidation risk."),
    beginner: l("存款屬於中階；借款與槓桿不適合完全新手。", "Supplying is intermediate; borrowing and leverage are not beginner-level."),
    beginnerScore: "intermediate",
    risk: l("中等至中等偏高", "Medium to medium-high"),
    riskScore: "medium-high",
    yieldSource: l("借款人支付的變動利息，以及可能的市場獎勵。", "Variable interest paid by borrowers plus possible market incentives."),
    yieldType: l("去中心化借貸", "Decentralized lending"),
    risks: [
      l("智慧合約、預言機、資產與網路風險。", "Smart-contract, oracle, asset, and network risk."),
      l("借款會帶來健康係數下降與清算風險。", "Borrowing introduces Health Factor deterioration and liquidation risk."),
    ],
    exit: l("若市場流動性足夠，退出通常較容易；高利用率可能限制提領。", "Usually easier when liquidity is available; high utilization may restrict withdrawals."),
    exitScore: "easy",
    bestFor: l("想理解成熟 DeFi 借貸結構與風險的人。", "Learners who want to understand established DeFi lending structures and risks."),
    note: l("提供資產與借款是不同風險活動，不要混在一起看。", "Supplying and borrowing are different risk activities. Do not treat them as one."),
    tags: ["beginner", "eth", "lending"],
    docs: "https://aave.com/docs",
  },
  {
    id: "hyperlend",
    name: "HyperLend",
    icon: Gauge,
    accent: "coral",
    ecosystem: l("Hyperliquid 生態系", "Hyperliquid ecosystem"),
    what: l("HyperLend 是面向 Hyperliquid 生態的借貸協議，偏向進階資產效率與動態利率學習。", "HyperLend is a lending protocol for the Hyperliquid ecosystem, focused on capital efficiency and dynamic-rate markets."),
    useCase: l("研究高速交易生態中的借貸、抵押與流動性風險。", "Study lending, collateral, and liquidity inside a fast trading ecosystem."),
    beginner: l("進階。建議已理解借貸、預言機與清算後再研究。", "Advanced. Better for learners who already understand lending, oracles, and liquidation."),
    beginnerScore: "advanced",
    risk: l("高", "High"),
    riskScore: "high",
    yieldSource: l("借款利息、市場利用率與可能的激勵。", "Borrow interest, market utilization, and possible incentives."),
    yieldType: l("進階借貸", "Advanced lending"),
    risks: [
      l("槓桿與進階功能可能放大虧損與清算風險。", "Leverage and advanced features can magnify losses and liquidation risk."),
      l("新興生態、動態利率、預言機與流動性風險。", "Newer-ecosystem, dynamic-rate, oracle, and liquidity risk."),
    ],
    exit: l("中等至複雜，取決於流動性、利用率與部位結構。", "Moderate to complex depending on liquidity, utilization, and position structure."),
    exitScore: "complex",
    bestFor: l("已熟悉 DeFi 借貸，並想研究 Hyperliquid 生態的人。", "Experienced DeFi lending learners studying the Hyperliquid ecosystem."),
    note: l("不建議作為第一個 DeFi 借貸工具，先觀察與學習。", "Not recommended as a first DeFi lending tool. Observe and learn first."),
    tags: ["lending", "risk"],
    docs: "https://docs.hyperlend.finance/",
  },
  {
    id: "kamino",
    name: "Kamino",
    icon: Waves,
    accent: "sky",
    ecosystem: l("Solana 生態系", "Solana ecosystem"),
    what: l("Kamino 是 Solana 上的 DeFi 協議，包含借貸市場、流動性產品與金庫策略。", "Kamino is a Solana DeFi protocol with lending markets, liquidity products, and vault strategies."),
    useCase: l("比較直接借貸、金庫份額與策略型資產配置。", "Compare direct lending, vault shares, and strategy-driven asset allocation."),
    beginner: l("中階。應先理解 Solana 錢包、金庫份額與清算。", "Intermediate. Learn Solana wallets, vault shares, and liquidation first."),
    beginnerScore: "intermediate",
    risk: l("中等偏高", "Medium-high"),
    riskScore: "medium-high",
    yieldSource: l("借款利息、流動性策略、金庫配置與可能激勵。", "Borrow interest, liquidity strategies, vault allocation, and possible incentives."),
    yieldType: l("借貸／金庫策略", "Lending / vault strategies"),
    risks: [
      l("智慧合約、Solana 網路、預言機與代幣風險。", "Smart-contract, Solana network, oracle, and token risk."),
      l("金庫會增加策略、管理、配置與依賴風險。", "Vaults add strategy, management, allocation, and dependency risk."),
    ],
    exit: l("中等。直接借貸與金庫有不同退出規則，且都依賴流動性。", "Moderate. Direct lending and vaults have different withdrawal rules and both depend on liquidity."),
    exitScore: "moderate",
    bestFor: l("熟悉 Solana，想比較借貸與金庫策略的人。", "Learners familiar with Solana who want to compare lending and vault strategies."),
    note: l("先確認自己持有的是資產、存款憑證，還是金庫份額。", "First identify whether you hold an asset, deposit receipt, or vault share."),
    tags: ["solana", "lending", "risk"],
    docs: "https://kamino.com/docs",
  },
];

const copy = {
  zh: {
    eyebrow: "Baby Hippo 收益學習",
    title: "先理解風險，再探索收益。",
    lead: "用同一套新手問題比較 Ether.fi、Aave、HyperLend 與 Kamino。這裡不排名、不推薦，也不顯示即時 APR。",
    mock: "教育資料・非即時 APR",
    noWallet: "不連錢包、不存款、不交易",
    pathTitle: "學習路線",
    pathLabel: "收益基礎",
    pathText: "先看懂回饋、資產波動與 DeFi 風險，再決定是否進一步研究。",
    filters: "快速篩選",
    all: "全部",
    beginner: "新手友善",
    eth: "以太坊生態系",
    solana: "Solana 生態系",
    lending: "借貸",
    staking: "質押",
    risk: "較高風險",
    showing: "目前顯示",
    protocols: "個協議",
    noResults: "沒有符合此篩選的協議。",
    cardsTitle: "每個協議都用同一套問題看懂",
    cardsLead: "這是教育參考，不是即時協議狀態。規則、支援資產與風險都可能改變。",
    what: "這是什麼",
    ecosystem: "支援生態系",
    useCase: "主要用途",
    beginnerLevel: "新手適合度",
    riskLevel: "預估風險",
    yieldSource: "收益來源",
    mainRisks: "主要風險",
    exit: "退出難度",
    bestFor: "適合誰",
    official: "官方資料",
    learnBasics: "學習基礎",
    readRiskGuide: "閱讀風險指南",
    compare: "協議比較表",
    compareLead: "這張表是學習捷徑，不是排名。",
    protocol: "協議",
    beginnerCol: "新手程度",
    riskCol: "風險",
    yieldType: "收益類型",
    liquidity: "流動性／退出",
    note: "Baby Hippo 提醒",
    paymentEyebrow: "加密卡片教育",
    paymentTitle: "從現金回饋，理解加密資產回饋。",
    paymentLead: "傳統信用卡通常回饋現金或點數；Ether.fi 類型的加密卡片教育重點，是理解回饋可能以 WETH 這類加密資產發放。WETH 不是固定現金，價格會上漲也會下跌。",
    spending: "假設消費",
    traditionalCard: "傳統信用卡・假設現金回饋",
    cryptoCard: "加密卡片・假設 WETH 回饋",
    cashbackNote: "比例只是教育範例，不代表 Ether.fi 現在或未來一定提供固定回饋。",
    rewardQuote: "很多人只看手續費，卻沒有看懂自己拿到的是現金、點數，還是會波動的加密資產。",
    rewardCycleTitle: "進階資產成長循環",
    rewardCycleText: "進階使用者可能把 WETH 轉為 weETH、參與質押或再質押，甚至把 WETH／weETH 放入 Aave 作為抵押品。這可能形成資產累積循環，但也會增加費用、波動、平台、智慧合約與清算風險。",
    warnings: "收益教育提醒",
    warningTitle: "收益不是免費午餐。",
    warningLead: "看 APR 或回饋前，先問本金可能發生什麼事。",
    w1: "收益不保證",
    w1t: "回饋、APR 或協議獎勵都可能下降、停止，或不足以抵銷本金損失。",
    w2: "WETH 會波動",
    w2t: "WETH 是加密資產，不是固定現金。收到回饋後，價值仍會隨市場變動。",
    w3: "智慧合約風險存在",
    w3t: "協議程式、預言機、整合服務或管理權限都可能出問題。",
    w4: "Aave 抵押品有清算風險",
    w4t: "把 WETH 或 weETH 放入 Aave 並借款，若價格下跌或健康係數惡化，可能被清算。",
    w5: "不要使用生活必需金",
    w5t: "不要用房租、生活費、緊急預備金或短期需要的錢參與 DeFi。",
    learn: "繼續到學習中心",
    footer: "僅供教育用途。不提供即時 APR、投資建議、錢包連線或交易功能。",
  },
  en: {
    eyebrow: "Baby Hippo yield education",
    title: "Understand the risk before exploring yield.",
    lead: "Compare Ether.fi, Aave, HyperLend, and Kamino through beginner-friendly questions. No rankings, recommendations, or live APR.",
    mock: "Educational data · No live APR",
    noWallet: "No wallet connection, deposits, or transactions",
    pathTitle: "Learning path",
    pathLabel: "Yield basics",
    pathText: "Understand rewards, asset volatility, and DeFi risk before deciding whether to study advanced strategies.",
    filters: "Quick filters",
    all: "All",
    beginner: "Beginner friendly",
    eth: "Ethereum ecosystem",
    solana: "Solana ecosystem",
    lending: "Lending",
    staking: "Staking",
    risk: "Higher risk",
    showing: "Showing",
    protocols: "protocols",
    noResults: "No protocols match this filter.",
    cardsTitle: "Use the same questions for every protocol",
    cardsLead: "This is educational reference data, not live protocol state. Rules, supported assets, and risks can change.",
    what: "What it is",
    ecosystem: "Supported ecosystem",
    useCase: "Main use case",
    beginnerLevel: "Beginner suitability",
    riskLevel: "Estimated risk",
    yieldSource: "Yield source",
    mainRisks: "Main risks",
    exit: "Exit difficulty",
    bestFor: "Best for who",
    official: "Official resources",
    learnBasics: "Learn the basics",
    readRiskGuide: "Read Risk Guide",
    compare: "Protocol comparison table",
    compareLead: "The table is a learning shortcut, not a ranking.",
    protocol: "Protocol",
    beginnerCol: "Beginner level",
    riskCol: "Risk",
    yieldType: "Yield type",
    liquidity: "Liquidity / exit",
    note: "Baby Hippo note",
    paymentEyebrow: "Crypto card education",
    paymentTitle: "From cashback to crypto asset rewards.",
    paymentLead: "Traditional cards usually reward users with cash or points. The key lesson from crypto card programs such as Ether.fi is that rewards may be paid in WETH. WETH is not fixed cash; it is a volatile crypto asset that can go up or down.",
    spending: "Example spending",
    traditionalCard: "Traditional card · assumed cash reward",
    cryptoCard: "Crypto card · assumed WETH reward",
    cashbackNote: "The percentage is only an educational example. It does not claim Ether.fi offers any fixed reward now or in the future.",
    rewardQuote: "Many people focus only on fees without asking whether they are receiving cash, points, or a volatile crypto asset.",
    rewardCycleTitle: "Advanced asset growth cycle",
    rewardCycleText: "Advanced users may convert WETH into weETH, stake or restake it, or use WETH / weETH as Aave collateral. This can create an asset accumulation loop, but it also adds fees, volatility, platform risk, smart-contract risk, and liquidation risk.",
    warnings: "Yield education warnings",
    warningTitle: "Yield is not a free lunch.",
    warningLead: "Before looking at APR or rewards, ask what can happen to the principal.",
    w1: "Yield is not guaranteed",
    w1t: "Rewards, APR, or protocol incentives can fall, stop, or fail to offset principal loss.",
    w2: "WETH is volatile",
    w2t: "WETH is a crypto asset, not fixed cash. After rewards are received, their value can still move with the market.",
    w3: "Smart-contract risk exists",
    w3t: "Protocol code, oracles, integrations, or admin controls can fail.",
    w4: "Aave collateral can be liquidated",
    w4t: "If WETH or weETH is used as Aave collateral and the position borrows against it, price drops or Health Factor deterioration can lead to liquidation.",
    w5: "Never use money you need to live",
    w5t: "Do not use rent, living costs, emergency cash, or money needed soon in DeFi.",
    learn: "Continue to the learning hub",
    footer: "Educational only. No live APR, financial advice, wallet connection, or transactions.",
  },
} as const;

export default function EarnPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [filter, setFilter] = useState<FilterId>("all");
  const { isBeginner } = useLearningMode();
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
    { id: "all", label: t.all },
    { id: "beginner", label: t.beginner },
    { id: "eth", label: t.eth },
    { id: "solana", label: t.solana },
    { id: "lending", label: t.lending },
    { id: "staking", label: t.staking },
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
              <strong>{t.pathTitle}</strong>
              <div className="earn-v2-current-mode">{t.pathLabel}</div>
              <p><BookOpen size={16} /> {t.pathText}</p>
            </div>
            {isBeginner && <div className="earn-v2-beginner-road" data-language-static>
              <article><small>01</small><strong>{language === "zh-TW" ? "先分清回饋類型" : "Start with the reward type"}</strong>
                <p>{language === "zh-TW" ? "現金回饋比較直覺；WETH 回饋是加密資產，價格會波動。" : "Cashback is easier to understand. WETH rewards are crypto assets, so their value can move."}</p></article>
              <article><small>02</small><strong>{language === "zh-TW" ? "再理解 Ether.fi" : "Then study Ether.fi"}</strong>
                <p>{language === "zh-TW" ? "先學質押、再質押、WETH 與 weETH，不需要立刻存入任何資產。" : "Learn staking, restaking, WETH, and weETH first. No deposit is needed to study the concepts."}</p></article>
              <article><small>03</small><strong>{language === "zh-TW" ? "進階才研究 Aave" : "Aave is an advanced step"}</strong>
                <p>{language === "zh-TW" ? "把資產放入 Aave 作為抵押品前，必須理解健康係數、借款與清算。" : "Before using assets as Aave collateral, understand Health Factor, borrowing, and liquidation."}</p></article>
              <article><small>04</small><strong>{language === "zh-TW" ? "最後再比較其他協議" : "Compare other protocols later"}</strong>
                <p>{language === "zh-TW" ? "Kamino 與 HyperLend 會加入不同網路、金庫或進階借貸風險。" : "Kamino and HyperLend add different network, vault, or advanced lending risks."}</p></article>
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
              <span className="earn-v2-eyebrow">{t.paymentEyebrow}</span>
              <h2>{t.paymentTitle}</h2>
              <p>{t.paymentLead}</p>
            </div>
            <div className="earn-v2-payment-grid">
              <article><small>{t.spending}</small><strong>NT$10,000</strong></article>
              <article><small>{t.traditionalCard}</small><strong>NT$100</strong></article>
              <article><small>{t.cryptoCard}</small><strong>NT$300</strong></article>
              <article className="difference"><small>{language === "zh-TW" ? "教育試算差額" : "Illustrative difference"}</small><strong>NT$200</strong></article>
            </div>
            <p className="earn-v2-payment-note"><AlertTriangle size={17} /> {t.cashbackNote}</p>
            <blockquote>{t.rewardQuote}</blockquote>
            <article className="earn-v2-mode-section">
              <strong>{t.rewardCycleTitle}</strong>
              <p><Layers3 size={16} /> {t.rewardCycleText}</p>
            </article>
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
  return <span className={`earn-v2-badge level-${value}`} title={label}>{label.split(/[／/]/)[0]}</span>;
}

function RiskBadge({ value, label }: { value: Protocol["riskScore"]; label: string }) {
  return <span className={`earn-v2-badge risk-${value}`}>{label}</span>;
}

function Warning({ icon: Icon, title, text, important = false }: {
  icon: typeof AlertTriangle; title: string; text: string; important?: boolean;
}) {
  return <article className={important ? "important" : ""}><span><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></article>;
}
