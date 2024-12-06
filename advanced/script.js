let today = new Date();
let localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
let currentDate = localDate;
let currentGame;
let currentImageIndex = 0;
let guesses = { make: "", model: "", year: "", trim: "" };

// Define paths for external files
const carsJsonPath = '../cars.json'; // JSON file is outside the advanced folder
const photosBasePath = '../';

// Load the game data
fetch(carsJsonPath)
  .then(response => response.json())
  .then(data => {
    setupGame(data, currentDate);
    setupArchive(data); // Initialize archive functionality
  });

function setupGame(data, date) {
  currentGame = data[date];
  if (!currentGame) {
    document.getElementById('feedback').textContent = "No game for this date.";
    return;
  }

  currentImageIndex = 0;
  guesses = { make: "", model: "", year: "", trim: "" };

  // Check if trim is applicable
  const trimInput = document.getElementById('trim');
  if (!currentGame.trim) {
    trimInput.style.display = "none"; // Hide trim input if not applicable
    guesses.trim = null; // Mark trim as not required
  } else {
    trimInput.style.display = "block"; // Show trim input if applicable
    guesses.trim = ""; // Reset trim guess
  }

  loadGame();
}

function loadGame() {
  if (!currentGame.photos || currentImageIndex >= currentGame.photos.length) {
    console.error("No photos available for the current game.");
    return;
  }

  const photoPath = `${photosBasePath}${currentGame.photos[currentImageIndex]}`;
  console.log("Loading Photo:", photoPath); // Debugging
  document.getElementById('car-photo').src = photoPath;

  document.getElementById('guess-container').style.display = "flex";
  document.getElementById('feedback').textContent = "";
  resetIncorrectFields();
}

function resetIncorrectFields() {
  // Reset only fields that are not already correct
  if (!guesses.make) {
    document.getElementById('make').value = "";
    document.getElementById('make').style.backgroundColor = "";
    document.getElementById('make').disabled = false;
  }
  if (!guesses.model) {
    document.getElementById('model').value = "";
    document.getElementById('model').style.backgroundColor = "";
    document.getElementById('model').disabled = false;
  }
  if (!guesses.year) {
    document.getElementById('year').value = "";
    document.getElementById('year').style.backgroundColor = "";
    document.getElementById('year').disabled = false;
  }
  if (!guesses.trim) {
    document.getElementById('trim').value = "";
    document.getElementById('trim').style.backgroundColor = "";
    document.getElementById('trim').disabled = false;
  }
}

document.getElementById('submit-guess').addEventListener('click', () => {
  const makeInput = document.getElementById('make');
  const modelInput = document.getElementById('model');
  const yearInput = document.getElementById('year');
  const trimInput = document.getElementById('trim');

  const make = makeInput.value.trim().toLowerCase();
  const model = modelInput.value.trim().toLowerCase();
  const year = yearInput.value.trim();
  const trim = trimInput.value.trim().toLowerCase();

  // Update guesses if the input matches the currentGame values
  if (!guesses.make && make === currentGame.make.toLowerCase()) {
    guesses.make = currentGame.make;
    makeInput.style.backgroundColor = "lightgreen";
    makeInput.disabled = true; // Lock correct input
  }
  if (!guesses.model && model === currentGame.model.toLowerCase()) {
    guesses.model = currentGame.model;
    modelInput.style.backgroundColor = "lightgreen";
    modelInput.disabled = true; // Lock correct input
  }
  if (!guesses.year && Array.isArray(currentGame.year) && currentGame.year.includes(parseInt(year))) {
    guesses.year = year;
    yearInput.style.backgroundColor = "lightgreen";
    yearInput.disabled = true; // Lock correct input
  }
  if (!guesses.trim && trim === (currentGame.trim || "").toLowerCase()) {
    guesses.trim = currentGame.trim;
    trimInput.style.backgroundColor = "lightgreen";
    trimInput.disabled = true; // Lock correct input
  }

  console.log("Guesses so far:", guesses); // Debugging

  // Check if all guesses are correct
  if (
    guesses.make === currentGame.make &&
    guesses.model === currentGame.model &&
    parseInt(guesses.year) === currentGame.year.find(y => y === parseInt(guesses.year)) &&
    (guesses.trim === currentGame.trim || currentGame.trim === null)
  ) {
    endGame(true); // Win condition
  } else {
    nextImage(); // Move to the next image
  }
});

function nextImage() {
  currentImageIndex++;
  if (currentImageIndex < currentGame.photos.length) {
    const photoPath = `${photosBasePath}${currentGame.photos[currentImageIndex]}`;
    console.log("Next Photo:", photoPath); // Debugging
    document.getElementById('car-photo').src = photoPath;
    resetIncorrectFields(); // Reset incorrect fields for the new image
  } else {
    endGame(false); // End the game when all images are used
  }
}

function endGame(playerWon) {
  const finalPhotoPath = `${photosBasePath}${currentGame.photos[currentGame.photos.length - 1]}`;
  document.getElementById('car-photo').src = finalPhotoPath; // Show the full image
  document.getElementById('guess-container').style.display = "none";

  let feedbackMessage = playerWon
    ? "Good job you win! Check out the other games."
    : "Out of guesses! Check out the other games.";

  feedbackMessage += `<br><strong>Correct Answers:</strong><br>
    Make: ${currentGame.make}<br>
    Model: ${currentGame.model}<br>
    Year: ${currentGame.year}`;

  if (currentGame.trim) {
    feedbackMessage += `<br>Trim: ${currentGame.trim}`;
  }

  if (currentGame.credits) {
    feedbackMessage += `<br><small>Credits: ${currentGame.credits}</small>`;
  }

  document.getElementById('feedback').innerHTML = feedbackMessage;
}

function setupArchive(data) {
  document.getElementById('view-archive').addEventListener('click', () => {
    document.getElementById('archive-modal').classList.remove('hidden');
    loadArchive(data);
  });

  document.getElementById('close-archive').addEventListener('click', () => {
    document.getElementById('archive-modal').classList.add('hidden');
  });
}

function loadArchive(data) {
  const archiveGrid = document.getElementById('archive-grid');
  archiveGrid.innerHTML = ""; // Clear previous grid
  Object.keys(data).forEach(date => {
    const dateDiv = document.createElement('div');
    dateDiv.textContent = date;
    dateDiv.className = "archive-date";
    dateDiv.addEventListener('click', () => {
      document.getElementById('archive-modal').classList.add('hidden');
      setupGame(data, date);
    });
    archiveGrid.appendChild(dateDiv);
  });
}
