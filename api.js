
const API_URL =
  "https://6ad8ad59f89c5702ed99f40b.mockapi.io/api/v1";

// Get all doctors
export async function getDoctors() {
  const response = await fetch(`${API_URL}/doctorappointment`);

  if (!response.ok) {
    throw new Error(
      `Doctors API error (${response.status}). Check doctorappointment resource.`
    );
  }

  return response.json();
}

// Get one doctor by ID
export async function getDoctorById(id) {
  const response = await fetch(
    `${API_URL}/doctorappointment/${id}`
  );

  if (!response.ok) {
    throw new Error(
      `Doctor API error (${response.status}). Check doctor ID and resource.`
    );
  }

  return response.json();
}

// Get all appointments
export async function getAppointments() {
  const response = await fetch(`${API_URL}/appointments`);

  if (!response.ok) {
    throw new Error(
      `Appointments API error (${response.status}). Check appointments resource.`
    );
  }

  return response.json();
}

// Create a new appointment
export async function createAppointment(appointment) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });

  if (!response.ok) {
    throw new Error(`Booking API error: ${response.status}`);
  }

  return response.json();
}

// Update an appointment
export async function updateAppointment(id, updates) {
  const response = await fetch(`${API_URL}/appointments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Update API error: ${response.status}`);
  }

  return response.json();
}