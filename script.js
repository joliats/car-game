const photoContainer = document.getElementById("car-photo");
const feedback = document.getElementById("feedback");
const savedAnswers = document.getElementById("saved-answers");

const guessMakeInput = document.getElementById("guess-make");
const guessModelInput = document.getElementById("guess-model");
const guessTrimInput = document.getElementById("guess-trim");
const guessYearInput = document.getElementById("guess-year");
const submitButton = document.getElementById("submit-guess");
const archiveButton = document.getElementById("archive-button");
const archiveModal = document.getElementById("archive-modal");
const calendar = document.getElementById("calendar");
const closeArchive = document.getElementById("close-archive");

let carsData = {};
let currentCar = {};
let currentPhotoIndex = 0;
let correctGuesses = { make: false, model: false, trim: false, year: false };

// Fetch car data
async function fetchCars() {
  const response = await fetch("cars.json");
  carsData = await response.json();
  loadDailyCar();
}

// Load today's car
function loadDailyCar() {
  const today = new Date().toISOString().split("T")[0];
  currentCar = carsData[today];
  loadPhoto();
}

// Load photos
function loadPhoto() {
  if (currentPhotoIndex >= currentCar.photos.length) {
    feedback.textContent = `Game over! The car is a ${currentCar.make} ${currentCar.model} ${currentCar.trim} (${currentCar.year}).`;
    return;
  }
  photoContainer.src = currentCar.photos[currentPhotoIndex];
}

// Check guess
function checkGuess() {
  const guessMake = guessMakeInput.value.trim().toLowerCase();
  const guessModel = guessModelInput.value.trim().toLowerCase();
  const guessTrim = guessTrimInput.value.trim().toLowerCase();
  const guessYear = parseInt(guessYearInput.value.trim());

  if (!correctGuesses.make && guessMake === currentCar.make.toLowerCase()) correctGuesses.make = true;
  if (!correctGuesses.model && guessModel === currentCar.model.toLowerCase()) correctGuesses.model = true;
  if (!correctGuesses.trim && guessTrim === currentCar.trim.toLowerCase()) correctGuesses.trim = true;
  if (!correctGuesses.year && guessYear === currentCar.year) correctGuesses.year = true;

  updateSavedAnswers();

  if (Object.values(correctGuesses).every(Boolean)) {
    feedback.textContent = `Correct! It's a ${currentCar.make} ${currentCar.model} ${currentCar.trim} (${currentCar.year}).`;
  } else {
    currentPhotoIndex++;
    loadPhoto();
  }
}

// Update saved answers
function updateSavedAnswers() {
  savedAnswers.textContent = `Saved Answers: ${correctGuesses.make ? currentCar.make : "?"} ${correctGuesses.model ? currentCar.model : "?"} ${correctGuesses.trim ? currentCar.trim : "?"} (${correctGuesses.year ? currentCar.year : "?"})`;
}

// Populate calendar
function populateCalendar() {
  calendar.innerHTML = "";
  Object.keys(carsData).forEach((date) => {
    const dateDiv = document.createElement("div");
    dateDiv.textContent = date;
    dateDiv.addEventListener("click", () => {
      archiveModal.classList.add("hidden");
      loadArchivedCar(date);
    });
    calendar.appendChild(dateDiv);
  });
}

// Load archived car
function loadArchivedCar(date) {
  currentCar = carsData[date];
  currentPhotoIndex = 0;
  correctGuesses = { make: false, model: false, trim: false, year: false };
  updateSavedAnswers();
  loadPhoto();
}

// Open and close archive modal
archiveButton.addEventListener("click", () => {
  populateCalendar();
  archiveModal.classList.remove("hidden");
});

closeArchive.addEventListener("click", () => {
  archiveModal.classList.add("hidden");
});

// Initialize
fetchCars();
