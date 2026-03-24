// ======== app.js ========

// Set the live backend URL
const API_URL = "https://smart-hospital-queue-lb5m-git-main-25bcyc45-nirmalas-projects.vercel.app";

const form = document.getElementById("patientForm");
const queueList = document.getElementById("queueList");
const clearQueueBtn = document.getElementById("clearQueue");

// Generate Token
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const dept = document.getElementById("department").value;
  const emergency = document.getElementById("emergency").checked;

  try {
    const res = await fetch(`${API_URL}/get-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, department: dept, emergency })
    });

    if (!res.ok) throw new Error("Failed to generate token");

    const data = await res.json();
    form.reset();
    loadQueue();
  } catch (error) {
    alert("Error generating token: " + error.message);
    console.error(error);
  }
});

// Load Queue
async function loadQueue() {
  try {
    const res = await fetch(`${API_URL}/queue`);
    if (!res.ok) throw new Error("Failed to load queue");

    const data = await res.json();
    queueList.innerHTML = "";
    let emergencyCount = 0;

    data.forEach(p => {
      if (p.emergency) emergencyCount++;
      const li = document.createElement("li");
      li.textContent = `Token ${p.token} - ${p.name} (${p.department}) ${p.emergency ? "🚨" : ""}`;
      queueList.appendChild(li);
    });

    animateValue("total", data.length);
    animateValue("emergencyCount", emergencyCount);
  } catch (error) {
    console.error("Error loading queue:", error);
  }
}

// Animated Counters
function animateValue(id, value) {
  let i = 0;
  const interval = setInterval(() => {
    document.getElementById(id).innerText = i;
    i++;
    if (i > value) clearInterval(interval);
  }, 30);
}

// Clear Queue
clearQueueBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_URL}/clear`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Failed to clear queue");

    // Reload the updated queue
    loadQueue();
  } catch (error) {
    console.error("Error clearing queue:", error);
    alert("Failed to clear queue. Check backend connection.");
  }
});


// Auto refresh every 3 seconds
setInterval(loadQueue, 3000);
loadQueue();