"use client";

import { useLanguage } from "@/components/language-provider";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="top" className="hero hero-photo-section">
      <div className="hero-stage">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow hero-eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <div className="hero-text">
            {t.hero.subtitle.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="hero-impact">{t.hero.impact}</p>
          <div className="cta-row">
            <a className="btn primary" href="#registration">
              {t.hero.primaryCta}
            </a>
            <a className="btn secondary hero-secondary" href="#why-this-research-matters">
              {t.hero.secondaryCta}
            </a>
          </div>
        </div>
      </div>

      <div className="video-band">
        <div className="container video-layout">
          <div className="video-copy">
            <p className="eyebrow">{t.video.title}</p>
            <h2>{t.video.subtitle}</h2>
          </div>
          <div className="video-frame">
            <iframe
              title={t.video.placeholderTitle}
              src="https://www.youtube.com/embed/ysz5S6PUM-U?rel=0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
