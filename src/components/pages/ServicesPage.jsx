import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { servicesData } from '../../data/services_data';
import SEO from '../common/SEO';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { language } = useTranslation();
  const d = servicesData[language] || servicesData.el;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>
      <SEO page="services" />

      {/* ── HERO ── */}
      <section style={{ backgroundColor: 'var(--color-dark)', paddingTop: '10rem', paddingBottom: '5rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--color-teal-light)', marginBottom: '1rem' }}>
            {d.hero.eyebrow}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(3rem, 6vw, 5rem)', color: '#ffffff', marginTop: 0, marginBottom: '1.25rem' }}>
            {d.hero.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            {d.hero.subtitle}
          </p>
        </div>
      </section>

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
                  <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.4rem', marginBottom: '0.75rem', marginTop: 0 }}>
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
      <section style={{ backgroundColor: 'var(--color-dark-soft)', padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#ffffff', marginTop: 0, marginBottom: '1rem' }}>
            {d.ctaBanner.title}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', maxWidth: '440px', margin: '0 auto 2.5rem' }}>
            {d.ctaBanner.subtitle}
          </p>
          <button className="btn-white" onClick={() => navigate('/contact')}>
            {d.ctaBanner.button}
          </button>
        </div>
      </section>

    </div>
  );
};

export default ServicesPage;