import { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { repairsData } from '../../data/repairs_data';
import SEO from '../common/SEO';
import PageHero from '../common/PageHero';
import CtaBand from '../common/CtaBand';

const RepairsPage = () => {
  const { language } = useTranslation();
  const d = repairsData[language] || repairsData.el;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div>
      <SEO page="repairs" />

      {/* ── HERO ── */}
      <PageHero art="circuit" eyebrow={d.hero.eyebrow} title={d.hero.title} subtitle={d.hero.subtitle} />

      {/* ── INTRO ── */}
      <section style={{ padding: '4.5rem 0 1rem' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            {d.intro}
          </p>
        </div>
      </section>

      {/* ── SECTIONS ── */}
      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {d.sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.key}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '2.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', backgroundColor: 'var(--color-teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color: 'var(--color-teal)' }} />
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.5rem', margin: 0 }}>
                    {section.title}
                  </h2>
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8, margin: 0 }}>
                  {section.body}
                </p>

                {section.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.5rem' }}>
                    {section.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.78rem',
                          fontWeight: 500,
                          padding: '0.4rem 0.9rem',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', textAlign: 'center', marginTop: 0, marginBottom: '3rem' }}>
            {d.process.title}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: '820px', margin: '0 auto' }}>
            {d.process.steps.map((step, idx) => (
              <div key={step.title} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-teal)',
                    color: 'var(--color-on-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}
                >
                  {idx + 1}
                </div>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.95rem', marginTop: 0, marginBottom: '0.6rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN NOTE ── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div
            style={{
              borderRadius: '16px',
              padding: '2rem 2.25rem',
              backgroundColor: 'var(--color-teal-pale)',
              border: '1px solid var(--color-teal-light)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.3rem', marginTop: 0, marginBottom: '0.6rem', color: 'var(--color-teal)' }}>
              {d.openNote.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.7, margin: 0 }}>
              {d.openNote.body}
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBand title={d.cta.title} button={d.cta.button} />

    </div>
  );
};

export default RepairsPage;