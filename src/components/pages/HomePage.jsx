import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { STATS, ROUTES } from '../../constants/routes';
import SearchBar from '../common/searchBar';
import { homeData } from '../../data/home_data';

/* ── Animated counter hook ── */
function useCounter(target, duration = 1800, trigger = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const numeric = parseInt(target.replace(/\D/g, ''), 10);
    const suffix = target.replace(/[0-9]/g, '');
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * numeric) + suffix);
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return value;
}

/* ── Stats counter component ── */
const StatCounter = ({ value, label, trigger }) => {
  const count = useCounter(value, 1600, trigger);
  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div className="stat-number">{count || '0'}</div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
        {label}
      </p>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { language } = useTranslation();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);

  const d = homeData[language] || homeData.el;

  const handleSearchResult = () => {
    navigate('/contact');
  };

  // Intersection observer for stats
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#0f0f0f',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '7rem', paddingBottom: '4rem' }}>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'space-between' }}
          >
            {/* Text column (eyebrow/title/subtitle) */}
            <div style={{ flex: '1 1 380px' }}>
              <p className="eyebrow animate-fade-in" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
                {d.hero.eyebrow}
              </p>

              <h1
                className="display-title animate-slide-up"
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                  color: '#ffffff',
                  marginBottom: '1.5rem',
                  animationDelay: '0.1s',
                }}
              >
                {d.hero.title}
              </h1>

              <p
                className="animate-slide-up"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.7,
                  marginBottom: '2.5rem',
                  animationDelay: '0.2s',
                  maxWidth: '480px',
                }}
              >
                {d.hero.subtitle}
              </p>
            </div>

            {/* Photo column */}
            <div
              className="animate-fade-in"
              style={{
                flex: '0 0 auto',
                width: 'clamp(180px, 26vw, 320px)',
                height: 'clamp(180px, 26vw, 320px)',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto',
                boxShadow: '0 0 0 12px rgba(45,122,122,0.12), 0 0 60px rgba(45,122,122,0.25), 0 25px 50px rgba(0,0,0,0.4)',
                animationDelay: '0.15s',
              }}
            >
              <img
                src="/images/dimitris-profile.png"
                alt="Δημήτρης Μεϊμαρίδης"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Search + CTA column - πάντα σε δική του γραμμή */}
            <div style={{ flex: '1 1 100%' }}>
              {/* Search bar */}
              <div className="animate-fade-in" style={{ animationDelay: '0.25s', marginBottom: '2rem', maxWidth: '460px' }}>
                <SearchBar
                  placeholder={d.search.placeholder}
                  onResultSelect={handleSearchResult}
                />
              </div>

              <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animationDelay: '0.3s' }}>
                <button className="btn-white" onClick={() => navigate('/contact')}>
                  {d.hero.ctaPrimary}
                </button>
                <button
                  onClick={() => navigate(ROUTES.SERVICES_SUBJECTS)}
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 2rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    borderRadius: '9999px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    color: 'rgba(255,255,255,0.85)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                >
                  {d.hero.ctaSecondary}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
      {/* ── INTRO VIDEO ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{d.introVideo.eyebrow}</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', margin: '0 0 0.75rem' }}>
            {d.introVideo.title}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            {d.introVideo.subtitle}
          </p>
          <div
            style={{
              maxWidth: '780px',
              margin: '0 auto',
              position: 'relative',
              aspectRatio: '16 / 9',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              border: '1px solid var(--color-border)',
            }}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${d.introVideo.youtubeId}`}
              title={d.introVideo.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── QUOTE STRIP ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '5rem 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
          <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            {d.philosophy.eyebrow}
          </p>
          <blockquote
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--color-text)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {d.philosophy.quote}
          </blockquote>
          <div className="accent-line-center" style={{ marginTop: '2rem' }} />
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>
                {d.programsSection.eyebrow}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0 }}>
                {d.programsSection.title}
              </h2>
            </div>
            <button className="btn-teal" onClick={() => navigate(ROUTES.SERVICES_SUBJECTS)}>
              {d.programsSection.allButton}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {d.programs.map((p) => {
              const isFlipped = flippedCard === p.number;
              return (
                <div
                  key={p.number}
                  className={`flip-card${isFlipped ? ' is-flipped' : ''}`}
                  onClick={() => {
                    // Πρώτο tap (mobile/χωρίς hover): γύρισε την κάρτα. Δεύτερο tap: πήγαινε στο contact.
                    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                      navigate('/contact');
                    } else if (isFlipped) {
                      navigate('/contact');
                    } else {
                      setFlippedCard(p.number);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flip-card-inner">
                    {/* Front */}
                    <div className="flip-card-face">
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-teal)', marginBottom: '0.5rem' }}>
                        {p.number}. {p.tag}
                      </p>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.6rem', marginBottom: '1rem', marginTop: 0 }}>
                        {p.title}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
                        {p.desc}
                      </p>
                      <div style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {d.programsSection.inquireLabel} →
                      </div>
                    </div>
                    {/* Back */}
                    <div className="flip-card-face flip-card-back">
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.75)', marginBottom: '0.75rem' }}>
                        {p.number}. {p.tag}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0, flex: 1 }}>
                        {p.details}
                      </p>
                      <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {d.programsSection.inquireLabel} →
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES (Γιατί να με επιλέξετε) ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', backgroundColor: 'var(--color-border)' }}>
            {d.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ backgroundColor: 'var(--color-surface)', padding: '2.5rem 2rem', textAlign: 'center' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--color-teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <Icon size={20} style={{ color: 'var(--color-teal)' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', marginTop: 0 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{d.achievementsSection.eyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', maxWidth: '600px', margin: '0 auto' }}>
              {d.achievementsSection.title}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', backgroundColor: 'var(--color-border)' }}>
            {d.achievements.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} style={{ backgroundColor: 'var(--color-bg)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Icon size={18} style={{ color: 'var(--color-teal)' }} />
                  <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>
                    {a.title}
                  </h4>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {a.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ABOUT / TEACHING PHOTO ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="split-grid split-grid--even">
            {/* Photo */}
            <div style={{ position: 'relative' }}>
              <img
                src="/images/Teaching_unity.png"
                alt="Live Unity tutoring session"
                style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
              />
              {/* Quote overlay card */}
              <div style={{
                position: 'absolute', bottom: '-1.5rem', right: '-1.5rem',
                backgroundColor: 'var(--color-teal)',
                color: '#ffffff',
                padding: '1.5rem 1.75rem',
                maxWidth: '260px',
              }}>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                  {d.aboutSection.quoteOverlay.quote}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0, opacity: 0.85 }}>
                  {d.aboutSection.quoteOverlay.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.06em', margin: 0, opacity: 0.7 }}>
                  {d.aboutSection.quoteOverlay.role}
                </p>
              </div>
            </div>

            {/* Text */}
            <div style={{ paddingRight: '1rem' }}>
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{d.aboutSection.eyebrow}</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1.2, marginBottom: '1rem', marginTop: 0 }}>
                {d.aboutSection.title}
              </h2>
              <div className="accent-line" />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '1rem', marginTop: '1.25rem' }}>
                {d.aboutSection.body}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                {d.aboutSection.availability}
              </p>
              <button className="btn-outline" onClick={() => navigate('/about')}>
                {d.aboutSection.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ backgroundColor: '#0f0f0f', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
            {[
              { value: STATS.YEARS, label: d.stats.labels[0] },
              { value: STATS.STUDENTS, label: d.stats.labels[1] },
              { value: STATS.SUBJECTS, label: d.stats.labels[2] },
            ].map((s, i) => (
              <div key={i} style={{ backgroundColor: '#0f0f0f', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#ffffff', lineHeight: 1 }}>
                  {statsVisible ? s.value : '-'}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem', marginBottom: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{d.testimonialsSection.eyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0 }}>
              {d.testimonialsSection.title}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {d.testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Stars */}
                <div style={{ color: '#d4a853', fontSize: '0.85rem', letterSpacing: '2px' }}>★★★★★</div>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: '1.05rem', color: 'var(--color-text)', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {t.text}
                </p>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {t.subject}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ backgroundColor: 'var(--color-dark-soft)', padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#ffffff', marginBottom: '1rem', marginTop: 0 }}>
            {d.ctaBanner.title}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
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

export default HomePage;