"use client";

import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {t.brand.title}
        </p>
        <p>{t.footer.credit}</p>
      </div>
    </footer>
  );
}
