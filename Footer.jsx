
import { Link } from "react-router-dom";
import { HeartPulse, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Link to="/" className="brand footer-brand">
            <HeartPulse size={27} />
            CarePoint
          </Link>

          <p>
            Making healthcare easier by helping you find specialists
            and manage your appointments in one place.
          </p>
        </div>

        <div>
          <h3>Quick links</h3>
          <Link to="/">Home</Link>
          <Link to="/appointments">My appointments</Link>
          <Link to="/admin">Admin panel</Link>
        </div>

        <div>
          <h3>Our services</h3>
          <a href="/#doctors">Find a doctor</a>
          <a href="/#doctors">Explore specialties</a>
          <Link to="/appointments">Appointment management</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p><Mail size={16} /> support@carepoint.example</p>
          <p><Phone size={16} /> Add your clinic phone</p>
          <p><MapPin size={16} /> Add your clinic address</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} CarePoint. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
