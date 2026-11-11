import { useLocation } from 'react-router-dom';
import Navigation from '../common/Navigation.jsx';
import Footer from '../common/Footer.jsx';
import ThemeSwitcher from '../common/ThemeSwitcher.jsx';
import Backdrop from '../fx/Backdrop.jsx';
import MatrixBoot from '../fx/MatrixBoot.jsx';

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <Backdrop />
      <Navigation />
      {/* key: κάθε αλλαγή σελίδας ξαναπαίζει το animation εισόδου */}
      <main key={pathname} className="page-enter">
        {children}
      </main>
      <Footer />
      <ThemeSwitcher />
      <MatrixBoot />
    </div>
  );
};

export default Layout;
