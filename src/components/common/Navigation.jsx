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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu / dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedKey(null);
    setOpenDropdown(null);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const isActiveGroup = (item) =>
    item.children ? location.pathname.startsWith(item.path) : isActive(item.path);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          backgroundColor: scrolled ? '#ffffff' : 'transparent',
          boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            {/* Logo */}
            <Link
              to={ROUTES.HOME}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                color: scrolled ? 'var(--color-dark)' : '#ffffff',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              meimaridis
            </Link>

            {/* Desktop Nav */}
            {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              {NAV_ITEMS.map((item) => {
                const active = isActiveGroup(item);
                const linkColor = scrolled
                  ? (active ? 'var(--color-teal)' : 'var(--color-text)')
                  : (active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.8)');

                if (item.children) {
                  const isOpen = openDropdown === item.key;
                  return (
                    <div key={item.key} style={{ position: 'relative' }}>
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : item.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: linkColor,
                          transition: 'color 0.2s ease',
                          paddingBottom: '2px',
                          borderBottom: active ? '1px solid currentColor' : '1px solid transparent',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = scrolled ? 'var(--color-teal)' : '#ffffff'}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.color = linkColor; }}
                      >
                        {getString(`nav.${item.key}`, language)}
                        <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                      </button>

                      {isOpen && (
                        <>
                          <div onClick={() => setOpenDropdown(null)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              marginTop: '0.9rem',
                              minWidth: '230px',
                              backgroundColor: '#ffffff',
                              border: '1px solid var(--color-border)',
                              borderRadius: '10px',
                              boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
                              overflow: 'hidden',
                              zIndex: 20,
                            }}
                          >
                            {/* Link προς τη landing σελίδα Υπηρεσίες */}
                            <Link
                              to={item.path}
                              style={{
                                display: 'block',
                                padding: '0.9rem 1.25rem',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                color: 'var(--color-teal)',
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--color-border)',
                                backgroundColor: isActive(item.path) ? 'var(--color-teal-pale)' : 'transparent',
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-teal-pale)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = isActive(item.path) ? 'var(--color-teal-pale)' : 'transparent'}
                            >
                              {getString(`nav.${item.key}`, language)} — {language === 'el' ? 'Όλες' : 'Overview'}
                            </Link>

                            {item.children.map((child) => {
                              const childActive = isActive(child.path);
                              return (
                                <Link
                                  key={child.key}
                                  to={child.path}
                                  style={{
                                    display: 'block',
                                    padding: '0.85rem 1.25rem',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    color: childActive ? 'var(--color-teal)' : 'var(--color-text)',
                                    textDecoration: 'none',
                                    backgroundColor: childActive ? 'var(--color-teal-pale)' : 'transparent',
                                    transition: 'background-color 0.15s ease',
                                  }}
                                  onMouseEnter={e => { if (!childActive) e.currentTarget.style.backgroundColor = 'var(--color-bg)'; }}
                                  onMouseLeave={e => { if (!childActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  {getString(`nav.${child.key}`, language)}
                                </Link>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: linkColor,
                      transition: 'color 0.2s ease',
                      paddingBottom: '2px',
                      borderBottom: active ? '1px solid currentColor' : '1px solid transparent',
                    }}
                    onMouseEnter={e => e.target.style.color = scrolled ? 'var(--color-teal)' : '#ffffff'}
                    onMouseLeave={e => {
                      if (!active) {
                        e.target.style.color = scrolled ? 'var(--color-text)' : 'rgba(255,255,255,0.8)';
                      }
                    }}
                  >
                    {getString(`nav.${item.key}`, language)}
                  </Link>
                );
              })}

              <LanguageSelector dark={!scrolled} />

              <Link
                to={ROUTES.CONTACT}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1.5rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: '9999px',
                  transition: 'all 0.25s ease',
                  backgroundColor: scrolled ? 'var(--color-dark)' : 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: scrolled ? '2px solid var(--color-dark)' : '2px solid rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = scrolled ? 'transparent' : 'rgba(255,255,255,0.25)';
                  if (scrolled) e.currentTarget.style.color = 'var(--color-dark)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = scrolled ? 'var(--color-dark)' : 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                {getString('nav.contact', language)}
              </Link>
            </div>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: scrolled ? 'var(--color-dark)' : '#ffffff',
                padding: '4px',
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            backgroundColor: '#0f0f0f',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.75rem',
            overflowY: 'auto',
            padding: '5rem 1.5rem 3rem',
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff',
            }}
          >
            <X size={28} />
          </button>

          {NAV_ITEMS.map((item) => {
            if (item.children) {
              const expanded = mobileExpandedKey === item.key;
              const groupActive = isActiveGroup(item);
              return (
                <div key={item.key} style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => setMobileExpandedKey(expanded ? null : item.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      color: groupActive ? 'var(--color-teal-light)' : '#ffffff',
                    }}
                  >
                    {getString(`nav.${item.key}`, language)}
                    <ChevronDown size={20} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {expanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                      <Link
                        to={item.path}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--color-teal-light)',
                          textDecoration: 'none',
                        }}
                      >
                        {language === 'el' ? 'Ολες οι Υπηρεσιες' : 'All Services'}
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          to={child.path}
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.05rem',
                            color: isActive(child.path) ? 'var(--color-teal-light)' : 'rgba(255,255,255,0.75)',
                            textDecoration: 'none',
                          }}
                        >
                          {getString(`nav.${child.key}`, language)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.key}
                to={item.path}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: isActive(item.path) ? 'var(--color-teal-light)' : '#ffffff',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {getString(`nav.${item.key}`, language)}
              </Link>
            );
          })}

          <div style={{ marginTop: '1rem' }}>
            <LanguageSelector dark={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
