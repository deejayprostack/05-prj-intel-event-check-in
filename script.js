// Intel Sustainability Summit Check-In App

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");
const attendeeList = document.getElementById("attendeeList");
const resetBtn = document.getElementById("resetBtn");

const maxAttendance = 5;

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

let count = 0;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = [];

// Load saved data from local storage
function loadFromStorage() {
  const savedCount = localStorage.getItem("attendanceCount");
  const savedTeams = localStorage.getItem("teamCounts");
  const savedAttendees = localStorage.getItem("attendees");

  if (savedCount !== null) {
    count = parseInt(savedCount, 10);
  }

  if (savedTeams !== null) {
    teamCounts = JSON.parse(savedTeams);
  }

  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
  }
}

// Save current counts and attendee list to local storage
function saveToStorage() {
  localStorage.setItem("attendanceCount", String(count));
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Update attendance total, team totals, and progress bar on the page
function updateDisplay() {
  attendeeCountSpan.textContent = String(count);
  waterCountSpan.textContent = String(teamCounts.water);
  zeroCountSpan.textContent = String(teamCounts.zero);
  powerCountSpan.textContent = String(teamCounts.power);

  const percentage = Math.min((count / maxAttendance) * 100, 100);
  progressBar.style.width = percentage + "%";
}

// Rebuild the attendee list under the team counters
function renderAttendeeList() {
  attendeeList.innerHTML = "";

  for (let i = 0; i < attendees.length; i++) {
    const person = attendees[i];
    const item = document.createElement("li");
    item.className = "attendee-item " + person.team;

    const nameSpan = document.createElement("span");
    nameSpan.className = "attendee-name";
    nameSpan.textContent = person.name;

    const teamSpan = document.createElement("span");
    teamSpan.className = "attendee-team";
    teamSpan.textContent = teamNames[person.team];

    item.appendChild(nameSpan);
    item.appendChild(teamSpan);
    attendeeList.appendChild(item);
  }
}

// Find which team has the most check-ins
function getWinningTeam() {
  let winningTeamKey = "water";
  let highest = teamCounts.water;

  if (teamCounts.zero > highest) {
    winningTeamKey = "zero";
    highest = teamCounts.zero;
  }

  if (teamCounts.power > highest) {
    winningTeamKey = "power";
  }

  return teamNames[winningTeamKey];
}

// Show a personalized greeting, or a celebration when the goal is hit
function showGreeting(name, teamKey) {
  greeting.className = "success-message";
  greeting.style.display = "block";

  if (count >= maxAttendance) {
    const winner = getWinningTeam();
    greeting.textContent =
      "🎉 Goal reached! " + winner + " has the most attendees!";
    greeting.classList.add("celebration-message");
  } else {
    greeting.textContent =
      "Welcome, " + name + " from " + teamNames[teamKey] + "!";
    greeting.classList.remove("celebration-message");
  }
}

// Handle check-in form submit
function handleCheckIn(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (name === "" || team === "") {
    return;
  }

  // Stop accepting check-ins after the goal is reached
  if (count >= maxAttendance) {
    showGreeting(name, team);
    return;
  }

  count = count + 1;
  teamCounts[team] = teamCounts[team] + 1;

  attendees.push({
    name: name,
    team: team,
  });

  updateDisplay();
  renderAttendeeList();
  showGreeting(name, team);
  saveToStorage();

  form.reset();
  nameInput.focus();
}

// Clear all counts, the attendee list, and saved data
function handleReset() {
  count = 0;
  teamCounts.water = 0;
  teamCounts.zero = 0;
  teamCounts.power = 0;
  attendees = [];

  localStorage.removeItem("attendanceCount");
  localStorage.removeItem("teamCounts");
  localStorage.removeItem("attendees");
  saveToStorage();

  greeting.style.display = "none";
  greeting.textContent = "";
  greeting.className = "";

  progressBar.style.width = "0%";
  attendeeCountSpan.textContent = "0";
  waterCountSpan.textContent = "0";
  zeroCountSpan.textContent = "0";
  powerCountSpan.textContent = "0";
  attendeeList.innerHTML = "";

  updateDisplay();
  renderAttendeeList();
  form.reset();
  nameInput.focus();
}

form.addEventListener("submit", handleCheckIn);

if (resetBtn) {
  resetBtn.addEventListener("click", handleReset);
}

// Restore saved progress when the page loads
loadFromStorage();
updateDisplay();
renderAttendeeList();
