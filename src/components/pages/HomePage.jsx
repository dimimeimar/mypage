import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Sigma, Atom, Gamepad2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../contexts/ThemeContext';
import { STATS, ROUTES } from '../../constants/routes';
import { homeData } from '../../data/home_data';
import { stripTonos } from '../../utils/text';
import SearchBar from '../common/searchBar';
import SEO from '../common/SEO';
import StatsBand from '../common/StatsBand';
import CtaBand from '../common/CtaBand';
import Decode from '../fx/Decode';
import TiltCard from '../fx/TiltCard';
import CodeDemo from '../fx/CodeDemo';

// Το three.js φορτώνεται σε ξεχωριστό chunk, αφού εμφανιστεί το κείμενο του hero
const HeroScene = lazy(() => import('../fx/HeroScene'));

// Ένα εικονίδιο ανά πρόγραμμα - ίδια σειρά με homeData.programs και με τα 3D σχήματα
const PROGRAM_ICONS = [Code2, Sigma, Atom, Gamepad2];
const SHAPE_MS = 6000;

const HomePage = () => {
  const navigate = useNavigate();
  const { language } = useTranslation();
  const { theme } = useTheme();
  const d = homeData[language] || homeData.el;

  const [shape, setShape] = useState(0);
  const [auto, setAuto] = useState(true); // σταματάει μόλις ο επισκέπτης διαλέξει μόνος του
  const [sceneFailed, setSceneFailed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Αυτόματη εναλλαγή των 3D σχημάτων
  useEffect(() => {
    if (!auto) return undefined;
    const id = setTimeout(() => setShape((s) => (s + 1) % d.programs.length), SHAPE_MS);
    return () => clearTimeout(id);
  }, [shape, auto, d.programs.length]);

  const pickShape = (i) => {
    setAuto(false);
    setShape(i);
  };

  return (
    <div>
      <SEO page="home" />

      {/* ── HERO ── */}
      <section className="hero fx-clear" data-rv="off">
        <div className="container">
          <div className="hero__grid">
            <div>
              <div className="hero__who">
                <img src="/images/dimitris-profile.png" alt={d.hero.name} width="42" height="42" />
                <span>
                  <strong>{d.hero.name}</strong>
                  <small>{d.hero.eyebrow}</small>
                </span>
              </div>

              <Decode
                as="h1"
                className={`hero__title${d.hero.title.length > 40 ? ' hero__title--long' : ''}`}
                text={d.hero.title}
                delay={150}
              />

              <p className="hero__sub">{d.hero.subtitle}</p>

              <div className="hero__search">
                <SearchBar placeholder={d.search.placeholder} onResultSelect={() => navigate(ROUTES.CONTACT)} />
              </div>

              <div className="hero__actions">
                <button className="btn-primary" onClick={() => navigate(ROUTES.CONTACT)}>
                  {d.hero.ctaPrimary} <ArrowRight size={16} />
                </button>
                <button className="btn-ghost" onClick={() => navigate(ROUTES.SERVICES_SUBJECTS)}>
                  {d.hero.ctaSecondary}
                </button>
              </div>
            </div>

            <div className="hero__stage">
              {sceneFailed ? (
                <img
                  src="/images/dimitris-profile.png"
                  alt={d.hero.name}
                  style={{ width: '70%', margin: '15%', borderRadius: '50%', boxShadow: 'var(--glow)' }}
                />
              ) : (
                <Suspense fallback={null}>
                  <HeroScene shape={shape} theme={theme} onError={() => setSceneFailed(true)} />
                </Suspense>
              )}
              {!sceneFailed && (
                <p className="hero__caption" aria-hidden="true">
                  <b>{stripTonos(d.programs[shape].title)}</b> / {d.hero.shapes[shape]}
                </p>
              )}
            </div>
          </div>

          {/* Τα 4 αντικείμενα: κάθε κουμπί μεταμορφώνει το 3D σχήμα */}
          <div className="hero__tabs" role="tablist" aria-label={d.programsSection.eyebrow}>
            {d.programs.map((p, i) => (
              <button
                key={p.number}
                role="tab"
                aria-selected={shape === i}
                className={`hero__tab${shape === i ? ' is-active' : ''}${auto ? ' is-auto' : ''}`}
                style={{ '--tab-ms': `${SHAPE_MS}ms` }}
                onClick={() => pickShape(i)}
                onMouseEnter={() => pickShape(i)}
              >
                <span>{p.tag}</span>
                <strong>{p.title}</strong>
              </button>
            ))}
          </div>
        </div>
        <div className="hero__scroll" aria-hidden="true" />
      </section>

      {/* ── STATS ── */}
      <StatsBand
        items={[
          { value: STATS.YEARS, label: d.stats.labels[0] },
          { value: STATS.STUDENTS, label: d.stats.labels[1] },
          { value: STATS.SUBJECTS, label: d.stats.labels[2] },
        ]}
      />

      {/* ── PROGRAMS (3D tilt cards) ── */}
      <section className="band">
        <div className="container">
          <div className="band__head">
            <div>
              <p className="eyebrow">{d.programsSection.eyebrow}</p>
              <Decode as="h2" className="band__title" text={d.programsSection.title} />
            </div>
            <button className="btn-outline" onClick={() => navigate(ROUTES.SERVICES_SUBJECTS)}>
              {d.programsSection.allButton} <ArrowRight size={16} />
            </button>
          </div>

          <div className="tilt-grid" data-rv-group>
            {d.programs.map((p, i) => {
              const Icon = PROGRAM_ICONS[i] || Code2;
              return (
                <div key={p.number} style={{ perspective: '1200px' }}>
                  <TiltCard
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(ROUTES.CONTACT)}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(ROUTES.CONTACT); }}
                  >
                    <div className="tilt__icon"><Icon size={22} /></div>
                    <p className="tilt__tag">{p.tag}</p>
                    <h3 className="tilt__title">{p.title}</h3>
                    <p className="tilt__desc">{p.desc}</p>
                    <p className="tilt__more">{p.details}</p>
                    <span className="tilt__cta">
                      {d.programsSection.inquireLabel} <ArrowRight size={15} />
                    </span>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CODE DEMO ── */}
      <section className="band">
        <div className="container">
          <div className="code-split" data-rv-group>
            <div>
              <p className="eyebrow">{d.codeDemo.eyebrow}</p>
              <Decode as="h2" className="band__title" text={d.codeDemo.title} />
              <p className="band__lead">{d.codeDemo.body}</p>
              <button className="btn-outline" style={{ marginTop: '2rem' }} onClick={() => navigate(ROUTES.SERVICES_SUBJECTS)}>
                {d.codeDemo.cta} <ArrowRight size={16} />
              </button>
            </div>
            <CodeDemo outputLabel={d.codeDemo.outputLabel} />
          </div>
        </div>
      </section>

      {/* ── INTRO VIDEO ── */}
      <section className="band">
        <div className="container">
          <div className="band__head band__head--center">
            <p className="eyebrow">{d.introVideo.eyebrow}</p>
            <Decode as="h2" className="band__title" text={d.introVideo.title} />
            <p className="band__lead" style={{ marginTop: 0 }}>{d.introVideo.subtitle}</p>
          </div>
          <div className="video-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${d.introVideo.youtubeId}`}
              title={d.introVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY QUOTE ── */}
      <section className="band">
        <div className="container">
          <div className="quote">
            <p className="eyebrow">{d.philosophy.eyebrow}</p>
            <Decode as="blockquote" text={d.philosophy.quote} />
          </div>
        </div>
      </section>

      {/* ── WHY ME + ACHIEVEMENTS ── */}
      <section className="band">
        <div className="container">
          <div className="band__head band__head--center">
            <p className="eyebrow">{d.achievementsSection.eyebrow}</p>
            <Decode as="h2" className="band__title" text={d.achievementsSection.title} />
          </div>

          <div className="feat-grid" data-rv-group style={{ marginBottom: '1.25rem' }}>
            {d.features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="feat feat--big">
                  <Icon size={26} className="feat__icon" />
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              );
            })}
          </div>
          <div className="feat-grid" data-rv-group style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {d.achievements.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.title} className="feat">
                  <Icon size={20} className="feat__icon" />
                  <h3 style={{ fontSize: '1rem' }}>{a.title}</h3>
                  <p>{a.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ABOUT / TEACHING PHOTO ── */}
      <section className="band">
        <div className="container">
          <div className="split-grid split-grid--even">
            <div className="about-photo">
              <img src="/images/Teaching_unity.png" alt="Live Unity tutoring session" loading="lazy" />
              <div className="about-photo__card">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                  {d.aboutSection.quoteOverlay.quote}
                </p>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {d.aboutSection.quoteOverlay.name}
                </p>
                <p style={{ fontSize: '0.68rem', opacity: 0.8 }}>{d.aboutSection.quoteOverlay.role}</p>
              </div>
            </div>

            <div>
              <p className="eyebrow">{d.aboutSection.eyebrow}</p>
              <Decode as="h2" className="band__title" text={d.aboutSection.title} />
              <div className="accent-line" />
              <p className="band__lead">{d.aboutSection.body}</p>
              <p className="band__lead">{d.aboutSection.availability}</p>
              <button className="btn-outline" style={{ marginTop: '2rem' }} onClick={() => navigate(ROUTES.ABOUT)}>
                {d.aboutSection.cta} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="band">
        <div className="container">
          <div className="band__head band__head--center">
            <p className="eyebrow">{d.testimonialsSection.eyebrow}</p>
            <Decode as="h2" className="band__title" text={d.testimonialsSection.title} />
          </div>

          <div className="tm-grid" data-rv-group>
            {d.testimonials.map((t) => (
              <figure key={t.name} className="tm">
                <div className="tm__stars" aria-label={`${t.rating}/5`}>{'★'.repeat(t.rating)}</div>
                <blockquote className="tm__text">{t.text}</blockquote>
                <figcaption className="tm__who">
                  <span className="tm__avatar" aria-hidden="true">{t.name.charAt(0)}</span>
                  <span>
                    <strong>{t.name}</strong>
                    <span>{t.subject}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBand title={d.ctaBanner.title} subtitle={d.ctaBanner.subtitle} button={d.ctaBanner.button} />
    </div>
  );
};

export default HomePage;
