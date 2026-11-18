import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../hooks/useTranslation';
import { seoData } from '../../data/seo_data';

const SITE_URL = 'https://meimaridistutor.com';

// Χρήση: <SEO page="schools" /> μέσα σε κάθε page component (π.χ. πρώτη γραμμή του return)
// Το 'page' key πρέπει να ταιριάζει με key του seo_data.js (home, services, subjects, schools, consulting, repairs, about, contact, calendar)
const SEO = ({ page }) => {
  const { language } = useTranslation();
  const entry = seoData[page] || seoData.home;
  const d = entry[language] || entry.el;
  const canonical = `${SITE_URL}${entry.path}`;
  const ogImage = `${SITE_URL}/images/dimitris-profile.png`;

  return (
    <Helmet>
      <title>{d.title}</title>
      <meta name="description" content={d.description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={d.title} />
      <meta property="og:description" content={d.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={d.title} />
      <meta name="twitter:description" content={d.description} />

      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="el" href={`${canonical}${entry.path.includes('?') ? '&' : '?'}lang=el`} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
    </Helmet>
  );
};

export default SEO;
