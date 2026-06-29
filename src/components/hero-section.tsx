"use client";

import { useLanguage } from "@/components/language-provider";

const INVITATION_VIDEO_SRC = "/videos/prof-okun-invitation.mp4";
const INVITATION_VIDEO_POSTERS = {
  en: "/videos/prof-okun-invitation-poster-en.png",
  he: "/videos/prof-okun-invitation-poster.jpg"
} as const;

export function HeroSection() {
  const { language, t } = useLanguage();
  const hasVideo = Boolean(INVITATION_VIDEO_SRC);
  const invitationVideoPoster = INVITATION_VIDEO_POSTERS[language];

  return (
    <section id="top" className="hero hero-photo-section">
      <div className="hero-stage">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-content">
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
            <h2>{t.video.title}</h2>
            <p>{t.video.subtitle}</p>
          </div>
          <div className="video-frame" aria-label={t.video.placeholderTitle}>
            {hasVideo ? (
              <video
                className="study-video"
                controls
                poster={invitationVideoPoster}
                preload="metadata"
              >
                <source src={INVITATION_VIDEO_SRC} type="video/mp4" />
                {t.video.unsupported}
              </video>
            ) : (
              <div className="native-video-placeholder">
                <span className="video-play-icon" aria-hidden="true" />
                <div>
                  <p className="video-placeholder-title">{t.video.placeholderHeading}</p>
                  <p>{t.video.placeholderText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
