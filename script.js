// Auto-fill event name when Apply button is clicked
document.querySelectorAll('[data-bs-target="#applyModal"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const button = e.currentTarget;               // the button actually clicked
    const eventCard = button.closest('.card');    // may be null
    let eventName = '';

    if (eventCard) {
      const titleEl = eventCard.querySelector('.card-title');
      eventName = titleEl ? titleEl.textContent.trim() : '';
    } else {
      // fallback: prefer a data-event attribute, otherwise use button text
      eventName = button.dataset.event || button.getAttribute('data-event') || button.textContent.trim();
      // if button text includes icons or extra text, you might want to clean it further
    }

    // fill modal input and title (if present)
    const eventInput = document.querySelector('#event');
    if (eventInput) {
      eventInput.value = eventName;
      eventInput.readOnly = true; // keep it readonly if you don't want manual edits
    }

    const modalTitle = document.querySelector('#applyModalLabel');
    if (modalTitle) {
      modalTitle.textContent = eventName ? `Registering for: ${eventName}` : 'Event Registration';
    }
  });
});


// Handle form submission and store data in localStorage
document.getElementById('eventForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const eventName = document.getElementById('event').value.trim();

  if (!name || !email) {
    alert("Please fill out all fields!");
    return;
  }

  const entry = { name, email, eventName, time: new Date().toLocaleString() };

  // Fetch existing data or create empty array
  const data = JSON.parse(localStorage.getItem('registrations')) || [];
  data.push(entry);
  localStorage.setItem('registrations', JSON.stringify(data));

  // Reset form & close modal
  e.target.reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById('applyModal'));
  modal.hide();

  alert(`Registration successful for ${eventName}! 🎉`);
  loadRegistrations(); // Refresh table after new entry
});
// 🔹 Preload dummy data if localStorage is empty
function preloadDummyData() {
  const existing = JSON.parse(localStorage.getItem('registrations'));
  if (!existing || existing.length === 0) {
    const dummyData = [
      { name: "Aarav Patel", email: "aarav@example.com", eventName: "Dance Battle", time: "2025-11-08 10:30 AM" },
      { name: "Riya Sharma", email: "riya@example.com", eventName: "CodeSprint", time: "2025-11-08 10:45 AM" },
      { name: "Neha Mehta", email: "neha@example.com", eventName: "Drama Fiesta", time: "2025-11-08 11:00 AM" },
      { name: "Aditya Verma", email: "aditya@example.com", eventName: "Music Mania", time: "2025-11-08 11:15 AM" },
      { name: "Priya Singh", email: "priya@example.com", eventName: "Fine Art Expo", time: "2025-11-08 11:30 AM" }
    ];
    localStorage.setItem('registrations', JSON.stringify(dummyData));
  }
}

// 🔹 Display data from localStorage in the table
function loadRegistrations() {
  const tableBody = document.querySelector('#userTable tbody');
  const data = JSON.parse(localStorage.getItem('registrations')) || [];

  tableBody.innerHTML = ''; // Clear old rows

  data.forEach((entry, index) => {
    const row = `
      <tr>
        <th scope="row">${index + 1}</th>
        <td>${entry.name}</td>
        <td>${entry.email}</td>
        <td>${entry.eventName}</td>
        <td>${entry.time}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
  });
}

// 🔹 Clear all data button
document.getElementById('clearDataBtn').addEventListener('click', () => {
  if (confirm("Are you sure you want to clear all registrations?")) {
    localStorage.removeItem('registrations');
    loadRegistrations();
  }
});

// 🔹 Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  preloadDummyData();
  loadRegistrations();

  // Show the new info modal on page load
  const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
  infoModal.show();
});
