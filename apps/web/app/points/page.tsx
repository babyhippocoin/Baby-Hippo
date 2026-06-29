"use client";

import {
  AlertTriangle, Award, BookOpen, CalendarCheck, Check, ChevronRight, CircleDollarSign,
  Coins, GraduationCap, HeartHandshake, Landmark, LockKeyhole, Medal,
  MessageCircle, PiggyBank, Route, ShieldCheck, Sparkles, Sprout, Star,
  Target, Trophy, Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicHeader } from "../components/public-header";
import { useLearningMode } from "../components/public-learning-mode";

type Language = "zh-TW" | "en";
type CategoryId = "learning" | "planning" | "yield" | "community";
type Localized = { zh: string; en: string };
type Achievement = {
  id: string;
  category: CategoryId;
  points: number;
  title: Localized;
  description: Localized;
  href: string;
  icon: typeof BookOpen;
  actionTracked?: boolean;
};

const STORAGE_KEY = "baby-hippo-points-mvp";
const LANGUAGE_KEY = "baby-hippo-language";
const l = (zh: string, en: string): Localized => ({ zh, en });

const categories: Record<CategoryId, {
  label: Localized;
  description: Localized;
  icon: typeof BookOpen;
  color: string;
}> = {
  learning: {
    label: l("學習", "Learning"),
    description: l("完成基礎課程，建立更安全的鏈上知識。", "Complete core lessons and build safer on-chain knowledge."),
    icon: GraduationCap,
    color: "#f3aa36",
  },
  planning: {
    label: l("規劃", "Planning"),
    description: l("把預算、風險與緊急預備金放進實際計畫。", "Turn budget, risk, and emergency cash into a practical plan."),
    icon: Target,
    color: "#51c9bb",
  },
  yield: {
    label: l("收益學習", "Yield"),
    description: l("先理解協議與風險，再認識收益來源。", "Understand protocols and risks before exploring yield sources."),
    icon: Landmark,
    color: "#9b81ec",
  },
  community: {
    label: l("社群", "Community"),
    description: l("認識故事、價值與一起成長的人。", "Discover the story, values, and people growing together."),
    icon: HeartHandshake,
    color: "#70c88b",
  },
};

const achievements: Achievement[] = [
  { id: "learn-bitcoin", category: "learning", points: 10, icon: Coins, href: "/learn#bitcoin",
    title: l("完成比特幣課程", "Complete Bitcoin lesson"), description: l("了解比特幣的基本概念與價格波動風險。", "Understand Bitcoin basics and price-volatility risk.") },
  { id: "learn-ethereum", category: "learning", points: 10, icon: Sparkles, href: "/learn#ethereum",
    title: l("完成以太坊課程", "Complete Ethereum lesson"), description: l("認識智慧合約與以太坊應用。", "Learn about smart contracts and Ethereum applications.") },
  { id: "learn-dca", category: "learning", points: 10, icon: Route, href: "/learn#dca",
    title: l("完成定期定額課程", "Complete DCA lesson"), description: l("理解固定節奏如何降低擇時壓力。", "Understand how a schedule can reduce timing pressure.") },
  { id: "learn-aave", category: "learning", points: 10, icon: Landmark, href: "/learn#aave",
    title: l("完成 Aave 課程", "Complete Aave lesson"), description: l("認識借貸、抵押品、健康度與清算。", "Learn lending, collateral, Health Factor, and liquidation.") },
  { id: "learn-etherfi", category: "learning", points: 10, icon: Sprout, href: "/learn#etherfi",
    title: l("完成 Ether.fi 課程", "Complete Ether.fi lesson"), description: l("理解質押、流動性憑證與再質押層次。", "Understand staking, liquid receipt tokens, and restaking layers.") },
  { id: "learn-risk", category: "learning", points: 10, icon: ShieldCheck, href: "/learn#risk",
    title: l("完成風險管理課程", "Complete Risk lesson"), description: l("在行動前先思考可能出錯的地方。", "Think about what can go wrong before acting.") },
  { id: "learn-seed", category: "learning", points: 10, icon: LockKeyhole, href: "/learn#seed-phrase",
    title: l("完成助記詞安全課程", "Complete Seed Phrase Safety lesson"), description: l("學會保護錢包最重要的恢復資訊。", "Learn to protect the wallet's most important recovery information.") },
  { id: "learn-onramp", category: "learning", points: 10, icon: Landmark, href: "/on-ramp",
    title: l("閱讀台幣入金指南", "Read Taiwan fiat on-ramp guide"), description: l("了解如何從台幣開始，並比較入金方便性、費用與下一步。", "Learn how to start with TWD and compare convenience, fees, and next steps.") },

  { id: "plan-first", category: "planning", points: 5, icon: CalendarCheck, href: "/dca-planner", actionTracked: true,
    title: l("已建立定投計畫", "DCA plan created"), description: l("你已儲存一份定投計畫，但這不代表已經開始執行。", "You saved a DCA plan, but this does not mean execution has started.") },
  { id: "plan-balanced", category: "planning", points: 20, icon: CircleDollarSign, href: "/dca-planner",
    title: l("建立均衡 DCA 計畫", "Create balanced DCA plan"), description: l("用均衡風險偏好比較多項資產配置。", "Use the balanced risk profile to compare a multi-asset allocation.") },
  { id: "plan-emergency", category: "planning", points: 20, icon: PiggyBank, href: "/dca-planner",
    title: l("完成緊急預備金計畫", "Complete emergency fund plan"), description: l("先為生活安全建立現金目標，再規劃投入。", "Set an emergency cash target before planning investments.") },
  { id: "funnel-exchange", category: "planning", points: 5, icon: Landmark, href: "/#start-journey", actionTracked: true,
    title: l("已選擇交易平台", "Exchange Selected"), description: l("了解 Baby Hippo 不保管資金，並選擇自行買入資產的平台。", "Understand self-custody responsibilities and choose where to buy assets directly.") },
  { id: "dca-started", category: "planning", points: 20, icon: Check, href: "/dca-planner#how-to-start", actionTracked: true,
    title: l("已提交 DCA 承諾", "DCA Commitment Submitted"), description: l("你已自行提交定投承諾；Baby Hippo 未讀取或驗證交易所資料。", "You self-reported a DCA commitment. Baby Hippo did not read or verify exchange data.") },

  { id: "yield-etherfi", category: "yield", points: 15, icon: Sprout, href: "/earn",
    title: l("閱讀 Ether.fi 指南", "Review Ether.fi guide"), description: l("比較質押收益來源、代幣層次與退出風險。", "Compare staking yield sources, token layers, and exit risk.") },
  { id: "yield-aave", category: "yield", points: 15, icon: Landmark, href: "/earn",
    title: l("閱讀 Aave 指南", "Review Aave guide"), description: l("比較提供資產、借款與流動性風險。", "Compare supplying, borrowing, and liquidity risk.") },
  { id: "yield-kamino", category: "yield", points: 15, icon: Sparkles, href: "/earn",
    title: l("閱讀 Kamino 指南", "Review Kamino guide"), description: l("認識 Solana 借貸與金庫策略。", "Learn about Solana lending and vault strategies.") },
  { id: "yield-hyperlend", category: "yield", points: 15, icon: Trophy, href: "/earn",
    title: l("閱讀 HyperLend 指南", "Review HyperLend guide"), description: l("了解進階借貸、動態利率與較高風險。", "Understand advanced lending, dynamic rates, and higher risk.") },
  { id: "funnel-passive", category: "yield", points: 15, icon: Sprout, href: "/#start-journey",
    title: l("學習被動收入", "Learn Passive Income"), description: l("理解資產可能產生收益，但收益與本金都不保證。", "Understand that assets may produce yield without guaranteeing returns or principal.") },
  { id: "funnel-aave", category: "yield", points: 20, icon: Landmark, href: "/learn#aave",
    title: l("學習進階 Aave", "Learn Aave"), description: l("完成基礎課程後，認識抵押借貸、借款安全分數與清算。", "After the basics, learn collateral lending, borrowing safety, and liquidation.") },
  { id: "dca-habit-verified", category: "planning", points: 50, icon: Trophy, href: "/dca-planner#how-to-start", actionTracked: true,
    title: l("已驗證習慣里程碑", "Verified Habit Milestone"), description: l("未來由驗證系統確認持續定投習慣後才會取得；目前不會自動發放。", "Reserved for a future system that verifies a sustained DCA habit; it is not awarded automatically today.") },

  { id: "community-story", category: "community", points: 5, icon: BookOpen, href: "/story",
    title: l("閱讀創辦人故事", "Read founder story"), description: l("了解貨運、音樂教學與 Baby Hippo 的起點。", "Learn how freight work, music teaching, and Baby Hippo connect.") },
  { id: "community-telegram", category: "community", points: 5, icon: MessageCircle, href: "/community#join",
    title: l("加入 Telegram", "Join Telegram"), description: l("進入學習社群並自行確認官方連結。", "Enter the learning community and verify the official link yourself.") },
  { id: "community-x", category: "community", points: 5, icon: Users, href: "/community#join",
    title: l("追蹤 X", "Follow X"), description: l("追蹤創辦人筆記、產品進度與安全提醒。", "Follow founder notes, product progress, and safety reminders.") },
  { id: "community-values", category: "community", points: 5, icon: HeartHandshake, href: "/community#values",
    title: l("閱讀社群價值", "Read community values"), description: l("理解誠實成長、教育優先與社群重於炒作。", "Understand honest growth, education first, and community over hype.") },
];

const levels = [
  { level: 1, min: 0, max: 99, name: l("探索者", "Explorer"), icon: Star },
  { level: 2, min: 100, max: 299, name: l("建造者", "Builder"), icon: Medal },
  { level: 3, min: 300, max: 599, name: l("鏈上工作者", "On-Chain Worker"), icon: Award },
  { level: 4, min: 600, max: Infinity, name: l("Baby Hippo 老闆", "Baby Hippo Boss"), icon: Trophy },
] as const;

const copy = {
  zh: {
    eyebrow: "Baby Hippo 成就旅程",
    title: "每一步學習，都值得被看見。",
    lead: "透過學習、規劃、收益教育與社群參與累積 Baby Hippo Points。所有進度只儲存在這台裝置。",
    disclaimer: "Baby Hippo Points 不是代幣、加密貨幣、證券、投資或金融產品。",
    local: "本機 MVP・沒有後端、錢包或區塊鏈交易",
    total: "總積分",
    currentLevel: "目前等級",
    completed: "已完成",
    of: "／",
    achievements: "項成就",
    nextLevel: "距離下一等級",
    pointsNeeded: "點",
    maxJourney: "目前 MVP 已完成全部可用積分",
    currentMvp: "目前 MVP 共可取得",
    pointUnit: "點",
    categoryBreakdown: "分類進度",
    journey: "成就任務",
    journeyLead: "一般學習卡片可自行標記；定投行動證明會由相關操作自動記錄。",
    actionTracked: "由相關操作自動記錄",
    complete: "標記完成",
    undo: "取消完成",
    visit: "前往相關頁面",
    done: "已完成",
    incomplete: "尚未完成",
    levelRoad: "等級路線",
    levelRoadLead: "目前任務最高 315 點；更高等級保留給未來新增的教育與社群成就。",
    pointsRange: "點",
    future: "未來社群表揚",
    futureText: "Baby Hippo 未來可能推出社群表揚計畫，但不保證提供任何獎勵。",
    futureNote: "不承諾空投、代幣、現金、收益或其他財務回報。",
    reset: "重設全部進度",
    resetConfirm: "再次點擊確認重設",
    footer: "BHC Points 僅代表本機教育成就，不具有金錢價值，也不能轉讓、交易或兌換。",
  },
  en: {
    eyebrow: "Baby Hippo achievement journey",
    title: "Every learning step deserves to be seen.",
    lead: "Earn Baby Hippo Points through learning, planning, yield education, and community participation. Progress stays on this device.",
    disclaimer: "Baby Hippo Points are not tokens, cryptocurrencies, securities, investments, or financial products.",
    local: "Local-only MVP · No backend, wallet, or blockchain transactions",
    total: "Total points",
    currentLevel: "Current level",
    completed: "Completed",
    of: "of",
    achievements: "achievements",
    nextLevel: "Until next level",
    pointsNeeded: "points",
    maxJourney: "All currently available MVP points completed",
    currentMvp: "Current MVP points available",
    pointUnit: "points",
    categoryBreakdown: "Category progress",
    journey: "Achievement tasks",
    journeyLead: "Learning cards can be marked manually. DCA proof tasks are tracked by their related actions.",
    actionTracked: "Tracked by related action",
    complete: "Mark complete",
    undo: "Mark incomplete",
    visit: "Visit related page",
    done: "Completed",
    incomplete: "Incomplete",
    levelRoad: "Level roadmap",
    levelRoadLead: "Current tasks total 315 points. Higher levels are reserved for future educational and community achievements.",
    pointsRange: "points",
    future: "Future Community Rewards",
    futureText: "Baby Hippo may introduce community recognition programs in the future. No rewards are guaranteed.",
    futureNote: "No airdrops, tokens, cash, yield, or other financial returns are promised.",
    reset: "Reset all progress",
    resetConfirm: "Click again to confirm reset",
    footer: "BHC Points represents local educational achievements only. It has no monetary value and cannot be transferred, traded, or redeemed.",
  },
} as const;

function getLevel(points: number) {
  return [...levels].reverse().find((level) => points >= level.min) ?? levels[0];
}

export default function PointsPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [completed, setCompleted] = useState<string[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const { isBeginner } = useLearningMode();
  const t = language === "zh-TW" ? copy.zh : copy.en;
  const text = (value: Localized) => language === "zh-TW" ? value.zh : value.en;

  useEffect(() => {
    setLanguage(window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-TW");
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { completed?: string[] };
        if (Array.isArray(parsed.completed)) {
          setCompleted(parsed.completed.filter((id) => achievements.some((achievement) => achievement.id === id)));
        }
      } catch {
        setCompleted([]);
      }
    }
    const updateLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    window.addEventListener("baby-hippo-language-change", updateLanguage);
    return () => window.removeEventListener("baby-hippo-language-change", updateLanguage);
  }, []);

  const totalPoints = useMemo(
    () => achievements.filter((achievement) => completed.includes(achievement.id))
      .reduce((sum, achievement) => sum + achievement.points, 0),
    [completed],
  );
  const currentLevel = getLevel(totalPoints);
  const nextLevel = levels.find((level) => level.min > totalPoints);
  const nextThreshold = nextLevel?.min ?? Math.max(totalPoints, 600);
  const progressBase = currentLevel.min;
  const progressSpan = nextLevel ? nextThreshold - progressBase : 1;
  const levelProgress = nextLevel ? Math.min(100, Math.max(0, (totalPoints - progressBase) / progressSpan * 100)) : 100;
  const availablePoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);

  const persistCompleted = (next: string[]) => {
    const nextTotal = achievements.filter((achievement) => next.includes(achievement.id))
      .reduce((sum, achievement) => sum + achievement.points, 0);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      completed: next,
      totalPoints: nextTotal,
      level: getLevel(nextTotal).level,
    }));
    window.dispatchEvent(new CustomEvent("baby-hippo-points-change", { detail: next }));
  };

  const toggle = (id: string) => {
    setConfirmReset(false);
    setCompleted((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      persistCompleted(next);
      return next;
    });
  };

  const reset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setCompleted([]);
    persistCompleted([]);
    setConfirmReset(false);
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
              <div className="points-local-note"><ShieldCheck size={17} /> {t.local}</div>
            </div>
            <div className="points-hero-badge" aria-hidden="true">
              <div className="points-orbit one" /><div className="points-orbit two" />
              <span><Trophy size={42} /><strong>{totalPoints}</strong><small>BHC Points</small></span>
              <i className="b1"><BookOpen size={18} /></i>
              <i className="b2"><Target size={18} /></i>
              <i className="b3"><Landmark size={18} /></i>
              <i className="b4"><Users size={18} /></i>
            </div>
          </div>
          <div className="points-container points-disclaimer">
            <AlertTriangle size={20} /><strong>{t.disclaimer}</strong>
          </div>
          {isBeginner && <div className="points-container learning-mode-note" data-language-static>
            <strong>{language === "zh-TW" ? "把 BHC Points 想成遊戲進度，不是錢。" : "Think of BHC Points as game progress, not money."}</strong>
            <p>{language === "zh-TW"
              ? "完成學習與規劃任務，就會累積 BHC Points 積分。它不是代幣，也不是投資商品，只是幫你看見自己學到哪裡。"
              : "Complete learning and planning tasks to collect BHC Points points. They are not tokens or investments—only a way to see your learning progress."}</p>
          </div>}
        </section>

        <section className="points-dashboard">
          <div className="points-container">
            <div className="points-summary-grid">
              <article className="points-total-card">
                <span>{t.total}</span><strong>{totalPoints}</strong><small>BHC Points</small>
              </article>
              <article>
                <span>{t.currentLevel}</span>
                <strong>Level {currentLevel.level}</strong><small>{text(currentLevel.name)}</small>
              </article>
              <article>
                <span>{t.completed}</span>
                <strong>{completed.length} {t.of} {achievements.length}</strong><small>{t.achievements}</small>
              </article>
              <article>
                <span>{t.currentMvp}</span><strong>{availablePoints}</strong><small>{t.pointUnit}</small>
              </article>
            </div>

            <article className="points-level-progress">
              <div className="points-level-heading">
                <div>
                  <span className="points-eyebrow">{t.nextLevel}</span>
                  <h2>{nextLevel ? text(nextLevel.name) : text(currentLevel.name)}</h2>
                </div>
                <strong>{nextLevel ? `${nextThreshold - totalPoints} ${t.pointsNeeded}` : t.maxJourney}</strong>
              </div>
              <div className="points-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100}
                aria-valuenow={Math.round(levelProgress)}>
                <span style={{ width: `${levelProgress}%` }} />
              </div>
              <div className="points-progress-labels"><span>{progressBase}</span><span>{nextLevel ? nextThreshold : "600+"}</span></div>
            </article>

            <div className="points-section-heading">
              <span className="points-eyebrow">{t.categoryBreakdown}</span><h2>{t.categoryBreakdown}</h2>
            </div>
            <div className="points-category-grid">
              {(Object.keys(categories) as CategoryId[]).map((categoryId) => {
                const category = categories[categoryId];
                const Icon = category.icon;
                const tasks = achievements.filter((achievement) => achievement.category === categoryId);
                const done = tasks.filter((achievement) => completed.includes(achievement.id));
                const earned = done.reduce((sum, achievement) => sum + achievement.points, 0);
                const max = tasks.reduce((sum, achievement) => sum + achievement.points, 0);
                return (
                  <article key={categoryId} style={{ "--category-color": category.color } as React.CSSProperties}>
                    <span className="points-category-icon"><Icon size={23} /></span>
                    <div><h3>{text(category.label)}</h3><p>{text(category.description)}</p></div>
                    <strong>{earned} / {max}</strong>
                    <div className="points-mini-track"><span style={{ width: `${max ? earned / max * 100 : 0}%` }} /></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="points-journey">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">{t.journey}</span><h2>{t.journey}</h2><p>{t.journeyLead}</p>
            </div>
            {(Object.keys(categories) as CategoryId[]).map((categoryId) => {
              const category = categories[categoryId];
              const CategoryIcon = category.icon;
              return (
                <div className="points-achievement-group" key={categoryId}>
                  <div className="points-group-heading" style={{ "--category-color": category.color } as React.CSSProperties}>
                    <span><CategoryIcon size={20} /></span>
                    <div><h3>{text(category.label)}</h3><p>{text(category.description)}</p></div>
                  </div>
                  <div className="points-achievement-grid">
                    {achievements.filter((achievement) => achievement.category === categoryId).map((achievement) => {
                      const Icon = achievement.icon;
                      const isDone = completed.includes(achievement.id);
                      return (
                        <article className={`points-achievement-card ${isDone ? "completed" : ""}`}
                          key={achievement.id} style={{ "--category-color": category.color } as React.CSSProperties}>
                          <button type="button" className="points-achievement-toggle"
                            onClick={() => {
                              if (!achievement.actionTracked) toggle(achievement.id);
                            }}
                            disabled={achievement.actionTracked}
                            aria-pressed={isDone} aria-label={`${isDone ? t.undo : t.complete}: ${text(achievement.title)}`}>
                            <span className="points-task-icon">{isDone ? <Check size={22} /> : <Icon size={22} />}</span>
                            <span className="points-task-copy">
                              <small>{achievement.actionTracked ? t.actionTracked : (isDone ? t.done : t.incomplete)}</small>
                              <strong>{text(achievement.title)}</strong>
                              <p>{text(achievement.description)}</p>
                            </span>
                            <span className="points-task-points">+{achievement.points} BHC Points</span>
                          </button>
                          <Link href={achievement.href}>{t.visit} <ChevronRight size={15} /></Link>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="points-levels">
          <div className="points-container">
            <div className="points-section-heading">
              <span className="points-eyebrow">{t.levelRoad}</span><h2>{t.levelRoad}</h2><p>{t.levelRoadLead}</p>
            </div>
            <div className="points-level-grid">
              {levels.map((level) => {
                const Icon = level.icon;
                const reached = totalPoints >= level.min;
                const active = currentLevel.level === level.level;
                return (
                  <article className={`${reached ? "reached" : ""} ${active ? "active" : ""}`} key={level.level}>
                    <span><Icon size={24} /></span><small>Level {level.level}</small>
                    <h3>{text(level.name)}</h3>
                    <p>{level.max === Infinity ? `${level.min}+` : `${level.min}–${level.max}`} {t.pointsRange}</p>
                  </article>
                );
              })}
            </div>

            <article className="points-future">
              <span><Sparkles size={28} /></span>
              <div><small>{t.future}</small><h2>{t.future}</h2><p>{t.futureText}</p><strong>{t.futureNote}</strong></div>
            </article>

            <button className={`points-reset ${confirmReset ? "confirm" : ""}`} type="button" onClick={reset}>
              {confirmReset ? t.resetConfirm : t.reset}
            </button>
          </div>
        </section>
      </main>
      <footer className="points-footer"><div className="points-container"><strong>Baby Hippo Points</strong><p>{t.footer}</p></div></footer>
    </div>
  );
}
