"use client";

import {
  ArrowRight, Award, Bitcoin, BookOpen, BriefcaseBusiness, CalendarCheck, Check,
  ChevronRight, GraduationCap, HeartHandshake, Landmark, Menu, Mountain, Music2,
  Mail, MessageCircle, Route, ShieldCheck, Sprout, Store, Truck, Users, X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublicLanguageSwitcher } from "./public-language";
import { PublicHeader } from "./public-header";
import { LearningJourneyQuestion } from "./public-learning-mode";
import { ProductFunnel } from "./public-product-funnel";
import { LobsterJourney } from "./lobster-journey";

type Language = "zh-TW" | "en";
type JourneyTask = {
  id: string;
  points: number;
  href: string;
  icon: typeof BookOpen;
  actionTracked?: boolean;
  zh: string;
  en: string;
  actionZh: string;
  actionEn: string;
};

const LANGUAGE_KEY = "baby-hippo-language";
const POINTS_STORAGE_KEY = "baby-hippo-points-mvp";

const journeyTasks: JourneyTask[] = [
  {
    id: "learn-bitcoin", points: 10, href: "/learn#bitcoin", icon: Bitcoin,
    zh: "學習比特幣", en: "Learn Bitcoin", actionZh: "閱讀比特幣指南", actionEn: "Read Bitcoin Guide",
  },
  {
    id: "plan-first", points: 5, href: "/dca-planner", icon: CalendarCheck, actionTracked: true,
    zh: "建立第一份定投計畫", en: "Create First DCA Plan", actionZh: "建立我的第一份定投計畫", actionEn: "Create My First DCA Plan",
  },
  {
    id: "funnel-exchange", points: 5, href: "/#start-journey", icon: Landmark, actionTracked: true,
    zh: "選擇交易所", en: "Select an Exchange", actionZh: "選擇交易所", actionEn: "Choose an Exchange",
  },
  {
    id: "dca-started", points: 20, href: "/dca-planner#how-to-start", icon: Check, actionTracked: true,
    zh: "已提交 DCA 承諾", en: "DCA Commitment Submitted", actionZh: "提交我的 DCA 承諾", actionEn: "Submit My DCA Commitment",
  },
  {
    id: "yield-etherfi", points: 15, href: "/earn#etherfi", icon: Sprout,
    zh: "閱讀 Ether.fi 指南", en: "Read Ether.fi Guide", actionZh: "學習 Ether.fi", actionEn: "Learn Ether.fi",
  },
  {
    id: "yield-aave", points: 15, href: "/earn#aave", icon: Landmark,
    zh: "閱讀 Aave 指南", en: "Read Aave Guide", actionZh: "學習 Aave", actionEn: "Learn Aave",
  },
  {
    id: "community-telegram", points: 5, href: "/community#join", icon: HeartHandshake,
    zh: "加入社群", en: "Join Community", actionZh: "加入社群", actionEn: "Join Community",
  },
];

const achievementPoints: Record<string, number> = {
  "learn-bitcoin": 10, "learn-ethereum": 10, "learn-dca": 10, "learn-aave": 10,
  "learn-etherfi": 10, "learn-risk": 10, "learn-seed": 10,
  "learn-onramp": 10,
  "plan-first": 5, "plan-balanced": 20, "plan-emergency": 20, "dca-started": 20,
  "yield-etherfi": 15, "yield-aave": 15, "yield-kamino": 15, "yield-hyperlend": 15,
  "community-story": 5, "community-telegram": 5, "community-x": 5, "community-values": 5,
  "funnel-exchange": 5, "funnel-passive": 15, "funnel-aave": 20, "dca-habit-verified": 50,
};

function getPointsLevel(points: number) {
  if (points >= 600) return 4;
  if (points >= 300) return 3;
  if (points >= 100) return 2;
  return 1;
}

const audiences = [
  [Truck, "Truck Drivers", "Learning designed around long roads, irregular hours, and real responsibilities."],
  [BriefcaseBusiness, "Workers & Logistics Teams", "Practical tools that respect every hour of honest work."],
  [Music2, "Music Teachers", "Steady learning for people who patiently help others grow."],
  [Store, "Small Business Owners", "Clear guidance for people balancing business, family, and the future."],
  [Mountain, "Rural Communities", "Access to modern knowledge should not depend on where you live."],
  [Users, "Everyday Builders", "A welcoming place to begin, ask questions, and move forward."],
] as const;

const products = [
  {
    number: "01", icon: ShieldCheck, status: "Live prototype", title: "Lobster Watch",
    label: "Understand your risk",
    text: "Monitor market signals and Aave health in calm, plain language—without trading or automatic execution.",
    note: "Read-only by design.", href: "/dashboard", cta: "View My On-Chain Boss Progress", featured: true,
  },
  {
    number: "02", icon: Route, status: "Learning preview", title: "Hippo Bank",
    label: "Build a steady plan",
    text: "Learn DCA habits and DeFi lending concepts through simple planning tools and simulations.",
    note: "Education, not guaranteed outcomes.", href: "/dca-planner", cta: "Create My DCA Plan",
  },
  {
    number: "03", icon: GraduationCap, status: "Phase 1", title: "Hippo Academy",
    label: "Learn one step at a time",
    text: "Short beginner lessons about wallet safety, scams, DCA, lending, and risk management.",
    note: "No wallet connection required.", href: "/learn#bitcoin", cta: "Read Bitcoin Guide",
  },
];

const values = [
  "Honest growth, not scams",
  "Long-term progress, not overnight gambling",
  "Education before speculation",
  "Risk management before leverage",
  "Tools for ordinary people",
  "Community over hype",
];

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`public-brand-mark ${small ? "small" : ""}`} aria-hidden="true">
      <i className="public-ear left" /><i className="public-ear right" />
      <i className="public-glasses left" /><i className="public-glasses right" />
      <i className="public-nostril left" /><i className="public-nostril right" />
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="public-header">
      <div className="public-container public-header-inner">
        <Link className="public-logo" href="/" aria-label="Baby Hippo home">
          <BrandMark small />
          <span><strong>Baby Hippo</strong><small>On-chain growth community</small></span>
        </Link>
        <nav className="public-desktop-nav" aria-label="Homepage navigation">
          <a href="#story">Our Story</a><a href="#community">Community</a>
          <a href="#products">Products</a><a href="#stories">Hippo Stories</a>
          <a href="#values">Values</a>
        </nav>
        <div className="public-header-actions">
          <PublicLanguageSwitcher />
          <a className="public-button primary compact" href="#join">Join Community</a>
          <button className="public-menu-button" type="button" onClick={() => setOpen(!open)}
            aria-expanded={open} aria-controls="public-mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <nav id="public-mobile-menu" className={`public-mobile-menu ${open ? "open" : ""}`} aria-label="Mobile homepage navigation">
        {[
          ["#story", "Our Story"], ["#community", "Who We Build For"], ["#products", "Products"],
          ["#stories", "Hippo Stories"], ["#values", "Our Values"],
        ].map(([href, label]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="public-button primary" href="#join" onClick={() => setOpen(false)}>Join Community</a>
      </nav>
    </header>
  );
}

function HeroArtwork() {
  return (
    <div className="public-hero-art" role="img" aria-label="Baby Hippo guiding working people along a learning road toward the mountains">
      <div className="public-sun" /><div className="public-mountains back" /><div className="public-mountains front" />
      <div className="public-music-notes" aria-hidden="true">♪　♫</div>
      <div className="public-road"><i /><i /><i /></div>
      <div className="public-hero-hippo"><BrandMark /><div className="public-vest"><span /></div></div>
      <div className="public-art-badge"><ShieldCheck size={17} /><span><strong>Education first</strong>Build safer habits</span></div>
      <div className="public-piano-keys" aria-hidden="true">{Array.from({ length: 8 }).map((_, i) => <i key={i} />)}</div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, text, centered = false }: {
  eyebrow: string; title: string; text?: string; centered?: boolean;
}) {
  return (
    <div className={`public-section-heading ${centered ? "centered" : ""}`}>
      <span>{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}
    </div>
  );
}

function MyJourney() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const t = language === "zh-TW" ? {
    eyebrow: "你的第一段旅程",
    title: "我的 Baby Hippo 旅程",
    progress: "已完成",
    next: "下一個推薦行動",
    allDone: "第一段旅程完成了！",
    allDoneText: "做得好。你已經建立學習、規劃、收益教育與社群參與的第一個基礎。",
    completed: "已完成",
    markComplete: "標記完成",
    points: "教育成就積分",
    local: "進度只保存在這台裝置，並與成就積分頁同步。",
    viewPoints: "查看全部成就",
  } : {
    eyebrow: "Your first journey",
    title: "My Baby Hippo Journey",
    progress: "completed",
    next: "Next Recommended Action",
    allDone: "Your first journey is complete!",
    allDoneText: "Nice work. You have built a first foundation across learning, planning, yield education, and community.",
    completed: "Completed",
    markComplete: "Mark complete",
    points: "educational achievement points",
    local: "Progress stays on this device and syncs with your Points page.",
    viewPoints: "View all achievements",
  };

  useEffect(() => {
    const loadProgress = () => {
      setLanguage(window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-TW");
      try {
        const saved = JSON.parse(window.localStorage.getItem(POINTS_STORAGE_KEY) || "{}") as {
          completed?: string[];
        };
        const nextCompleted = Array.isArray(saved.completed) ? saved.completed : [];
        setCompleted((current) => current.length === nextCompleted.length
          && current.every((id, index) => id === nextCompleted[index]) ? current : nextCompleted);
      } catch {
        setCompleted([]);
      }
      setReady(true);
    };
    const updateLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    loadProgress();
    window.addEventListener("baby-hippo-language-change", updateLanguage);
    window.addEventListener("storage", loadProgress);
    window.addEventListener("baby-hippo-points-change", loadProgress);
    return () => {
      window.removeEventListener("baby-hippo-language-change", updateLanguage);
      window.removeEventListener("storage", loadProgress);
      window.removeEventListener("baby-hippo-points-change", loadProgress);
    };
  }, []);

  const completedCount = journeyTasks.filter((task) => completed.includes(task.id)).length;
  const progress = completedCount / journeyTasks.length * 100;
  const nextTask = journeyTasks.find((task) => !completed.includes(task.id));
  const totalPoints = useMemo(
    () => completed.reduce((sum, id) => sum + (achievementPoints[id] || 0), 0),
    [completed],
  );

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify({
      completed,
      totalPoints,
      level: getPointsLevel(totalPoints),
    }));
    window.dispatchEvent(new CustomEvent("baby-hippo-points-change", { detail: completed }));
  }, [completed, ready, totalPoints]);

  const toggleTask = (task: JourneyTask) => {
    setCompleted((current) => current.includes(task.id)
      ? current.filter((id) => id !== task.id)
      : [...current, task.id]);
  };

  return (
    <section className="public-journey" aria-labelledby="journey-title" data-language-static>
      <div className="public-container">
        <article className="public-journey-card">
          <div className="public-journey-heading">
            <div>
              <span className="public-kicker">{t.eyebrow}</span>
              <h2 id="journey-title">{t.title}</h2>
              <p>{completedCount}/{journeyTasks.length} {t.progress}</p>
            </div>
            <div className="public-journey-points">
              <Award size={19} />
              <strong>{ready ? totalPoints : 0} BHP</strong>
              <span>{t.points}</span>
            </div>
          </div>

          <div className="public-journey-progress" role="progressbar" aria-valuemin={0}
            aria-valuemax={journeyTasks.length} aria-valuenow={completedCount}
            aria-label={`${completedCount}/${journeyTasks.length} ${t.progress}`}>
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="public-journey-next">
            <div>
              <span>{t.next}</span>
              <strong>{nextTask ? (language === "zh-TW" ? nextTask.zh : nextTask.en) : t.allDone}</strong>
              {!nextTask && <p>{t.allDoneText}</p>}
            </div>
            {nextTask ? (
              <Link href={nextTask.href}>
                {language === "zh-TW" ? nextTask.actionZh : nextTask.actionEn}
                <ArrowRight size={16} />
              </Link>
            ) : <Check size={24} />}
          </div>

          <div className="public-journey-tasks">
            {journeyTasks.map((task) => {
              const Icon = task.icon;
              const isComplete = completed.includes(task.id);
              return (
                <article className={isComplete ? "completed" : ""} key={task.id}>
                  <button type="button" onClick={() => {
                    if (!task.actionTracked) toggleTask(task);
                  }}
                    disabled={task.actionTracked}
                    aria-pressed={isComplete}
                    aria-label={`${isComplete ? t.completed : t.markComplete}: ${language === "zh-TW" ? task.zh : task.en}`}>
                    <span>{isComplete ? <Check size={18} /> : <Icon size={18} />}</span>
                    <strong>{language === "zh-TW" ? task.zh : task.en}</strong>
                    <small>+{task.points} BHP</small>
                  </button>
                  <Link href={task.href} aria-label={`${language === "zh-TW" ? task.actionZh : task.actionEn}: ${language === "zh-TW" ? task.zh : task.en}`}>
                    <ChevronRight size={17} />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="public-journey-foot">
            <span><ShieldCheck size={15} /> {t.local}</span>
            <Link href="/points">{t.viewPoints} <ArrowRight size={14} /></Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function PublicHomepage() {
  return (
    <div className="public-site">
      <PublicHeader />
      <main>
        <section className="public-hero" id="top">
          <div className="public-container public-hero-grid">
            <div className="public-hero-copy">
              <span className="public-kicker">An on-chain growth community for ordinary people</span>
              <h1>From Worker<br />To On-Chain Boss</h1>
              <p className="public-hero-zh" id="zh">Built for everyone working hard to improve life.</p>
              <p className="public-hero-lead">Learn wallets, DCA, DeFi, and risk management at your own pace—with tools and a community built for real life.</p>
              <div className="public-cta-row">
                <a className="public-button primary" href="#start-journey">Start My Baby Hippo Journey <ArrowRight size={17} /></a>
                <Link className="public-button secondary" href="/learn#bitcoin"><BookOpen size={17} /> Read Bitcoin Guide</Link>
              </div>
              <div className="public-trust-line"><ShieldCheck size={17} /><span>Education first. Risk management first. No promises of easy money.</span></div>
            </div>
            <HeroArtwork />
          </div>
        </section>

        <section className="public-story public-section" id="story">
          <div className="public-container public-story-grid">
            <div className="public-story-visual">
              <div className="public-story-landscape"><Mountain size={42} /><Route size={32} /><Music2 size={34} /></div>
              <div className="public-story-caption"><span>Miaoli, Taiwan</span><strong>Where roads, music, and a new idea met.</strong></div>
            </div>
            <div className="public-story-copy">
              <SectionHeading eyebrow="Our story" title="Built from real life." />
              <p>Baby Hippo began in a rural town in Miaoli. Its founder has worked in logistics and freight transportation and teaches violin—two worlds built on responsibility, patience, and practice.</p>
              <p>While learning DeFi and risk management, he saw how complicated and unwelcoming the on-chain world can feel to ordinary people. Too many projects begin with hype before education.</p>
              <blockquote>“I am building Baby Hippo for people who work hard, want to learn, and deserve a fair place to begin.”</blockquote>
              <Link className="public-text-link" href="/story">Read Founder Story <ChevronRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="public-section public-audience" id="community">
          <div className="public-container">
            <SectionHeading eyebrow="Who we build for" title="Built for people who keep going."
              text="We do not believe only whales deserve modern financial tools. Ordinary people deserve education, risk awareness, and a place to learn too." centered />
            <div className="public-audience-grid">
              {audiences.map(([Icon, title, text]) => (
                <article className="public-audience-card" key={title}><span><Icon size={21} /></span><div><h3>{title}</h3><p>{text}</p></div></article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-section public-products" id="products">
          <div className="public-container">
            <SectionHeading eyebrow="Our core products" title="Learn. Protect. Plan. Grow."
              text="Baby Hippo starts with understanding and protection. Every product makes the next step clearer—not more pressured." />
            <div className="public-product-grid">
              {products.map(({ icon: Icon, ...product }) => (
                <article className={`public-product-card ${product.featured ? "featured" : ""}`} key={product.title}>
                  <div className="public-product-top"><span className="public-product-icon"><Icon size={24} /></span><span className="public-status">{product.status}</span></div>
                  <span className="public-product-number">{product.number}</span><p className="public-product-label">{product.label}</p>
                  <h3>{product.title}</h3><p>{product.text}</p><small><Check size={13} /> {product.note}</small>
                  {product.href.startsWith("/") ? <Link className="public-product-link" href={product.href}>{product.cta} <ArrowRight size={16} /></Link>
                    : <a className="public-product-link" href={product.href}>{product.cta} <ArrowRight size={16} /></a>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="public-section public-learning" id="learn">
          <div className="public-container public-learning-card">
            <div className="public-learning-icon"><BookOpen size={29} /></div>
            <div><span className="public-kicker">Your first five-minute lesson</span><h2>Understand before you connect.</h2>
              <p>A wallet is a tool for accessing on-chain accounts. Never share your seed phrase, never approve something you do not understand, and begin with small, reversible learning steps.</p>
              <div className="public-lesson-points"><span><Check size={14} /> Protect your seed phrase</span><span><Check size={14} /> Check the network</span><span><Check size={14} /> Read before signing</span></div>
            </div>
            <Link className="public-button secondary" href="/learn#bitcoin">Read Bitcoin Guide <ArrowRight size={16} /></Link>
          </div>
        </section>

        <LearningJourneyQuestion />

        <section className="public-section">
          <LobsterJourney />
        </section>

        <ProductFunnel />

        <MyJourney />

        <section className="public-section public-stories" id="stories">
          <div className="public-container public-stories-grid">
            <div><SectionHeading eyebrow="Hippo Stories" title="Real people. Real journeys."
              text="We will share the learning journeys of drivers, workers, teachers, rural entrepreneurs, and first-time Web3 learners—with dignity and consent." />
              <p className="public-stories-statement">People are the community. The community is more important than hype.</p></div>
            <article className="public-story-empty"><span><HeartHandshake size={28} /></span><h3>The first Hippo Stories are being gathered with care.</h3>
              <p>A meaningful story does not need a large portfolio or dramatic success. It begins with honest effort and one lesson worth sharing.</p>
              <a className="public-text-link" href="#join">Share your learning journey <ChevronRight size={16} /></a></article>
          </div>
        </section>

        <section className="public-section public-values" id="values">
          <div className="public-container">
            <SectionHeading eyebrow="Our values" title="What we refuse to compromise."
              text="Markets change. Technology changes. Our responsibility to ordinary people should remain." centered />
            <div className="public-values-grid">{values.map(value => <div className="public-value" key={value}><Check size={16} /><span>{value}</span></div>)}</div>
            <div className="public-doc-grid">
              <article><span className="public-doc-icon"><BookOpen size={23} /></span><p>Why we exist</p><h3>The Baby Hippo Manifesto</h3>
                <p>Our origin, mission, and the people we are building for.</p><span className="public-coming-soon">Public reading page coming next</span></article>
              <article><span className="public-doc-icon"><Landmark size={23} /></span><p>How we decide</p><h3>The Baby Hippo Constitution</h3>
                <p>The permanent principles guiding our products and community.</p><span className="public-coming-soon">Public reading page coming next</span></article>
            </div>
          </div>
        </section>

        <section className="public-section public-join" id="join">
          <div className="public-container public-join-card">
            <div className="public-join-mark"><BrandMark /></div><span className="public-kicker">Join Baby Hippo</span>
            <h2>You do not have to know everything to begin.</h2><p>Learn at your own pace. Ask questions without shame. Build safer habits. Help someone else when you are ready.</p>
            <div className="public-cta-row"><Link className="public-button primary" href="/community#join">Join Community <ArrowRight size={17} /></Link>
              <Link className="public-button secondary" href="/learn#bitcoin"><BookOpen size={17} /> Read Bitcoin Guide</Link></div>
            <div className="public-founder-close"><p>We do not promise wealth. We do not promise easy money.</p>
              <strong>We will keep building for people willing to learn and grow.</strong><span>From Worker To On-Chain Boss.</span></div>
          </div>
        </section>

        <section className="public-section public-contact">
          <div className="public-container">
            <SectionHeading eyebrow="Founder communication" title="A real project should be reachable."
              text="Official community channels are being prepared. Until then, use these email addresses for project and founder communication." />
            <div className="public-contact-grid">
              <a href="mailto:hello@babyhippo.community"><Mail size={22} /><span><small>Official Email</small><strong>hello@babyhippo.community</strong></span></a>
              <a href="mailto:founder@babyhippo.community"><Mail size={22} /><span><small>Founder Email</small><strong>founder@babyhippo.community</strong></span></a>
              <div><MessageCircle size={22} /><span><small>Social Links</small><strong>X · Coming Soon</strong><strong>Telegram · Coming Soon</strong></span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <div className="public-container public-footer-grid">
          <div className="public-footer-brand"><Link className="public-logo" href="/"><BrandMark small /><span><strong>Baby Hippo</strong><small>From Worker To On-Chain Boss</small></span></Link>
            <p>Built for everyone working hard to improve life.</p></div>
          <div><strong>Explore</strong><a href="#story">Our Story</a><a href="#products">Products</a><a href="#stories">Hippo Stories</a></div>
          <div><strong>Learn</strong><a href="#learn">First Lesson</a><Link href="/dashboard">Lobster Watch</Link><a href="#values">Our Values</a></div>
          <div><strong>Safety</strong><p>Baby Hippo will never ask for your seed phrase or private key.</p></div>
        </div>
        <div className="public-container public-footer-bottom"><span>© 2026 Baby Hippo. Built carefully in Taiwan.</span><span>Education only. No guaranteed financial outcomes.</span></div>
      </footer>
    </div>
  );
}
