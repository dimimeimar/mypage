import { Link } from 'react-router-dom';
import { CONTACT_INFO, EXTERNAL_LINKS } from '../../constants/routes';
import { getString } from '../../data/strings';
import { footerData, footerPlatforms } from '../../data/footer_data';
import { useLanguage } from '../../contexts/LanguageContext';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  const d = footerData[language] || footerData.el;

  return (
    <footer style={{ backgroundColor: '#0a0a0a', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
      {/* Main footer grid */}
      <div className="container" style={{ padding: '5rem 1.5rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '1rem', marginTop: 0 }}>
              meimaridis
            </p>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', marginTop: 0 }}>
              {d.tagline}
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { href: EXTERNAL_LINKS.GITHUB, icon: Github },
                { href: EXTERNAL_LINKS.LINKEDIN, icon: Linkedin },
                { href: EXTERNAL_LINKS.INSTAGRAM, icon: Instagram },
              ].map(({ href, icon: Icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                   style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                   onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem', marginTop: 0 }}>
              {d.navTitle}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {d.navLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    {getString(`nav.${link.labelKey}`, language)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h4 style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem', marginTop: 0 }}>
              {d.platformsTitle}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {footerPlatforms.map(p => (
                <li key={p.key}>
                  <a href={EXTERNAL_LINKS[p.key]} target="_blank" rel="noopener noreferrer"
                     style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                     onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                     onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem', marginTop: 0 }}>
              {d.contactTitle}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={14} style={{ color: 'var(--color-teal-light)', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{CONTACT_INFO.LOCATION}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Mail size={14} style={{ color: 'var(--color-teal-light)', marginTop: '2px', flexShrink: 0 }} />
                <a href={`mailto:${CONTACT_INFO.EMAIL}`} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                   onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {CONTACT_INFO.EMAIL}
                </a>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Phone size={14} style={{ color: 'var(--color-teal-light)', marginTop: '2px', flexShrink: 0 }} />
                <a href={`tel:${CONTACT_INFO.PHONE}`} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                   onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {CONTACT_INFO.PHONE}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container" style={{ padding: '1.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            © {year} Meimaridis Tutoring. {d.rightsReserved}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            {d.locationLine}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;