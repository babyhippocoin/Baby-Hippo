"use client";

import {
  ArrowRight, Building2, CalendarCheck, Check, CreditCard,
  ExternalLink, Landmark, LockKeyhole, ShieldCheck, Sprout,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLearningMode } from "./public-learning-mode";

const POINTS_KEY = "baby-hippo-points-mvp";
const pointValues: Record<string, number> = {
  "learn-bitcoin": 10, "learn-ethereum": 10, "learn-dca": 10, "learn-aave": 10,
  "learn-etherfi": 10, "learn-risk": 10, "learn-seed": 10,
  "learn-onramp": 10,
  "plan-first": 5, "plan-balanced": 20, "plan-emergency": 20, "dca-started": 20,
  "yield-etherfi": 15, "yield-aave": 15, "yield-kamino": 15, "yield-hyperlend": 15,
  "community-story": 5, "community-telegram": 5, "community-x": 5, "community-values": 5,
  "funnel-exchange": 5, "funnel-passive": 15, "funnel-aave": 20, "dca-habit-verified": 50,
};

function levelFor(points: number) {
  if (points >= 600) return 4;
  if (points >= 300) return 3;
  if (points >= 100) return 2;
  return 1;
}

export function ProductFunnel() {
  const { language, isBeginner } = useLearningMode();
  const [completed, setCompleted] = useState<string[]>([]);
  const zh = language === "zh-TW";

  const load = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(POINTS_KEY) || "{}") as { completed?: string[] };
      const current = Array.isArray(saved.completed) ? saved.completed : [];
      setCompleted(current);
    } catch {
      setCompleted([]);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("storage", load);
    window.addEventListener("baby-hippo-points-change", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("baby-hippo-points-change", load);
    };
  }, []);

  const saveAchievement = (id: string) => {
    const next = completed.includes(id) ? completed : [...completed, id];
    const totalPoints = next.reduce((sum, item) => sum + (pointValues[item] || 0), 0);
    window.localStorage.setItem(POINTS_KEY, JSON.stringify({
      completed: next, totalPoints, level: levelFor(totalPoints),
    }));
    setCompleted(next);
    window.dispatchEvent(new CustomEvent("baby-hippo-points-change", { detail: next }));
  };

  const advancedRequirements = [
    { id: "learn-bitcoin", zh: "完成比特幣課程", en: "Complete Bitcoin lesson" },
    { id: "learn-dca", zh: "完成定期定額課程", en: "Complete DCA lesson" },
    { id: "funnel-passive", zh: "完成被動收入學習", en: "Complete Passive Income lesson" },
  ];
  const advancedUnlocked = advancedRequirements.every((item) => completed.includes(item.id));
  const progress = useMemo(() => {
    const ids = ["learn-bitcoin", "funnel-exchange", "plan-first", "dca-started", "funnel-passive", "funnel-aave"];
    return ids.filter((id) => completed.includes(id)).length;
  }, [completed]);

  const steps = [
    [Building2, zh ? "台幣入金" : "TWD On-Ramp"],
    [CalendarCheck, zh ? "長期定投" : "DCA"],
    [Sprout, zh ? "被動收入" : "Passive Income"],
    [CreditCard, zh ? "加密支付" : "Crypto Payment"],
    [Landmark, zh ? "進階 DeFi" : "Advanced DeFi"],
  ] as const;

  return (
    <section className="product-funnel public-section" id="start-journey" data-language-static>
      <div className="public-container">
        <div className="public-section-heading">
          <span>{zh ? "Baby Hippo 產品旅程" : "Baby Hippo Product Journey"}</span>
          <h2>{zh ? "先建立習慣，再增加複雜度。" : "Build the habit before adding complexity."}</h2>
          <p>{zh
            ? "Baby Hippo 不保管你的資金。你先學習、在交易所自行買入、建立定投習慣，再決定是否認識被動收入與進階鏈上工具。"
            : "Baby Hippo never holds your funds. Learn first, buy directly through an exchange, build a DCA habit, then decide whether to study passive income and advanced on-chain tools."}</p>
        </div>

        <div className="product-funnel-progress">
          {steps.map(([Icon, label], index) => <span key={label}><i><Icon size={17} /></i>
            <small>{String(index + 1).padStart(2, "0")}</small><strong>{label}</strong></span>)}
        </div>

        <div className="product-funnel-status">
          <span>{zh ? "核心旅程進度" : "Core journey progress"}</span>
          <strong>{progress}/6</strong>
          <div><i style={{ width: `${progress / 6 * 100}%` }} /></div>
          <Link href="/points">{zh ? "查看我的鏈上老闆進度" : "View My On-Chain Boss Progress"} <ArrowRight size={15} /></Link>
        </div>

        <div className="product-funnel-grid">
          <article className="funnel-exchange">
            <span className="funnel-card-icon"><Building2 size={25} /></span>
            <small>STEP 02</small>
            <h3>{zh ? "我該從哪裡開始？" : "Where Do I Start?"}</h3>
            <p>{zh
              ? "Baby Hippo 永遠不保管使用者資金。你直接在交易所開戶、買入並自行保管資產。"
              : "Baby Hippo never holds user funds. You open an exchange account, buy assets directly, and remain responsible for custody."}</p>
            <div className="funnel-platform-list">
              <a className="funnel-partner-card" href="https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00SFPUZH40"
                target="_blank" rel="noopener noreferrer sponsored">
                <span className="funnel-partner-label">{zh ? "合作連結" : "Partner Link"}</span>
                <ExternalLink className="funnel-external-icon" size={17} />
                <strong>Binance</strong>
                <p>{zh ? "大型全球交易所，適合新手、BTC 與 ETH 定投。" : "A large global exchange suited to beginners and BTC or ETH DCA."}</p>
                <span className="funnel-card-action">{zh ? "從 Binance 開始" : "Start with Binance"} <ArrowRight size={14} /></span>
              </a>
              <a className="funnel-partner-card" href="https://okx.com/join/81023154" target="_blank"
                rel="noopener noreferrer sponsored">
                <span className="funnel-partner-label">{zh ? "合作連結" : "Partner Link"}</span>
                <ExternalLink className="funnel-external-icon" size={17} />
                <strong>OKX</strong>
                <p>{zh ? "另一個交易所選擇，適合偏好不同平台或第二個定投管道的人。" : "An alternative exchange for users who prefer another platform or a secondary DCA option."}</p>
                <span className="funnel-card-action">{zh ? "從 OKX 開始" : "Start with OKX"} <ArrowRight size={14} /></span>
              </a>
            </div>
            {completed.includes("funnel-exchange") && <span className="funnel-selected-status">
              <Check size={14} /> {zh ? "已選擇交易所・+5 BHC Points" : "Exchange Selected · +5 BHC Points"}
            </span>}
            {completed.includes("funnel-exchange") && !completed.includes("dca-started") && (
              <div className="funnel-custody-note">
                <CalendarCheck size={16} />
                <span>{zh ? "你已選擇交易所。接下來請在交易所建立定期定額。" : "You selected an exchange. Next, create a recurring purchase on that exchange."}</span>
                <Link href="/dca-planner#how-to-start">
                  {zh ? "我已在交易所建立定投" : "I set up DCA on the exchange"} <ArrowRight size={14} />
                </Link>
              </div>
            )}
            <div className="funnel-custody-note"><ShieldCheck size={16} /> {zh
              ? "打開合作連結不會獲得 BHC Points。只有在投資計畫中主動選擇平台，才會記錄「選擇交易所」進度。"
              : "Opening a partner link does not award BHC Points. Exchange selection is recorded only when you actively choose a platform in your plan."}</div>
          </article>

          <article>
            <span className="funnel-card-icon"><CalendarCheck size={25} /></span><small>STEP 03–04</small>
            <h3>{zh ? "開始定投，養成習慣" : "Start DCA and build the habit"}</h3>
            <p>{isBeginner
              ? (zh ? "定投像每月固定存一筆錢，不猜最低點。先把緊急預備金留好，再建立能長期做到的投入金額。" : "DCA is like a monthly saving plan. Keep emergency cash first, then choose an amount you can maintain.")
              : (zh ? "根據生活預算、市場週期與資產偏好，建立可持續的每月配置。" : "Build a sustainable monthly allocation from your budget, market cycle, and asset preferences.")}</p>
            <Link className="funnel-primary-action" href="/dca-planner">{zh ? "建立我的第一份定投計畫" : "Create My First DCA Plan"} <ArrowRight size={15} /></Link>
            <Link className="funnel-secondary-action" href="/points">{zh ? "用 BHC Points 追蹤習慣" : "Track the habit with BHC Points"} <ArrowRight size={15} /></Link>
          </article>

          <a className="funnel-product-card funnel-etherfi-card" href="https://www.ether.fi/@14a14fc7"
            target="_blank" rel="noopener noreferrer sponsored" onClick={() => saveAchievement("funnel-passive")}>
            <span className="funnel-partner-label">{zh ? "合作連結" : "Partner Link"}</span>
            <ExternalLink className="funnel-external-icon" size={17} />
            <span className="funnel-card-icon"><Sprout size={25} /></span><small>STEP 05</small>
            <h3>{zh ? "被動收入層" : "Passive Income Layer"}</h3>
            <p>{zh
              ? "建立 BTC 與 ETH 部位後，你可以再認識被動收入。它像讓資產收租，但收益不保證，資產也可能承受損失。"
              : "After building BTC and ETH positions, you may study passive income. It is like collecting rent from an asset, but yield is not guaranteed and losses remain possible."}</p>
            <div className="funnel-protocol"><strong>Ether.fi</strong><span>{zh ? "ETH 質押與被動收入學習路徑" : "ETH staking and passive-income learning path"}</span>
              <ul><li>{zh ? "適合長期 ETH 持有學習" : "Long-term ETH holding education"}</li>
                <li>{zh ? "可能有質押收益" : "Potential staking rewards"}</li>
                <li>{zh ? "智慧合約與協議風險" : "Smart-contract and protocol risk"}</li></ul></div>
            <span className="funnel-card-action">{zh ? "學習 Ether.fi" : "Learn Ether.fi"} <ArrowRight size={14} /></span>
          </a>

          <article>
            <span className="funnel-card-icon"><CreditCard size={25} /></span><small>STEP 06</small>
            <h3>{zh ? "在真實生活使用加密資產" : "Spend Crypto In Real Life"}</h3>
            <p>{zh
              ? "有些人選擇用支付卡使用獎勵或加密資產餘額。這一層只做教育，不建議消費，也不承諾回饋。"
              : "Some people use payment cards to spend rewards or crypto balances. This is education only—not spending advice or a reward promise."}</p>
            <div className="funnel-protocol"><strong>Ether.fi Card</strong>
              <ul><li>{zh ? "日常消費" : "Daily spending"}</li><li>{zh ? "旅遊消費" : "Travel spending"}</li>
                <li>{zh ? "回饋方案可能改變" : "Reward programs can change"}</li></ul></div>
            <span className="funnel-placeholder">{zh ? "教育內容・不連卡、不付款" : "Education only · No card or payment connection"}</span>
          </article>

          <article className={`funnel-advanced ${advancedUnlocked ? "unlocked" : "locked"}`}>
            <span className="funnel-card-icon">{advancedUnlocked ? <Landmark size={25} /> : <LockKeyhole size={25} />}</span>
            <small>STEP 07</small><h3>{zh ? "進階 DeFi：Aave" : "Advanced DeFi: Aave"}</h3>
            <p>{zh ? "Aave 是加密資產借貸協議。這一層只適合已理解抵押、借款安全分數與清算風險的使用者。"
              : "Aave is a crypto lending and borrowing protocol. This layer is for users who understand collateral, borrowing safety, and liquidation risk."}</p>
            <strong className="funnel-warning">{zh ? "僅適合進階使用者" : "Advanced users only"}</strong>
            <div className="funnel-requirements">{advancedRequirements.map((item) => (
              <span className={completed.includes(item.id) ? "done" : ""} key={item.id}>
                {completed.includes(item.id) ? <Check size={14} /> : <LockKeyhole size={14} />}
                {zh ? item.zh : item.en}</span>
            ))}</div>
            {advancedUnlocked
              ? <Link className="funnel-primary-action" href="/learn#aave" onClick={() => {
                saveAchievement("funnel-aave");
              }}>
                {zh ? "學習 Aave" : "Learn Aave"} <ArrowRight size={15} /></Link>
              : <Link className="funnel-secondary-action" href="/learn">
                {zh ? "先完成基礎學習" : "Complete the basics first"} <ArrowRight size={15} /></Link>}
          </article>
        </div>

      </div>
    </section>
  );
}
