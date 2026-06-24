"use client";

import {
  AlertTriangle, ArrowRight, Award, Banknote, Bitcoin, BookOpen, Building2, CalendarDays, Check,
  CircleDollarSign, Coins, ExternalLink, Landmark, Link2, PiggyBank, RefreshCw,
  ShieldCheck, Sparkles, TrendingUp, WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicHeader } from "../components/public-header";
import { GlossaryTerm, useLearningMode } from "../components/public-learning-mode";
import { LobsterJourney } from "../components/lobster-journey";

type Language = "zh-TW" | "en";
type RiskLevel = "conservative" | "balanced" | "growth";
type CycleMode = "bear" | "transition" | "earlyBull" | "lateBull";
type AssetId = "BTC" | "ETH" | "SOL" | "LINK" | "Yield";
type PlannerInputs = {
  income: number;
  fixedExpenses: number;
  flexibleExpenses: number;
  emergencyTarget: number;
  risk: RiskLevel;
  cycle: CycleMode;
  assets: AssetId[];
};

const STORAGE_KEY = "baby-hippo-dca-planner-v2";
const LANGUAGE_KEY = "baby-hippo-language";
const POINTS_STORAGE_KEY = "baby-hippo-points-mvp";
const POINT_VALUES: Record<string, number> = {
  "learn-bitcoin": 10, "learn-ethereum": 10, "learn-dca": 10, "learn-aave": 10,
  "learn-etherfi": 10, "learn-risk": 10, "learn-seed": 10,
  "learn-onramp": 10,
  "plan-first": 5, "plan-balanced": 20, "plan-emergency": 20, "dca-started": 20,
  "yield-etherfi": 15, "yield-aave": 15, "yield-kamino": 15, "yield-hyperlend": 15,
  "community-story": 5, "community-telegram": 5, "community-x": 5, "community-values": 5,
  "funnel-exchange": 5, "funnel-passive": 15, "funnel-aave": 20, "dca-habit-verified": 50,
};
const DCA_CHECKLIST_IDS = ["asset", "amount", "risk", "cash", "noLeverage"] as const;
type DcaChecklistId = typeof DCA_CHECKLIST_IDS[number];
const projectionYears = [1, 3, 5, 10] as const;
const defaultInputs: PlannerInputs = {
  income: 5000, fixedExpenses: 2600, flexibleExpenses: 900,
  emergencyTarget: 6000, risk: "balanced",
  cycle: "transition",
  assets: ["BTC", "ETH", "SOL", "LINK", "Yield"],
};

const assets: Record<AssetId, { color: string; icon: typeof Bitcoin }> = {
  BTC: { color: "#f3aa36", icon: Bitcoin },
  ETH: { color: "#779bf0", icon: Coins },
  SOL: { color: "#8f7df0", icon: Sparkles },
  LINK: { color: "#4d8ee8", icon: Link2 },
  Yield: { color: "#51c9bb", icon: Landmark },
};

const profiles: Record<RiskLevel, { rate: number; weights: Record<AssetId, number> }> = {
  conservative: { rate: .04, weights: { BTC: 50, ETH: 25, SOL: 5, LINK: 5, Yield: 15 } },
  balanced: { rate: .05, weights: { BTC: 40, ETH: 30, SOL: 10, LINK: 8, Yield: 12 } },
  growth: { rate: .06, weights: { BTC: 30, ETH: 30, SOL: 20, LINK: 10, Yield: 10 } },
};

const cycles: Record<CycleMode, {
  investmentShare: number;
  adjustments: Record<AssetId, number>;
}> = {
  bear: {
    investmentShare: 1,
    adjustments: { BTC: 10, ETH: 3, SOL: -5, LINK: -3, Yield: -5 },
  },
  transition: {
    investmentShare: .9,
    adjustments: { BTC: 4, ETH: 2, SOL: -2, LINK: -1, Yield: -3 },
  },
  earlyBull: {
    investmentShare: .8,
    adjustments: { BTC: 5, ETH: 3, SOL: 1, LINK: 0, Yield: -4 },
  },
  lateBull: {
    investmentShare: .6,
    adjustments: { BTC: 8, ETH: 2, SOL: -4, LINK: -2, Yield: -4 },
  },
};

const copy = {
  zh: {
    eyebrow: "我的投資計畫", title: "先照顧生活，再建立長期投入計畫。",
    lead: "把收入、支出、緊急預備金與偏好資產放在同一張圖裡，建立一份看得懂、做得到的每月定期定額計畫。",
    saved: "資料只儲存在這台裝置，不連接錢包，也不會執行交易。",
    start: "從每月生活開始", startSub: "輸入數字後，右側計畫會立即更新。", reset: "恢復預設值",
    income: "每月收入", fixed: "每月固定支出", fixedHelp: "例如房租、貸款、保險、學費與固定帳單。",
    flexible: "每月彈性支出", flexibleHelp: "例如飲食、交通、娛樂與不固定的生活費。",
    emergency: "緊急預備金目標", emergencyHelp: "工具會把目標平均分成 12 個月，優先列入每月現金準備。",
    risk: "風險偏好", conservative: "保守", balanced: "均衡", growth: "成長",
    conservativeDesc: "較高 BTC 比例，降低波動資產比重。",
    balancedDesc: "在主流資產、成長資產與收益學習間取得平衡。",
    growthDesc: "提高 SOL 等成長資產比例，也承擔更大波動。",
    cycle: "市場週期情境",
    cycleHelp: "由你手動選擇目前較接近的市場環境。這不是市場預測，也不會自動追蹤價格。",
    bear: "熊市累積", transition: "轉換期", earlyBull: "牛市初期", lateBull: "牛市末期",
    bearDesc: "價格與信心偏低時，以核心資產和規律累積為主。",
    transitionDesc: "方向還不明確時，保留一些現金並維持穩定投入。",
    earlyBullDesc: "市場動能回升時，維持參與，但避免因追漲而突然加碼。",
    lateBullDesc: "價格與情緒偏熱時，降低投入強度並提高現金緩衝。",
    cycleExample: "簡單配置例子（不是本次計算結果）",
    bearExample: "BTC 40%・ETH 30%・SOL 15%・LINK 10%・現金 5%",
    transitionExample: "核心資產為主，維持均衡投入並保留部分現金。",
    earlyBullExample: "繼續定投，但降低投入強度，避免因上漲追價。",
    lateBullExample: "提高現金比例，保護已累積成果並降低積極買入。",
    cyclePlan: "本期策略說明", plannedDca: "本月建議 DCA 金額", strategyCash: "額外保留現金",
    whyAllocation: "為什麼配置會改變",
    bearWhy: "熊市情境提高 BTC、ETH 等核心資產比重，並降低高波動與收益部位；重點是有紀律地累積，不是猜最低點。",
    transitionWhy: "轉換期保留 10% 可投入餘額，以免市場方向不明時一次投入過多；配置略偏核心資產。",
    earlyBullWhy: "牛市初期保留 20% 可投入餘額，維持核心配置，同時限制追高與過度增加收益風險。",
    lateBullWhy: "牛市末期只使用 60% 可投入餘額，降低高波動資產與收益部位，優先保留安全緩衝。",
    preferred: "偏好資產", preferredHelp: "至少選擇一項。配置會依選擇重新計算。",
    monthlyPlan: "你的每月計畫", surplus: "支出後結餘", cashReserve: "每月緊急預備金",
    investable: "每月可投入金額", noRoom: "目前支出與預備金已用完每月結餘。",
    targetNote: "以 12 個月完成預備金目標為示意", allocation: "建議配置",
    allocationSub: "依風險偏好與所選資產重新配置。",
    schedule: "每月定期定額摘要", scheduleLead: "拆成兩次投入，降低單一日期帶來的心理壓力。",
    first: "每月 1 日", second: "每月 15 日", weekly: "約當每週", selected: "項資產",
    projection: "長期試算", projectionTitle: "看見紀律累積，不是獲利承諾。",
    projectionLead: "成長線使用固定教育假設，未反映真實市場波動、費用、稅務或協議損失。",
    chart: "資產成長試算圖", projected: "教育假設結果", contributions: "累計投入",
    year: "年", contributed: "累計投入", difference: "示意差額",
    education: "使用前請先理解", notAdvice: "這不是財務建議",
    notAdviceText: "配置與試算只用來幫助思考，不是個人化投資推薦。",
    dca: "DCA 降低擇時壓力", dcaText: "固定節奏能減少追高殺低，但不保證獲利，也不會消除虧損。",
    cashFirst: "先準備緊急現金", cashFirstText: "近期生活需要與緊急預備金，應排在長期投入之前。",
    yieldRisk: "收益也有風險", yieldRiskText: "Yield 涉及智慧合約、協議、流動性與底層資產風險，不等同銀行存款。",
    assumptions: "試算假設",
    assumptionsText: "保守、均衡、成長分別使用固定 4%、5%、6% 年化教育假設，按月投入與複利。週期由使用者手動選擇，只調整投入強度與配置，不預測價格。試算未計入手續費、稅務、通膨、市場波動或協議損失；真實結果可能更低、為負，或大幅波動。",
    estimateOnly: "所有預估都只是情境試算，不是預測、承諾或保證報酬。",
    learn: "閱讀定期定額指南",
    executeEyebrow: "DCA Execute Layer", executeTitle: "如何開始",
    executeLead: "把試算結果整理成下一步學習清單。這裡不會連接交易所、不會下單，也不會移動資產。",
    monthlyInvestment: "本月 DCA 規劃", monthly: "每月", weeklyAmount: "約當每週",
    passiveLayer: "被動收入層", noAllocation: "本計畫未配置",
    btcEthTitle: "比特幣與以太坊 DCA",
    btcEthText: "先學會如何選擇合規平台、確認資產與網路，再考慮分批買入。不要因為價格波動臨時改變生活預算。",
    buyBtc: "學習如何買入 BTC", buyEth: "學習如何買入 ETH",
    yieldTitle: "被動收入層",
    yieldText: "被動收入層使用可信賴的 DeFi 協議，讓長期持有資產有機會產生收益；收益不保證，也可能發生本金損失。",
    firstProtocol: "第一個建議學習的協議", learnEtherfi: "學習 Ether.fi", readYield: "閱讀收益指南",
    advancedTitle: "進階 DeFi", advancedText: "進階使用者可以學習借貸策略。請先理解抵押品、利率、健康度與清算風險。",
    learnAave: "學習 Aave", readRisk: "閱讀風險指南",
    recommendation: "市場週期行動提醒",
    bearAction: "增加累積專注度", transitionAction: "採取均衡方式",
    earlyBullAction: "維持 DCA 節奏", lateBullAction: "提高現金準備",
    bearActionText: "熊市情境重點是依預算規律累積核心資產，不猜最低點，也不使用緊急預備金。",
    transitionActionText: "轉換期方向不明，維持均衡配置並保留部分現金，避免一次投入過多。",
    earlyBullActionText: "牛市初期維持原有 DCA 節奏，不因上漲而突然提高預算或追價。",
    lateBullActionText: "牛市末期提高現金準備，降低追高與過度曝險，保留未來調整空間。",
    warningTitle: "執行前再次確認", warningAdvice: "這不是財務建議",
    warningRisk: "所有投資都有風險", warningDefi: "DeFi 有智慧合約風險",
    warningEmergency: "絕不使用緊急預備金投資",
    platforms: "支援平台", platformsLead: "Binance、OKX 與 Ether.fi 為合作推薦連結；Aave 僅提供教育資訊。平台規則與地區限制可能變動，請自行確認。",
    comingSoon: "即將推出", educationOnly: "教育內容",
    readyAchievement: "準備開始執行", readyEarned: "已取得 +10 BHP",
    readyPending: "閱讀本區後可取得 +10 BHP 教育成就積分",
    savePlan: "儲存我的第一份定投計畫", planSaved: "已建立計畫・+5 BHP",
    planCreatedMessage: "你已建立計畫，但還沒有開始執行。",
    nextExchange: "下一步：選擇交易所",
    exchangeSelectedMessage: "你已選擇交易所。接下來請在交易所建立定期定額。",
    confirmDca: "我已在交易所建立定投", confirmTitle: "開始定投自我回報",
    confirmLead: "Baby Hippo 不會讀取你的交易所資料。請逐項確認，只有真正建立現貨定期定額時才回報。",
    checkAsset: "我已選擇 BTC 或 ETH", checkAmount: "我已設定固定金額",
    checkRisk: "我了解這不是保證獲利", checkCash: "我沒有使用生活必需金",
    checkNoLeverage: "我沒有使用合約或槓桿",
    submitDca: "提交我的 DCA 承諾", dcaReported: "已提交定投承諾・+20 BHP",
    dcaReportedMessage: "你已回報開始定投。Baby Hippo 目前不會讀取你的交易所資料，請保持紀律。",
    unverified: "未驗證的自我回報", leverageWarning: "如果你只是入金打合約，這不算 DCA。",
    proofTitle: "我的 DCA 行動進度", noPlan: "尚未建立計畫", planCreated: "已建立計畫",
    exchangeSelected: "已選擇交易所", startedReported: "已提交定投承諾", growthReady: "準備進入 Lobster Watch",
    chainNext: "下一階段：讓 Lobster Watch 看見你的鏈上成長",
    chainText: "交易所內的定投資料 Baby Hippo 看不到。當你未來把 ETH 或其他資產提領到自己的鏈上錢包，Lobster Watch 才能用公開地址追蹤資產成長。",
    learnLobster: "了解鏈上錢包與 Lobster Watch",
    footer: "僅供教育用途，不構成財務建議，不保證獲利，也不會執行交易。",
    donutLabel: "每月資產配置圓餅圖", lineLabel: "長期資產成長試算線圖", assets: "項資產",
  },
  en: {
    eyebrow: "My Investment Plan", title: "Take care of real life before building a long-term plan.",
    lead: "Bring income, expenses, emergency cash, and preferred assets into one clear monthly DCA plan you can understand and follow.",
    saved: "Data stays on this device. No wallet connection and no transactions.",
    start: "Start with monthly life", startSub: "Your plan updates instantly as the numbers change.", reset: "Reset defaults",
    income: "Monthly income", fixed: "Monthly fixed expenses", fixedHelp: "For example: rent, loans, insurance, tuition, and recurring bills.",
    flexible: "Monthly flexible expenses", flexibleHelp: "For example: food, transport, entertainment, and variable living costs.",
    emergency: "Emergency cash target", emergencyHelp: "The tool divides this target across 12 months and puts cash preparation first.",
    risk: "Risk level", conservative: "Conservative", balanced: "Balanced", growth: "Growth",
    conservativeDesc: "More BTC weight with less exposure to volatile growth assets.",
    balancedDesc: "A middle mix of core assets, growth assets, and yield learning.",
    growthDesc: "More growth-asset exposure, including SOL, with greater volatility.",
    cycle: "Market cycle scenario",
    cycleHelp: "Manually choose the environment that feels closest today. This is not a market prediction and does not track prices automatically.",
    bear: "Bear Market", transition: "Transition", earlyBull: "Early Bull", lateBull: "Late Bull",
    bearDesc: "When prices and confidence are weak, focus on core assets and disciplined accumulation.",
    transitionDesc: "When direction is unclear, keep some cash and continue at a steady pace.",
    earlyBullDesc: "As momentum improves, stay involved without suddenly chasing prices.",
    lateBullDesc: "When prices and sentiment feel hot, reduce intensity and keep a larger cash buffer.",
    cycleExample: "Simple allocation example (not this calculator's output)",
    bearExample: "BTC 40% · ETH 30% · SOL 15% · LINK 10% · Cash 5%",
    transitionExample: "Favor core assets, keep a balanced pace, and retain some cash.",
    earlyBullExample: "Continue buying with lower intensity and avoid chasing rising prices.",
    lateBullExample: "Increase cash, protect accumulated progress, and reduce aggressive buying.",
    cyclePlan: "Current strategy explanation", plannedDca: "Suggested DCA this month", strategyCash: "Additional cash kept aside",
    whyAllocation: "Why the allocation changes",
    bearWhy: "The bear scenario increases core BTC and ETH weight while reducing volatile and yield exposure. The goal is disciplined accumulation, not guessing the bottom.",
    transitionWhy: "The transition scenario keeps 10% of investable cash aside while direction is unclear and slightly favors core assets.",
    earlyBullWhy: "The early-bull scenario keeps 20% aside, maintains core exposure, and limits price chasing or added yield risk.",
    lateBullWhy: "The late-bull scenario uses only 60% of investable cash and reduces volatile and yield exposure to protect flexibility.",
    preferred: "Preferred assets", preferredHelp: "Select at least one. Allocation is recalculated from your choices.",
    monthlyPlan: "Your monthly plan", surplus: "Surplus after expenses", cashReserve: "Monthly emergency cash",
    investable: "Available monthly investment", noRoom: "Expenses and emergency cash currently use the full monthly surplus.",
    targetNote: "Illustrates reaching the emergency target over 12 months", allocation: "Suggested allocation",
    allocationSub: "Rebalanced for your risk level and selected assets.",
    schedule: "Monthly DCA schedule", scheduleLead: "Split into two dates to reduce pressure around one perfect day.",
    first: "1st of each month", second: "15th of each month", weekly: "Weekly equivalent", selected: "assets selected",
    projection: "Long-term illustration", projectionTitle: "See discipline compound—not a profit promise.",
    projectionLead: "The growth line uses a fixed educational assumption and excludes real volatility, fees, taxes, and protocol losses.",
    chart: "Portfolio growth illustration", projected: "Educational growth example", contributions: "Contributions only",
    year: "year", contributed: "Contributed", difference: "Illustrative difference",
    education: "Understand before using", notAdvice: "This is not financial advice",
    notAdviceText: "Allocations and projections are thinking tools, not personalized investment recommendations.",
    dca: "DCA reduces timing pressure", dcaText: "A schedule can reduce emotional timing decisions, but it cannot guarantee profit or prevent loss.",
    cashFirst: "Keep emergency cash first", cashFirstText: "Near-term living needs and emergency cash should come before long-term investing.",
    yieldRisk: "Yield carries added risk", yieldRiskText: "Yield involves smart-contract, protocol, liquidity, and underlying-asset risk. It is not a bank deposit.",
    assumptions: "Projection assumptions",
    assumptionsText: "Conservative, balanced, and growth use fixed 4%, 5%, and 6% annual educational assumptions with monthly contributions and compounding. The manually selected cycle changes contribution intensity and allocation only; it does not predict prices. Fees, taxes, inflation, volatility, and protocol losses are excluded. Real results may be lower, negative, or highly volatile.",
    estimateOnly: "Every projection is a scenario estimate, not a prediction, promise, or guaranteed return.",
    learn: "Read DCA Guide",
    executeEyebrow: "DCA Execute Layer", executeTitle: "How To Start",
    executeLead: "Turn the plan into a clear next-learning checklist. This section does not connect to exchanges, place orders, or move assets.",
    monthlyInvestment: "Monthly DCA plan", monthly: "Monthly", weeklyAmount: "Weekly equivalent",
    passiveLayer: "Passive Income Layer", noAllocation: "Not included in this plan",
    btcEthTitle: "Bitcoin & Ethereum DCA",
    btcEthText: "First learn how to choose a compliant platform and verify the asset and network. Do not change your real-life budget because prices move.",
    buyBtc: "Learn how to buy BTC", buyEth: "Learn how to buy ETH",
    yieldTitle: "Passive Income Layer",
    yieldText: "Passive Income Layer uses trusted DeFi protocols to potentially earn yield on long-term holdings. Yield is not guaranteed and principal can be lost.",
    firstProtocol: "Recommended first protocol to learn", learnEtherfi: "Learn Ether.fi", readYield: "Read Yield Guide",
    advancedTitle: "Advanced DeFi", advancedText: "Advanced users can learn lending and borrowing strategies. Understand collateral, rates, Health Factor, and liquidation risk first.",
    learnAave: "Learn Aave", readRisk: "Read Risk Guide",
    recommendation: "Market cycle action note",
    bearAction: "Increase accumulation focus", transitionAction: "Use a balanced approach",
    earlyBullAction: "Maintain DCA", lateBullAction: "Increase cash reserves",
    bearActionText: "In a bear scenario, focus on steady core-asset accumulation within your budget. Do not guess the bottom or use emergency cash.",
    transitionActionText: "When direction is unclear, keep a balanced allocation and retain some cash instead of investing everything at once.",
    earlyBullActionText: "Maintain the existing DCA pace. Do not suddenly raise the budget or chase prices because the market is rising.",
    lateBullActionText: "Increase cash reserves, reduce price chasing and excess exposure, and preserve room to adjust later.",
    warningTitle: "Confirm before taking action", warningAdvice: "This is not financial advice",
    warningRisk: "All investments involve risk", warningDefi: "DeFi carries smart contract risk",
    warningEmergency: "Never invest emergency funds",
    platforms: "Supported Platforms", platformsLead: "Binance, OKX, and Ether.fi are partner referral links. Aave is educational only. Platform rules and regional restrictions may change, so verify them yourself.",
    comingSoon: "Coming soon", educationOnly: "Educational",
    readyAchievement: "Ready To Execute", readyEarned: "+10 BHP earned",
    readyPending: "View this section to earn the +10 BHP educational achievement",
    savePlan: "Save My First DCA Plan", planSaved: "Plan Created · +5 BHP",
    planCreatedMessage: "You created a plan, but you have not started executing it yet.",
    nextExchange: "Next: Choose an exchange",
    exchangeSelectedMessage: "You selected an exchange. Next, create a recurring DCA plan on that exchange.",
    confirmDca: "I created a recurring DCA on the exchange", confirmTitle: "Self-report DCA Started",
    confirmLead: "Baby Hippo cannot read your exchange activity. Confirm every item only after creating a real spot DCA.",
    checkAsset: "I selected BTC or ETH", checkAmount: "I set a fixed amount",
    checkRisk: "I understand profit is not guaranteed", checkCash: "I did not use essential living money",
    checkNoLeverage: "I did not use futures or leverage",
    submitDca: "Submit My DCA Commitment", dcaReported: "DCA Commitment Submitted · +20 BHP",
    dcaReportedMessage: "You reported starting DCA. Baby Hippo does not read your exchange data, so please stay disciplined.",
    unverified: "Unverified self-report", leverageWarning: "Depositing money to trade futures does not count as DCA.",
    proofTitle: "My DCA action progress", noPlan: "No plan created", planCreated: "Plan Created",
    exchangeSelected: "Exchange Selected", startedReported: "DCA Commitment Submitted", growthReady: "Ready for Lobster Watch",
    chainNext: "Next stage: Let Lobster Watch see your on-chain growth",
    chainText: "Baby Hippo cannot see DCA activity held inside an exchange. If you later withdraw ETH or other assets to your own on-chain wallet, Lobster Watch can follow growth using a public address.",
    learnLobster: "Learn On-Chain Wallets and Lobster Watch",
    footer: "Educational only. Not financial advice. No profit promise and no transactions.",
    donutLabel: "Monthly asset allocation donut chart", lineLabel: "Long-term portfolio growth line chart", assets: "assets",
  },
} as const;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    .format(Number.isFinite(value) ? value : 0);
}

function formatTwd(value: number) {
  return `NT$${new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 })
    .format(Number.isFinite(value) ? value : 0)}`;
}

function projectMonthly(monthly: number, years: number, annualRate: number) {
  if (monthly <= 0) return 0;
  const rate = annualRate / 12;
  return monthly * ((Math.pow(1 + rate, years * 12) - 1) / rate);
}

function compactTwd(value: number) {
  if (value >= 1_000_000) return `NT$${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `NT$${Math.round(value / 1_000)}K`;
  return `NT$${Math.round(value)}`;
}

function ScenarioCurveChart({ monthly, lowRate, highRate, accent, label, language }: {
  monthly: number;
  lowRate: number;
  highRate: number;
  accent: string;
  label: string;
  language: Language;
}) {
  const midRate = (lowRate + highRate) / 2;
  const years = Array.from({ length: 11 }, (_, year) => year);
  const points = years.map((year) => ({
    year,
    principal: monthly * 12 * year,
    scenario: year === 0 ? 0 : projectMonthly(monthly, year, midRate),
    high: year === 0 ? 0 : projectMonthly(monthly, year, highRate),
  }));
  const maxValue = Math.max(...points.map((point) => Math.max(point.principal, point.high)), 1);
  const left = 62, right = 540, top = 24, bottom = 246;
  const x = (year: number) => left + year / 10 * (right - left);
  const y = (value: number) => bottom - value / maxValue * (bottom - top);
  const curve = (key: "principal" | "scenario") =>
    points.map((point, index) => `${index ? "L" : "M"} ${x(point.year)} ${y(point[key])}`).join(" ");
  const markers = [0, 1, 3, 5, 10];

  return (
    <div className="planner-v2-scenario-chart" style={{ "--scenario-accent": accent } as React.CSSProperties}>
      <svg viewBox="0 0 570 290" role="img"
        aria-label={`${label}：${language === "zh-TW" ? "虛線為累計投入本金，實線為情境資產估值" : "dashed principal line and solid scenario valuation line"}`}>
        {[0, .25, .5, .75, 1].map((step) => {
          const value = maxValue * step;
          return <g key={step}>
            <line x1={left} x2={right} y1={y(value)} y2={y(value)} className="scenario-grid-line" />
            <text x={left - 8} y={y(value) + 4} textAnchor="end" className="scenario-axis-label">
              {compactTwd(value)}
            </text>
          </g>;
        })}
        <path d={curve("principal")} className="scenario-principal-line" />
        <path d={curve("scenario")} className="scenario-value-line" />
        {markers.slice(1).map((year) => {
          const point = points[year];
          return <circle key={year} cx={x(year)} cy={y(point.scenario)} r="4.5" className="scenario-value-dot" />;
        })}
        {markers.map((year) => <text key={year} x={x(year)} y="272" textAnchor="middle"
          className="scenario-year-label">{year}Y</text>)}
      </svg>
      <div className="planner-v2-scenario-legend">
        <span><i className="principal" /> {language === "zh-TW" ? "累計投入本金" : "Cumulative principal"}</span>
        <span><i className="valuation" /> {language === "zh-TW" ? "情境資產估值" : "Scenario valuation"}</span>
      </div>
    </div>
  );
}

function AllocationDonut({ allocation, label, assetLabel }: {
  allocation: { id: AssetId; percentage: number }[]; label: string; assetLabel: string;
}) {
  let cursor = 0;
  const segments = allocation.map((item) => {
    const start = cursor;
    cursor += item.percentage;
    return `${assets[item.id].color} ${start}% ${cursor}%`;
  });
  return (
    <div className="planner-v2-donut" style={{ background: `conic-gradient(${segments.join(",")})` }}
      role="img" aria-label={label}>
      <span><strong>{allocation.length}</strong><small>{assetLabel}</small></span>
    </div>
  );
}

function GrowthLineChart({ monthly, rate, label, projectedLabel, contributionLabel }: {
  monthly: number; rate: number; label: string; projectedLabel: string; contributionLabel: string;
}) {
  const points = Array.from({ length: 11 }, (_, years) => ({
    years, projected: projectMonthly(monthly, years, rate), contributed: monthly * 12 * years,
  }));
  const max = Math.max(points.at(-1)?.projected ?? 0, 1);
  const left = 48, right = 510, top = 22, bottom = 220;
  const x = (year: number) => left + year / 10 * (right - left);
  const y = (value: number) => bottom - value / max * (bottom - top);
  const path = (key: "projected" | "contributed") =>
    points.map((point, i) => `${i ? "L" : "M"} ${x(point.years)} ${y(point[key])}`).join(" ");
  return (
    <div className="planner-v2-line-wrap">
      <svg viewBox="0 0 540 260" role="img" aria-label={label} className="planner-v2-line-chart">
        {[0, .25, .5, .75, 1].map((step) => {
          const value = max * step, lineY = y(value);
          return <g key={step}><line x1={left} x2={right} y1={lineY} y2={lineY} className="v2-grid-line" />
            <text x="42" y={lineY + 4} textAnchor="end" className="v2-axis-label">
              {step === 0 ? "$0" : `$${Math.round(value / 1000)}k`}
            </text></g>;
        })}
        <path d={path("contributed")} className="v2-line-contribution" />
        <path d={path("projected")} className="v2-line-projected" />
        {[1, 3, 5, 10].map((year) =>
          <circle key={year} cx={x(year)} cy={y(points[year].projected)} r="5" className="v2-line-dot" />)}
        {[0, 1, 3, 5, 10].map((year) =>
          <text key={year} x={x(year)} y="244" textAnchor="middle" className="v2-year-label">{year}Y</text>)}
      </svg>
      <div className="planner-v2-chart-legend">
        <span><i className="projected" /> {projectedLabel}</span>
        <span><i className="contributed" /> {contributionLabel}</span>
      </div>
    </div>
  );
}

export default function DcaPlannerPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [inputs, setInputs] = useState<PlannerInputs>(defaultInputs);
  const [restored, setRestored] = useState(false);
  const [planAwarded, setPlanAwarded] = useState(false);
  const [dcaGuideRead, setDcaGuideRead] = useState(false);
  const [exchangeSelected, setExchangeSelected] = useState(false);
  const [dcaStarted, setDcaStarted] = useState(false);
  const [showDcaConfirm, setShowDcaConfirm] = useState(false);
  const [dcaChecklist, setDcaChecklist] = useState<Record<DcaChecklistId, boolean>>({
    asset: false, amount: false, risk: false, cash: false, noLeverage: false,
  });
  const { isBeginner } = useLearningMode();
  const t = language === "zh-TW" ? copy.zh : copy.en;

  useEffect(() => {
    setLanguage(window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-TW");
    try {
      const points = JSON.parse(window.localStorage.getItem(POINTS_STORAGE_KEY) || "{}") as { completed?: string[] };
      setPlanAwarded(Array.isArray(points.completed) && points.completed.includes("plan-first"));
      setDcaGuideRead(Array.isArray(points.completed) && points.completed.includes("learn-dca"));
      setExchangeSelected(Array.isArray(points.completed) && points.completed.includes("funnel-exchange"));
      setDcaStarted(Array.isArray(points.completed) && points.completed.includes("dca-started"));
    } catch {
      setPlanAwarded(false);
      setDcaGuideRead(false);
      setExchangeSelected(false);
      setDcaStarted(false);
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<PlannerInputs>;
        const validAssets = Array.isArray(parsed.assets)
          ? parsed.assets.filter((asset): asset is AssetId => typeof asset === "string" && asset in assets)
          : [];
        const validCycle = parsed.cycle && parsed.cycle in cycles ? parsed.cycle : defaultInputs.cycle;
        setInputs({
          ...defaultInputs,
          ...parsed,
          cycle: validCycle,
          assets: validAssets.length ? validAssets : defaultInputs.assets,
        });
      } catch { setInputs(defaultInputs); }
    }
    setRestored(true);
    const updateLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    window.addEventListener("baby-hippo-language-change", updateLanguage);
    return () => window.removeEventListener("baby-hippo-language-change", updateLanguage);
  }, []);

  useEffect(() => {
    if (restored) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs, restored]);

  const updateNumber = (
    key: "income" | "fixedExpenses" | "flexibleExpenses" | "emergencyTarget", value: string,
  ) => setInputs((current) => ({ ...current, [key]: Math.max(0, Number(value) || 0) }));

  const toggleAsset = (asset: AssetId) => setInputs((current) => {
    const selected = current.assets.includes(asset);
    if (selected && current.assets.length === 1) return current;
    return { ...current, assets: selected ? current.assets.filter((item) => item !== asset) : [...current.assets, asset] };
  });

  const completeFirstPlan = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(POINTS_STORAGE_KEY) || "{}") as {
        completed?: string[];
      };
      const completed = Array.isArray(saved.completed) ? saved.completed : [];
      const next = completed.includes("plan-first") ? completed : [...completed, "plan-first"];
      const totalPoints = next.reduce((sum, id) => sum + (POINT_VALUES[id] || 0), 0);
      const level = totalPoints >= 600 ? 4 : totalPoints >= 300 ? 3 : totalPoints >= 100 ? 2 : 1;
      window.localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify({ completed: next, totalPoints, level }));
      window.dispatchEvent(new CustomEvent("baby-hippo-points-change", { detail: next }));
      setPlanAwarded(true);
    } catch {
      setPlanAwarded(false);
    }
  };

  const completeExchangeSelection = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(POINTS_STORAGE_KEY) || "{}") as {
        completed?: string[];
      };
      const completed = Array.isArray(saved.completed) ? saved.completed : [];
      const next = completed.includes("funnel-exchange") ? completed : [...completed, "funnel-exchange"];
      const totalPoints = next.reduce((sum, id) => sum + (POINT_VALUES[id] || 0), 0);
      const level = totalPoints >= 600 ? 4 : totalPoints >= 300 ? 3 : totalPoints >= 100 ? 2 : 1;
      window.localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify({ completed: next, totalPoints, level }));
      window.dispatchEvent(new CustomEvent("baby-hippo-points-change", { detail: next }));
      setExchangeSelected(true);
    } catch {
      // The external link still works if local educational progress cannot be saved.
    }
  };

  const completeDcaGuide = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(POINTS_STORAGE_KEY) || "{}") as {
        completed?: string[];
      };
      const completed = Array.isArray(saved.completed) ? saved.completed : [];
      const next = completed.includes("learn-dca") ? completed : [...completed, "learn-dca"];
      const totalPoints = next.reduce((sum, id) => sum + (POINT_VALUES[id] || 0), 0);
      const level = totalPoints >= 600 ? 4 : totalPoints >= 300 ? 3 : totalPoints >= 100 ? 2 : 1;
      window.localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify({ completed: next, totalPoints, level }));
      window.dispatchEvent(new CustomEvent("baby-hippo-points-change", { detail: next }));
      setDcaGuideRead(true);
    } catch {
      setDcaGuideRead(false);
    }
  };

  const reportDcaStarted = () => {
    if (!DCA_CHECKLIST_IDS.every((id) => dcaChecklist[id])) return;
    try {
      const saved = JSON.parse(window.localStorage.getItem(POINTS_STORAGE_KEY) || "{}") as {
        completed?: string[];
      };
      const completed = Array.isArray(saved.completed) ? saved.completed : [];
      const next = completed.includes("dca-started") ? completed : [...completed, "dca-started"];
      const totalPoints = next.reduce((sum, id) => sum + (POINT_VALUES[id] || 0), 0);
      const level = totalPoints >= 600 ? 4 : totalPoints >= 300 ? 3 : totalPoints >= 100 ? 2 : 1;
      window.localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify({ completed: next, totalPoints, level }));
      window.dispatchEvent(new CustomEvent("baby-hippo-points-change", { detail: next }));
      setDcaStarted(true);
      setShowDcaConfirm(false);
    } catch {
      setDcaStarted(false);
    }
  };

  const results = useMemo(() => {
    const expenses = inputs.fixedExpenses + inputs.flexibleExpenses;
    const surplus = Math.max(0, inputs.income - expenses);
    const cashReserve = Math.min(surplus, inputs.emergencyTarget / 12);
    const investable = Math.max(0, surplus - cashReserve);
    const profile = profiles[inputs.risk];
    const cycle = cycles[inputs.cycle];
    const plannedDca = investable * cycle.investmentShare;
    const strategyCash = investable - plannedDca;
    const adjustedWeights = Object.fromEntries(
      (Object.keys(assets) as AssetId[]).map((asset) => [
        asset,
        Math.max(1, profile.weights[asset] + cycle.adjustments[asset]),
      ]),
    ) as Record<AssetId, number>;
    const selectedWeight = inputs.assets.reduce((sum, asset) => sum + adjustedWeights[asset], 0);
    const allocation = inputs.assets.map((id) => {
      const percentage = selectedWeight ? adjustedWeights[id] / selectedWeight * 100 : 0;
      return { id, percentage, amount: plannedDca * percentage / 100 };
    });
    const projections = projectionYears.map((years) => ({
      years, contributed: plannedDca * 12 * years,
      projected: projectMonthly(plannedDca, years, profile.rate),
    }));
    return {
      surplus, cashReserve, investable, plannedDca, strategyCash,
      allocation, projections, rate: profile.rate, cycle,
    };
  }, [inputs]);
  const allocationAmount = (asset: AssetId) =>
    results.allocation.find((item) => item.id === asset)?.amount ?? 0;
  const coreMonthly = allocationAmount("BTC") + allocationAmount("ETH");
  const cycleActionKey = `${inputs.cycle}Action` as keyof typeof t;
  const cycleActionTextKey = `${inputs.cycle}ActionText` as keyof typeof t;
  const assetName = (asset: AssetId) => asset === "Yield" && isBeginner
    ? (language === "zh-TW" ? "被動收入層" : "Passive Income Layer") : asset;
  const scenarioSimulation = useMemo(() => {
    const monthly = results.investable;
    const horizons = projectionYears.map((years) => ({
      years,
      principal: monthly * 12 * years,
    }));
    return {
      monthly,
      yearly: monthly * 12,
      horizons,
      scenarios: [
        {
          id: "weak", labelZh: "弱勢走勢", labelEn: "Weak market scenario",
          rateZh: "年化假設 -5% ～ +3%", rateEn: "Annual assumption: -5% to +3%",
          low: -.05, high: .03,
          descriptionZh: "熊市延長、震盪很久、成長較慢，甚至短期可能低於投入本金。",
          descriptionEn: "A prolonged bear market may remain volatile, grow slowly, or stay below contributed principal for a period.",
        },
        {
          id: "average", labelZh: "平均走勢", labelEn: "Average market scenario",
          rateZh: "年化假設 8% ～ 15%", rateEn: "Annual assumption: 8% to 15%",
          low: .08, high: .15,
          descriptionZh: "市場經歷牛熊循環，長期可能逐步累積。",
          descriptionEn: "The market moves through bull and bear cycles and may accumulate gradually over time.",
        },
        {
          id: "strong", labelZh: "強勢走勢", labelEn: "Strong market scenario",
          rateZh: "年化假設 25% ～ 40%", rateEn: "Annual assumption: 25% to 40%",
          low: .25, high: .40,
          descriptionZh: "遇到明顯牛市主升段，資產可能快速成長，但波動也最大。",
          descriptionEn: "A strong bull phase may grow quickly, while also producing the largest volatility and drawdowns.",
        },
      ].map((scenario) => ({
        ...scenario,
        values: horizons.map(({ years, principal }) => ({
          years,
          principal,
          low: projectMonthly(monthly, years, scenario.low),
          high: projectMonthly(monthly, years, scenario.high),
        })),
      })),
    };
  }, [results.investable]);

  return (
    <div className="planner-v2-site" data-language-static>
      <PublicHeader />
      <main>
        <section className="planner-v2-hero">
          <div className="planner-v2-container planner-v2-hero-grid">
            <div><span className="planner-v2-eyebrow">{t.eyebrow}</span><h1>{t.title}</h1>
              <p className="planner-v2-lead">{t.lead}</p>
              <div className="planner-v2-trust"><ShieldCheck size={18} /><span>{t.saved}</span></div>
            </div>
            <div className="planner-v2-hero-card" aria-hidden="true">
              <div className="planner-v2-hero-ring one" /><div className="planner-v2-hero-ring two" />
              <span className="planner-v2-hero-icon"><PiggyBank size={42} /></span>
              <strong>{formatMoney(results.investable)}</strong><small>{t.investable}</small>
              <div><span>1Y</span><span>3Y</span><span>5Y</span><span>10Y</span></div>
            </div>
          </div>
        </section>

        {isBeginner && <section className="planner-v2-beginner-guide" data-language-static>
          <div className="planner-v2-container">
            <div className="planner-v2-section-heading"><span className="planner-v2-eyebrow">
              {language === "zh-TW" ? "新手先懂四件事" : "Four things to understand first"}</span>
              <h2>{language === "zh-TW" ? "計畫要能配合生活，才走得久。" : "A plan lasts only when it fits real life."}</h2></div>
            <div className="beginner-concept-grid">
              <article><h3>{language === "zh-TW" ? "先留緊急預備金" : "Emergency cash comes first"}</h3>
                <p>{language === "zh-TW" ? "生活費像貨車的備用油。先留好修車、生病與臨時支出的錢，再考慮投入。" : "Emergency cash is like reserve fuel for a truck. Keep money for repairs, health, and surprises before investing."}</p></article>
              <article><h3><GlossaryTerm term="DCA">{language === "zh-TW" ? "定期定額降低壓力" : "DCA reduces pressure"}</GlossaryTerm></h3>
                <p>{language === "zh-TW" ? "像每月固定買台積電零股，不用每天猜最低點，但仍可能虧損。" : "Like buying a small amount of the same stock monthly. You do not guess the bottom, but losses are still possible."}</p></article>
              <article><h3>{language === "zh-TW" ? "試算不是承諾" : "Projections are not promises"}</h3>
                <p>{language === "zh-TW" ? "圖表只是用假設數字練習規劃，不是在預測未來，也不保證會賺錢。" : "Charts practice planning with assumptions. They do not predict the future or guarantee profit."}</p></article>
              <article><h3>{language === "zh-TW" ? "市場週期會改變投入強度" : "Market cycles change DCA intensity"}</h3>
                <p>{language === "zh-TW" ? "市場冷清時可專注累積；市場過熱時多留現金，避免因興奮追高。" : "Cold markets may favor steady accumulation; hot markets may call for more cash and less chasing."}</p></article>
            </div>
          </div>
        </section>}

        <section className="planner-v2-workspace" id="calculator">
          <div className="planner-v2-container planner-v2-workspace-grid">
            <article className="planner-v2-input-card">
              <div className="planner-v2-card-heading">
                <div><span className="planner-v2-eyebrow">{t.start}</span><h2>{t.startSub}</h2></div>
                <button type="button" onClick={() => setInputs(defaultInputs)}><RefreshCw size={15} /> {t.reset}</button>
              </div>
              <div className="planner-v2-field-grid">
                <NumberField icon={CircleDollarSign} label={t.income} value={inputs.income}
                  onChange={(value) => updateNumber("income", value)} />
                <NumberField icon={WalletCards} label={t.fixed} help={t.fixedHelp} value={inputs.fixedExpenses}
                  onChange={(value) => updateNumber("fixedExpenses", value)} />
                <NumberField icon={WalletCards} label={t.flexible} help={t.flexibleHelp} value={inputs.flexibleExpenses}
                  onChange={(value) => updateNumber("flexibleExpenses", value)} />
                <NumberField icon={PiggyBank} label={t.emergency} help={t.emergencyHelp} value={inputs.emergencyTarget}
                  onChange={(value) => updateNumber("emergencyTarget", value)} />
              </div>
              <fieldset className="planner-v2-risk"><legend>{t.risk}</legend>
                {(["conservative", "balanced", "growth"] as RiskLevel[]).map((level) => (
                  <label className={inputs.risk === level ? "selected" : ""} key={level}>
                    <input type="radio" name="risk-v2" checked={inputs.risk === level}
                      onChange={() => setInputs((current) => ({ ...current, risk: level }))} />
                    <span><strong>{t[level]}</strong><small>{t[`${level}Desc` as keyof typeof t]}</small></span><Check size={17} />
                  </label>
                ))}
              </fieldset>
              <fieldset className="planner-v2-cycle"><legend>{t.cycle}</legend><p>{t.cycleHelp}</p>
                <div>
                  {(["bear", "transition", "earlyBull", "lateBull"] as CycleMode[]).map((cycle) => (
                    <label className={inputs.cycle === cycle ? "selected" : ""} key={cycle}>
                      <input type="radio" name="cycle-v2" checked={inputs.cycle === cycle}
                        onChange={() => setInputs((current) => ({ ...current, cycle }))} />
                      <span><strong>{t[cycle]}</strong>
                        <small>{t[`${cycle}Desc` as keyof typeof t]}</small></span><Check size={17} />
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="planner-v2-assets"><legend>{t.preferred}</legend><p>{t.preferredHelp}</p><div>
                {(Object.keys(assets) as AssetId[]).map((asset) => {
                  const Icon = assets[asset].icon, checked = inputs.assets.includes(asset);
                  return <label className={checked ? "selected" : ""} key={asset}>
                    <input type="checkbox" checked={checked} onChange={() => toggleAsset(asset)} />
                    <Icon size={18} /><span>{assetName(asset)}</span><Check size={15} />
                  </label>;
                })}
              </div>{isBeginner && <p className="planner-v2-yield-help" data-language-static>
                <GlossaryTerm term="Yield">{language === "zh-TW" ? "被動收入層是什麼？" : "What is the Passive Income Layer?"}</GlossaryTerm>
                {" "}{language === "zh-TW"
                  ? "指 Ether.fi 或 Aave 這類可能讓資產產生收益的工具，但仍有協議、價格與智慧合約風險。"
                  : "Tools such as Ether.fi or Aave may produce yield, but still carry protocol, price, and smart-contract risks."}
              </p>}</fieldset>
            </article>

            <div className="planner-v2-results">
              <article className="planner-v2-cycle-explanation">
                <div className="planner-v2-card-heading"><div><span className="planner-v2-eyebrow">{t.cyclePlan}</span>
                  <h2>{t[inputs.cycle]}</h2></div><ShieldCheck size={23} /></div>
                <div className="planner-v2-cycle-totals">
                  <span><small>{t.plannedDca}</small><strong>{formatMoney(results.plannedDca)}</strong></span>
                  <span><small>{t.strategyCash}</small><strong>{formatMoney(results.strategyCash)}</strong></span>
                </div>
                <strong className="planner-v2-cycle-why">{t.whyAllocation}</strong>
                <p>{t[`${inputs.cycle}Why` as keyof typeof t]}</p>
                <div className="planner-v2-cycle-example"><small>{t.cycleExample}</small>
                  <strong>{t[`${inputs.cycle}Example` as keyof typeof t]}</strong></div>
              </article>
              <article className="planner-v2-summary-card">
                <div className="planner-v2-card-heading"><div><span className="planner-v2-eyebrow">{t.monthlyPlan}</span><h2>{t.investable}</h2></div></div>
                <strong className="planner-v2-big-money">{formatMoney(results.investable)}</strong>
                {results.investable === 0 && <p className="planner-v2-zero"><AlertTriangle size={16} /> {t.noRoom}</p>}
                <div className="planner-v2-money-flow">
                  <span><small>{t.surplus}</small><strong>{formatMoney(results.surplus)}</strong></span><i />
                  <span><small>{t.cashReserve}</small><strong>-{formatMoney(results.cashReserve)}</strong></span><i />
                  <span className="active"><small>{t.investable}</small><strong>{formatMoney(results.investable)}</strong></span>
                </div>
                <p className="planner-v2-target-note"><PiggyBank size={15} /> {t.targetNote}</p>
                <button type="button" className={`planner-v2-complete-plan ${planAwarded ? "completed" : ""}`}
                  onClick={completeFirstPlan} disabled={planAwarded || results.plannedDca <= 0}>
                  {planAwarded ? <Check size={16} /> : <Award size={16} />}
                  {planAwarded ? t.planSaved : t.savePlan}
                </button>
              </article>
              <article className="planner-v2-allocation-card">
                <div className="planner-v2-card-heading"><div><span className="planner-v2-eyebrow">{t.allocation}</span><h2>{t.allocationSub}</h2></div></div>
                <div className="planner-v2-allocation-layout">
                  <AllocationDonut allocation={results.allocation} label={t.donutLabel} assetLabel={t.assets} />
                  <div className="planner-v2-allocation-list">{results.allocation.map((item) =>
                    <div key={item.id}><i style={{ background: assets[item.id].color }} /><span>{assetName(item.id)}</span>
                      <strong>{item.percentage.toFixed(0)}%</strong><b>{formatMoney(item.amount)}<small>
                        {formatMoney(item.amount * 12 / 52)} / {language === "zh-TW" ? "週" : "week"}</small></b></div>)}
                  </div>
                </div>
              </article>
              <article className="planner-v2-schedule-card">
                <div className="planner-v2-card-heading"><div><span className="planner-v2-eyebrow">{t.schedule}</span><h2>{t.scheduleLead}</h2></div><CalendarDays size={24} /></div>
                <div className="planner-v2-schedule-grid">
                  <span><small>{t.first}</small><strong>{formatMoney(results.plannedDca / 2)}</strong></span>
                  <span><small>{t.second}</small><strong>{formatMoney(results.plannedDca / 2)}</strong></span>
                  <span><small>{t.weekly}</small><strong>{formatMoney(results.plannedDca * 12 / 52)}</strong></span>
                  <span><small>{t.preferred}</small><strong>{results.allocation.length} {t.selected}</strong></span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <aside className="planner-v2-onramp-note">
          <div className="planner-v2-container">
            <Banknote size={24} />
            <div>
              <strong>{language === "zh-TW" ? "還不知道台幣如何入金？" : "Not sure how to start with TWD?"}</strong>
              <p>{language === "zh-TW"
                ? "如果你人在台灣，還不知道如何入金，請先閱讀「台幣入金指南」。"
                : "If you are in Taiwan and do not understand the funding process yet, read the Taiwan fiat on-ramp guide first."}</p>
            </div>
            <Link href="/on-ramp">{language === "zh-TW" ? "閱讀台幣入金指南" : "Read TWD On-Ramp Guide"} <ArrowRight size={15} /></Link>
          </div>
        </aside>

        <LobsterJourney compact />

        <section className="planner-v2-execute" id="how-to-start">
          <div className="planner-v2-container">
            <div className="planner-v2-section-heading">
              <span className="planner-v2-eyebrow">{t.executeEyebrow}</span>
              <h2>{t.executeTitle}</h2><p>{t.executeLead}</p>
            </div>

            <div className="planner-v2-execute-summary">
              <div>
                <span>{t.monthlyInvestment}</span>
                <strong>{formatMoney(results.plannedDca)}</strong>
              </div>
              <div className="planner-v2-execute-allocation">
                {results.allocation.map((item) => (
                    <span key={item.id}><i style={{ background: assets[item.id].color }} />
                    <small>{assetName(item.id)}</small>
                    <strong>{formatMoney(item.amount)}</strong>
                  </span>
                ))}
              </div>
            </div>

            <article className="planner-v2-proof-card">
              <div className="planner-v2-card-heading"><div><span className="planner-v2-eyebrow">{language === "zh-TW" ? "行動證明" : "Proof of Action"}</span>
                <h2>{t.proofTitle}</h2></div><Award size={23} /></div>
              <div className="planner-v2-proof-levels">
                {[
                  [t.planCreated, planAwarded, "+5 BHP"],
                  [language === "zh-TW" ? "已閱讀 DCA 指南" : "DCA Guide Read", dcaGuideRead, "+10 BHP"],
                  [t.exchangeSelected, exchangeSelected, "+5 BHP"],
                  [t.startedReported, dcaStarted, "+20 BHP"],
                  [language === "zh-TW" ? "已驗證習慣里程碑" : "Verified Habit Milestone", false, "+50 BHP"],
                ].map(([label, done, points], index) => (
                  <div className={done ? "active" : ""} key={String(label)}>
                    <span>{done ? <Check size={14} /> : index + 1}</span>
                    <strong>{label}</strong><small>{points}</small>
                  </div>
                ))}
              </div>

              {!planAwarded && <div className="planner-v2-proof-message"><strong>{t.noPlan}</strong>
                <p>{language === "zh-TW" ? "先完成上方計畫並儲存。" : "Complete and save the plan above first."}</p></div>}

              {planAwarded && !exchangeSelected && <div className="planner-v2-proof-message">
                <strong>{t.planCreatedMessage}</strong>
                <a href="#supported-platforms">{t.nextExchange} <ArrowRight size={14} /></a>
              </div>}

              {planAwarded && exchangeSelected && !dcaStarted && <div className="planner-v2-proof-message">
                <strong>{t.exchangeSelectedMessage}</strong>
                <button type="button" onClick={() => setShowDcaConfirm(true)}>{t.confirmDca} <ArrowRight size={14} /></button>
              </div>}

              {showDcaConfirm && !dcaStarted && <div className="planner-v2-dca-confirm">
                <strong>{t.confirmTitle}</strong><p>{t.confirmLead}</p>
                <div className="planner-v2-dca-checklist">{DCA_CHECKLIST_IDS.map((id) => {
                  const labelKey = {
                    asset: "checkAsset", amount: "checkAmount", risk: "checkRisk",
                    cash: "checkCash", noLeverage: "checkNoLeverage",
                  }[id] as keyof typeof t;
                  return <label key={id}><input type="checkbox" checked={dcaChecklist[id]}
                    onChange={(event) => setDcaChecklist((current) => ({ ...current, [id]: event.target.checked }))} />
                    {t[labelKey]}</label>;
                })}</div>
                <p className="planner-v2-leverage-warning"><AlertTriangle size={15} /> {t.leverageWarning}</p>
                <button type="button" className="planner-v2-complete-plan"
                  disabled={!DCA_CHECKLIST_IDS.every((id) => dcaChecklist[id])}
                  onClick={reportDcaStarted}>{t.submitDca}</button>
              </div>}

              {dcaStarted && <div className="planner-v2-reported">
                <span><Check size={18} /></span><div><small>{t.unverified}</small><strong>{t.dcaReported}</strong>
                  <p>{t.dcaReportedMessage}</p></div>
              </div>}
              <p className="planner-v2-self-report-note">{language === "zh-TW"
                ? "Baby Hippo 無法查看你的交易所帳戶。在未來驗證系統推出前，所有進度都由使用者自行回報。"
                : "Baby Hippo cannot see your exchange account. Progress is self-reported until future verification systems are available."}</p>
            </article>

            <article className="planner-v2-cycle-action">
              <span><TrendingUp size={22} /></span>
              <div><small>{t.recommendation}</small><h3>{t[cycleActionKey]}</h3>
                <p>{t[cycleActionTextKey]}</p></div>
            </article>

            <div className="planner-v2-execution-cards">
              <article>
                <span className="planner-v2-execute-icon"><Bitcoin size={25} /></span>
                <small>01</small><h3>{t.btcEthTitle}</h3><p>{t.btcEthText}</p>
                <div className="planner-v2-execute-numbers">
                  <span><small>{t.monthly}</small><strong>{formatMoney(coreMonthly)}</strong></span>
                  <span><small>{t.weeklyAmount}</small><strong>{formatMoney(coreMonthly * 12 / 52)}</strong></span>
                </div>
                <div className="planner-v2-execute-actions">
                  <button type="button" disabled>{t.buyBtc}</button>
                  <button type="button" disabled>{t.buyEth}</button>
                </div>
              </article>

              <article>
                <span className="planner-v2-execute-icon"><Sparkles size={25} /></span>
                <small>02</small><h3>{t.yieldTitle}</h3><p>{t.yieldText}</p>
                <div className="planner-v2-protocol-note"><small>{t.firstProtocol}</small>
                  <strong>Ether.fi</strong><span>{allocationAmount("Yield") > 0
                    ? `${t.monthly}: ${formatMoney(allocationAmount("Yield"))}` : t.noAllocation}</span></div>
                <div className="planner-v2-execute-actions">
                  <Link href="/learn#etherfi">{t.learnEtherfi} <ArrowRight size={14} /></Link>
                  <Link href="/earn#etherfi">{t.readYield} <ArrowRight size={14} /></Link>
                </div>
              </article>

              <article>
                <span className="planner-v2-execute-icon"><Landmark size={25} /></span>
                <small>03</small><h3>{t.advancedTitle}</h3><p>{t.advancedText}</p>
                <div className="planner-v2-protocol-note"><small>{language === "zh-TW" ? "協議" : "Protocol"}</small><strong>Aave</strong>
                  <span>{t.educationOnly}</span></div>
                <div className="planner-v2-execute-actions">
                  <Link href="/learn#aave">{t.learnAave} <ArrowRight size={14} /></Link>
                  <Link href="/learn#risk">{t.readRisk} <ArrowRight size={14} /></Link>
                </div>
              </article>
            </div>

            <article className="planner-v2-execute-warning">
              <div><AlertTriangle size={23} /><h3>{t.warningTitle}</h3></div>
              <ul><li><Check size={15} /> {t.warningAdvice}</li><li><Check size={15} /> {t.warningRisk}</li>
                <li><Check size={15} /> {t.warningDefi}</li><li><Check size={15} /> {t.warningEmergency}</li></ul>
            </article>

            <div className="planner-v2-platforms" id="supported-platforms">
              <div><span className="planner-v2-eyebrow">{t.platforms}</span><p>{t.platformsLead}</p></div>
              <div className="planner-v2-platform-grid">
                {[
                  {
                    name: "Binance", title: "推薦新手定投",
                    description: "適合建立 BTC、ETH 長期定投習慣。",
                    cta: "立即前往 →", href: "https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00SFPUZH40",
                  },
                  {
                    name: "OKX", title: "備用交易所選擇",
                    description: "提供另一種長期定投方案。",
                    cta: "立即前往 →", href: "https://okx.com/join/81023154",
                  },
                  {
                    name: "Ether.fi", title: "被動收入與支付",
                    description: "了解如何讓資產產生收益，並學習加密支付。",
                    cta: "了解更多 →", href: "https://www.ether.fi/@14a14fc7",
                  },
                ].map((platform) => (
                  <article key={platform.name}>
                    <a href={platform.href} target="_blank" rel="noopener noreferrer sponsored">
                      <Building2 size={22} />
                      <span><strong>{platform.name}</strong><small>{platform.title}</small></span>
                      <ExternalLink size={15} />
                      <p>{platform.description}</p>
                      <b>{platform.cta}</b>
                    </a>
                  </article>
                ))}
                <article>
                  <Link href="/learn#aave">
                    <Landmark size={22} />
                    <span><strong>Aave</strong><small>進階 DeFi</small></span>
                    <ArrowRight size={15} />
                    <p>學習借貸、健康度與資產管理。</p>
                    <b>學習內容 →</b>
                  </Link>
                </article>
              </div>
              <div className="planner-v2-exchange-record">
                <div><strong>行動進度紀錄</strong><p>前往平台不會自動取得積分。確定自己的定投平台後，再自行記錄一次。</p></div>
                {exchangeSelected ? <span><Check size={16} /> 平台選擇已記錄</span> : <div>
                  <button type="button" onClick={completeExchangeSelection}>記錄 Binance 為定投平台</button>
                  <button type="button" onClick={completeExchangeSelection}>記錄 OKX 為定投平台</button>
                </div>}
              </div>
              <p className="planner-v2-partner-support">{language === "zh-TW"
                ? "使用 Baby Hippo 推薦連結可支持網站持續開發。"
                : "Using a Baby Hippo referral link can support continued website development."}</p>
            </div>

            {dcaStarted && <div className="planner-v2-chain-ready">
              <ShieldCheck size={25} /><div><strong>{t.chainNext}</strong><p>{t.chainText}</p>
                <Link href="/dashboard">{t.learnLobster} <ArrowRight size={14} /></Link></div>
            </div>}
          </div>
        </section>

        <section className="planner-v2-projection planner-v2-scenarios" id="projection">
          <div className="planner-v2-container">
            <div className="planner-v2-section-heading">
              <span className="planner-v2-eyebrow">{language === "zh-TW" ? "歷史情境模擬" : "Historical scenario simulation"}</span>
              <h2>{language === "zh-TW" ? "三種資產走勢情境模擬" : "Three market-path scenarios"}</h2>
              <p>{language === "zh-TW"
                ? "根據你輸入後算出的每月可投資金額，模擬不同市場環境下的資產累積差異。"
                : "Uses your calculated monthly investable amount to illustrate how different market environments could affect accumulation."}</p>
            </div>
            <div className="planner-v2-scenario-inputs">
              <article><small>{language === "zh-TW" ? "每月定投" : "Monthly DCA"}</small><strong>{formatTwd(scenarioSimulation.monthly)}</strong></article>
              <article><small>{language === "zh-TW" ? "每年投入" : "Annual contribution"}</small><strong>{formatTwd(scenarioSimulation.yearly)}</strong></article>
              {scenarioSimulation.horizons.slice(1).map((item) => <article key={item.years}>
                <small>{item.years}{language === "zh-TW" ? " 年累積投入" : "-year principal"}</small>
                <strong>{formatTwd(item.principal)}</strong>
              </article>)}
            </div>
            <p className="planner-v2-scenario-warning"><AlertTriangle size={18} /> {language === "zh-TW"
              ? "這不是預測，也不是保證。這只是根據歷史情境與使用者輸入金額做的教育模擬。"
              : "This is not a prediction or guarantee. It is an educational simulation based on historical-style scenarios and your input amount."}</p>
            <div className="planner-v2-scenario-grid">
              {scenarioSimulation.scenarios.map((scenario) => (
                <article className={`planner-v2-scenario-card ${scenario.id}`} key={scenario.id}>
                  <header><span><TrendingUp size={21} /></span><div>
                    <h3>{language === "zh-TW" ? scenario.labelZh : scenario.labelEn}</h3>
                    <small>{language === "zh-TW" ? scenario.rateZh : scenario.rateEn}</small>
                  </div></header>
                  <p>{language === "zh-TW" ? scenario.descriptionZh : scenario.descriptionEn}</p>
                  <ScenarioCurveChart monthly={scenarioSimulation.monthly} lowRate={scenario.low}
                    highRate={scenario.high}
                    accent={scenario.id === "weak" ? "#ef8177" : scenario.id === "average" ? "#f3aa36" : "#51c9bb"}
                    label={language === "zh-TW" ? scenario.labelZh : scenario.labelEn} language={language} />
                  <div className="planner-v2-scenario-result-labels">
                    <span>{language === "zh-TW" ? "期間" : "Period"}</span>
                    <span>{language === "zh-TW" ? "累計本金" : "Principal"}</span>
                    <span>{language === "zh-TW" ? "情境參考值" : "Scenario range"}</span>
                  </div>
                  <div className="planner-v2-scenario-results">
                    {scenario.values.map((value) => <div key={value.years}>
                      <strong>{value.years} {language === "zh-TW" ? "年" : "years"}</strong>
                      <span>{formatTwd(value.principal)}</span>
                      <b>{formatTwd(value.low)} ～ {formatTwd(value.high)}</b>
                    </div>)}
                  </div>
                </article>
              ))}
            </div>
            <p className="planner-v2-scenario-disclaimer"><AlertTriangle size={17} /> {language === "zh-TW"
              ? "以上是使用固定年化假設的歷史情境模擬，不是價格預測、個人建議或保證收益。真實結果可能更低、為負值，或出現大幅波動。"
              : "These are historical-style simulations using fixed annual assumptions—not predictions, personal advice, or guaranteed returns. Actual outcomes may be lower, negative, or highly volatile."}</p>
          </div>
        </section>

        <section className="planner-v2-history" data-language-static>
          <div className="planner-v2-container">
            <div className="planner-v2-section-heading">
              <span className="planner-v2-eyebrow">歷史週期教材</span>
              <h2>歷史熊牛週期教材：為什麼很多人願意長期定投 BTC / ETH？</h2>
              <p>歷史不代表未來，但能幫助我們理解，為什麼很多人選擇長期定投、分散時間風險，而不是試圖完美猜中最低點。</p>
            </div>
            <div className="planner-v2-history-grid">
              {[
                {
                  name: "BTC Cycle 1",
                  period: "2015 → 2017",
                  start: "US$200",
                  peak: "US$19,800",
                  multiple: "≈ 99x",
                  note: "早期採用者快速增加，市場規模仍小。",
                },
                {
                  name: "BTC Cycle 2",
                  period: "2018 → 2021",
                  start: "US$3,200",
                  peak: "US$69,000",
                  multiple: "≈ 22x",
                  note: "機構與更多散戶進入，週期波動仍然劇烈。",
                },
                {
                  name: "BTC Cycle 3",
                  period: "2022 → 2025 Cycle High",
                  start: "US$15,500",
                  peak: "US$126,000",
                  multiple: "≈ 8.1x",
                  note: "漲幅下降，但價格區間仍創新高。",
                },
                {
                  name: "ETH 早期成長階段",
                  period: "2016 → 2021",
                  start: "US$10",
                  peak: "US$4,800",
                  multiple: "≈ 480x",
                  note: "此階段屬於早期網路效應快速成長時期。歷史表現不代表未來報酬。",
                },
              ].map((cycle) => <article key={cycle.name}>
                <small>{cycle.name}</small>
                <h3>{cycle.period}</h3>
                <div className="planner-v2-history-prices">
                  <span><b>起點</b>{cycle.start}</span>
                  <span><b>高點</b>{cycle.peak}</span>
                </div>
                <svg className="planner-v2-history-trend" viewBox="0 0 180 52" role="img" aria-label={`${cycle.name} trend graphic`}>
                  <path d="M8 44 C42 38, 68 33, 96 23 S142 13, 172 8" />
                  <circle cx="8" cy="44" r="4" />
                  <circle cx="172" cy="8" r="4" />
                </svg>
                <strong>{cycle.multiple}</strong>
                <p>{cycle.note}</p>
              </article>)}
            </div>
            <div className="planner-v2-history-table-wrap">
              <h3>BTC 歷史熊市後反彈</h3>
              <div className="planner-v2-history-table">
                <div><strong>週期</strong><strong>期間</strong><strong>起點價格</strong><strong>週期高點</strong><strong>約略倍數</strong></div>
                <div><span>Cycle 1</span><span>2015 → 2017</span><span>US$200</span><span>US$19,800</span><b>≈ 99x</b></div>
                <div><span>Cycle 2</span><span>2018 → 2021</span><span>US$3,200</span><span>US$69,000</span><b>≈ 22x</b></div>
                <div><span>Cycle 3</span><span>2022 → 2025</span><span>US$15,500</span><span>US$126,000</span><b>≈ 8.1x</b></div>
              </div>
            </div>
            <article className="planner-v2-history-observation">
              <span><BookOpen size={25} /></span><div><small>Baby Hippo 觀察</small>
                <h3>每輪牛市漲幅正在下降：99x → 22x → 8x</h3>
                <p>這代表市場逐漸成熟。但即使漲幅下降，BTC 仍持續創造更高價格區間。因為沒有人能事先知道最低點，許多人選擇：</p>
                <ul><li>長期定投</li><li>分散時間風險</li><li>不猜最低點</li><li>不使用生活必需金</li></ul>
              </div>
            </article>
            <p className="planner-v2-history-note">歷史資料僅供教育用途。過去表現不代表未來結果。投資有風險，請依自身情況評估。</p>
          </div>
        </section>

        <section className="planner-v2-education" id="education">
          <div className="planner-v2-container">
            <div className="planner-v2-section-heading"><span className="planner-v2-eyebrow">{t.education}</span><h2>{t.notAdvice}</h2></div>
            <div className="planner-v2-education-grid">
              <EducationCard icon={ShieldCheck} title={t.notAdvice} text={t.notAdviceText} />
              <EducationCard icon={CalendarDays} title={t.dca} text={t.dcaText} />
              <EducationCard icon={PiggyBank} title={t.cashFirst} text={t.cashFirstText} />
              <EducationCard icon={AlertTriangle} title={t.yieldRisk} text={t.yieldRiskText} warning />
            </div>
            <div className="planner-v2-assumption-note"><BookOpen size={21} />
              <div><strong>{t.assumptions}</strong><p>{t.assumptionsText}</p></div>
              <Link href="/learn#dca">{t.learn} <ArrowRight size={16} /></Link>
            </div>
            <button type="button" className="planner-v2-read-guide" onClick={completeDcaGuide} disabled={dcaGuideRead}>
              {dcaGuideRead
                ? (language === "zh-TW" ? "已閱讀 DCA 指南・+10 BHP" : "DCA Guide Read · +10 BHP")
                : (language === "zh-TW" ? "我已閱讀並理解 DCA 指南・+10 BHP" : "I read and understood the DCA Guide · +10 BHP")}
            </button>
          </div>
        </section>
      </main>
      <footer className="planner-v2-footer"><div className="planner-v2-container"><strong>Baby Hippo</strong><p>{t.footer}</p></div></footer>
    </div>
  );
}

function NumberField({ icon: Icon, label, help, value, onChange }: {
  icon: typeof CircleDollarSign; label: string; help?: string; value: number; onChange: (value: string) => void;
}) {
  return <label className="planner-v2-field"><span>{label}</span><div><Icon size={18} />
    <input type="number" min="0" step="100" value={value} onChange={(event) => onChange(event.target.value)} /></div>
    {help && <small>{help}</small>}</label>;
}

function EducationCard({ icon: Icon, title, text, warning = false }: {
  icon: typeof ShieldCheck; title: string; text: string; warning?: boolean;
}) {
  return <article className={warning ? "warning" : ""}><span><Icon size={22} /></span><h3>{title}</h3><p>{text}</p></article>;
}
