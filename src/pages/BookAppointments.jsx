import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoctorById,
  createAppointment,
} from "../services/api";

const timeSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
];

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(false);
  const [pageError, setPageError] = useState("");

  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    reason: "",
  });

  useEffect(() => {
    async function loadDoctor() {
      try {
        setPageError("");
        setDoctor(null);

        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setPageError(
          err.message || "Could not load doctor details."
        );
      }
    }

    loadDoctor();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleReview(event) {
    event.preventDefault();
    setPageError("");

    if (!doctor) {
      setPageError("Doctor details are not available.");
      return;
    }

    if (!date || !slot) {
      setPageError(
        "Please select an appointment date and time."
      );
      return;
    }

    setReview(true);
    window.scrollTo(0, 0);
  }

  async function handleConfirm() {
    if (loading) return;

    setPageError("");
    setLoading(true);

    try {
      // Create the appointment
      const appointment = await createAppointment({
        doctorId: String(doctor.id),
        doctorName: doctor.name,
        ...form,
        age: Number(form.age),
        date,
        slot,
        status: "Confirmed",
      });

      // Open My Appointments
      navigate("/appointments", {
        state: { newAppointment: appointment },
      });
    } catch (err) {
      setPageError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!doctor && !pageError) {
    return (
      <main className="container section">
        Loading doctor details...
      </main>
    );
  }

  if (!doctor && pageError) {
    return (
      <main className="container section">
        <p className="error-message">{pageError}</p>
      </main>
    );
  }

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <main className="container section">
      <div className="form-container">
        <span className="eyebrow">YOUR HEALTH MATTERS</span>

        <h1>
          {review
            ? "Review Your Appointment"
            : "Book an Appointment"}
        </h1>

        <p>
          Appointment with <strong>{doctor.name}</strong>
          {" · "}₹{doctor.fee}
        </p>

        {review ? (
          <section className="appointment-form">
            <h3>Doctor details</h3>

            <p>
              <strong>Doctor:</strong> {doctor.name}
            </p>

            <p>
              <strong>Specialty:</strong>{" "}
              {doctor.specialty || "Not provided"}
            </p>

            <p>
              <strong>Consultation fee:</strong> ₹{doctor.fee}
            </p>

            <h3>Appointment details</h3>

            <p>
              <strong>Date:</strong> {date}
            </p>

            <p>
              <strong>Time:</strong> {slot}
            </p>

            <h3>Patient details</h3>

            <p>
              <strong>Name:</strong> {form.patientName}
            </p>

            <p>
              <strong>Age:</strong> {form.age}
            </p>

            <p>
              <strong>Gender:</strong> {form.gender}
            </p>

            <p>
              <strong>Phone:</strong> {form.phone}
            </p>

            <p>
              <strong>Email:</strong> {form.email}
            </p>

            <p>
              <strong>Reason for visit:</strong> {form.reason}
            </p>

            <p className="notice">
              Please check all details before confirming
              your appointment.
            </p>

            {pageError && (
              <p className="error-message" role="alert">
                {pageError}
              </p>
            )}

            <div className="form-row">
              <button
                type="button"
                className="button"
                onClick={() => {
                  setReview(false);
                  setPageError("");
                }}
                disabled={loading}
              >
                Go Back to Edit
              </button>

              <button
                type="button"
                className="button button-full"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading
                  ? "Booking..."
                  : "Confirm Appointment"}
              </button>
            </div>
          </section>
        ) : (
          <form
            className="appointment-form"
            onSubmit={handleReview}
          >
            <h3>Patient details</h3>

            <label>
              Full name
              <input
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                required
                placeholder="Enter patient name"
              />
            </label>

            <div className="form-row">
              <label>
                Age
                <input
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Gender
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Phone
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone number"
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email address"
                />
              </label>
            </div>

            <label>
              Reason for visit
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                placeholder="Briefly describe the reason for your visit"
                rows="3"
              />
            </label>

            <h3>Select date and time</h3>

            <label>
              Appointment date
              <input
                type="date"
                min={today}
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setSlot("");
                  setPageError("");
                }}
                required
              />
            </label>

            <div className="slot-grid">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`slot-button ${
                    slot === time ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSlot(time);
                    setPageError("");
                  }}
                  aria-pressed={slot === time}
                >
                  {time}
                </button>
              ))}
            </div>

            {pageError && (
              <p className="error-message" role="alert">
                {pageError}
              </p>
            )}

            <button
              className="button button-full"
              type="submit"
            >
              Review Appointment
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
