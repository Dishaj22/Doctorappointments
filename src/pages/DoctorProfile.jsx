
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Clock,
  CalendarDays,
  GraduationCap,
  IndianRupee,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getDoctorById } from "../services/api";

export default function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctor() {
      try {
        setLoading(true);
        setError("");
        setDoctor(null);

        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setError(err.message || "Unable to load doctor details.");
      } finally {
        setLoading(false);
      }
    }

    loadDoctor();
  }, [id]);

  if (loading) {
    return (
      <main className="container section doctor-profile-page">
        <div className="profile-message">
          <span className="profile-loading-icon">
            <Clock size={26} />
          </span>
          <h2>Loading doctor profile...</h2>
          <p>Please wait while we fetch the details.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container section doctor-profile-page">
        <div className="profile-message">
          <h2>Unable to load doctor</h2>
          <p className="error-message">{error}</p>
          <Link to="/" className="profile-back-button">
            <ArrowLeft size={17} />
            Back to doctors
          </Link>
        </div>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="container section doctor-profile-page">
        <div className="profile-message">
          <h2>Doctor not found</h2>
          <p>This doctor profile may no longer be available.</p>
          <Link to="/" className="profile-back-button">
            <ArrowLeft size={17} />
            Back to doctors
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="doctor-profile-page">
      <div className="doctor-profile-container">
        <Link to="/" className="profile-back-button">
          <ArrowLeft size={17} />
          Back to doctors
        </Link>

        <section className="doctor-profile-card">
          <div className="doctor-profile-grid">
            <div className="doctor-profile-left">
              <div className="doctor-profile-photo">
                <img
                  src={
                    doctor.image ||
                    doctor.avatar ||
                    "https://placehold.co/500x600?text=Doctor"
                  }
                  alt={doctor.name || "Doctor"}
                />

                <div className="profile-photo-caption">
                  <ShieldCheck size={19} />
                  <span>Doctor profile</span>
                </div>
              </div>

              <div className="profile-trust-note">
                <ShieldCheck size={21} />
                <div>
                  <strong>Your health comes first</strong>
                  <p>Explore doctor details before booking.</p>
                </div>
              </div>
            </div>

            <div className="doctor-profile-info">
              <span className="profile-specialty">
                {doctor.specialty || "Medical Specialist"}
              </span>

              <h1>{doctor.name || "Doctor Name"}</h1>

              <p className="profile-qualification">
                <GraduationCap size={21} />
                <span>
                  {doctor.qualification || "Qualification not added"}
                </span>
              </p>

              <div className="profile-rating">
                <Star size={18} fill="currentColor" />
                <strong>{doctor.rating ?? "N/A"}</strong>
                <span>Doctor rating</span>
              </div>

              <div className="profile-details">
                <div className="profile-detail">
                  <span className="profile-detail-icon">
                    <MapPin size={21} />
                  </span>
                  <div>
                    <span className="profile-detail-label">
                      Clinic location
                    </span>
                    <p>
                      {doctor.address || "Clinic address not added"}
                    </p>
                  </div>
                </div>

                <div className="profile-detail">
                  <span className="profile-detail-icon">
                    <Clock size={21} />
                  </span>
                  <div>
                    <span className="profile-detail-label">
                      Experience
                    </span>
                    <p>
                      {doctor.experience ?? 0} years of experience
                    </p>
                  </div>
                </div>

                <div className="profile-detail profile-detail-wide">
                  <span className="profile-detail-icon">
                    <CalendarDays size={21} />
                  </span>
                  <div>
                    <span className="profile-detail-label">
                      Availability
                    </span>
                    <p>
                      {doctor.days || "Schedule not added"}
                    </p>
                    <p className="profile-detail-subtext">
                      {doctor.hours || "Timings not added"}
                    </p>
                  </div>
                </div>

                <div className="profile-fee-card">
                  <div>
                    <span>Consultation fee</span>
                    <strong>
                      <IndianRupee size={23} />
                      {doctor.fee ?? "N/A"}
                    </strong>
                  </div>
                  <span className="fee-label">Per consultation</span>
                </div>
              </div>

              <div className="profile-about">
                <h2>About the Doctor</h2>
                <p>
                  {doctor.bio ||
                    "Doctor biography has not been added yet."}
                </p>
              </div>

              <Link
                to={`/book/${encodeURIComponent(String(doctor.id))}`}
                className="profile-book-btn"
                state={{ doctorId: String(doctor.id) }}
              >
                Book an Appointment
                <ArrowRight size={19} />
              </Link>

              <p className="profile-book-note">
                Choose your preferred date and available time slot.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
