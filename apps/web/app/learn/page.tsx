"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bitcoin,
  BookOpen,
  Check,
  CircleDollarSign,
  Coins,
  KeyRound,
  Landmark,
  Layers3,
  Menu,
  Route,
  ShieldCheck,
  Sprout,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PublicLanguageSwitcher } from "../components/public-language";
import { PublicHeader } from "../components/public-header";
import {
  BeginnerGlossary, LearningJourneyQuestion, useLearningMode,
} from "../components/public-learning-mode";

const beginnerAnalogies: Record<string, { zh: string; en: string }> = {
  bitcoin: {
    zh: "把比特幣想成「數位黃金」：數量有限，有些人用它長期保存價值，但價格仍會大幅波動。",
    en: "Think of Bitcoin as digital gold: it is scarce and some people use it to store value, but its price can still move sharply.",
  },
  ethereum: {
    zh: "把以太坊想成一座數位城市。開發者可以在城市裡蓋金融工具、遊戲和其他應用。",
    en: "Think of Ethereum as a digital city where developers can build financial tools, games, and other applications.",
  },
  dca: {
    zh: "就像每月固定買台積電零股，不花力氣猜最低價，而是用固定預算慢慢累積。",
    en: "It is like buying a small amount of the same stock every month instead of trying to guess the lowest price.",
  },
  aave: {
    zh: "像線上的當鋪與抵押借貸市場：放入加密資產作抵押，可能借出穩定幣；抵押品跌太多時，可能被強制賣出。",
    en: "It is like an online pawnshop and collateral market: crypto backs a loan, and falling collateral can be forcibly sold.",
  },
  etherfi: {
    zh: "像讓長期持有的 ETH 去工作。ETH 仍是你的長期部位，但可參與質押、可能產生收益，也同時增加風險。",
    en: "It is like putting long-term ETH to work through staking for potential yield, while adding extra risk.",
  },
  risk: {
    zh: "像開貨車前先看載重、煞車和路況。先想哪裡會出錯，再決定要不要上路。",
    en: "Like checking truck load, brakes, and road conditions before driving: think about what can go wrong first.",
  },
  "seed-phrase": {
    zh: "助記詞像整個錢包的萬能鑰匙。誰拿到完整助記詞，通常就能拿走裡面的所有資產。",
    en: "A seed phrase is the master key to the whole wallet. Anyone with it can usually take everything inside.",
  },
};

const lessons = [
  {
    id: "bitcoin",
    number: "01",
    icon: Bitcoin,
    title: "What is Bitcoin?",
    shortTitle: "Bitcoin",
    explanation:
      "Bitcoin is a digital asset and payment network that can move value without a bank controlling the ledger. Its transaction history is recorded by a distributed network of computers.",
    matters:
      "Bitcoin introduced the idea that people can hold and transfer a scarce digital asset using an open network. It is often the first concept people meet when learning about crypto.",
    warning:
      "Bitcoin’s price can change sharply. Sending it to the wrong address or network may be irreversible. Learning about it does not mean you need to buy it.",
    cta: "Next: Understand Ethereum",
    next: "#ethereum",
    accent: "orange",
  },
  {
    id: "ethereum",
    number: "02",
    icon: Layers3,
    title: "What is Ethereum?",
    shortTitle: "Ethereum",
    explanation:
      "Ethereum is a public blockchain that can run programmable applications called smart contracts. People use it for payments, digital ownership, lending, exchanges, and many other on-chain tools.",
    matters:
      "Ethereum makes it possible for applications like Aave and Ether.fi to operate without a traditional company manually approving every action.",
    warning:
      "Smart contracts can contain bugs, applications can be misleading, and network fees can vary. Always confirm the website, network, and transaction details.",
    cta: "Next: Learn the DCA habit",
    next: "#dca",
    accent: "blue",
  },
  {
    id: "dca",
    number: "03",
    icon: Route,
    title: "What is DCA?",
    shortTitle: "DCA",
    explanation:
      "Dollar-cost averaging, or DCA, means dividing a planned amount into smaller purchases made on a regular schedule instead of trying to choose one perfect moment.",
    matters:
      "A schedule can reduce emotional decisions and make a plan easier to follow. It can be useful for people who prefer steady habits over constant chart watching.",
    warning:
      "DCA does not guarantee profit and does not make a risky asset safe. Only use money your real-life budget can handle, and review the plan regularly.",
    cta: "Next: See how Aave works",
    next: "#aave",
    accent: "green",
  },
  {
    id: "aave",
    number: "04",
    icon: Landmark,
    title: "What is Aave?",
    shortTitle: "Aave",
    explanation:
      "Aave is a decentralized lending protocol. Users can supply supported assets to earn variable interest, or borrow assets by providing enough collateral.",
    matters:
      "Aave is a practical example of DeFi lending. Learning it helps explain collateral, interest rates, Health Factor, and liquidation risk.",
    warning:
      "Borrowing can lead to liquidation if collateral value falls or debt grows. Rates change, smart-contract risk exists, and supplied assets are not the same as a bank deposit.",
    cta: "Next: Understand Ether.fi",
    next: "#etherfi",
    accent: "purple",
  },
  {
    id: "etherfi",
    number: "05",
    icon: Sprout,
    title: "What is Ether.fi?",
    shortTitle: "Ether.fi",
    explanation:
      "Ether.fi is a staking and restaking protocol built around Ethereum. It offers liquid receipt assets, including eETH and weETH, that represent a user’s position in the protocol.",
    matters:
      "It shows how one on-chain asset can represent another position and continue moving through DeFi. Understanding this helps beginners recognize layered protocols and additional risk.",
    warning:
      "Restaking adds complexity. Risks may include smart contracts, validators, changing exchange rates, liquidity, integrations, and the protocols underneath the position.",
    cta: "Next: Build a risk mindset",
    next: "#risk",
    accent: "teal",
  },
  {
    id: "risk",
    number: "06",
    icon: ShieldCheck,
    title: "What is Risk Management?",
    shortTitle: "Risk Management",
    explanation:
      "Risk management means deciding what could go wrong before taking action, limiting how much one mistake can hurt, and keeping enough flexibility to respond.",
    matters:
      "On-chain actions can be fast and irreversible. Good habits—small test amounts, diversification, Health Factor monitoring, and careful approvals—can reduce preventable harm.",
    warning:
      "No checklist removes every risk. Avoid leverage you do not understand, promises of unusually high returns, urgent messages, and positions too large for your real-life finances.",
    cta: "Next: Protect your seed phrase",
    next: "#seed-phrase",
    accent: "amber",
  },
  {
    id: "seed-phrase",
    number: "07",
    icon: KeyRound,
    title: "What is a Seed Phrase?",
    shortTitle: "Seed Phrase",
    explanation:
      "A seed phrase is a set of recovery words that can recreate access to a crypto wallet. Anyone who has the complete phrase can usually control the wallet and its assets.",
    matters:
      "It is the master backup for many self-custody wallets. Protecting it is more important than protecting a username or ordinary password.",
    warning:
      "Never type it into a website, send it in a message, save it in cloud notes, or share it with support staff. Baby Hippo and legitimate moderators will never ask for it.",
    cta: "Continue with the community",
    next: "/community",
    accent: "red",
  },
];

function BrandMark() {
  return (
    <span className="learn-brand-mark" aria-hidden="true">
      <i className="learn-ear left" />
      <i className="learn-ear right" />
      <i className="learn-glasses left" />
      <i className="learn-glasses right" />
      <i className="learn-nostril left" />
      <i className="learn-nostril right" />
    </span>
  );
}

function LearnHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="learn-header">
      <div className="learn-container learn-header-inner">
        <Link className="learn-logo" href="/" aria-label="Baby Hippo homepage">
          <BrandMark />
          <span>
            <strong>Baby Hippo</strong>
            <small>Beginner Learning Hub</small>
          </span>
        </Link>

        <nav className="learn-desktop-nav" aria-label="Learning hub navigation">
          <a href="#lessons">Lessons</a>
          <a href="#learning-path">Learning Path</a>
          <Link href="/community">Community</Link>
          <Link href="/dashboard">Lobster Watch</Link>
        </nav>

        <div className="learn-header-actions">
          <PublicLanguageSwitcher />
          <a className="learn-button primary compact" href="#lessons">
            Start Learning
          </a>
          <button
            className="learn-menu-button"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="learn-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <nav
        id="learn-mobile-menu"
        className={`learn-mobile-menu ${open ? "open" : ""}`}
        aria-label="Mobile learning navigation"
      >
        <a href="#lessons" onClick={() => setOpen(false)}>Lessons</a>
        <a href="#learning-path" onClick={() => setOpen(false)}>Learning Path</a>
        <Link href="/community" onClick={() => setOpen(false)}>Community</Link>
        <Link href="/" onClick={() => setOpen(false)}>Back to Homepage</Link>
      </nav>
    </header>
  );
}

export default function LearnPage() {
  const { isBeginner, language } = useLearningMode();
  const visibleLessons = isBeginner ? lessons.filter((lesson) => lesson.id !== "aave") : lessons;
  return (
    <div className="learn-site">
      <PublicHeader />

      <main>
        <section className="learn-hero">
          <div className="learn-container learn-hero-grid">
            <div className="learn-hero-copy">
              <Link className="learn-back-link" href="/">
                <ArrowLeft size={15} /> Baby Hippo Homepage
              </Link>
              <span className="learn-eyebrow">Hippo Academy · Beginner path</span>
              <h1>Learn the basics. Protect your future.</h1>
              <p className="learn-hero-zh">Understand first, then act. Build knowledge one step at a time.</p>
              <p className="learn-lead">
                Seven short lessons explain the ideas behind Bitcoin, Ethereum, DeFi, and wallet
                safety in everyday language. No wallet connection. No pressure to buy anything.
              </p>
              <div className="learn-cta-row">
                <a className="learn-button primary" href="#bitcoin">
                  Begin with Bitcoin <ArrowRight size={17} />
                </a>
                <a className="learn-button secondary" href="#learning-path">
                  <BookOpen size={17} /> View learning path
                </a>
              </div>
              <div className="learn-trust-note">
                <ShieldCheck size={17} />
                <span>Education only. Every lesson includes a beginner warning.</span>
              </div>
            </div>

            <div className="learn-hero-art" aria-hidden="true">
              <div className="learn-sun" />
              <div className="learn-mountain back" />
              <div className="learn-mountain front" />
              <div className="learn-road" />
              <div className="learn-book">
                <BookOpen size={52} />
                <span className="learn-book-node one" />
                <span className="learn-book-node two" />
                <span className="learn-book-node three" />
              </div>
              <div className="learn-art-caption">
                <Sprout size={19} />
                <span><strong>Knowledge compounds</strong>One clear lesson at a time</span>
              </div>
            </div>
          </div>
        </section>

        <LearningJourneyQuestion compact />

        {isBeginner && (
          <section className="learn-path-section" data-language-static>
            <div className="learn-container">
              <div className="learn-section-heading">
                <span className="learn-eyebrow">{language === "zh-TW" ? "先從生活問題開始" : "Start with a real-life question"}</span>
                <h2>{language === "zh-TW" ? "你現在最想解決什麼？" : "What do you want to solve first?"}</h2>
                <p>{language === "zh-TW" ? "不用先記專有名詞。選擇你的問題，再認識對應工具。" : "You do not need jargon first. Start with your problem, then learn the matching idea."}</p>
              </div>
              <div className="beginner-concept-grid">
                {[
                  ["我想開始投資", "I want to start investing", "Bitcoin：先看懂數位黃金與價格風險。", "Bitcoin: understand digital gold and price risk first.", "#bitcoin"],
                  ["我想定期定額", "I want a regular plan", "DCA：像每月固定買零股，降低猜價格的壓力。", "DCA: like buying a small amount monthly to reduce timing pressure.", "#dca"],
                  ["我想增加被動收入", "I want passive income", "Ether.fi：先學 ETH 如何參與質押，再談收益。", "Ether.fi: learn how ETH staking works before thinking about yield.", "#etherfi"],
                  ["我想避免被詐騙", "I want to avoid scams", "錢包安全：先保護助記詞，再學任何鏈上工具。", "Wallet safety: protect the seed phrase before using on-chain tools.", "#seed-phrase"],
                  ["我想學習鏈上借貸", "I want on-chain lending", "先完成比特幣、定投與被動收入基礎，再解鎖 Aave。", "Complete Bitcoin, DCA, and passive-income basics before unlocking Aave.", "/#start-journey"],
                ].map(([zhTitle, enTitle, zhText, enText, href]) => (
                  <article key={href}><h3>{language === "zh-TW" ? zhTitle : enTitle}</h3>
                    <p>{language === "zh-TW" ? zhText : enText}</p>
                    <a href={href}>{language === "zh-TW" ? "前往這一課" : "Go to this lesson"} <ArrowRight size={14} /></a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="learn-path-section" id="learning-path">
          <div className="learn-container">
            <div className="learn-section-heading centered">
              <span className="learn-eyebrow">Your learning road</span>
              <h2>Seven stops. One safer foundation.</h2>
              <p>Read in order or begin with the question you have today.</p>
            </div>
            <nav className="learn-path" aria-label="Lesson shortcuts">
              {visibleLessons.map(({ id, number, shortTitle, icon: Icon }) => (
                <a href={`#${id}`} key={id}>
                  <span><Icon size={17} /></span>
                  <small>{number}</small>
                  <strong>{shortTitle}</strong>
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="learn-lessons" id="lessons">
          <div className="learn-container">
            <div className="learn-section-heading">
              <span className="learn-eyebrow">Beginner lessons</span>
              <h2>Plain language, practical warnings.</h2>
              <p>
                These explanations are a starting point—not financial advice or a substitute for
                checking current documentation before using a protocol.
              </p>
            </div>

            <div className="learn-lesson-list">
              {visibleLessons.map((lesson) => {
                const Icon = lesson.icon;
                const isInternalRoute = lesson.next.startsWith("/");
                const ctaContent = <>{lesson.cta} <ArrowRight size={16} /></>;

                return (
                  <article className={`learn-lesson-card ${lesson.accent}`} id={lesson.id} key={lesson.id}>
                    <div className="learn-lesson-header">
                      <span className="learn-lesson-icon"><Icon size={26} /></span>
                      <div>
                        <small>Lesson {lesson.number}</small>
                        <h2>{lesson.title}</h2>
                      </div>
                    </div>

                    <div className="learn-lesson-content">
                      {isBeginner && <section className="learning-mode-note" data-language-static>
                        <strong>{language === "zh-TW" ? "生活比喻" : "Everyday analogy"}</strong>
                        <p>{language === "zh-TW" ? beginnerAnalogies[lesson.id].zh : beginnerAnalogies[lesson.id].en}</p>
                      </section>}
                      <section>
                        <span className="learn-content-label">
                          <BookOpen size={15} /> Simple explanation
                        </span>
                        <p>{lesson.explanation}</p>
                      </section>
                      <section>
                        <span className="learn-content-label">
                          <CircleDollarSign size={15} /> Why it matters
                        </span>
                        <p>{lesson.matters}</p>
                      </section>
                    </div>

                    <div className="learn-warning">
                      <AlertTriangle size={19} />
                      <div>
                        <strong>Beginner warning</strong>
                        <p>{lesson.warning}</p>
                      </div>
                    </div>

                    <div className="learn-lesson-footer">
                      <span><Check size={14} /> Read slowly. Verify before acting.</span>
                      {isInternalRoute ? (
                        <Link className="learn-next-link" href={lesson.next}>{ctaContent}</Link>
                      ) : (
                        <a className="learn-next-link" href={lesson.next}>{ctaContent}</a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {isBeginner && <BeginnerGlossary />}

        <section className="learn-finish">
          <div className="learn-container learn-finish-card">
            <div className="learn-finish-icon"><Coins size={30} /></div>
            <span className="learn-eyebrow">Your next responsible step</span>
            <h2>Keep learning before you add complexity.</h2>
            <p>
              Ask questions, revisit the warnings, and use read-only tools before considering any
              irreversible on-chain action.
            </p>
            <div className="learn-cta-row">
              <Link className="learn-button primary" href="/community">
                Join Baby Hippo Community <ArrowRight size={17} />
              </Link>
              <Link className="learn-button secondary" href="/dashboard">
                <ShieldCheck size={17} /> View My On-Chain Boss Progress
              </Link>
            </div>
            <div className="learn-final-safety">
              <KeyRound size={17} />
              <span>Baby Hippo will never ask for your seed phrase or private key.</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="learn-footer">
        <div className="learn-container learn-footer-inner">
          <Link className="learn-logo" href="/">
            <BrandMark />
            <span><strong>Baby Hippo</strong><small>From Worker To On-Chain Boss</small></span>
          </Link>
          <div>
            <Link href="/">Homepage</Link>
            <Link href="/community">Community</Link>
            <Link href="/dashboard">Lobster Watch</Link>
          </div>
          <p>Education first. Risk management first. No guaranteed financial outcomes.</p>
        </div>
      </footer>
    </div>
  );
}
