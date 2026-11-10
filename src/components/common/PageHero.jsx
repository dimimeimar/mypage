import Decode from '../fx/Decode';
import SEO from './SEO';

/* Κοινό hero για όλες τις εσωτερικές σελίδες.
   seo: key του seo_data.js (προαιρετικό) - βάζει και τα meta tags της σελίδας.
   image: προαιρετική φωτογραφία φόντου. compact: χαμηλότερο (π.χ. Ημερολόγιο). */
const PageHero = ({ eyebrow, title, subtitle, image, compact = false, seo }) => (
  <section className={`page-hero fx-clear${compact ? ' page-hero--compact' : ''}`} data-rv="off">
    {seo && <SEO page={seo} />}
    {image && <img className="page-hero__img" src={image} alt="" />}
    <div className="container page-hero__inner">
      {eyebrow && <p className="eyebrow animate-fade-in">{eyebrow}</p>}
      <Decode as="h1" className="page-hero__title" text={title} />
      {subtitle && <p className="page-hero__sub animate-slide-up" style={{ animationDelay: '0.3s' }}>{subtitle}</p>}
      <div className="page-hero__rule" />
    </div>
  </section>
);

export default PageHero;
