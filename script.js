const archiveButton = document.getElementById("archive-button");
const archiveModal = document.getElementById("archive-modal");
const closeArchive = document.getElementById("close-archive");
const archiveList = document.getElementById("archive-list");

let carsData = {};

// Fetch all cars for the game
async function fetchCars() {
  const response = await fetch("cars.json");
  carsData = await response.json();
  fetchDailyCar();
}

// Fetch the car of the day
function fetchDailyCar() {
  const today = new Date().toISOString().split("T")[0];
  currentCar = carsData[today];
  loadPhoto();
}

// Populate archive modal with available dates
function populateArchive() {
  archiveList.innerHTML = ""; // Clear existing list
  Object.keys(carsData).forEach((date) => {
    const listItem = document.createElement("li");
    listItem.textContent = date;
    listItem.addEventListener("click", () => {
      archiveModal.classList.add("hidden");
      loadArchivedCar(date);
    });
    archiveList.appendChild(listItem);
  });
}

// Load an archived game
function loadArchivedCar(date) {
  currentCar = carsData[date];
  currentPhotoIndex = 0;
  correctGuesses = { make: false, model: false, trim: false, year: false };
  updateSavedAnswers();
  loadPhoto();
}

// Open the archive modal
archiveButton.addEventListener("click", () => {
  populateArchive();
  archiveModal.classList.remove("hidden");
});

// Close the archive modal
closeArchive.addEventListener("click", () => {
  archiveModal.classList.add("hidden");
});

// Start the game
fetchCars();
