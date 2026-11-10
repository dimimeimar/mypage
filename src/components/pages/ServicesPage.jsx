import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { servicesData } from '../../data/services_data';
import SEO from '../common/SEO';
import PageHero from '../common/PageHero';
import CtaBand from '../common/CtaBand';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { language } = useTranslation();
  const d = servicesData[language] || servicesData.el;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div>
      <SEO page="services" />

      {/* ── HERO ── */}
      <PageHero eyebrow={d.hero.eyebrow} title={d.hero.title} subtitle={d.hero.subtitle} />

      {/* ── SERVICE CARDS ── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {d.cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  onClick={() => navigate(card.path)}
                  className="card-hover"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    minHeight: '300px',
                  }}
                >
                  <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', backgroundColor: 'var(--color-teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Icon size={22} style={{ color: 'var(--color-teal)' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.4rem', marginBottom: '0.75rem', marginTop: 0 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0, flex: 1 }}>
                    {card.description}
                  </p>
                  <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {card.cta} →
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBand title={d.ctaBanner.title} subtitle={d.ctaBanner.subtitle} button={d.ctaBanner.button} />

    </div>
  );
};

export default ServicesPage;