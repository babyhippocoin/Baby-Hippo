"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  HeartHandshake,
  Landmark,
  Menu,
  Mountain,
  Music2,
  Route,
  ShieldCheck,
  Sprout,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PublicLanguageSwitcher } from "../components/public-language";
import { PublicHeader } from "../components/public-header";
import { useLearningMode } from "../components/public-learning-mode";

const timeline = [
  {
    icon: Mountain,
    chapter: "Roots",
    title: "Growing up in rural Miaoli",
    text: "Life began far from financial centers and technology companies. That background taught me to value practical knowledge, honest work, and opportunities that reach beyond big cities.",
  },
  {
    icon: Truck,
    chapter: "Work",
    title: "Learning responsibility on the road",
    text: "Logistics and freight work meant long hours, changing schedules, and responsibility for every load. It showed me why working people need tools that respect limited time and real-life pressure.",
  },
  {
    icon: Music2,
    chapter: "Teaching",
    title: "Teaching violin, one practice at a time",
    text: "Violin teaching taught me that progress is rarely dramatic. Students improve through patient repetition, honest feedback, and small habits—the same mindset I later brought to financial learning.",
  },
  {
    icon: BookOpen,
    chapter: "Learning",
    title: "Starting to understand investing",
    text: "I began as a learner, not an expert. I had to work through unfamiliar language, market noise, fear, and the temptation to move faster than my understanding.",
  },
  {
    icon: Route,
    chapter: "Discipline",
    title: "Building a DCA habit",
    text: "DCA helped shift my attention away from guessing the perfect moment. The deeper lesson was not about a guaranteed result—it was about budgeting, consistency, and making fewer emotional decisions.",
  },
  {
    icon: Sprout,
    chapter: "DeFi",
    title: "Exploring Ether.fi",
    text: "Ether.fi introduced me to staking, liquid receipt tokens, and restaking. It also taught me that every extra layer can add another dependency and another question that must be understood.",
  },
  {
    icon: Landmark,
    chapter: "Risk",
    title: "Learning Aave and Health Factor",
    text: "Aave made collateral, borrowing, changing rates, and liquidation risk real. Health Factor became a reminder that protecting a position matters more than chasing the maximum possible return.",
  },
  {
    icon: HeartHandshake,
    chapter: "Building",
    title: "Creating Baby Hippo",
    text: "Baby Hippo grew from one question: what would on-chain education and risk tools look like if they were designed for drivers, teachers, workers, and first-time learners instead of insiders?",
  },
] as const;

const lessons = [
  {
    icon: Clock3,
    title: "Slow is still progress",
    text: "A calm plan that survives real life is more valuable than a complicated plan that cannot be followed.",
  },
  {
    icon: BookOpen,
    title: "Understanding comes first",
    text: "If I cannot explain a product simply, I am not ready to depend on it.",
  },
  {
    icon: ShieldCheck,
    title: "Risk is part of the product",
    text: "Yield, collateral, liquidity, smart contracts, and token layers must be studied together.",
  },
  {
    icon: HeartHandshake,
    title: "People need dignity, not pressure",
    text: "Beginners deserve plain language and room to ask basic questions without being sold a dream.",
  },
] as const;

const mistakes = [
  {
    title: "Trying to learn everything at once",
    text: "Web3 has endless protocols and terminology. Moving too quickly created more confusion, not more confidence.",
    lesson: "Now I learn one system and one risk at a time.",
  },
  {
    title: "Watching prices more than the plan",
    text: "Short-term movement can make a sensible routine feel wrong and an impulsive decision feel urgent.",
    lesson: "Now the budget, time horizon, and risk limit come before the chart.",
  },
  {
    title: "Seeing a rate before seeing its risks",
    text: "A displayed yield is easy to notice. The asset, contract, liquidity, network, and withdrawal risks take more work.",
    lesson: "Now I ask where the yield comes from and what can break.",
  },
  {
    title: "Underestimating DeFi complexity",
    text: "Staking tokens, collateral, borrowing, and integrations can stack several risks into one position.",
    lesson: "Now simplicity is a safety feature, not a lack of ambition.",
  },
] as const;

function BrandMark() {
  return (
    <span className="story-brand-mark" aria-hidden="true">
      <i className="story-ear left" />
      <i className="story-ear right" />
      <i className="story-glasses left" />
      <i className="story-glasses right" />
      <i className="story-nostril left" />
      <i className="story-nostril right" />
    </span>
  );
}

function StoryHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="story-header">
      <div className="story-container story-header-inner">
        <Link className="story-logo" href="/" aria-label="Baby Hippo homepage">
          <BrandMark />
          <span>
            <strong>Baby Hippo</strong>
            <small>Founder Story</small>
          </span>
        </Link>

        <nav className="story-desktop-nav" aria-label="Founder story navigation">
          <a href="#journey">Journey</a>
          <a href="#lessons">Lessons</a>
          <a href="#mistakes">Mistakes</a>
          <a href="#why">Why Baby Hippo</a>
          <Link href="/community">Community</Link>
        </nav>

        <div className="story-header-actions">
          <PublicLanguageSwitcher />
          <a className="story-button primary compact" href="#journey">
            Read the journey
          </a>
          <button
            className="story-menu-button"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="story-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <nav
        id="story-mobile-menu"
        className={`story-mobile-menu ${open ? "open" : ""}`}
        aria-label="Mobile founder story navigation"
      >
        <a href="#journey" onClick={() => setOpen(false)}>Journey</a>
        <a href="#lessons" onClick={() => setOpen(false)}>Founder Lessons</a>
        <a href="#mistakes" onClick={() => setOpen(false)}>Mistakes Made</a>
        <a href="#why" onClick={() => setOpen(false)}>Why Baby Hippo</a>
        <Link href="/" onClick={() => setOpen(false)}>Back to Homepage</Link>
      </nav>
    </header>
  );
}

export default function StoryPage() {
  const { isBeginner, language } = useLearningMode();
  return (
    <div className="story-site">
      <PublicHeader />

      <main>
        <section className="story-hero">
          <div className="story-container story-hero-grid">
            <div className="story-hero-copy">
              <Link className="story-back-link" href="/">
                <ArrowLeft size={15} /> Baby Hippo Homepage
              </Link>
              <span className="story-eyebrow">From Miaoli to the on-chain world</span>
              <h1>I did not start as a crypto expert.</h1>
              <p className="story-hero-zh">I came here slowly through work, teaching, and lesson after lesson.</p>
              <p className="story-lead">
                I came from a rural town, worked in logistics and freight transportation,
                and taught violin. Baby Hippo is the story of learning financial tools
                slowly—and building something useful for people whose lives look like mine.
              </p>
              <div className="story-cta-row">
                <a className="story-button primary" href="#journey">
                  Follow the journey <ArrowRight size={17} />
                </a>
                <Link className="story-button secondary" href="/learn#bitcoin">
                  <BookOpen size={17} /> Read Bitcoin Guide
                </Link>
              </div>
              <div className="story-honesty-note">
                <ShieldCheck size={18} />
                <span>This is a learning story, not a claim of financial success or a promise of results.</span>
              </div>
            </div>

            <div className="story-hero-art" aria-hidden="true">
              <div className="story-sun" />
              <div className="story-mountain back" />
              <div className="story-mountain front" />
              <div className="story-road"><i /><i /><i /></div>
              <div className="story-truck">
                <div className="story-cab">
                  <BrandMark />
                  <span className="story-vest" />
                </div>
                <div className="story-trailer">
                  <Music2 size={34} />
                  <span>Work · Music · Learning</span>
                </div>
                <i className="story-wheel one" />
                <i className="story-wheel two" />
              </div>
              <div className="story-art-note">
                <Music2 size={18} />
                <span><strong>Practice builds progress</strong>On the road, in music, and in life</span>
              </div>
            </div>
          </div>
        </section>

        {isBeginner && <div className="story-container learning-mode-note" data-language-static>
          <strong>{language === "zh-TW" ? "這不是一個一夜致富的故事。" : "This is not an overnight-rich story."}</strong>
          <p>{language === "zh-TW"
            ? "它從貨運工作、小提琴教學與每月定期投入開始。創辦人也不是一開始就懂鏈上金融，而是像一般人一樣，一課一課慢慢學。"
            : "It starts with freight work, violin teaching, and regular monthly investing. The founder did not begin as an on-chain expert—he learned one lesson at a time."}</p>
        </div>}

        <section className="story-intro">
          <div className="story-container story-intro-grid">
            <div>
              <span className="story-eyebrow">An ordinary beginning</span>
              <h2>Two jobs shaped one idea.</h2>
            </div>
            <div className="story-intro-copy">
              <p>
                Freight work taught me that responsibility is practical. You prepare, check the
                route, protect the load, and keep going when the day changes unexpectedly.
              </p>
              <p>
                Violin teaching taught me that growth is patient. A difficult passage becomes
                possible through small corrections repeated over time—not through one heroic practice session.
              </p>
              <blockquote>
                “Baby Hippo combines those lessons: carry risk carefully, practice consistently,
                and never make a beginner feel small.”
              </blockquote>
            </div>
          </div>
        </section>

        <section className="story-journey" id="journey">
          <div className="story-container">
            <div className="story-section-heading">
              <span className="story-eyebrow">The founder timeline</span>
              <h2>One road, eight honest chapters.</h2>
              <p>
                This is not a straight line from struggle to wealth. It is a continuing path
                from work, to questions, to better habits, to building in public.
              </p>
            </div>

            <div className="story-timeline">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.title}>
                    <div className="story-timeline-marker">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <i />
                    </div>
                    <div className="story-timeline-card">
                      <span className="story-timeline-icon"><Icon size={22} /></span>
                      <small>{item.chapter}</small>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="story-lessons" id="lessons">
          <div className="story-container">
            <div className="story-section-heading centered">
              <span className="story-eyebrow">Founder lessons</span>
              <h2>What the road has taught me.</h2>
            </div>
            <div className="story-lesson-grid">
              {lessons.map((lesson) => {
                const Icon = lesson.icon;
                return (
                  <article key={lesson.title}>
                    <span><Icon size={24} /></span>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="story-mistakes" id="mistakes">
          <div className="story-container story-mistakes-grid">
            <div className="story-section-heading">
              <span className="story-eyebrow">Mistakes made</span>
              <h2>Learning also means admitting what went wrong.</h2>
              <p>
                I do not want Baby Hippo to pretend that learning is clean or effortless.
                These mistakes shaped the safety-first approach behind the project.
              </p>
              <div className="story-mistake-note">
                <AlertTriangle size={19} />
                <span>No one becomes safer by hiding confusion.</span>
              </div>
            </div>
            <div className="story-mistake-list">
              {mistakes.map((mistake, index) => (
                <article key={mistake.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{mistake.title}</h3>
                    <p>{mistake.text}</p>
                    <small><CheckCircle2 size={14} /> {mistake.lesson}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="story-why" id="why">
          <div className="story-container story-why-card">
            <div className="story-why-mark"><BrandMark /></div>
            <span className="story-eyebrow">Why Baby Hippo exists</span>
            <h2>Financial tools should not belong only to whales.</h2>
            <p>
              Drivers, logistics workers, teachers, artists, small business owners, rural
              communities, and ordinary families deserve education and risk tools too.
              They deserve explanations that respect their intelligence without assuming
              they already speak the language of finance or Web3.
            </p>
            <div className="story-purpose-grid">
              <span><ShieldCheck size={17} /> Risk management before leverage</span>
              <span><BookOpen size={17} /> Education before speculation</span>
              <span><Route size={17} /> Long-term habits before shortcuts</span>
              <span><Users size={17} /> Community before token price</span>
            </div>
            <blockquote>
              “I do not promise wealth or easy money. I promise to keep building tools,
              education, and opportunities for people willing to learn and grow.”
            </blockquote>
            <div className="story-final-actions">
              <Link className="story-button primary" href="/community">
                Meet the community <ArrowRight size={17} />
              </Link>
              <Link className="story-button secondary" href="/learn">
                Visit Hippo Academy
              </Link>
            </div>
            <strong className="story-signoff">From Worker To On-Chain Boss.</strong>
          </div>
        </section>
      </main>

      <footer className="story-footer">
        <div className="story-container story-footer-inner">
          <Link className="story-logo" href="/">
            <BrandMark />
            <span><strong>Baby Hippo</strong><small>From Worker To On-Chain Boss</small></span>
          </Link>
          <div>
            <Link href="/">Homepage</Link>
            <Link href="/learn">Learning Hub</Link>
            <Link href="/earn">Earn & Learn</Link>
            <Link href="/community">Community</Link>
          </div>
          <p>An honest founder story. No financial promises. No hype.</p>
        </div>
      </footer>
    </div>
  );
}
