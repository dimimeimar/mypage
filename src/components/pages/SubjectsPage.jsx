import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { subjectsData, subjectsPageText } from '../../data/subjects';
import { stripTonos } from '../../utils/text';
import { Code2, Calculator, Atom, BookOpen, Database, Globe, Cpu, Gamepad2 } from 'lucide-react';
import PageHero from '../common/PageHero';
import CtaBand from '../common/CtaBand';

const ICON_MAP = {
  university: BookOpen,
  programming: Code2,
  web: Globe,
  databases: Database,
  mathematics: Calculator,
  physics: Atom,
  electronics: Cpu,
  games: Gamepad2,
};

const SubjectsPage = () => {
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const currentSubjects = subjectsData[language] || subjectsData.el;
  const pt = subjectsPageText[language] || subjectsPageText.el;
  const keys = Object.keys(currentSubjects);

  const visibleSections = activeFilter === 'all'
    ? Object.entries(currentSubjects)
    : Object.entries(currentSubjects).filter(([k]) => k === activeFilter);

  return (
    <div>

      {/* ── HERO ── */}
      <PageHero seo="subjects" title={pt.hero.title} subtitle={pt.hero.subtitle} />

      {/* ── FILTERS ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1.5rem 0', position: 'sticky', top: '72px', zIndex: 50 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '0.45rem 1.25rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: activeFilter === 'all' ? '1px solid var(--color-dark)' : '1px solid var(--color-border)',
                borderRadius: '9999px',
                backgroundColor: activeFilter === 'all' ? 'var(--color-dark)' : 'transparent',
                color: activeFilter === 'all' ? '#ffffff' : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {pt.allLabel}
            </button>
            {keys.map(key => {
              const Icon = ICON_MAP[key] || BookOpen;
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.45rem 1.25rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: isActive ? '1px solid var(--color-dark)' : '1px solid var(--color-border)',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? 'var(--color-dark)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={12} />
                  {stripTonos(currentSubjects[key].title)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS GRID ── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          {visibleSections.map(([sectionKey, section]) => {
            const SectionIcon = ICON_MAP[sectionKey] || BookOpen;
            return (
              <div key={sectionKey} style={{ marginBottom: '4rem' }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <SectionIcon size={20} style={{ color: 'var(--color-teal)' }} />
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.75rem', margin: 0 }}>
                    {section.title}
                  </h2>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.06em', marginLeft: 'auto' }}>
                    {section.categories.reduce((t, c) => t + c.subjects.length, 0)} {pt.unitLabel}
                  </span>
                </div>

                {section.categories.map((cat, ci) => (
                  <div key={ci} style={{ marginBottom: '2rem' }}>
                    {cat.name && (
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '1rem', marginTop: 0 }}>
                        {stripTonos(cat.name)}
                      </p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem' }}>
                      {cat.subjects.map((subj, si) => {
                        const label = typeof subj === 'string' ? subj : subj.name || subj;
                        return (
                          <div
                            key={si}
                            onClick={() => navigate('/contact')}
                            style={{
                              backgroundColor: 'var(--color-surface)',
                              padding: '1.25rem 1.5rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = 'var(--color-teal-pale)';
                              e.currentTarget.querySelector('.arrow').style.opacity = '1';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                              e.currentTarget.querySelector('.arrow').style.opacity = '0';
                            }}
                          >
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.4 }}>
                              {label}
                            </span>
                            <span className="arrow" style={{ color: 'var(--color-teal)', fontSize: '0.85rem', opacity: 0, transition: 'opacity 0.2s', flexShrink: 0 }}>→</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBand title={pt.cta.title} subtitle={pt.cta.subtitle} button={pt.cta.button} />

    </div>
  );
};

export default SubjectsPage;