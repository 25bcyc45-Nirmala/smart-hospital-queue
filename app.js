const form = document.getElementById("patientForm");
const queueList = document.getElementById("queueList");
const clearQueueBtn = document.getElementById("clearQueue");

const API_URL = window.API_URL ||"http://localhost:3000";

// Generate Token
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const dept = document.getElementById("department").value;
  const emergency = document.getElementById("emergency").checked;

  const res = await fetch(`${API_URL}/get-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, department: dept, emergency })
  });

  const data = await res.json();
  form.reset();
  loadQueue();
});

// Load Queue
async function loadQueue() {
  const res = await fetch(`${API_URL}/queue`);
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
  await fetch(`${API_URL}/clear`, { method: "POST" });
  loadQueue();
});

// Auto refresh every 3 seconds
setInterval(loadQueue, 3000);
loadQueue();