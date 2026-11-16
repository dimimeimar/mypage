import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useTranslation } from '../../hooks/useTranslation';
import { CONTACT_INFO, EXTERNAL_LINKS } from '../../constants/routes';
import { contactData } from '../../data/contact_data';
import OpenStreetMap from '../common/OpenStreetMap';
import { Mail, Phone, MapPin, MessageSquare, Send, MessageCircle, Video } from 'lucide-react';
import PageHero from '../common/PageHero';

// EmailJS - βλ. https://dashboard.emailjs.com. Χρειάζεται VITE_EMAILJS_PUBLIC_KEY στο .env
// (Επιβεβαίωσε ότι τα ονόματα των μεταβλητών ταιριάζουν με το template σου στο dashboard.)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const ContactPage = () => {
  const { language } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error' | null

  const d = contactData[language] || contactData.el;
  const dateLocale = language === 'en' ? 'en-US' : 'el-GR';

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = d.form.validation.required;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = d.form.validation.emailInvalid;
    if (!form.message.trim()) e.message = d.form.validation.required;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          title: `${d.form.emailSubjectPrefix} ${form.name}${form.subject ? ' – ' + form.subject : ''}`,
          student_email: form.email,
          date: new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
          time: new Date().toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' }),
          notes: form.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  const contactItems = [
    { Icon: MapPin, label: d.contactItems.location, value: d.contactItems.locationValue, href: null },
    { Icon: Mail, label: d.contactItems.email, value: CONTACT_INFO.EMAIL, href: `mailto:${CONTACT_INFO.EMAIL}` },
    { Icon: Phone, label: d.contactItems.phone, value: CONTACT_INFO.PHONE, href: `tel:${CONTACT_INFO.PHONE}` },
    { Icon: MessageSquare, label: d.contactItems.teams, value: d.contactItems.teamsValue, href: CONTACT_INFO.TEAMS },
  ];

  const whatsappUrl = `https://wa.me/30${CONTACT_INFO.WHATSAPP}?text=${encodeURIComponent(d.messagingApps.whatsapp.textParam)}`;
  const viberUrl = `viber://chat?number=30${CONTACT_INFO.VIBER}`;

  const quickContactCards = [
    { Icon: MessageCircle, ...d.messagingApps.whatsapp, url: whatsappUrl },
    { Icon: Phone, ...d.messagingApps.viber, url: viberUrl },
    { Icon: Video, ...d.messagingApps.teams, url: CONTACT_INFO.TEAMS },
  ];

  return (
    <div>

      {/* ── HERO ── */}
      <PageHero art="network" seo="contact" title={d.hero.title} subtitle={d.hero.subtitle} />

      {/* ── MAIN CONTENT ── */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div className="split-grid split-grid--narrow" style={{ gap: '6rem', alignItems: 'start' }}>

            {/* Left: contact info */}
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>
                {d.details.eyebrow}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', lineHeight: 1.2, marginTop: 0, marginBottom: '1rem' }}>
                {d.details.title}
              </h2>
              <div className="accent-line" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem', marginBottom: '2rem' }}>
                {contactItems.map(({ Icon, label, value, href }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--color-teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} style={{ color: 'var(--color-teal)' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 0.2rem' }}>{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                          style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text)'}
                        >{value}</a>
                      ) : (
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick info: hours / response time */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', backgroundColor: 'var(--color-teal-pale)', marginBottom: '2rem' }}>
                {d.quickInfo.map((info, i) => (
                  <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-text)', margin: 0 }}>
                    <strong>{info.title}:</strong> {info.value}
                  </p>
                ))}
              </div>

              {/* Map */}
              <div style={{ border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <OpenStreetMap />
              </div>
            </div>

            {/* Right: form */}
            <div>
              <p className="eyebrow" style={{ marginBottom: '2rem' }}>
                {d.form.eyebrow}
              </p>

              {status === 'success' && (
                <div style={{ padding: '1rem 1.25rem', backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#065f46' }}>
                  {d.form.status.success}
                </div>
              )}
              {status === 'error' && (
                <div style={{ padding: '1rem 1.25rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: '#991b1b' }}>
                  {d.form.status.error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">{d.form.labels.name}</label>
                    <input
                      type="text" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="form-input"
                      placeholder={d.form.placeholders.name}
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="form-label">{d.form.labels.email}</label>
                    <input
                      type="email" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="form-input"
                      placeholder={d.form.placeholders.email}
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">{d.form.labels.subject}</label>
                  <input
                    type="text" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="form-input"
                    placeholder={d.form.placeholders.subject}
                  />
                </div>

                <div>
                  <label className="form-label">{d.form.labels.message}</label>
                  <textarea
                    rows={6} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="form-textarea"
                    placeholder={d.form.placeholders.message}
                  />
                  {errors.message && <p className="form-error">{errors.message}</p>}
                </div>

                <div>
                  <button type="submit" className="btn-primary" disabled={status === 'sending'} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', opacity: status === 'sending' ? 0.6 : 1 }}>
                    <Send size={14} />
                    {status === 'sending' ? d.form.status.sending : d.form.labels.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK CONTACT (WhatsApp / Viber / Teams) ── */}
      <section style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{d.quickContactSection.eyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', margin: 0 }}>
              {d.quickContactSection.title}
            </h2>
          </div>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
            {d.quickContactSection.note}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', maxWidth: '900px', margin: '0 auto' }}>
            {quickContactCards.map((card, i) => (
              <a
                key={i}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: 'var(--color-surface)', padding: '2.5rem 2rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}
              >
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--color-teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <card.Icon size={20} style={{ color: 'var(--color-teal)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', marginTop: 0, color: 'var(--color-text)' }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  {card.description}
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-teal)' }}>
                  {card.action} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '6rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{d.faqSection.eyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', margin: 0 }}>
              {d.faqSection.title}
            </h2>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {d.faq.map((item, i) => (
              <div key={i} style={{ paddingBottom: '1.75rem', marginBottom: '1.75rem', borderBottom: i < d.faq.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.15rem', margin: '0 0 0.5rem' }}>
                  {item.question}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEACHING AREAS ── */}
      <section style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{d.teachingAreasSection.eyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', margin: '0 0 0.75rem' }}>
              {d.teachingAreasSection.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              {d.teachingAreasSection.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
            {d.teachingAreas.map((area, i) => (
              <span key={i} style={{
                padding: '0.4rem 1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '9999px',
              }}>
                {area}
              </span>
            ))}
          </div>

          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-teal)', textAlign: 'center', marginBottom: '1.25rem' }}>
              {d.teachingAreasSection.infoTitle}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {d.teachingAreasInfo.map((info, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--color-teal)', flexShrink: 0 }}>-</span>
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── ONLINE PRESENCE ── */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '5rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '2rem' }}>{d.onlinePresenceSection.eyebrow}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {d.externalLinks.map((link, i) => (
              <a
                key={i}
                href={EXTERNAL_LINKS[link.key]}
                target="_blank"
                rel="noopener noreferrer"
                title={link.desc}
                style={{
                  padding: '0.6rem 1.25rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-teal)'; e.currentTarget.style.color = 'var(--color-teal)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text)'; }}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;