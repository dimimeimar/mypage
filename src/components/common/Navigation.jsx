import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAV_ITEMS, ROUTES } from '../../constants/routes';
import { getString } from '../../data/strings';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // desktop: key του ανοιχτού dropdown
  const [mobileExpandedKey, setMobileExpandedKey] = useState(null); // mobile: key του ανοιχτού disclosure
  const location = useLocation();
  const { language } = useLanguage();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1120);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1120);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Κλείσιμο mobile menu / dropdowns σε αλλαγή σελίδας
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedKey(null);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Όσο είναι ανοιχτό το mobile menu, η σελίδα από πίσω δεν σκρολάρει
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isActive = (path) => location.pathname === path;
  const isActiveGroup = (item) =>
    item.children
      ? (item.path && location.pathname.startsWith(item.path)) || item.children.some((c) => isActive(c.path))
      : isActive(item.path);
  const label = (key) => getString(`nav.${key}`, language);

  return (
    <>
      <nav className={`nav no-print${scrolled || mobileMenuOpen ? ' nav--scrolled' : ''}`}>
        <div className="container">
          <div className="nav__bar">
            <Link to={ROUTES.HOME} className="nav__logo" aria-label="Meimaridis - Home">
              meimaridis
            </Link>

            {!isMobile && (
              <div className="nav__links">
                {NAV_ITEMS.map((item) => {
                  const active = isActiveGroup(item);

                  if (item.children) {
                    const isOpen = openDropdown === item.key;
                    return (
                      <div key={item.key} style={{ position: 'relative' }}>
                        <button
                          className={`nav__link${active ? ' is-active' : ''}`}
                          onClick={() => setOpenDropdown(isOpen ? null : item.key)}
                          aria-expanded={isOpen}
                        >
                          {label(item.key)}
                          <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                        </button>

                        {isOpen && (
                          <>
                            <div onClick={() => setOpenDropdown(null)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                            <div className={`menu-pop${item.key === 'more' ? ' menu-pop--right' : ''}`}>
                              {/* Link προς τη landing σελίδα της ομάδας (αν έχει) */}
                              {item.path && (
                                <Link to={item.path} className={`menu-pop__item menu-pop__item--head${isActive(item.path) ? ' is-active' : ''}`}>
                                  {label(item.key)} - {language === 'el' ? 'Ολες' : 'Overview'}
                                </Link>
                              )}
                              {item.children.map((child) => (
                                <Link key={child.key} to={child.path} className={`menu-pop__item${isActive(child.path) ? ' is-active' : ''}`}>
                                  {label(child.key)}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link key={item.key} to={item.path} className={`nav__link${active ? ' is-active' : ''}`}>
                      {label(item.key)}
                    </Link>
                  );
                })}

                <LanguageSelector />

                <Link to={ROUTES.CONTACT} className="btn-primary nav__cta">
                  {label('contact')}
                </Link>
              </div>
            )}

            {isMobile && (
              <button className="nav__burger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          {NAV_ITEMS.map((item, i) => {
            if (item.children) {
              const expanded = mobileExpandedKey === item.key;
              return (
                <div key={item.key} style={{ textAlign: 'center' }}>
                  <button
                    className={`mobile-menu__link${isActiveGroup(item) ? ' is-active' : ''}`}
                    style={{ '--i': i }}
                    onClick={() => setMobileExpandedKey(expanded ? null : item.key)}
                    aria-expanded={expanded}
                  >
                    {label(item.key)}
                    <ChevronDown size={20} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {expanded && (
                    <div className="mobile-menu__sub">
                      {item.path && (
                        <Link to={item.path} className="eyebrow">
                          {language === 'el' ? 'Ολες οι Υπηρεσιες' : 'All Services'}
                        </Link>
                      )}
                      {item.children.map((child) => (
                        <Link key={child.key} to={child.path} className={isActive(child.path) ? 'is-active' : ''}>
                          {label(child.key)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.key} to={item.path} className={`mobile-menu__link${isActive(item.path) ? ' is-active' : ''}`} style={{ '--i': i }}>
                {label(item.key)}
              </Link>
            );
          })}

          <div style={{ marginTop: '0.5rem' }}>
            <LanguageSelector />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
