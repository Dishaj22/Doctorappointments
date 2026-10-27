
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  HeartPulse,
  Brain,
  Baby,
  Smile,
  Stethoscope,
  ShieldCheck,
  CalendarCheck,
  Clock3,
  ArrowRight,
  Star,
  Users,
} from "lucide-react";

import { getDoctors } from "../services/api";
import DoctorCard from "../components/DoctorCard";

const specialtyOptions = [
  {
    name: "Cardiologist",
    description: "Heart and blood pressure care",
    icon: HeartPulse,
  },
  {
    name: "Dermatologist",
    description: "Skin, hair and nail care",
    icon: Smile,
  },
  {
    name: "Neurologist",
    description: "Brain and nervous system",
    icon: Brain,
  },
  {
    name: "Pediatrician",
    description: "Healthcare for children",
    icon: Baby,
  },
  {
    name: "Dentist",
    description: "Teeth and oral health",
    icon: Stethoscope,
  },
];

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await getDoctors();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load doctors.");
      } finally {
        setLoading(false);
      }
    }

    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchableText =
      `${doctor.name || ""} ${doctor.specialty || ""}`.toLowerCase();

    const matchesSearch = searchableText.includes(search.toLowerCase());

    const matchesSpecialty =
      !specialty ||
      doctor.specialty?.toLowerCase() === specialty.toLowerCase();

    return matchesSearch && matchesSpecialty;
  });

  function chooseSpecialty(name) {
    setSpecialty((current) => current === name ? "" : name);
    document.getElementById("doctors")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="eyebrow">
              YOUR HEALTH, OUR PRIORITY
            </span>

            <h1>
              Expert healthcare,
              <br />
              <span>just a click away.</span>
            </h1>

            <p>
              Find the right specialist, explore doctor profiles,
              and book your appointment with ease.
            </p>

            <div className="hero-actions">
              <a href="#doctors" className="button">
                Find a doctor <ArrowRight size={18} />
              </a>

              <Link to="/appointments" className="hero-secondary">
                My appointments
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong>Care you can trust</strong>
                <span>Simple and convenient booking</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              className="hero-doctor-image"
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85"
              alt="Doctor ready to help patients"
            />

            <div className="hero-floating-card">
              <div className="floating-icon">
                <CalendarCheck size={23} />
              </div>
              <div>
                <strong>Easy appointments</strong>
                <span>Book in a few simple steps</span>
              </div>
            </div>

            <div className="hero-image-label">
              <span className="online-dot" />
              Healthcare made simpler
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div>
          <ShieldCheck />
          <span>Trusted specialist profiles</span>
        </div>
        <div>
          <CalendarCheck />
          <span>Easy online booking</span>
        </div>
        <div>
          <Clock3 />
          <span>Convenient appointment slots</span>
        </div>
        <div>
          <Users />
          <span>Patient-first experience</span>
        </div>
      </section>

      <section className="specialties-section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CARE FOR EVERY NEED</span>
            <h2>Explore specialties</h2>
            <p>Choose the type of doctor you are looking for.</p>
          </div>
        </div>

        <div className="specialty-grid">
          {specialtyOptions.map((item) => {
            const Icon = item.icon;
            const selected = specialty === item.name;

            return (
              <button
                type="button"
                key={item.name}
                className={`specialty-card ${selected ? "selected" : ""}`}
                onClick={() => chooseSpecialty(item.name)}
              >
                <span className="specialty-icon">
                  <Icon size={25} />
                </span>

                <strong>{item.name}</strong>
                <span className="specialty-description">
                  {item.description}
                </span>

                <ArrowRight className="specialty-arrow" size={18} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="doctors-section" id="doctors">
        <div className="container section">
          <div className="section-heading doctors-heading">
            <div>
              <span className="eyebrow">MEET YOUR CARE TEAM</span>
              <h2>Find your doctor</h2>
              <p>
                Explore specialists and choose the right care for you.
              </p>
            </div>

            <span className="doctor-count">
              {filteredDoctors.length} doctors found
            </span>
          </div>

          <div className="doctor-search">
            <Search size={21} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by doctor name or specialty..."
              aria-label="Search doctors"
            />

            <select
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              aria-label="Filter by specialty"
            >
              <option value="">All specialties</option>
              {[
                ...new Set(
                  doctors
                    .map((doctor) => doctor.specialty)
                    .filter(Boolean)
                ),
              ].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {specialty && (
              <button
                className="clear-filter"
                onClick={() => setSpecialty("")}
                type="button"
              >
                Clear
              </button>
            )}
          </div>

          {loading && (
            <p className="loading-message">Finding the right doctors for you...</p>
          )}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && filteredDoctors.length === 0 && (
            <div className="empty-state">
              <Stethoscope size={36} />
              <h3>No doctors found</h3>
              <p>Try another name or specialty.</p>
              <button
                className="button"
                onClick={() => {
                  setSearch("");
                  setSpecialty("");
                }}
              >
                Show all doctors
              </button>
            </div>
          )}

          <div className="doctor-grid">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container why-layout">
          <div>
            <span className="eyebrow">WHY CAREPOINT?</span>
            <h2>Healthcare that puts you first.</h2>
            <p>
              From finding a specialist to reviewing your appointment,
              we make the booking journey easier.
            </p>
          </div>

          <div className="why-features">
            <article className="why-card">
              <ShieldCheck size={27} />
              <h3>Choose with confidence</h3>
              <p>Review each doctor's specialty, qualifications and experience.</p>
            </article>

            <article className="why-card">
              <CalendarCheck size={27} />
              <h3>Book with ease</h3>
              <p>Choose an available date and time before submitting your request.</p>
            </article>

            <article className="why-card">
              <Star size={27} />
              <h3>Compare your options</h3>
              <p>Check consultation fees and ratings when available.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="appointment-cta">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow">YOUR NEXT STEP TO BETTER CARE</span>
            <h2>Ready to book your appointment?</h2>
            <p>Explore our specialists and find a time that works for you.</p>
          </div>

          <a href="#doctors" className="button cta-button">
            Explore doctors <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
