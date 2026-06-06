"use client";

import { RegistrationForm } from "@/components/registration-form";
import { useLanguage } from "@/components/language-provider";

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="study-check-list">
      {items.map((item) => (
        <li key={item}>
          <span className="check-icon" aria-hidden="true">
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ParticipationRegistrationSection() {
  const { t } = useLanguage();

  return (
    <section id="participation-registration" className="section participation-section">
      <div className="container participation-layout">
        <div className="participation-intro">
          <p className="eyebrow">{t.participation.eyebrow}</p>
          <h2>{t.participation.title}</h2>
          <CheckList items={t.participation.eligibility} />
        </div>

        <div className="participation-details">
          <article className="participation-panel">
            <h3>{t.participation.involvementTitle}</h3>
            <CheckList items={t.participation.involvement} />
          </article>

          <article className="participation-panel participation-panel-featured">
            <h3>{t.participation.whyTitle}</h3>
            <p>{t.participation.whyIntro}</p>
            <CheckList items={t.participation.reasons} />
          </article>
        </div>

        <p className="participation-final">{t.participation.final}</p>

        <RegistrationForm />
      </div>
    </section>
  );
}
