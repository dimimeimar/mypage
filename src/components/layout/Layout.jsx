import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../common/Navigation.jsx';
import Footer from '../common/Footer.jsx';
import ThemeSwitcher from '../common/ThemeSwitcher.jsx';
import Backdrop from '../fx/Backdrop.jsx';
import MatrixBoot from '../fx/MatrixBoot.jsx';
import { ScrollProgress, CursorGlow } from '../fx/Chrome.jsx';
import { useAutoReveal } from '../../hooks/useAutoReveal';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  useAutoReveal(mainRef, pathname);

  return (
    <div className="app-shell">
      <Backdrop />
      <CursorGlow />
      <ScrollProgress />
      <Navigation />
      {/* key: κάθε αλλαγή σελίδας ξαναπαίζει το animation εισόδου */}
      <main ref={mainRef} key={pathname} className="page-enter">
        {children}
      </main>
      <Footer />
      <ThemeSwitcher />
      <MatrixBoot />
    </div>
  );
};

export default Layout;
