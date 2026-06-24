"use client";

import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  BookOpen,
  BriefcaseBusiness,
  Check,
  HeartHandshake,
  Menu,
  MessageCircle,
  Mountain,
  Music2,
  Send,
  ShieldCheck,
  Store,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PublicLanguageSwitcher } from "../components/public-language";
import { PublicHeader } from "../components/public-header";
import { useLearningMode } from "../components/public-learning-mode";

const TELEGRAM_URL = "https://t.me/BabyHippoCommunity";
const X_URL = "https://x.com/BabyHippoWeb3";

const communityValues = [
  {
    icon: ShieldCheck,
    title: "Honest Growth",
    text: "No scams, false promises, hidden pressure, or get-rich-quick culture.",
  },
  {
    icon: BookOpen,
    title: "Education First",
    text: "We learn what a tool does, what can go wrong, and what questions to ask before acting.",
  },
  {
    icon: HeartHandshake,
    title: "Respect Every Beginner",
    text: "No one should feel ashamed for asking a basic question or starting with limited resources.",
  },
  {
    icon: Users,
    title: "Community Over Hype",
    text: "People, useful knowledge, and safer habits matter more than attention or market noise.",
  },
];

const people = [
  [Truck, "Drivers & Logistics Workers", "Learning that fits around real shifts, routes, and responsibilities."],
  [BriefcaseBusiness, "Labor & Everyday Workers", "A practical place to understand modern tools without insider language."],
  [Music2, "Music & Arts Teachers", "A community that values patience, practice, and grassroots education."],
  [Store, "Small Business Owners", "Clear learning for people balancing customers, family, and the future."],
  [Mountain, "People From Rural Areas", "Knowledge and opportunity should not depend on a big-city address."],
  [Users, "First-Time Web3 Learners", "A calm place to begin, ask questions, and build confidence step by step."],
] as const;

function BrandMark() {
  return (
    <span className="community-brand-mark" aria-hidden="true">
      <i className="community-ear left" />
      <i className="community-ear right" />
      <i className="community-glasses left" />
      <i className="community-glasses right" />
      <i className="community-nostril left" />
      <i className="community-nostril right" />
    </span>
  );
}

function CommunityHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="community-header">
      <div className="community-container community-header-inner">
        <Link className="community-logo" href="/" aria-label="Baby Hippo homepage">
          <BrandMark />
          <span>
            <strong>Baby Hippo</strong>
            <small>On-chain growth community</small>
          </span>
        </Link>

        <nav className="community-desktop-nav" aria-label="Community page navigation">
          <a href="#mission">Mission</a>
          <a href="#values">Values</a>
          <a href="#people">Who It Is For</a>
          <a href="#join">Join Us</a>
          <Link href="/dashboard">Lobster Watch</Link>
        </nav>

        <div className="community-header-actions">
          <PublicLanguageSwitcher />
          <a className="community-button primary compact" href="#join">
            Join Community
          </a>
          <button
            className="community-menu-button"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="community-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <nav
        id="community-mobile-menu"
        className={`community-mobile-menu ${open ? "open" : ""}`}
        aria-label="Mobile community navigation"
      >
        {[
          ["#mission", "Mission"],
          ["#values", "Community Values"],
          ["#people", "Who It Is For"],
          ["#join", "Join Us"],
        ].map(([href, label]) => (
          <a href={href} key={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <Link href="/" onClick={() => setOpen(false)}>Back to Homepage</Link>
      </nav>
    </header>
  );
}

export default function CommunityPage() {
  const { isBeginner, language } = useLearningMode();
  return (
    <div className="community-site">
      <PublicHeader />

      <main>
        <section className="community-hero">
          <div className="community-container community-hero-grid">
            <div className="community-hero-copy">
              <Link className="community-back-link" href="/">
                <ArrowLeft size={15} /> Baby Hippo Homepage
              </Link>
              <span className="community-eyebrow">People are the community</span>
              <h1>A place to learn, grow, and help each other.</h1>
              <p className="community-hero-zh">
                Built for everyone working hard to improve life.
              </p>
              <p className="community-lead">
                Baby Hippo welcomes ordinary people who want to understand Web3, build safer
                habits, and improve life step by step—without hype, pressure, or shame.
              </p>
              <div className="community-cta-row">
                <a
                  className="community-button telegram"
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Send size={18} /> Join Telegram <ArrowRight size={16} />
                </a>
                <a
                  className="community-button x-button"
                  href={X_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <AtSign size={18} /> Follow on X <ArrowRight size={16} />
                </a>
              </div>
              <div className="community-safety-note">
                <ShieldCheck size={17} />
                <span>Baby Hippo will never ask for your seed phrase or private key.</span>
              </div>
            </div>

            <div className="community-hero-art" aria-hidden="true">
              <div className="community-sun" />
              <div className="community-mountain back" />
              <div className="community-mountain front" />
              <div className="community-path" />
              <div className="community-people">
                <span><Truck size={22} /></span>
                <span><Music2 size={22} /></span>
                <span className="hippo"><BrandMark /></span>
                <span><BriefcaseBusiness size={22} /></span>
                <span><Store size={22} /></span>
              </div>
              <div className="community-art-caption">
                <HeartHandshake size={19} />
                <span><strong>Learn together</strong>Grow one responsible step at a time</span>
              </div>
            </div>
          </div>
        </section>

        {isBeginner && <div className="community-container learning-mode-note" data-language-static>
          <strong>{language === "zh-TW" ? "完全不懂也可以加入。" : "You can join even if you know nothing yet."}</strong>
          <p>{language === "zh-TW"
            ? "這裡先回答最基本的問題，不笑新手，也不要求你買幣、連錢包或投入資金。"
            : "Basic questions are welcome. No one should shame beginners or pressure you to buy, connect a wallet, or invest."}</p>
        </div>}

        <section className="community-section community-mission" id="mission">
          <div className="community-container community-mission-grid">
            <div>
              <span className="community-eyebrow">Our mission</span>
              <h2>Help ordinary people become more capable on-chain.</h2>
            </div>
            <div className="community-mission-copy">
              <p>
                Our mission is to make wallets, DCA, DeFi lending, and risk management easier to
                understand for people with real jobs, families, students, and responsibilities.
              </p>
              <p>
                Becoming an on-chain boss does not mean becoming rich overnight. It means learning
                how the tools work, recognizing risk, making independent decisions, and helping
                someone else when you are ready.
              </p>
              <blockquote>
                We do not promise easy money. We promise to keep building education, practical
                tools, and a respectful place to begin.
              </blockquote>
            </div>
          </div>
        </section>

        <section className="community-section community-values" id="values">
          <div className="community-container">
            <div className="community-section-heading">
              <span className="community-eyebrow">Community values</span>
              <h2>How we treat each other matters.</h2>
              <p>
                These principles guide conversations, learning, moderation, and everything we
                build together.
              </p>
            </div>
            <div className="community-values-grid">
              {communityValues.map(({ icon: Icon, title, text }) => (
                <article key={title}>
                  <span><Icon size={23} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="community-conduct">
              <strong>In this community, we:</strong>
              <div>
                <span><Check size={14} /> Ask questions without shame</span>
                <span><Check size={14} /> Explain risk before opportunity</span>
                <span><Check size={14} /> Correct mistakes respectfully</span>
                <span><Check size={14} /> Protect beginners from scams</span>
              </div>
            </div>
          </div>
        </section>

        <section className="community-section community-for" id="people">
          <div className="community-container">
            <div className="community-section-heading centered">
              <span className="community-eyebrow">Who this community is for</span>
              <h2>If you work hard and want to learn, you belong here.</h2>
              <p>
                You do not need a large portfolio, technical background, or online following.
              </p>
            </div>
            <div className="community-people-grid">
              {people.map(([Icon, title, text]) => (
                <article key={title}>
                  <span><Icon size={21} /></span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="community-section community-join" id="join">
          <div className="community-container community-join-card">
            <div className="community-join-icon"><MessageCircle size={30} /></div>
            <span className="community-eyebrow">Choose your starting point</span>
            <h2>Come learn with Baby Hippo.</h2>
            <p>
              Join the conversation on Telegram or follow the project’s learning notes and updates
              on X. Participation does not require a wallet connection or financial information.
            </p>
            <div className="community-channel-grid">
              <article>
                <span className="channel-icon telegram"><Send size={25} /></span>
                <div>
                  <small>Conversation & questions</small>
                  <h3>Baby Hippo Telegram</h3>
                  <p>Meet other learners, ask beginner questions, and receive community updates.</p>
                </div>
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                  Join Telegram <ArrowRight size={16} />
                </a>
              </article>
              <article>
                <span className="channel-icon x"><AtSign size={25} /></span>
                <div>
                  <small>Learning notes & progress</small>
                  <h3>Baby Hippo on X</h3>
                  <p>Follow founder notes, product updates, safety reminders, and learning posts.</p>
                </div>
                <a href={X_URL} target="_blank" rel="noreferrer">
                  Follow on X <ArrowRight size={16} />
                </a>
              </article>
            </div>
            <div className="community-final-note">
              <ShieldCheck size={18} />
              <p>
                Verify official links from this page. Community moderators will never request
                passwords, seed phrases, private keys, or payment to answer a question.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="community-footer">
        <div className="community-container community-footer-inner">
          <Link className="community-logo" href="/">
            <BrandMark />
            <span><strong>Baby Hippo</strong><small>From Worker To On-Chain Boss</small></span>
          </Link>
          <div>
            <Link href="/">Homepage</Link>
            <Link href="/dashboard">Lobster Watch</Link>
            <a href="#values">Community Values</a>
          </div>
          <p>Education first. Risk management first. No guaranteed financial outcomes.</p>
        </div>
      </footer>
    </div>
  );
}
