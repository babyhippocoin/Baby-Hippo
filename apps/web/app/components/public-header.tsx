"use client";

import { ChevronRight, Home, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PublicLanguageSwitcher } from "./public-language";
import { LearningModeSelector } from "./public-learning-mode";

const links = [
  { href: "/", en: "Home", zh: "首頁" },
  { href: "/story", en: "Story", zh: "故事" },
  { href: "/learn", en: "Learn", zh: "學習" },
  { href: "/on-ramp", en: "TWD On-Ramp", zh: "台灣入金" },
  { href: "/dca-planner", en: "My Investment Plan", zh: "我的投資計畫" },
  { href: "/earn", en: "Earn", zh: "收益學習" },
  { href: "/community", en: "Community", zh: "社群" },
  { href: "/points", en: "Points", zh: "成就積分" },
] as const;

function SharedBrandMark() {
  return (
    <span className="unified-brand-mark" aria-hidden="true">
      <i className="unified-ear left" />
      <i className="unified-ear right" />
      <i className="unified-glasses left" />
      <i className="unified-glasses right" />
      <i className="unified-nostril left" />
      <i className="unified-nostril right" />
    </span>
  );
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"zh-TW" | "en">("zh-TW");

  useEffect(() => {
    setLanguage(window.localStorage.getItem("baby-hippo-language") === "en" ? "en" : "zh-TW");
    const updateLanguage = (event: Event) => {
      const next = (event as CustomEvent<"zh-TW" | "en">).detail;
      if (next === "zh-TW" || next === "en") setLanguage(next);
    };
    window.addEventListener("baby-hippo-language-change", updateLanguage);
    return () => window.removeEventListener("baby-hippo-language-change", updateLanguage);
  }, []);

  return (
    <header className="unified-public-header" data-language-static>
      <div className="unified-public-inner">
        <Link className="unified-public-logo" href="/" aria-label="Baby Hippo Homepage">
          <SharedBrandMark />
          <span>
            <strong>Baby Hippo</strong>
            <small>{language === "zh-TW" ? "鏈上成長社群" : "On-chain growth community"}</small>
          </span>
        </Link>

        <nav className="unified-public-desktop-nav" aria-label="Public navigation">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                href={link.href}
                key={link.href}
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
              >
                {language === "zh-TW" ? link.zh : link.en}
              </Link>
            );
          })}
        </nav>

        <div className="unified-public-actions">
          <PublicLanguageSwitcher />
          <button
            className="unified-public-menu-button"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="unified-public-mobile-menu"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <div className="unified-learning-mode-row">
        <LearningModeSelector />
      </div>
      {pathname !== "/" && (
        <nav className="unified-public-breadcrumb" aria-label={language === "zh-TW" ? "麵包屑導覽" : "Breadcrumb"}>
          <Link href="/"><Home size={14} /> {language === "zh-TW" ? "首頁" : "Home"}</Link>
          <ChevronRight size={13} />
          <strong>{language === "zh-TW"
            ? links.find((link) => link.href === pathname)?.zh
            : links.find((link) => link.href === pathname)?.en}</strong>
        </nav>
      )}

      <nav
        id="unified-public-mobile-menu"
        className={`unified-public-mobile-menu ${open ? "open" : ""}`}
        aria-label="Mobile public navigation"
      >
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              href={link.href}
              key={link.href}
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {language === "zh-TW" ? link.zh : link.en}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
