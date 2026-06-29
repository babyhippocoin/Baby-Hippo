"use client";

import { ArrowRight, Check, HelpCircle, Sprout } from "lucide-react";
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
  const [language, setLanguage] = useState<Language>("zh-TW");

  useEffect(() => {
    const load = () => setLanguage(currentLanguage());
    const onLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    load();
    window.addEventListener("baby-hippo-language-change", onLanguage);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("baby-hippo-language-change", onLanguage);
      window.removeEventListener("storage", load);
    };
  }, []);

  const setMode = () => {};

  return { mode: "beginner" as LearningMode, setMode, language, isBeginner: true };
}

export function LearningModeSelector() {
  return null;
}

const journeyChoices: Record<JourneyChoice, {
  zh: string; en: string; href: string; actionZh: string; actionEn: string;
}> = {
  first: {
    zh: "我還沒有買過 BTC", en: "I have never bought Bitcoin",
    href: "/learn#bitcoin", actionZh: "先看懂 BTC", actionEn: "Understand Bitcoin first",
  },
  dca: {
    zh: "我已經開始 DCA", en: "I already use DCA",
    href: "/dca-planner", actionZh: "建立我的 DCA 計畫", actionEn: "Build My DCA Plan",
  },
  yield: {
    zh: "我想了解被動收入", en: "I want to explore passive income",
    href: "/earn#etherfi", actionZh: "了解被動收入", actionEn: "Understand Passive Income",
  },
  lending: {
    zh: "我想學習 Aave 與風險", en: "I want to learn Aave and risk",
    href: "/learn#aave", actionZh: "學習 Aave 與風險", actionEn: "Learn Aave and Risk",
  },
};

export function LearningJourneyQuestion({ compact = false }: { compact?: boolean }) {
  const { language } = useLearningMode();
  const [choice, setChoice] = useState<JourneyChoice | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(LEARNING_JOURNEY_KEY) as JourneyChoice | null;
    if (saved && saved in journeyChoices) setChoice(saved);
  }, []);

  const choose = (next: JourneyChoice) => {
    setChoice(next);
    window.localStorage.setItem(LEARNING_JOURNEY_KEY, next);
  };

  const selected = choice ? journeyChoices[choice] : null;
  const text = language === "zh-TW"
    ? {
      eyebrow: "找到你的起點",
      title: "你現在走到哪一步？",
      body: "選一個最接近你的狀態，Baby Hippo 會提供一個清楚的下一步。",
      next: "下一步建議",
    }
    : {
      eyebrow: "Find your starting point",
      title: "Where are you in your learning journey?",
      body: "Choose the option that feels closest. Baby Hippo will suggest one clear next step.",
      next: "Next step",
    };

  return (
    <section className={`learning-journey-question ${compact ? "compact" : ""}`} data-language-static>
      <div className="learning-journey-heading">
        <span><Sprout size={17} /> {text.eyebrow}</span>
        <h2>{text.title}</h2>
        <p>{text.body}</p>
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
          <div><small>{text.next}</small>
            <strong>{language === "zh-TW" ? selected.actionZh : selected.actionEn}</strong></div>
          <Link href={selected.href}>{language === "zh-TW" ? selected.actionZh : selected.actionEn}
            <ArrowRight size={16} /></Link>
        </div>
      )}
    </section>
  );
}

const glossary = {
  DCA: {
    zh: "定期定額：按照計畫固定投入，而不是猜最低點。",
    en: "Dollar-cost averaging: buying a planned amount regularly instead of guessing the lowest price.",
  },
  DeFi: {
    zh: "去中心化金融：運行在區塊鏈上的金融工具，但仍有程式碼與市場風險。",
    en: "Decentralized finance: financial tools running on blockchains without a traditional bank counter, but with code and market risks.",
  },
  Aave: {
    zh: "Aave 是鏈上借貸協議。使用前需要理解抵押品、利率、健康度與清算風險。",
    en: "Aave is an on-chain lending protocol. Learn collateral, rates, health factor, and liquidation risk before using it.",
  },
  "Ether.fi": {
    zh: "Ether.fi 是以 ETH 為核心的收益與支付相關工具。收益不保證，本金也有風險。",
    en: "Ether.fi is an ETH-focused yield and payment tool. Yield is not guaranteed, and principal can be at risk.",
  },
  Yield: {
    zh: "被動收入層：讓資產可能產生收益，但鏈上工具仍可能虧損。",
    en: "Yield / passive income layer: putting assets to work for potential yield while accepting on-chain risk.",
  },
  APR: {
    zh: "年化利率估算。DeFi 的 APR 會變動，不代表保證收益。",
    en: "An estimated yearly interest rate. DeFi APR changes often and is not guaranteed.",
  },
  "Health Factor": {
    zh: "借貸安全指標。數字越低，越接近清算風險。",
    en: "A borrowing safety score. Lower means closer to liquidation risk.",
  },
  Stablecoin: {
    zh: "穩定幣通常追蹤美元，但仍可能脫鉤或發生風險。",
    en: "A digital asset that usually tracks USD, but it can still lose its peg.",
  },
  "Seed Phrase": {
    zh: "助記詞是錢包主鑰。任何拿到完整助記詞的人，通常都能控制錢包。",
    en: "The master key to a wallet. Anyone with the full phrase can usually control everything inside.",
  },
  "Smart Contract": {
    zh: "智能合約是寫在鏈上的自動規則。它會自動執行，但程式錯誤可能造成損失。",
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
        <span>{language === "zh-TW" ? "新手詞彙表" : "Beginner glossary"}</span>
        <h2>{language === "zh-TW" ? "先把術語變成人話。" : "Translate jargon into plain language first."}</h2>
        <p>{language === "zh-TW" ? "點選或停留在詞彙上，看懂它真正的意思。" : "Focus or hover on a term to see its explanation."}</p>
      </div>
      <div className="learning-glossary-grid">
        {(Object.keys(glossary) as GlossaryTermName[]).map((term) => (
          <GlossaryTerm term={term} key={term}>{term === "Yield" && language === "zh-TW" ? "被動收入層" : term}</GlossaryTerm>
        ))}
      </div>
    </section>
  );
}
