import { Link } from 'react-router-dom';
import { CONTACT_INFO, EXTERNAL_LINKS, ROUTES } from '../../constants/routes';
import { getString } from '../../data/strings';
import { footerData, footerPlatforms } from '../../data/footer_data';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram } from 'lucide-react';

const SOCIAL = [
  { href: EXTERNAL_LINKS.GITHUB, icon: Github, label: 'GitHub' },
  { href: EXTERNAL_LINKS.LINKEDIN, icon: Linkedin, label: 'LinkedIn' },
  { href: EXTERNAL_LINKS.INSTAGRAM, icon: Instagram, label: 'Instagram' },
];

const Footer = () => {
  const { language } = useLanguage();
  const year = new Date().getFullYear();
  const d = footerData[language] || footerData.el;
  const { user, isAdmin } = useAuth();
  const accountLabel = isAdmin ? (language === 'el' ? 'Διαχείριση' : 'Admin') : user ? (language === 'el' ? 'Λογαριασμός' : 'Account') : (language === 'el' ? 'Σύνδεση' : 'Sign in');
  const accountPath = isAdmin ? ROUTES.ADMIN : ROUTES.LOGIN;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="footer__brand">meimaridis</p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, margin: 0, maxWidth: '22rem' }}>{d.tagline}</p>
            <div className="footer__social">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>{d.navTitle}</h4>
            <ul>
              {d.navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{getString(`nav.${link.labelKey}`, language)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{d.platformsTitle}</h4>
            <ul>
              {footerPlatforms.map((p) => (
                <li key={p.key}>
                  <a href={EXTERNAL_LINKS[p.key]} target="_blank" rel="noopener noreferrer">{p.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{d.contactTitle}</h4>
            <ul>
              <li><MapPin size={14} /><span>{CONTACT_INFO.LOCATION}</span></li>
              <li><Mail size={14} /><a href={`mailto:${CONTACT_INFO.EMAIL}`}>{CONTACT_INFO.EMAIL}</a></li>
              <li><Phone size={14} /><a href={`tel:${CONTACT_INFO.PHONE}`}>{CONTACT_INFO.PHONE}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} Meimaridis Tutoring. {d.rightsReserved}</p>
          <p>{d.locationLine} <Link to={ROUTES.PRIVACY} style={{ marginLeft: '1rem', opacity: 0.7 }}>{language === 'el' ? 'Απόρρητο' : 'Privacy'}</Link> <Link to={accountPath} style={{ marginLeft: '1rem', opacity: 0.7 }}>{accountLabel}</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
