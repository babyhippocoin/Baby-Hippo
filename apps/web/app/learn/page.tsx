"use client";

import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicHeader } from "../components/public-header";
import "./learn.css";

type Language = "zh-TW" | "en";
type Copy = { zh: string; en: string };
type Guide = {
  symbol: string;
  name: string;
  what: Copy;
  why: Copy;
  risk: Copy;
  view: Copy;
};

const LANGUAGE_KEY = "baby-hippo-language";

const guides: Guide[] = [
  {
    symbol: "BTC", name: "Bitcoin",
    what: { zh: "一種供應量有限、由全球電腦共同維護的數位資產。它不由單一公司或政府控制。", en: "A scarce digital asset maintained by a global network rather than one company or government." },
    why: { zh: "它讓人們能在網路上持有與轉移稀缺資產，也常被視為長期價值儲存的實驗。", en: "It lets people hold and transfer scarce value online and is often explored as a long-term store of value." },
    risk: { zh: "價格波動很大；保管方式、詐騙與買在情緒高點都是新手常見風險。", en: "Price swings, custody mistakes, scams, and emotional buying are common beginner risks." },
    view: { zh: "先理解、再小額、固定節奏，不借錢追高。", en: "Learn first, start small, use a steady rhythm, and never borrow money to chase price." },
  },
  {
    symbol: "ETH", name: "Ethereum",
    what: { zh: "一個能執行智慧合約的公開網路，ETH 是支付網路費用與參與生態系的主要資產。", en: "A public smart-contract network. ETH is the main asset used for network fees and participation." },
    why: { zh: "許多 DeFi、穩定幣與鏈上應用建立在 Ethereum 及其延伸網路上。", en: "Many DeFi, stablecoin, and on-chain applications are built on Ethereum and its scaling networks." },
    risk: { zh: "除了價格波動，還有智慧合約、網路費用與操作錯誤風險。", en: "Beyond price volatility, users face smart-contract, network-fee, and operational risks." },
    view: { zh: "先學會網路、Gas 費與錢包安全，再接觸鏈上應用。", en: "Understand networks, gas fees, and wallet safety before using on-chain applications." },
  },
  {
    symbol: "SOL", name: "Solana",
    what: { zh: "一個速度快、費用較低的智慧合約網路，SOL 是其主要資產。", en: "A fast, lower-cost smart-contract network whose native asset is SOL." },
    why: { zh: "它希望讓支付、交易與應用能以較低成本服務更多使用者。", en: "It aims to support payments, markets, and applications at low cost for many users." },
    risk: { zh: "生態系變化快、代幣波動大，也有平台集中度與技術穩定性風險。", en: "The ecosystem changes quickly and carries volatility, concentration, and technical reliability risks." },
    view: { zh: "把它視為較高風險的成長型資產，不要因速度快就忽略風險。", en: "Treat it as a higher-risk growth asset; speed does not remove risk." },
  },
  {
    symbol: "LINK", name: "Chainlink",
    what: { zh: "為智慧合約提供價格與外部資料的基礎設施，LINK 是其生態系資產。", en: "Infrastructure that supplies smart contracts with prices and outside data; LINK is its ecosystem asset." },
    why: { zh: "鏈上借貸與金融工具需要可信資料，否則無法正確計算價格與風險。", en: "On-chain lending and financial tools need reliable data to calculate prices and risk." },
    risk: { zh: "技術被廣泛採用不代表代幣價格一定上漲，仍有競爭與估值風險。", en: "Strong technology adoption does not guarantee token appreciation; competition and valuation risks remain." },
    view: { zh: "先理解它解決的問題，不要只因合作新聞買入。", en: "Understand the problem it solves instead of buying only because of partnership headlines." },
  },
  {
    symbol: "BNB", name: "BNB",
    what: { zh: "與 BNB Chain 和 Binance 生態系密切相關的資產，可用於網路費用與多種平台用途。", en: "An asset closely connected to BNB Chain and the Binance ecosystem, used for fees and platform utilities." },
    why: { zh: "它支援大型交易與鏈上生態系中的費用、應用與使用者活動。", en: "It supports fees, applications, and user activity across a large exchange and on-chain ecosystem." },
    risk: { zh: "價值與單一企業及生態系高度相關，也有監管與集中度風險。", en: "Its value is closely tied to one company and ecosystem, creating regulatory and concentration risks." },
    view: { zh: "理解集中風險，避免把單一平台資產當成無風險核心。", en: "Understand concentration risk and do not treat a single-platform asset as risk-free." },
  },
  {
    symbol: "HYP", name: "Hyperliquid",
    what: { zh: "與 Hyperliquid 鏈上交易生態相關的資產，著重高效能市場基礎設施。", en: "An asset connected to Hyperliquid's on-chain market ecosystem and high-performance infrastructure." },
    why: { zh: "它探索如何把更快速的市場工具搬到公開鏈上。", en: "It explores how faster market infrastructure can operate on public blockchain rails." },
    risk: { zh: "屬於較新且波動高的生態系，產品、治理、流動性與技術風險都較高。", en: "It is a newer, volatile ecosystem with elevated product, governance, liquidity, and technical risks." },
    view: { zh: "只適合已理解核心資產與風險管理的人進一步研究。", en: "Best researched only after understanding core assets and basic risk management." },
  },
  {
    symbol: "TAO", name: "Bittensor",
    what: { zh: "一個鼓勵不同 AI 模型與服務協作競爭的去中心化網路，TAO 是其資產。", en: "A decentralized network that rewards competing and collaborating AI models and services; TAO is its asset." },
    why: { zh: "它嘗試用開放式激勵機制建立可共享的 AI 網路。", en: "It experiments with open incentives for building a shared artificial-intelligence network." },
    risk: { zh: "概念複雜、估值高度依賴未來採用，且價格可能劇烈波動。", en: "The concept is complex, valuation depends heavily on future adoption, and price can move sharply." },
    view: { zh: "把它當成進階研究題目，不要把 AI 熱潮當成獲利保證。", en: "Treat it as advanced research; AI excitement is not a profit guarantee." },
  },
  {
    symbol: "IO", name: "io.net",
    what: { zh: "嘗試整合分散式 GPU 運算資源、服務 AI 與機器學習需求的網路。", en: "A network seeking to aggregate distributed GPU computing for AI and machine-learning workloads." },
    why: { zh: "AI 運算成本高，它希望讓閒置硬體能被更有效地找到與使用。", en: "AI compute is expensive, and the network aims to make unused hardware easier to find and use." },
    risk: { zh: "需求、供給品質、代幣經濟與競爭都仍在快速變化。", en: "Demand, supply quality, token economics, and competition are still evolving quickly." },
    view: { zh: "先研究真實使用量與供需，不因 AI 標籤而忽略基本面。", en: "Research real usage and supply-demand conditions rather than relying on an AI label." },
  },
  {
    symbol: "DOGE", name: "Dogecoin",
    what: { zh: "源自網路迷因、由社群推動的加密資產，交易與轉帳方式類似其他公開鏈資產。", en: "A community-driven crypto asset that began as an internet meme and operates on a public network." },
    why: { zh: "它展示社群文化也能形成大型網路，但用途與價格常受到情緒影響。", en: "It shows how community culture can create a large network, though sentiment strongly affects its use and price." },
    risk: { zh: "波動與投機性很高，社群熱度不等於長期價值。", en: "Volatility and speculation are high; community attention does not equal lasting value." },
    view: { zh: "若要接觸，只能使用可承受損失的小額資金，不把迷因當理財計畫。", en: "If explored at all, use only a small amount you can lose and never treat a meme as a financial plan." },
  },
];

function text(copy: Copy, language: Language) {
  return language === "zh-TW" ? copy.zh : copy.en;
}

export default function LearnPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");

  useEffect(() => {
    const sync = () => setLanguage(localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-TW");
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("baby-hippo-language-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("baby-hippo-language-change", sync);
    };
  }, []);

  const isZh = language === "zh-TW";

  return (
    <div className="learn-site asset-learn-site">
      <PublicHeader />
      <main>
        <section className="asset-learn-hero">
          <div className="learn-container">
            <span className="learn-eyebrow">{isZh ? "Baby Hippo 學習專區" : "Baby Hippo Learning Hub"}</span>
            <h1>{isZh ? "先理解，再行動。" : "Understand first. Act second."}</h1>
            <p>
              {isZh
                ? "用一般人聽得懂的方式認識常見資產。每一篇都說明它是什麼、為什麼存在、主要風險，以及 Baby Hippo 的紀律觀點。"
                : "Meet common digital assets in plain language. Every guide explains what it is, why it exists, its main risks, and Baby Hippo's discipline-first view."}
            </p>
            <div className="asset-learn-principle">
              <ShieldCheck size={22} />
              <span>{isZh ? "學習不是買入建議。生活必需金與緊急預備金永遠優先。" : "Learning is not a buy recommendation. Essential expenses and emergency cash always come first."}</span>
            </div>
          </div>
        </section>

        <section className="asset-guide-section">
          <div className="learn-container">
            <div className="learn-section-heading">
              <span className="learn-eyebrow">{isZh ? "九個資產新手指南" : "Nine beginner asset guides"}</span>
              <h2>{isZh ? "知道自己在研究什麼" : "Know what you are researching"}</h2>
              <p>{isZh ? "不要因為別人喊單就行動。先看懂用途、限制與風險。" : "Do not act because someone posted a signal. Understand purpose, limits, and risk first."}</p>
            </div>
            <div className="asset-guide-grid">
              {guides.map((guide) => (
                <article className="asset-guide-card" id={guide.symbol.toLowerCase()} key={guide.symbol}>
                  <header>
                    <span>{guide.symbol}</span>
                    <div><small>{isZh ? "新手指南" : "Beginner guide"}</small><h2>{guide.name}</h2></div>
                  </header>
                  <section><h3>{isZh ? "是什麼" : "What it is"}</h3><p>{text(guide.what, language)}</p></section>
                  <section><h3>{isZh ? "為什麼存在" : "Why it exists"}</h3><p>{text(guide.why, language)}</p></section>
                  <section className="asset-risk"><h3><AlertTriangle size={17} /> {isZh ? "主要風險" : "Main risks"}</h3><p>{text(guide.risk, language)}</p></section>
                  <section className="asset-view"><h3><BookOpen size={17} /> {isZh ? "Baby Hippo 看法" : "Baby Hippo view"}</h3><p>{text(guide.view, language)}</p></section>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="asset-learn-next">
          <div className="learn-container">
            <div className="asset-next-card">
              <CheckCircle2 size={32} />
              <div>
                <span className="learn-eyebrow">{isZh ? "下一步" : "Next step"}</span>
                <h2>{isZh ? "把理解變成穩定習慣" : "Turn understanding into a steady habit"}</h2>
                <p>{isZh ? "Lobster Watch 目前正式開放 DCA 提醒。它只提醒與記錄，不會替你交易。" : "Lobster Watch currently offers DCA reminders. It reminds and records; it never trades for you."}</p>
              </div>
              <Link href="/dashboard" className="learn-button primary">
                {isZh ? "建立定投提醒" : "Create a DCA reminder"} <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
