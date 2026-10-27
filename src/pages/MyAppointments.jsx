
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getAppointments,
  updateAppointment,
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

export default function MyAppointments() {
  const location = useLocation();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filter, setFilter] = useState("All");

  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const newAppointment = location.state?.newAppointment;
  const today = new Date().toLocaleDateString("en-CA");

  // Load appointments from MockAPI
  async function loadAppointments() {
    setLoading(true);
    setPageError("");

    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      setPageError(
        error.message || "Could not load appointments."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  // Cancel appointment
  async function handleCancel(appointment) {
    if (
      appointment.status === "Cancelled" ||
      appointment.status === "Completed"
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel your appointment with ${
        appointment.doctorName || "this doctor"
      } on ${appointment.date} at ${appointment.slot}?`
    );

    if (!confirmed) return;

    setPageError("");
    setSuccessMessage("");
    setBusyId(appointment.id);

    try {
      const updated = await updateAppointment(
        appointment.id,
        { status: "Cancelled" }
      );

      setAppointments((previous) =>
        previous.map((item) =>
          String(item.id) === String(appointment.id)
            ? { ...item, ...updated, status: "Cancelled" }
            : item
        )
      );

      setSuccessMessage("Appointment cancelled successfully.");
      setRescheduleId(null);
    } catch (error) {
      setPageError(
        error.message || "Could not cancel the appointment."
      );
    } finally {
      setBusyId(null);
    }
  }

  // Delete appointment
  async function handleDelete(appointment) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete appointment ${
        appointment.id
      } with ${appointment.doctorName || "this doctor"}?`
    );

    if (!confirmed) return;

    setPageError("");
    setSuccessMessage("");
    setBusyId(appointment.id);

    try {
      const response = await fetch(
        `https://6ad8ad59f89c5702ed99f40b.mockapi.io/api/v1/appointments/${appointment.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Could not delete the appointment. Please try again.");
      }

      setAppointments((previous) =>
        previous.filter(
          (item) => String(item.id) !== String(appointment.id)
        )
      );

      setSuccessMessage("Appointment deleted successfully.");
      setRescheduleId(null);
    } catch (error) {
      setPageError(
        error.message || "Could not delete the appointment."
      );
    } finally {
      setBusyId(null);
    }
  }

  // Open the reschedule form
  function handleOpenReschedule(appointment) {
    setPageError("");
    setSuccessMessage("");
    setRescheduleId(appointment.id);
    setNewDate(appointment.date || "");
    setNewSlot(appointment.slot || "");
  }

  // Save the new date and time
  async function handleReschedule(appointment) {
    if (!newDate || !newSlot) {
      setPageError("Please select a new date and time.");
      return;
    }

    if (newDate < today) {
      setPageError("Please select today or a future date.");
      return;
    }

    if (
      newDate === appointment.date &&
      newSlot === appointment.slot
    ) {
      setPageError("Please select a different date or time.");
      return;
    }

    setPageError("");
    setSuccessMessage("");
    setBusyId(appointment.id);

    try {
      const updated = await updateAppointment(
        appointment.id,
        {
          date: newDate,
          slot: newSlot,
          status: "Confirmed",
        }
      );

      setAppointments((previous) =>
        previous.map((item) =>
          String(item.id) === String(appointment.id)
            ? { ...item, ...updated }
            : item
        )
      );

      setSuccessMessage("Appointment rescheduled successfully!");
      setRescheduleId(null);
      setNewDate("");
      setNewSlot("");
    } catch (error) {
      setPageError(
        error.message || "Could not reschedule the appointment."
      );
    } finally {
      setBusyId(null);
    }
  }

  // Filter appointments
  const filteredAppointments = appointments.filter(
    (appointment) => {
      if (filter === "All") return true;

      if (filter === "Upcoming") {
        return (
          appointment.date >= today &&
          appointment.status !== "Cancelled" &&
          appointment.status !== "Completed"
        );
      }

      if (filter === "Past") {
        return (
          appointment.date < today ||
          appointment.status === "Completed"
        );
      }

      if (filter === "Cancelled") {
        return appointment.status === "Cancelled";
      }

      return true;
    }
  );

  if (loading) {
    return (
      <main className="container section">
        <h1>My Appointments</h1>
        <p>Loading your appointments...</p>
      </main>
    );
  }

  return (
    <main className="container section">
      <div className="form-container">
        <span className="eyebrow">YOUR HEALTH MATTERS</span>
        <h1>My Appointments</h1>
        <p>View and manage your doctor appointments.</p>

        {newAppointment && (
          <div className="notice">
            <h3>Appointment booked successfully!</h3>
            <p>
              <strong>Appointment ID:</strong>{" "}
              {newAppointment.id}
            </p>
            <p>
              <strong>Doctor:</strong>{" "}
              {newAppointment.doctorName}
            </p>
            <p>
              <strong>Date:</strong> {newAppointment.date}
            </p>
            <p>
              <strong>Time:</strong> {newAppointment.slot}
            </p>

            <button
              type="button"
              className="button"
              onClick={() => window.print()}
            >
              Print Booking Summary
            </button>
          </div>
        )}

        {pageError && (
          <p className="error-message" role="alert">
            {pageError}
          </p>
        )}

        {successMessage && (
          <p className="notice" role="status">
            {successMessage}
          </p>
        )}

        <div className="form-row">
          <button
            type="button"
            className="button"
            onClick={() => window.print()}
          >
            Print / Save as PDF
          </button>

          <button
            type="button"
            className="button"
            onClick={loadAppointments}
            disabled={busyId !== null}
          >
            Refresh Appointments
          </button>
        </div>

        <div className="form-row">
          <label>
            Filter appointments
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All Appointments</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Past">Past / Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="notice">
            No appointments found in this category.
          </p>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => {
              const isCancelled =
                appointment.status === "Cancelled";

              const isCompleted =
                appointment.status === "Completed";

              const isBusy =
                String(busyId) === String(appointment.id);

              const isRescheduling =
                String(rescheduleId) === String(appointment.id);

              const canManage =
                !isCancelled &&
                !isCompleted &&
                appointment.date >= today;

              return (
                <article
                  className="appointment-card"
                  key={appointment.id}
                >
                  <div className="appointment-header">
                    <h3>
                      {appointment.doctorName ||
                        "Doctor appointment"}
                    </h3>

                    <span
                      className={`appointment-status ${
                        isCancelled
                          ? "status-cancelled"
                          : isCompleted
                          ? "status-completed"
                          : "status-confirmed"
                      }`}
                    >
                      {appointment.status || "Confirmed"}
                    </span>
                  </div>

                  <p>
                    <strong>Appointment ID:</strong>{" "}
                    {appointment.id}
                  </p>

                  <p>
                    <strong>Patient:</strong>{" "}
                    {appointment.patientName}
                  </p>

                  <p>
                    <strong>Date:</strong> {appointment.date}
                  </p>

                  <p>
                    <strong>Time:</strong> {appointment.slot}
                  </p>

                  <p>
                    <strong>Email:</strong> {appointment.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {appointment.phone}
                  </p>

                  {appointment.reason && (
                    <p>
                      <strong>Reason:</strong>{" "}
                      {appointment.reason}
                    </p>
                  )}

                  <div className="form-row appointment-actions">
                    {canManage && (
                      <>
                        <button
                          type="button"
                          className="button"
                          onClick={() =>
                            handleOpenReschedule(appointment)
                          }
                          disabled={busyId !== null}
                        >
                          Reschedule
                        </button>

                        <button
                          type="button"
                          className="button"
                          onClick={() => handleCancel(appointment)}
                          disabled={busyId !== null}
                        >
                          {isBusy
                            ? "Please wait..."
                            : "Cancel Appointment"}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(appointment)}
                      disabled={busyId !== null}
                    >
                      {isBusy ? "Please wait..." : "Delete"}
                    </button>
                  </div>

                  {isRescheduling && (
                    <form
                      className="appointment-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleReschedule(appointment);
                      }}
                    >
                      <h3>Reschedule Appointment</h3>

                      <label>
                        New date
                        <input
                          type="date"
                          min={today}
                          value={newDate}
                          onChange={(event) => {
                            setNewDate(event.target.value);
                            setPageError("");
                          }}
                          required
                        />
                      </label>

                      <label>
                        New time slot
                        <select
                          value={newSlot}
                          onChange={(event) => {
                            setNewSlot(event.target.value);
                            setPageError("");
                          }}
                          required
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </label>

                      <p className="notice">
                        Select a new date and time, then save your
                        changes. Slot availability is not checked
                        by this version.
                      </p>

                      <div className="form-row">
                        <button
                          type="submit"
                          className="button"
                          disabled={busyId !== null}
                        >
                          {isBusy ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          className="button"
                          disabled={busyId !== null}
                          onClick={() => {
                            setRescheduleId(null);
                            setNewDate("");
                            setNewSlot("");
                            setPageError("");
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  )}

                  {isCancelled && (
                    <p className="notice">
                      This appointment has been cancelled.
                    </p>
                  )}

                  {isCompleted && (
                    <p className="notice">
                      This appointment is completed.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
