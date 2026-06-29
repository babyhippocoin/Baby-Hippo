"use client";

import {
  ArrowDown, ArrowRight, BadgeCheck, Banknote, Bitcoin, BookOpen, Building2,
  Check, CircleAlert, Coins, Copy, CreditCard, ExternalLink, Landmark, Route, ShieldCheck,
  Sparkles, Sprout, WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicHeader } from "../components/public-header";
import { LobsterJourney } from "../components/lobster-journey";

type Language = "zh-TW" | "en";

const LANGUAGE_KEY = "baby-hippo-language";
const POINTS_KEY = "baby-hippo-points-mvp";
const REFERRAL_CODE = "5931862212";
const pointValues: Record<string, number> = {
  "learn-bitcoin": 10, "learn-ethereum": 10, "learn-dca": 10, "learn-aave": 10,
  "learn-etherfi": 10, "learn-risk": 10, "learn-seed": 10, "learn-onramp": 10,
  "plan-first": 5, "plan-balanced": 20, "plan-emergency": 20, "dca-started": 20,
  "yield-etherfi": 15, "yield-aave": 15, "yield-kamino": 15, "yield-hyperlend": 15,
  "community-story": 5, "community-telegram": 5, "community-x": 5, "community-values": 5,
  "funnel-exchange": 5, "funnel-passive": 15, "funnel-aave": 20, "dca-habit-verified": 50,
};

const platforms = [
  {
    name: "BitoPro",
    icon: Banknote,
    funding: "高・可直接使用台幣",
    beginner: "高・流程較貼近台灣使用者",
    cost: "通常較高，應查看當下費率",
    dca: "可入門，長期成本需自行比較",
    future: "可銜接 BTC、ETH、USDT 與國際交易所",
  },
  {
    name: "Binance",
    icon: Bitcoin,
    funding: "中・需先理解台幣入金路線",
    beginner: "中・功能多，需要先學基本操作",
    cost: "通常較低，仍以平台當下公告為準",
    dca: "適合學習 BTC、ETH 長期定投",
    future: "可銜接資產轉出與後續鏈上學習",
  },
  {
    name: "OKX",
    icon: Coins,
    funding: "中・需理解台幣到平台的流程",
    beginner: "中・對完全新手稍微複雜",
    cost: "通常較低，仍以平台當下公告為準",
    dca: "可作為 BTC、ETH 定投的另一選擇",
    future: "可銜接資產管理與鏈上學習",
  },
] as const;

const steps = [
  ["註冊 BitoPro", "Create a BitoPro account"],
  ["完成身份驗證", "Complete identity verification"],
  ["綁定銀行帳戶", "Link your bank account"],
  ["台幣入金", "Deposit TWD"],
  ["買 BTC／ETH／USDT", "Buy BTC, ETH, or USDT"],
  ["若要使用 Binance／OKX 定投，再把資產轉到對應平台", "If you want Binance or OKX DCA, transfer assets only after learning the correct network and process"],
  ["若要進入鏈上世界，先學會錢包安全", "Before going on-chain, learn wallet safety first"],
] as const;

const flowItems = [
  { icon: Banknote, zh: "台幣", en: "TWD" },
  { icon: Route, zh: "建立 DCA 習慣", en: "Build a DCA habit" },
  { icon: Sprout, zh: "被動收入層", en: "Passive Income Layer" },
  { icon: CreditCard, zh: "加密支付層", en: "Crypto Payment Layer" },
  { icon: Landmark, zh: "進階 DeFi", en: "Advanced DeFi" },
] as const;

function getLevel(points: number) {
  if (points >= 600) return 4;
  if (points >= 300) return 3;
  if (points >= 100) return 2;
  return 1;
}

export default function TaiwanOnRampPage() {
  const [language, setLanguage] = useState<Language>("zh-TW");
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const zh = language === "zh-TW";

  useEffect(() => {
    const load = () => {
      setLanguage(window.localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh-TW");
      try {
        const saved = JSON.parse(window.localStorage.getItem(POINTS_KEY) || "{}") as { completed?: string[] };
        setCompleted(Array.isArray(saved.completed) && saved.completed.includes("learn-onramp"));
      } catch {
        setCompleted(false);
      }
    };
    const onLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    load();
    window.addEventListener("baby-hippo-language-change", onLanguage);
    window.addEventListener("baby-hippo-points-change", load);
    return () => {
      window.removeEventListener("baby-hippo-language-change", onLanguage);
      window.removeEventListener("baby-hippo-points-change", load);
    };
  }, []);

  const completeGuide = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(POINTS_KEY) || "{}") as { completed?: string[] };
      const current = Array.isArray(saved.completed) ? saved.completed : [];
      const next = current.includes("learn-onramp") ? current : [...current, "learn-onramp"];
      const totalPoints = next.reduce((sum, id) => sum + (pointValues[id] || 0), 0);
      window.localStorage.setItem(POINTS_KEY, JSON.stringify({
        completed: next, totalPoints, level: getLevel(totalPoints),
      }));
      setCompleted(true);
      window.dispatchEvent(new CustomEvent("baby-hippo-points-change", { detail: next }));
    } catch {
      setCompleted(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const disclosure = zh
    ? "此連結或推薦碼可能讓 Baby Hippo 獲得推薦獎勵，用於支持網站持續開發。這不代表投資建議。"
    : "This link or referral code may provide Baby Hippo with a referral reward that supports continued development. It is not investment advice.";

  return (
    <div className="ramp-site" data-language-static>
      <PublicHeader />
      <main>
        <section className="ramp-hero">
          <div className="ramp-container ramp-hero-grid">
            <div>
              <span className="ramp-eyebrow">{zh ? "Baby Hippo 台灣新手路線" : "Baby Hippo Taiwan beginner path"}</span>
              <h1>{zh ? "台灣新手入金指南" : "Taiwan Fiat On-Ramp Guide"}</h1>
              <p>{zh
                ? "如果你人在台灣，第一步不是急著買幣，而是先學會安全、合法、看得懂地把台幣換成加密資產。"
                : "If you are in Taiwan, the first step is not rushing to buy crypto. Learn how to move from TWD into crypto in a safer, lawful, and understandable way."}</p>
              <div className="ramp-hero-actions">
                <a href="#bito" className="ramp-button primary">{zh ? "從台幣第一步開始" : "Start with TWD"} <ArrowDown size={17} /></a>
                <Link href="/dca-planner" className="ramp-button secondary">{zh ? "建立我的 DCA 計畫" : "Build My DCA Plan"} <ArrowRight size={17} /></Link>
              </div>
              <div className="ramp-safety-line"><ShieldCheck size={17} /> {zh
                ? "教育用途。不會代你入金、買幣、轉帳或連接錢包。"
                : "Education only. No deposits, purchases, transfers, or wallet connection."}</div>
            </div>
            <div className="ramp-hero-card" aria-hidden="true">
              <Banknote size={58} /><strong>TWD</strong><ArrowDown size={25} />
              <span><Building2 size={22} /> BTC・ETH・USDT</span>
            </div>
          </div>
        </section>

        <section className="ramp-section ramp-flow">
          <div className="ramp-container">
            <div className="ramp-heading centered">
              <span>{zh ? "先看懂整條路" : "Understand the whole path"}</span>
              <h2>{zh ? "從台幣走到鏈上成長" : "From TWD to on-chain growth"}</h2>
            </div>
            <div className="ramp-flow-list">
              {flowItems.map((item, index) => {
                const Icon = item.icon;
                return (
                <div key={item.zh}>
                  <article><span><Icon size={22} /></span><strong>{zh ? item.zh : item.en}</strong></article>
                  {index < flowItems.length - 1 && <ArrowDown size={18} />}
                </div>
              );})}
            </div>
          </div>
        </section>

        <LobsterJourney compact />

        <section className="ramp-section" id="bito">
          <div className="ramp-container ramp-bito-grid">
            <article className="ramp-bito-card">
              <span className="ramp-eyebrow">{zh ? "台灣新手第一站" : "A first stop for Taiwan beginners"}</span>
              <h2>BitoPro</h2>
              <p>{zh
                ? "BitoPro 適合完全新手，用台幣入金、完成 KYC，並買到第一筆 BTC、ETH 或 USDT。"
                : "BitoPro can help complete beginners fund with TWD, complete KYC, and buy a first amount of BTC, ETH, or USDT."}</p>
              <div className="ramp-code">
                <small>{zh ? "推薦碼" : "Referral code"}</small><strong>{REFERRAL_CODE}</strong>
                <button type="button" onClick={copyCode}><Copy size={15} /> {copied ? (zh ? "已複製" : "Copied") : (zh ? "複製" : "Copy")}</button>
              </div>
              <button type="button" className="ramp-button primary" onClick={copyCode}>
                {zh ? "使用 BitoPro 推薦碼" : "Use BitoPro Referral Code"} <Copy size={16} />
              </button>
              <p className="ramp-disclosure">{zh
                ? "使用推薦碼可支持 Baby Hippo 持續開發。你也可以自行前往官方網站註冊。"
                : "Using the code can support Baby Hippo development. You may also register directly through the official website."}</p>
              <p className="ramp-disclosure legal">{disclosure}</p>
            </article>
            <div className="ramp-pro-con">
              <article><Check size={21} /><div><h3>{zh ? "適合的地方" : "Why beginners may use it"}</h3>
                <ul><li>{zh ? "台幣入金直覺" : "Straightforward TWD funding"}</li>
                  <li>{zh ? "適合台灣新手" : "Designed for Taiwan users"}</li>
                  <li>{zh ? "可作為進入 Binance／OKX 前的入金橋梁" : "Can serve as a bridge before Binance or OKX"}</li></ul></div></article>
              <article className="caution"><CircleAlert size={21} /><div><h3>{zh ? "需要知道的限制" : "What to understand"}</h3>
                <ul><li>{zh ? "手續費通常比國際交易所高" : "Fees are often higher than international exchanges"}</li>
                  <li>{zh ? "幣種與進階功能較少" : "Fewer assets and advanced features"}</li>
                  <li>{zh ? "適合入門，不一定適合所有進階操作" : "Useful for entry, not necessarily every advanced activity"}</li></ul></div></article>
            </div>
          </div>
        </section>

        <section className="ramp-section ramp-compare">
          <div className="ramp-container">
            <div className="ramp-heading"><span>{zh ? "選平台不是選冠軍" : "Choose by purpose, not hype"}</span>
              <h2>新手平台教育比較</h2>
              <p>這不是排名，也不是推薦。請依自己的入金需求、理解程度與長期計畫選擇。</p></div>
            <div className="ramp-table-wrap">
              <table>
                <thead><tr><th>平台</th><th>台幣入金便利性</th>
                  <th>新手友善度</th><th>交易成本</th>
                  <th>長期定投適合度</th><th>未來鏈上發展</th></tr></thead>
                <tbody>{platforms.map((platform) => {
                  const Icon = platform.icon;
                  return <tr key={platform.name}>
                    <td data-label="平台"><span className="ramp-platform-name"><Icon size={17} />{platform.name}</span></td>
                    <td data-label="台幣入金便利性">{platform.funding}</td>
                    <td data-label="新手友善度">{platform.beginner}</td>
                    <td data-label="交易成本">{platform.cost}</td>
                    <td data-label="長期定投適合度">{platform.dca}</td>
                    <td data-label="未來鏈上發展">{platform.future}</td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
            <p className="ramp-platform-disclaimer">沒有最好的平台。只有適合自己的平台。</p>
          </div>
        </section>

        <section className="ramp-section">
          <div className="ramp-container ramp-fee-grid" data-language-static>
            <div className="ramp-heading">
              <span>用生活情境理解成本</span>
              <h2>真實案例：手續費怎麼看？</h2>
              <p>以下金額是方便理解的假設案例，不代表平台目前的實際費率，也不代表資產價格一定上漲。</p>
            </div>
            <div className="ramp-real-examples">
              <article>
                <small>案例一</small>
                <h3>阿明第一次入金</h3>
                <dl>
                  <div><dt>投入</dt><dd>NT$10,000</dd></div>
                  <div><dt>平台</dt><dd>BitoPro</dd></div>
                  <div><dt>假設成本</dt><dd>約 NT$120</dd></div>
                  <div><dt>結果</dt><dd>5 分鐘完成入金，成功買入 BTC</dd></div>
                </dl>
              </article>
              <article>
                <small>案例二・情境示意</small>
                <h3>阿明研究最低手續費</h3>
                <dl>
                  <div><dt>研究時間</dt><dd>3 天</dd></div>
                  <div><dt>最後</dt><dd>沒有買入</dd></div>
                  <div><dt>假設情境</dt><dd>期間 BTC 上漲 15%</dd></div>
                  <div><dt>學習重點</dt><dd>建立持續行動，通常比節省幾十元手續費更重要</dd></div>
                </dl>
              </article>
            </div>
            <div className="ramp-fee-lesson"><Sparkles size={24} /><div><strong>學習重點</strong>
              <p>建立持續行動，通常比節省幾十元手續費更重要。</p></div></div>
            <blockquote className="ramp-founder-opinion">很多人研究手續費一個月，卻沒有研究資產一天。</blockquote>
            <p className="ramp-example-disclaimer">以上為教育情境，不代表價格一定上漲，也不是鼓勵匆忙買入。先理解資產、風險與自己的預算，再開始小額行動。</p>
            <div className="ramp-fee-final">
              <strong>手續費很重要。</strong>
              <p>但是否開始建立投資習慣，往往比幾十元的成本差距更重要。</p>
            </div>
            <section className="ramp-fee-comparison">
              <div className="ramp-heading">
                <span>NT$10,000 教學案例</span>
                <h2>實際平台手續費比較</h2>
                <p>用 NT$10,000 買入 BTC 作為假設案例，讓你直覺理解成本差距。</p>
              </div>
              <p className="ramp-fee-disclaimer"><CircleAlert size={18} /> 以下為教學用假設數字，實際費率會依平台、交易方式、入金方式、活動、VIP 等級與市場狀況不同而變動。請以平台官方公告為準。</p>
              <div className="ramp-fee-table">
                <div className="head"><span>平台</span><span>交易手續費率（假設）</span><span>假設總成本</span><span>與最低成本差異</span></div>
                {[
                  ["BitoPro", "1.0% ～ 1.2%", "約 NT$100 ～ NT$120", "+ NT$80 ～ NT$110"],
                  ["Binance", "0.1% ～ 0.2%", "約 NT$10 ～ NT$20", "基準（最低）"],
                  ["OKX", "0.1% ～ 0.2%", "約 NT$10 ～ NT$20", "+ NT$0 ～ NT$10"],
                ].map(([platform, rate, cost, difference]) => <article key={platform}>
                  <strong>{platform}</strong>
                  <span data-label="交易手續費率（假設）">{rate}</span>
                  <span data-label="假設總成本">{cost}</span>
                  <span data-label="與最低成本差異">{difference}</span>
                </article>)}
              </div>
            </section>

            <section className="ramp-movement-example">
              <div className="ramp-heading"><span>同一筆 NT$10,000</span><h2>手續費 vs 價格波動：誰影響更大？</h2></div>
              <div className="ramp-movement-grid">
                <article><small>如果 BTC 上漲 10%</small><strong>NT$10,000 → NT$11,000</strong><p>增加：NT$1,000</p></article>
                <article><small>BitoPro vs Binance / OKX</small><strong>約 NT$80 ～ NT$110</strong><p>假設平台成本差距</p></article>
              </div>
              <p className="ramp-balanced-point">手續費是成本之一。但價格波動、是否開始建立習慣、是否持續定投，通常影響更大。<strong>手續費重要，但不是唯一標準。</strong></p>
            </section>

            <section className="ramp-monthly-fees">
              <div className="ramp-heading"><span>持續 12 個月</span><h2>每月定投的手續費長期影響</h2></div>
              <div className="ramp-monthly-fee-grid">
                <article><small>每月定投</small><strong>NT$3,000</strong></article>
                <article><small>全年投入</small><strong>NT$36,000</strong></article>
                <article><small>假設每月成本差距</small><strong>NT$20 ～ NT$30</strong></article>
                <article><small>全年差距</small><strong>約 NT$240 ～ NT$360</strong></article>
              </div>
              <p>小額定投時，手續費差距存在，但通常不該成為完全不開始的理由。大額、頻繁交易或短線交易時，手續費影響會更明顯。</p>
            </section>

            <section className="ramp-platform-judgment">
              <div className="ramp-heading"><span>依現在的階段判斷</span><h2>你該怎麼判斷？</h2></div>
              <div>
                <article><h3>BitoPro 適合你，如果：</h3><ul>
                  <li>你是台灣新手</li><li>你重視台幣入金方便</li><li>你想先用小額熟悉流程</li>
                </ul></article>
                <article><h3>Binance / OKX 適合你，如果：</h3><ul>
                  <li>你已經理解入金流程</li><li>你想長期定投</li><li>你重視較低交易成本</li>
                </ul></article>
              </div>
              <blockquote>沒有最好的平台。只有適合你目前階段的平台。<strong>手續費很重要，但不是唯一標準。</strong></blockquote>
            </section>
          </div>
        </section>

        <section className="ramp-section ramp-guide">
          <div className="ramp-container">
            <div className="ramp-heading centered"><span>{zh ? "一步一步，不要急" : "One step at a time"}</span>
              <h2>{zh ? "BitoPro 新手流程" : "BitoPro beginner flow"}</h2></div>
            <div className="ramp-step-grid">{steps.map(([z,e], index) => <article key={z}>
              <span>{String(index + 1).padStart(2,"0")}</span><p>{zh ? z : e}</p></article>)}</div>
            <div className="ramp-warning"><CircleAlert size={21} /><strong>{zh
              ? "第一次操作請小額測試，不要一次轉大額。轉出前要確認資產、地址與網路。"
              : "Use a small test amount the first time. Do not transfer a large amount at once. Confirm the asset, address, and network before sending."}</strong></div>
          </div>
        </section>

        <section className="ramp-section ramp-partners">
          <div className="ramp-container">
            <div className="ramp-heading"><span>{zh ? "下一階段的平台" : "Platforms for later stages"}</span>
              <h2>{zh ? "教育與合作連結" : "Educational and partner links"}</h2></div>
            <div className="ramp-partner-grid">
              {[
                ["Binance","https://www.binance.com/activity/referral-entry/CPA?ref=CPA_00SFPUZH40", zh ? "BTC／ETH 長期定投" : "Long-term BTC and ETH DCA"],
                ["OKX","https://okx.com/join/81023154", zh ? "備用定投選擇" : "Alternative DCA option"],
                ["Ether.fi","https://www.ether.fi/@14a14fc7", zh ? "ETH 被動收入學習" : "ETH passive-income education"],
              ].map(([name,href,note]) => <a href={href} target="_blank" rel="noopener noreferrer sponsored" key={name}>
                <span>{zh ? "合作連結" : "Partner Link"}</span><ExternalLink size={17} /><strong>{name}</strong><p>{note}</p>
              </a>)}
            </div>
            <p className="ramp-disclosure legal">{disclosure}</p>
          </div>
        </section>

        <section className="ramp-final">
          <div className="ramp-container ramp-final-card">
            <WalletCards size={35} /><span className="ramp-eyebrow">{zh ? "下一步" : "Next step"}</span>
            <h2>{zh ? "建立我的 DCA 計畫" : "Build My DCA Plan"}</h2>
            <p>{zh ? "先知道台幣怎麼進來，再用生活預算建立一份做得到的長期計畫。" : "Once you understand the TWD path, build a sustainable long-term plan around your real-life budget."}</p>
            <div className="ramp-final-actions">
              <Link href="/dca-planner" className="ramp-button primary">{zh ? "下一步：建立我的 DCA 計畫" : "Next: Build My DCA Plan"} <ArrowRight size={17} /></Link>
              <button type="button" className={`ramp-button secondary ${completed ? "completed" : ""}`} onClick={completeGuide} disabled={completed}>
                {completed ? <Check size={17} /> : <BookOpen size={17} />}
                {completed ? (zh ? "已閱讀・+10 BHC Points" : "Guide Completed · +10 BHC Points") : (zh ? "完成閱讀・+10 BHC Points" : "Complete Guide · +10 BHC Points")}
              </button>
            </div>
            <small>{zh
              ? "BHC Points 只記錄教育進度。入金、買幣或轉帳不會獲得積分，也不會要求上傳證明。"
              : "BHC Points records education only. Deposits, purchases, and transfers do not earn points, and no proof is requested."}</small>
          </div>
        </section>
      </main>
    </div>
  );
}
