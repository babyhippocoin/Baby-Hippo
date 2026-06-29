"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  CalendarCheck,
  Check,
  CreditCard,
  Landmark,
  MonitorCheck,
  Sprout,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

type Language = "zh-TW" | "en";

const LANGUAGE_KEY = "baby-hippo-language";

const steps = [
  { icon: WalletCards, zh: "台灣入金", en: "TWD On-Ramp" },
  { icon: CalendarCheck, zh: "長期 DCA", en: "Long-Term DCA" },
  { icon: Sprout, zh: "被動收入", en: "Passive Income" },
  { icon: CreditCard, zh: "加密支付", en: "Crypto Payments" },
  { icon: Landmark, zh: "進階 DeFi", en: "Advanced DeFi" },
];

const copy = {
  "zh-TW": {
    eyebrow: "Baby Hippo 旅程",
    title: "先建立紀律，再增加複雜度。",
    body: "Baby Hippo 不保管資金，也不替使用者交易。我們幫助普通人一步一步學習、規劃、追蹤習慣並理解風險。",
    coreLabel: "你的資產成長儀表板",
    coreText: "追蹤習慣、學習進度、DCA 紀律與未來 DeFi 成就。",
    items: ["DCA 進度", "學習進度", "被動收入成就", "DeFi 成就", "未來資產成長紀錄"],
    cta: "開啟 Lobster Watch",
  },
  en: {
    eyebrow: "Baby Hippo Journey",
    title: "Build discipline first. Add complexity later.",
    body: "Baby Hippo does not hold funds or trade for users. We help ordinary people learn, plan, track habits, and understand risk one step at a time.",
    coreLabel: "Your asset-growth dashboard",
    coreText: "Track habits, learning progress, DCA discipline, and future DeFi achievements.",
    items: ["DCA progress", "Learning progress", "Passive income milestones", "DeFi achievements", "Future asset-growth records"],
    cta: "Open Lobster Watch",
  },
} as const;

function useJourneyLanguage() {
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

  return language;
}

export function LobsterJourney({ compact = false }: { compact?: boolean }) {
  const language = useJourneyLanguage();
  const t = copy[language];

  return (
    <section className={`lobster-journey ${compact ? "compact" : ""}`} data-language-static>
      <div className="lobster-journey-heading">
        <span>{t.eyebrow}</span>
        <h2>{t.title}</h2>
        <p>{t.body}</p>
      </div>
      <div className="lobster-journey-steps">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.en}>
              <article>
                <span><Icon size={21} /></span>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{language === "zh-TW" ? step.zh : step.en}</strong>
              </article>
              {index < steps.length - 1 && <ArrowDown size={17} />}
            </div>
          );
        })}
      </div>
      <article className="lobster-journey-core">
        <MonitorCheck size={28} />
        <div>
          <small>{t.coreLabel}</small>
          <strong>Lobster Watch</strong>
          <p>{t.coreText}</p>
          <ul>
            {t.items.map((item) => (
              <li key={item}><Check size={15} /> {item}</li>
            ))}
          </ul>
        </div>
        <Link href="/dashboard">{t.cta}</Link>
      </article>
    </section>
  );
}
