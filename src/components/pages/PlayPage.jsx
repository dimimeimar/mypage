import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { playText } from '../../data/exercises_data';
import { ROUTES } from '../../constants/routes';
import PageHero from '../common/PageHero';

const PlayPage = () => {
  const { language } = useTranslation();
  const d = playText[language] || playText.el;

  return (
    <div>
      <PageHero seo="play" art="path" eyebrow={d.hero.eyebrow} title={d.hero.title} subtitle={d.hero.subtitle} />
      <section className="band">
        <div className="container">
          <div className="soon">
            <Gamepad2 size={34} />
            <h2>{d.soon}</h2>
            <p>{d.body}</p>
            <Link to={ROUTES.EXERCISES} className="btn-primary">{d.button} <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlayPage;
