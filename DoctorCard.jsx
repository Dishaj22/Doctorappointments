
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";

export default function DoctorCard({ doctor }) {
  return (
    <article className="doctor-card">
      <img
        className="doctor-image"
        src={doctor.image || doctor.avatar || "https://placehold.co/300x220?text=Doctor"}
        alt={doctor.name}
      />

      <div className="doctor-card-content">
        <span className="specialty">{doctor.specialty}</span>

        <h3>{doctor.name}</h3>
        <p>{doctor.qualification}</p>

        <p className="doctor-meta">
          <Star size={16} /> {doctor.rating || "New"}
          <span>•</span>
          {doctor.experience || 0} years experience
        </p>

        <p className="doctor-meta">
          <MapPin size={16} /> {doctor.address || "Clinic details available"}
        </p>

        <div className="doctor-card-footer">
          <strong>₹{doctor.fee}</strong>
          <Link className="button button-small" to={`/doctor/${doctor.id}`}>
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
