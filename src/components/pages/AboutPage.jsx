import { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { STATS } from '../../constants/routes';
import { aboutData } from '../../data/about_data';
import PageHero from '../common/PageHero';
import { stripTonos } from '../../utils/text';
import StatsBand from '../common/StatsBand';
import CtaBand from '../common/CtaBand';

const AboutPage = () => {
  const { language } = useTranslation();

  const d = aboutData[language] || aboutData.el;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const statsData = [
    { value: STATS.YEARS, label: d.stats.labels[0] },
    { value: STATS.STUDENTS, label: d.stats.labels[1] },
    { value: STATS.SUBJECTS, label: d.stats.labels[2] },
    { value: '100%', label: d.stats.labels[3] },
  ];

  return (
    <div>

      {/* ── HERO HEADER ── */}
      <PageHero seo="about" title={d.hero.title} image="/images/Teaching_unity.png" />

      {/* ── INTRO ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="split-grid split-grid--narrow">
            <div style={{ position: 'relative' }}>
              <img
                src="/images/me_and_robo.png"
                alt="Dimitris Meimaridis at desk"
                style={{ width: '100%', objectFit: 'cover', aspectRatio: '4/5', display: 'block' }}
              />
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{d.intro.eyebrow}</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1.2, marginBottom: '1rem', marginTop: 0, whiteSpace: 'pre-line' }}>
                {d.intro.title}
              </h2>
              <div className="accent-line" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1rem', marginTop: '1.25rem' }}>
                {d.intro.body1}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {d.intro.body2}
              </p>
              <blockquote style={{
                borderLeft: '2px solid var(--color-teal)',
                margin: 0,
                padding: '0.25rem 0 0.25rem 1.25rem',
              }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.05rem', color: 'var(--color-text)', lineHeight: 1.6, margin: '0 0 0.5rem' }}>
                  "{d.intro.quote.text}"
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
                  {stripTonos(d.intro.quote.author)}
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <StatsBand items={statsData} />

      {/* ── PILLARS ── */}
      <section style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 0' }}>
        <div className="container">
          <div className="split-grid split-grid--even" style={{ alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1.2, marginTop: 0, marginBottom: '1rem' }}>
                {d.pillarsSection.title}
              </h2>
              <div className="accent-line" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginTop: '1.25rem' }}>
                {d.pillarsSection.body}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {d.pillars.map((p) => (
                <div key={p.n} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-teal)', flexShrink: 0, lineHeight: 1, paddingTop: '2px' }}>{p.n}</span>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem', marginTop: 0 }}>{p.title}</h4>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── JOURNEY (Education & Professional Path) ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', textAlign: 'center', marginTop: 0, marginBottom: '3.5rem' }}>
            {d.journeySection.title}
          </h2>
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {d.journey.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '2rem', paddingBottom: '2.5rem', marginBottom: '2.5rem', borderBottom: i < d.journey.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-teal)', fontWeight: 600, margin: 0, paddingTop: '2px' }}>{item.period}</p>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.35rem', margin: '0 0 0.25rem' }}>{item.degree}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: '0 0 0.6rem', letterSpacing: '0.03em' }}>{item.institution}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.87rem', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications - folded into the same section */}
          <div style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal)', marginBottom: '1.25rem' }}>
              {d.certifications.title}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {d.certifications.items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--color-teal)', flexShrink: 0 }}>-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBand title={d.cta.title} subtitle={d.cta.subtitle} button={d.cta.button} />

    </div>
  );
};

export default AboutPage;