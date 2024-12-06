let today = new Date();
let localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
let currentDate = localDate;
let currentGame;
let currentImageIndex = 0;
let guesses = { make: "", model: "", year: "", trim: "" };
let isArchiveMode = false; // To track whether we're in archive mode

// Load the game data
fetch('cars.json')
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
  loadGame();
}

function loadGame() {
  document.getElementById('car-photo').src = currentGame.photos[currentImageIndex];
  document.getElementById('guess-container').style.display = "flex";
  document.getElementById('feedback').textContent = "";
  resetInputFields();
}

// Reset input fields and styles
function resetInputFields() {
  document.getElementById('make').style.backgroundColor = "";
  document.getElementById('model').style.backgroundColor = "";
  document.getElementById('year').style.backgroundColor = "";
  document.getElementById('trim').style.backgroundColor = "";

  document.getElementById('make').value = "";
  document.getElementById('model').value = "";
  document.getElementById('year').value = "";
  document.getElementById('trim').value = "";
}

document.getElementById('submit-guess').addEventListener('click', () => {
  const make = document.getElementById('make').value.trim().toLowerCase();
  const model = document.getElementById('model').value.trim().toLowerCase();
  const year = document.getElementById('year').value.trim();
  const trim = document.getElementById('trim').value.trim().toLowerCase();

  // Update feedback and field colors
  if (make === currentGame.make.toLowerCase()) {
    guesses.make = currentGame.make;
    document.getElementById('make').style.backgroundColor = "lightgreen";
  }
  if (model === currentGame.model.toLowerCase()) {
    guesses.model = currentGame.model;
    document.getElementById('model').style.backgroundColor = "lightgreen";
  }

  // Check if the year is one of the possible correct years
  if (Array.isArray(currentGame.year) && currentGame.year.includes(parseInt(year))) {
    guesses.year = year; // Set the guessed year (as string for consistency)
    document.getElementById('year').style.backgroundColor = "lightgreen";
  }

  if (trim === (currentGame.trim || "").toLowerCase()) {
    guesses.trim = currentGame.trim;
    document.getElementById('trim').style.backgroundColor = "lightgreen";
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
    return;
  }

  // Always move to the next image
  nextImage();
});




function nextImage() {
  currentImageIndex++;
  if (currentImageIndex < currentGame.photos.length) {
    // Load the next image (including the full image as the last one in the sequence)
    document.getElementById('car-photo').src = currentGame.photos[currentImageIndex];
  }

  if (currentImageIndex === currentGame.photos.length - 1) {
    // If it's the full image step, check if it's the last chance
    document.getElementById('feedback').textContent = "This is your last chance to guess!";
  }

  if (currentImageIndex >= currentGame.photos.length) {
    // If all images are used, end the game
    endGame(false);
  }
}


// End the game and show the correct answers
function endGame(playerWon) {
  document.getElementById('car-photo').src = currentGame.photos[currentGame.photos.length - 1]; // Show full image
  document.getElementById('guess-container').style.display = "none"; // Hide the input fields

  let feedbackMessage = playerWon
    ? "Good job you win! Check out the other games."
    : "Out of guesses! Check out the other games.";

  feedbackMessage += `<br><strong>Correct Answers:</strong><br>
    Make: ${currentGame.make}<br>
    Model: ${currentGame.model}<br>
    Year: ${currentGame.year}<br>
    Trim: ${currentGame.trim}`;

  // Add photographer credits if available
  if (currentGame.credits) {
    feedbackMessage += `<br><small>${currentGame.credits}</small>`;
  }

  document.getElementById('feedback').innerHTML = feedbackMessage; // Display feedback with correct answers
}


// Archive Button Logic
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