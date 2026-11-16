import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../common/Navigation.jsx';
import Footer from '../common/Footer.jsx';
import ThemeSwitcher from '../common/ThemeSwitcher.jsx';
import Backdrop from '../fx/Backdrop.jsx';
import MatrixBoot from '../fx/MatrixBoot.jsx';

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  // Κάθε νέα σελίδα ξεκινάει από την κορυφή - πριν το paint, ώστε να μη φαίνεται "πήδημα"
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      <Backdrop />
      <Navigation />
      <main>
        {children}
      </main>
      <Footer />
      <ThemeSwitcher />
      <MatrixBoot />
    </div>
  );
};

export default Layout;
