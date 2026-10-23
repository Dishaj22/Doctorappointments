import { useEffect, useState } from "react";
import {
  getAppointments,
  updateAppointment,
} from "../services/api";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Load appointments from MockAPI
  async function loadAppointments() {
    setLoading(true);
    setError("");

    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Could not load appointments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  // Update appointment status
  async function changeStatus(id, status) {
    setError("");
    setSuccessMessage("");
    setBusyId(id);

    try {
      const updated = await updateAppointment(id, { status });

      setAppointments((previous) =>
        previous.map((appointment) =>
          String(appointment.id) === String(id)
            ? { ...appointment, ...updated, status }
            : appointment
        )
      );

      setSuccessMessage(
        `Appointment #${id} status updated to ${status}.`
      );
    } catch (err) {
      setError(err.message || "Could not update appointment status.");
    } finally {
      setBusyId(null);
    }
  }

  // Dashboard statistics
  const totalAppointments = appointments.length;

  const confirmedCount = appointments.filter(
    (item) => item.status === "Confirmed"
  ).length;

  const completedCount = appointments.filter(
    (item) => item.status === "Completed"
  ).length;

  const cancelledCount = appointments.filter(
    (item) => item.status === "Cancelled"
  ).length;

  // Search and filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(appointment.id || "").toLowerCase().includes(searchText) ||
      (appointment.patientName || "").toLowerCase().includes(searchText) ||
      (appointment.doctorName || "").toLowerCase().includes(searchText) ||
      (appointment.phone || "").toLowerCase().includes(searchText);

    const status = appointment.status || "Pending";

    const matchesFilter =
      filter === "All" || status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="container section">
      <span className="eyebrow">MANAGEMENT</span>

      <h1>Admin Dashboard</h1>

      <p>Review appointments and manage their status.</p>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span>Total Appointments</span>
          <h2>{totalAppointments}</h2>
        </div>

        <div className="stat-card">
          <span>Confirmed</span>
          <h2>{confirmedCount}</h2>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <h2>{completedCount}</h2>
        </div>

        <div className="stat-card">
          <span>Cancelled</span>
          <h2>{cancelledCount}</h2>
        </div>
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="notice" role="status">
          {successMessage}
        </p>
      )}

      <div className="form-row">
        <label>
          Search appointments
          <input
            type="search"
            placeholder="Search by patient, doctor, ID or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          Filter by status
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All Appointments</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>

        <button
          type="button"
          className="button"
          onClick={loadAppointments}
          disabled={loading || busyId !== null}
        >
          {loading ? "Loading..." : "Refresh Appointments"}
        </button>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : filteredAppointments.length === 0 ? (
        <p className="notice">
          No appointments found. Try another search or filter.
        </p>
      ) : (
        <div className="admin-list">
          {filteredAppointments.map((appointment) => {
            const status = appointment.status || "Pending";
            const isBusy =
              String(busyId) === String(appointment.id);

            return (
              <article
                className="appointment-card"
                key={appointment.id}
              >
                <div className="appointment-header">
                  <div>
                    <span className="specialty">
                      Appointment #{appointment.id}
                    </span>

                    <h3>
                      {appointment.patientName || "Patient"}
                    </h3>
                  </div>

                  <span className="appointment-status">
                    {status}
                  </span>
                </div>

                <p>
                  <strong>Doctor:</strong>{" "}
                  {appointment.doctorName || "Not provided"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {appointment.date || "Not provided"}
                </p>

                <p>
                  <strong>Time:</strong>{" "}
                  {appointment.slot || "Not provided"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {appointment.phone || "Not provided"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {appointment.email || "Not provided"}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {appointment.reason || "Not provided"}
                </p>

                <label>
                  Update appointment status
                  <select
                    value={status}
                    disabled={isBusy || busyId !== null}
                    onChange={(event) =>
                      changeStatus(
                        appointment.id,
                        event.target.value
                      )
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </label>

                {isBusy && <p>Updating status...</p>}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}