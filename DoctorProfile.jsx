
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Clock,
  CalendarDays,
  GraduationCap,
  IndianRupee,
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
      <main className="container section">
        Loading doctor profile...
      </main>
    );
  }

  if (error) {
    return (
      <main className="container section">
        <p className="error-message">{error}</p>
        <Link to="/">Back to doctors</Link>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="container section">
        Doctor not found.
        <p>
          <Link to="/">Back to doctors</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container section">
      <Link to="/" className="back-link">
        ← Back to doctors
      </Link>

      <div className="profile-layout">
        <img
          className="doctor-image"
          src={
            doctor.image ||
            doctor.avatar ||
            "https://placehold.co/500x400?text=Doctor"
          }
          alt={doctor.name || "Doctor"}
        />

        <div className="profile-content">
          <span className="specialty">
            {doctor.specialty || "Medical Specialist"}
          </span>

          <h1>{doctor.name || "Doctor Name"}</h1>

          <p>
            <GraduationCap className="icon" />
            {doctor.qualification || "Qualification not added"}
          </p>

          <div className="profile-details">
            <div className="detail-item">
              <MapPin className="icon" />
              <span>
                {doctor.address || "Clinic address not added"}
              </span>
            </div>

            <div className="detail-item">
              <Star className="icon" />
              <span>{doctor.rating ?? "N/A"} rating</span>
            </div>

            <div className="detail-item">
              <Clock className="icon" />
              <span>
                {doctor.experience ?? 0} years of experience
              </span>
            </div>

            <div className="detail-item">
              <CalendarDays className="icon" />
              <span>
                {doctor.days || "Schedule not added"} |{" "}
                {doctor.hours || "Timings not added"}
              </span>
            </div>

            <div className="detail-item">
              <IndianRupee className="icon" />
              <span>
                Consultation fee: ₹{doctor.fee ?? "N/A"}
              </span>
            </div>
          </div>

          <h2>About the Doctor</h2>

          <p>
            {doctor.bio || "Doctor biography has not been added yet."}
          </p>

          <Link
            to={`/book/${encodeURIComponent(String(doctor.id))}`}
            className="btn-primary"
            state={{ doctorId: String(doctor.id) }}
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </main>
  );
}
