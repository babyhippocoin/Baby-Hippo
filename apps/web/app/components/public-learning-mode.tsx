"use client";

import { ArrowRight, BookOpen, Check, HelpCircle, Sprout } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type LearningMode = "beginner" | "growth";
type Language = "zh-TW" | "en";
type JourneyChoice = "first" | "dca" | "yield" | "lending";

export const LEARNING_MODE_KEY = "baby-hippo-learning-mode";
export const LEARNING_JOURNEY_KEY = "baby-hippo-learning-journey";

function currentLanguage(): Language {
  return typeof window !== "undefined" && window.localStorage.getItem("baby-hippo-language") === "en"
    ? "en" : "zh-TW";
}

export function useLearningMode() {
  const [mode, setModeState] = useState<LearningMode>("beginner");
  const [language, setLanguage] = useState<Language>("zh-TW");

  useEffect(() => {
    const load = () => {
      setModeState(window.localStorage.getItem(LEARNING_MODE_KEY) === "growth" ? "growth" : "beginner");
      setLanguage(currentLanguage());
    };
    const onMode = (event: Event) => {
      const next = (event as CustomEvent<LearningMode>).detail;
      if (next === "beginner" || next === "growth") setModeState(next);
    };
    const onLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    load();
    window.addEventListener("baby-hippo-learning-mode-change", onMode);
    window.addEventListener("baby-hippo-language-change", onLanguage);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("baby-hippo-learning-mode-change", onMode);
      window.removeEventListener("baby-hippo-language-change", onLanguage);
      window.removeEventListener("storage", load);
    };
  }, []);

  const setMode = (next: LearningMode) => {
    window.localStorage.setItem(LEARNING_MODE_KEY, next);
    setModeState(next);
    window.dispatchEvent(new CustomEvent("baby-hippo-learning-mode-change", { detail: next }));
  };

  return { mode, setMode, language, isBeginner: mode === "beginner" };
}

export function LearningModeSelector() {
  const { mode, setMode, language } = useLearningMode();
  const beginner = language === "zh-TW" ? "新手模式" : "Beginner Mode";
  const growth = language === "zh-TW" ? "成長模式" : "Growth Mode";
  const label = language === "zh-TW" ? "學習模式" : "Learning mode";

  return (
    <div className="learning-mode-selector" data-language-static>
      <span><BookOpen size={14} /> {label}</span>
      <div role="group" aria-label={label}>
        <button type="button" className={mode === "beginner" ? "active" : ""}
          aria-pressed={mode === "beginner"} onClick={() => setMode("beginner")}>{beginner}</button>
        <button type="button" className={mode === "growth" ? "active" : ""}
          aria-pressed={mode === "growth"} onClick={() => setMode("growth")}>{growth}</button>
      </div>
    </div>
  );
}

const journeyChoices: Record<JourneyChoice, {
  zh: string; en: string; mode: LearningMode; href: string; actionZh: string; actionEn: string;
}> = {
  first: {
    zh: "我還沒買過比特幣", en: "I have never bought Bitcoin",
    mode: "beginner", href: "/learn#bitcoin", actionZh: "先看懂比特幣", actionEn: "Understand Bitcoin first",
  },
  dca: {
    zh: "我已經開始定期定額", en: "I already use DCA",
    mode: "growth", href: "/dca-planner", actionZh: "建立我的定投計畫", actionEn: "Build My DCA Plan",
  },
  yield: {
    zh: "我想增加被動收入", en: "I want to explore passive income",
    mode: "growth", href: "/earn#etherfi", actionZh: "了解被動收入", actionEn: "Understand Passive Income",
  },
  lending: {
    zh: "我想學習鏈上借貸", en: "I want to learn on-chain lending",
    mode: "growth", href: "/learn#aave", actionZh: "學習 Aave 與風險", actionEn: "Learn Aave and Risk",
  },
};

export function LearningJourneyQuestion({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, language } = useLearningMode();
  const [choice, setChoice] = useState<JourneyChoice | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(LEARNING_JOURNEY_KEY) as JourneyChoice | null;
    if (saved && saved in journeyChoices) setChoice(saved);
  }, []);

  const choose = (next: JourneyChoice) => {
    setChoice(next);
    window.localStorage.setItem(LEARNING_JOURNEY_KEY, next);
    setMode(journeyChoices[next].mode);
  };
  const selected = choice ? journeyChoices[choice] : null;
  const recommendedMode = selected?.mode ?? mode;

  return (
    <section className={`learning-journey-question ${compact ? "compact" : ""}`} data-language-static>
      <div className="learning-journey-heading">
        <span><Sprout size={17} /> {language === "zh-TW" ? "找到適合你的起點" : "Find your starting point"}</span>
        <h2>{language === "zh-TW" ? "你的投資旅程到哪一步了？" : "Where are you in your investing journey?"}</h2>
        <p>{language === "zh-TW"
          ? "沒有標準答案。選一個最像你的狀況，我們會調整解釋方式並推薦下一步。"
          : "There is no perfect answer. Choose what feels closest and we will adjust the explanations and next step."}</p>
      </div>
      <div className="learning-journey-options">
        {(Object.keys(journeyChoices) as JourneyChoice[]).map((id) => (
          <button type="button" key={id} className={choice === id ? "selected" : ""}
            aria-pressed={choice === id} onClick={() => choose(id)}>
            <span>{choice === id ? <Check size={16} /> : <HelpCircle size={16} />}</span>
            {language === "zh-TW" ? journeyChoices[id].zh : journeyChoices[id].en}
          </button>
        ))}
      </div>
      {selected && (
        <div className="learning-journey-result">
          <div><small>{language === "zh-TW" ? "建議模式" : "Recommended mode"}</small>
            <strong>{recommendedMode === "beginner"
              ? (language === "zh-TW" ? "新手模式" : "Beginner Mode")
              : (language === "zh-TW" ? "成長模式" : "Growth Mode")}</strong></div>
          <Link href={selected.href}>{language === "zh-TW" ? selected.actionZh : selected.actionEn}
            <ArrowRight size={16} /></Link>
        </div>
      )}
    </section>
  );
}

const glossary = {
  DCA: {
    zh: "定期定額：像每月固定買台積電零股，不猜最低點。",
    en: "Dollar-cost averaging: buying a planned amount regularly instead of guessing the lowest price.",
  },
  DeFi: {
    zh: "去中心化金融：在區塊鏈上運作的金融工具，沒有傳統銀行櫃台，但仍有程式與市場風險。",
    en: "Decentralized finance: financial tools running on blockchains without a traditional bank counter, but with code and market risks.",
  },
  Aave: {
    zh: "像線上的抵押借貸市場。放入加密資產作為抵押，可能借出穩定幣；風險太高時可能被清算。",
    en: "Like an online collateral lending market. Crypto can back a stablecoin loan, and unsafe positions can be liquidated.",
  },
  "Ether.fi": {
    zh: "讓長期持有的 ETH 參與質押、可能產生收益的工具，但收益與本金都不保證安全。",
    en: "A tool that puts long-term ETH into staking for potential yield, without guaranteeing yield or principal safety.",
  },
  Yield: {
    zh: "收益／被動收入層：像讓店面或貨車工作產生收入，但鏈上工具仍可能虧損。",
    en: "Yield / passive income layer: like putting a shop or truck to work, while on-chain tools can still lose money.",
  },
  APR: {
    zh: "估計年利率，像一年可能得到多少利息；DeFi APR 常變動，也不保證。",
    en: "An estimated yearly interest rate. DeFi APR changes often and is not guaranteed.",
  },
  "Health Factor": {
    zh: "借款安全分數：像貨車載重安全，數字越低越接近危險，應保留舒適緩衝。",
    en: "Borrowing safety score: like truck-load safety. Lower means closer to danger, so keep a comfortable buffer.",
  },
  Stablecoin: {
    zh: "像數位美元，通常跟著美元價格，但仍可能脫鉤。",
    en: "Like a digital dollar that usually tracks USD, but can still lose its peg.",
  },
  "Seed Phrase": {
    zh: "錢包的萬能鑰匙。任何拿到完整助記詞的人，通常都能拿走錢包裡的資產。",
    en: "The master key to a wallet. Anyone with the full phrase can usually control everything inside.",
  },
  "Smart Contract": {
    zh: "寫進程式碼的自動規則。規則會自動執行，但程式出錯時，資金可能有風險。",
    en: "Automatic rules written in code. They execute automatically, but code problems can put money at risk.",
  },
} as const;

export type GlossaryTermName = keyof typeof glossary;

export function GlossaryTerm({ term, children }: { term: GlossaryTermName; children?: React.ReactNode }) {
  const { language } = useLearningMode();
  return <span className="learning-glossary-term" tabIndex={0}
    title={language === "zh-TW" ? glossary[term].zh : glossary[term].en}>
    {children ?? term}<HelpCircle size={12} aria-hidden="true" />
  </span>;
}

export function BeginnerGlossary() {
  const { language } = useLearningMode();
  return (
    <section className="learning-glossary" data-language-static>
      <div>
        <span>{language === "zh-TW" ? "新手小字典" : "Beginner glossary"}</span>
        <h2>{language === "zh-TW" ? "遇到專有名詞，先用白話看懂。" : "Translate jargon into plain language first."}</h2>
        <p>{language === "zh-TW" ? "點擊或停留在詞語上即可查看說明。" : "Focus or hover on a term to see its explanation."}</p>
      </div>
      <div className="learning-glossary-grid">
        {(Object.keys(glossary) as GlossaryTermName[]).map((term) => (
          <GlossaryTerm term={term} key={term}>{term === "Yield" && language === "zh-TW" ? "被動收入層" : term}</GlossaryTerm>
        ))}
      </div>
    </section>
  );
}
