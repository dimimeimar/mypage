import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { ROUTES } from '../../constants/routes';
import PageHero from '../common/PageHero';
import '../../styles/admin.css';

const TEXT = {
  el: {
    title: 'Σύνδεση',
    subtitle: 'Για μαθητές με δικαίωμα άμεσης κράτησης και για τη διαχείριση.',
    body: 'Η σύνδεση δεν είναι απαραίτητη για να κλείσετε μάθημα. Χρειάζεται μόνο αν σας έχω δώσει δικαίωμα άμεσης κράτησης.',
    button: 'Σύνδεση με Google',
    working: 'Μεταφορά στο Google...',
    signedAs: 'Συνδεδεμένος ως',
    signOut: 'Αποσύνδεση',
    goCalendar: 'Μετάβαση στο ημερολόγιο',
    goAdmin: 'Μετάβαση στη διαχείριση',
    error: 'Η σύνδεση δεν ολοκληρώθηκε. Δοκιμάστε ξανά.',
  },
  en: {
    title: 'Sign in',
    subtitle: 'For students with direct booking access, and for administration.',
    body: 'You do not need to sign in to request a lesson. It is only needed if I have given you direct booking access.',
    button: 'Sign in with Google',
    working: 'Redirecting to Google...',
    signedAs: 'Signed in as',
    signOut: 'Sign out',
    goCalendar: 'Go to the calendar',
    goAdmin: 'Go to administration',
    error: 'Sign-in did not complete. Please try again.',
  },
};

const LoginPage = () => {
  const { language } = useTranslation();
  const t = TEXT[language] || TEXT.el;
  const { ready, user, isAdmin, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  // Μόλις ολοκληρωθεί η σύνδεση, πάμε κατευθείαν εκεί που χρειάζεται ο χρήστης
  useEffect(() => {
    if (ready && user) navigate(isAdmin ? ROUTES.ADMIN : ROUTES.CALENDAR, { replace: true });
  }, [ready, user, isAdmin, navigate]);

  const onSignIn = async () => {
    setBusy(true);
    setFailed(false);
    try {
      await signIn();
    } catch {
      setBusy(false);
      setFailed(true);
    }
  };

  return (
    <div>
      <Helmet>
        <title>{t.title}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <PageHero compact title={t.title} subtitle={t.subtitle} />
      <section className="band">
        <div className="container">
          <div className="auth-card">
            <p>{t.body}</p>
            {user ? (
              <>
                <p className="auth-card__who">{t.signedAs} {user.email}</p>
                <div className="auth-card__row">
                  <button type="button" className="btn-primary" onClick={() => navigate(isAdmin ? ROUTES.ADMIN : ROUTES.CALENDAR)}>
                    {isAdmin ? t.goAdmin : t.goCalendar}
                  </button>
                  <button type="button" className="btn-outline" onClick={signOut}>{t.signOut}</button>
                </div>
              </>
            ) : (
              <button type="button" className="btn-primary" onClick={onSignIn} disabled={busy}>
                {busy ? t.working : t.button}
              </button>
            )}
            {failed && <p className="auth-card__err">{t.error}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
