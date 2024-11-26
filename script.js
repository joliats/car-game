const photoContainer = document.getElementById("car-photo");
const feedback = document.getElementById("feedback");
const savedAnswers = document.getElementById("saved-answers");

const guessMakeInput = document.getElementById("guess-make");
const guessModelInput = document.getElementById("guess-model");
const guessTrimInput = document.getElementById("guess-trim");
const guessYearInput = document.getElementById("guess-year");
const submitButton = document.getElementById("submit-guess");
const guessContainer = document.getElementById("guess-container");

let currentCar = {};
let currentPhotoIndex = 0;
let correctGuesses = {
  make: false,
  model: false,
  trim: false,
  year: false,
};

// Fetch the car of the day
async function fetchDailyCar() {
  const today = new Date().toISOString().split("T")[0];
  const response = await fetch("cars.json");
  const cars = await response.json();
  currentCar = cars[today];
  loadPhoto();
}

// Load the next photo in sequence
function loadPhoto() {
  if (currentPhotoIndex >= currentCar.photos.length) {
    feedback.textContent = `Game over! The car is a ${currentCar.make} ${currentCar.model} ${currentCar.trim} (${currentCar.year}).`;
    submitButton.disabled = true;
    return;
  }

  photoContainer.src = currentCar.photos[currentPhotoIndex];
  feedback.textContent = "";
}

// Check the user's guess
function checkGuess() {
  const guessMake = guessMakeInput.value.trim().toLowerCase();
  const guessModel = guessModelInput.value.trim().toLowerCase();
  const guessTrim = guessTrimInput.value.trim().toLowerCase();
  const guessYear = guessYearInput.value.trim();

  // Check and save correct guesses
  if (!correctGuesses.make && guessMake === currentCar.make.toLowerCase()) {
    correctGuesses.make = true;
  }
  if (!correctGuesses.model && guessModel === currentCar.model.toLowerCase()) {
    correctGuesses.model = true;
  }
  if (!correctGuesses.trim && guessTrim === currentCar.trim.toLowerCase()) {
    correctGuesses.trim = true;
  }
  if (!correctGuesses.year && parseInt(guessYear) === currentCar.year) {
    correctGuesses.year = true;
  }

  // Update saved answers
  updateSavedAnswers();

  // Check if all parts are guessed correctly
  if (
    correctGuesses.make &&
    correctGuesses.model &&
    correctGuesses.trim &&
    correctGuesses.year
  ) {
    feedback.textContent = `Correct! It's a ${currentCar.make} ${currentCar.model} ${currentCar.trim} (${currentCar.year}).`;
    guessContainer.style.display = "none"; // Hide the input boxes
    currentPhotoIndex = currentCar.photos.length - 1; // Jump to the final photo
    loadPhoto();
  } else {
    // Move to the next photo
    feedback.textContent = "Not quite! Moving to the next photo.";
    currentPhotoIndex++;
    loadPhoto();
  }

  // Clear inputs
  guessMakeInput.value = "";
  guessModelInput.value = "";
  guessTrimInput.value = "";
  guessYearInput.value = "";
}

// Update saved answers display
function updateSavedAnswers() {
  savedAnswers.textContent = `Saved Answers: ${
    correctGuesses.make ? currentCar.make : "?"
  } ${correctGuesses.model ? currentCar.model : "?"} ${
    correctGuesses.trim ? currentCar.trim : "?"
  } (${correctGuesses.year ? currentCar.year : "?"})`;
}

// Event listeners
submitButton.addEventListener("click", checkGuess);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkGuess();
  }
});

// Start the game
fetchDailyCar();
