import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { workData } from '../../data/work_data';
import PageHero from '../common/PageHero';
import CtaBand from '../common/CtaBand';

const GROUPS = ['web', 'other'];

const WorkPage = () => {
  const { language } = useTranslation();
  const lang = language === 'en' ? 'en' : 'el';
  const d = workData[lang];

  return (
    <div>
      <PageHero seo="work" art="network" eyebrow={d.hero.eyebrow} title={d.hero.title} subtitle={d.hero.subtitle} />

      {GROUPS.map((group, gi) => (
        <section key={group} className={`band${gi % 2 ? ' band--alt' : ''}`}>
          <div className="container">
            <h2 className="band__title" style={{ marginBottom: '2.5rem' }}>{d.groups[group]}</h2>
            <div className="work-grid">
              {workData.projects.filter((p) => p.group === group).map((p) => {
                const Tag = p.url ? 'a' : 'div';
                const linkProps = p.url ? { href: p.url, target: '_blank', rel: 'noopener noreferrer' } : {};
                return (
                  <Tag key={p.key} className={`work-card${p.url ? ' work-card--link' : ''}`} {...linkProps}>
                    <div className="work-card__top">
                      <span className={`work-card__status work-card__status--${p.status}`}>{d.status[p.status]}</span>
                      {p.url && <ArrowUpRight size={18} aria-label={d.visit} />}
                    </div>
                    <h3 className="work-card__name">{p.name}</h3>
                    <p className="work-card__desc">{p[lang]}</p>
                    {p.tech.length > 0 && (
                      <ul className="work-card__tech">
                        {p.tech.map((tech) => <li key={tech}>{tech}</li>)}
                      </ul>
                    )}
                  </Tag>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <CtaBand title={d.cta.title} button={d.cta.button} />
    </div>
  );
};

export default WorkPage;
