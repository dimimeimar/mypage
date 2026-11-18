import { useTranslation } from '../../hooks/useTranslation';
import { privacyData } from '../../data/privacy_data';
import { CONTACT_INFO } from '../../constants/routes';
import PageHero from '../common/PageHero';
import '../../styles/legal.css';

const PrivacyPage = () => {
  const { language } = useTranslation();
  const d = privacyData[language] || privacyData.el;

  return (
    <div>
      <PageHero seo="privacy" compact title={d.title} subtitle={d.subtitle} />
      <section className="band">
        <div className="container">
          <article className="legal">
            <p className="legal__date">{d.updated}</p>
            {d.sections.map((s) => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                {s.body && s.body.map((p) => <p key={p}>{p}</p>)}
                {s.items && <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>}
                {s.note && <p>{s.note}</p>}
              </section>
            ))}
            <section>
              <h2>{d.contactTitle}</h2>
              <p>{d.contactLead} <a href={`mailto:${CONTACT_INFO.EMAIL}`}>{CONTACT_INFO.EMAIL}</a></p>
            </section>
          </article>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
