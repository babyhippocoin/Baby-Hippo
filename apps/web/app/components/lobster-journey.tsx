import {
  ArrowDown, CalendarCheck, Check, CreditCard, Landmark, MonitorCheck, Sprout, WalletCards,
} from "lucide-react";
import Link from "next/link";

const steps = [
  { icon: WalletCards, label: "台幣入金" },
  { icon: CalendarCheck, label: "長期定投" },
  { icon: Sprout, label: "被動收入" },
  { icon: CreditCard, label: "加密支付" },
  { icon: Landmark, label: "進階 DeFi" },
];

export function LobsterJourney({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`lobster-journey ${compact ? "compact" : ""}`} data-language-static>
      <div className="lobster-journey-heading">
        <span>Baby Hippo 主要旅程</span>
        <h2>先建立習慣，再進入下一個階段。</h2>
        <p>Baby Hippo 不是交易所，也不替你投資。我們用教育與規劃，協助你看懂每一步的目的與風險。</p>
      </div>
      <div className="lobster-journey-steps">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label}>
              <article>
                <span><Icon size={21} /></span>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{step.label}</strong>
              </article>
              {index < steps.length - 1 && <ArrowDown size={17} />}
            </div>
          );
        })}
      </div>
      <article className="lobster-journey-core">
        <MonitorCheck size={28} />
        <div>
          <small>你的資產成長儀表板</small>
          <strong>Lobster Watch</strong>
          <p>把各階段的學習與行動整理在同一個地方。</p>
          <ul>
            {["定投進度", "學習進度", "被動收入成就", "DeFi 成就", "未來資產成長紀錄"].map((item) => (
              <li key={item}><Check size={15} /> {item}</li>
            ))}
          </ul>
        </div>
        <Link href="/dashboard">開啟 Lobster Watch →</Link>
      </article>
    </section>
  );
}
