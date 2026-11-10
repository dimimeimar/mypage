import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import Decode from '../fx/Decode';

/* Κοινό "κλείσιμο" κάθε σελίδας: τίτλος, προαιρετικός υπότιτλος, κουμπί προς Επικοινωνία. */
const CtaBand = ({ title, subtitle, button, to = ROUTES.CONTACT }) => {
  const navigate = useNavigate();
  return (
    <section className="cta-band">
      <div className="container">
        <div className="cta-band__panel">
          <Decode as="h2" className="cta-band__title" text={title} />
          {subtitle && <p className="cta-band__sub">{subtitle}</p>}
          <button className="btn-primary" onClick={() => navigate(to)}>
            {button} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CtaBand;
