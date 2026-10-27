import { Link, NavLink } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <HeartPulse size={32} />
        <span>Doctor Appointment Booking</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/appointments">
          My Appointments
        </NavLink>

        <NavLink to="/admin">
          Admin
        </NavLink>

        <NavLink to="/login">Login</NavLink>

        <NavLink to="/signup" className="signup-link">
          Sign Up
        </NavLink>
      </nav>
    </header>
  );
}
