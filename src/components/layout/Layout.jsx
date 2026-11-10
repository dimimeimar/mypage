import Navigation from '../common/Navigation.jsx';
import Footer from '../common/Footer.jsx';
import ThemeSwitcher from '../common/ThemeSwitcher.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ThemeSwitcher />
    </div>
  );
};

export default Layout;