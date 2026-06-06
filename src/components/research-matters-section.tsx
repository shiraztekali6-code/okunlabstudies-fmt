"use client";

import { SectionHeading } from "@/components/section-heading";
import { useLanguage } from "@/components/language-provider";

export function ResearchMattersSection() {
  const { t } = useLanguage();

  return (
    <section id="why-this-research-matters" className="section research-section">
      <div className="container research-layout">
        <div className="research-copy">
          <SectionHeading
            eyebrow={t.research.eyebrow}
            title={t.research.title}
            description={t.research.intro[0]}
          />

          <div className="research-narrative">
            {t.research.intro.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="research-card-grid">
          {t.research.cards.map((card, index) => (
            <article key={card.title} className="research-card">
              <span className="research-card-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <p className="research-closing">{t.research.closing}</p>
      </div>
    </section>
  );
}
