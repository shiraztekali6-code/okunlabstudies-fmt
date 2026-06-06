"use client";

import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/lib/i18n";

const navItems = [
  { key: "study", href: "#top" },
  { key: "why", href: "#why-this-research-matters" },
  { key: "join", href: "#registration" }
] as const;

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();

  function onLanguageChange(nextLanguage: Language) {
    setLanguage(nextLanguage);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            DNA
          </span>
          <span className="brand-text">
            {t.brand.title}
            <small>{t.brand.subtitle}</small>
          </span>
        </a>

        <nav aria-label={t.nav.primaryLabel} className="header-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{t.nav[item.key]}</a>
              </li>
            ))}
          </ul>
          <div className="language-switcher" aria-label={t.nav.languageLabel}>
            <button
              type="button"
              className={language === "he" ? "active" : ""}
              onClick={() => onLanguageChange("he")}
              aria-pressed={language === "he"}
            >
              עברית
            </button>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => onLanguageChange("en")}
              aria-pressed={language === "en"}
            >
              English
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
