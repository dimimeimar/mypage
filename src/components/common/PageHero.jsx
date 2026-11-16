import Decode from '../fx/Decode';
import SEO from './SEO';
import HeroArt from '../fx/HeroArt';

/* Κοινό hero για όλες τις εσωτερικές σελίδες.
   seo: key του seo_data.js (προαιρετικό) - βάζει και τα meta tags της σελίδας.
   image: προαιρετική φωτογραφία φόντου. art: γραμμικό σχέδιο φόντου (plot, steps, path, circuit, network). compact: χαμηλότερο (π.χ. Ημερολόγιο). */
const PageHero = ({ eyebrow, title, subtitle, image, art, compact = false, seo }) => (
  <section className={`page-hero${compact ? ' page-hero--compact' : ''}`}>
    {seo && <SEO page={seo} />}
    {image && <img className="page-hero__img" src={image} alt="" />}
    {art && <HeroArt variant={art} />}
    <div className="container page-hero__inner">
      {eyebrow && <p className="eyebrow animate-fade-in">{eyebrow}</p>}
      <Decode as="h1" className="page-hero__title" text={title} />
      {subtitle && <p className="page-hero__sub animate-slide-up" style={{ animationDelay: '0.3s' }}>{subtitle}</p>}
      <div className="page-hero__rule" />
    </div>
  </section>
);

export default PageHero;
