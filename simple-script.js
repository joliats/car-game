let today = new Date();
let localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
let currentDate = localDate;
let currentGame;
let currentImageIndex = 0;
let guesses = { make: "", model: "" };
let makes = [];
let models = [];

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
  guesses = { make: "", model: "" };

  // Reset input fields and styles
  resetInputFields();

  // Populate makes and models arrays
  makes = [...new Set(Object.values(data).map(car => car.make))];
  models = [...new Set(Object.values(data).map(car => car.model))];

  loadGame();
  populateAutocompleteOptions();
}

function loadGame() {
  document.getElementById('car-photo').src = currentGame.photos[currentImageIndex];
  document.getElementById('guess-container').style.display = "flex";
  document.getElementById('feedback').textContent = "";
}

function resetInputFields() {
  const makeInput = document.getElementById('make');
  const modelInput = document.getElementById('model');

  makeInput.value = "";
  modelInput.value = "";
  makeInput.style.backgroundColor = "";
  modelInput.style.backgroundColor = "";
  makeInput.disabled = false;
  modelInput.disabled = false;
}

function populateAutocompleteOptions() {
  const makeOptions = document.getElementById('make-options');
  const modelOptions = document.getElementById('model-options');

  makeOptions.innerHTML = '';
  makes.forEach(make => {
    const option = document.createElement('option');
    option.value = make;
    makeOptions.appendChild(option);
  });

  modelOptions.innerHTML = '';
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    modelOptions.appendChild(option);
  });
}

document.getElementById('submit-guess').addEventListener('click', () => {
  const makeInput = document.getElementById('make');
  const modelInput = document.getElementById('model');
  const make = makeInput.value.trim().toLowerCase();
  const model = modelInput.value.trim().toLowerCase();

  // Update guesses if the input matches the currentGame values
  if (make === currentGame.make.toLowerCase()) {
    guesses.make = currentGame.make;
    makeInput.style.backgroundColor = "lightgreen";
    makeInput.disabled = true; // Disable input once correct
  }

  if (model === currentGame.model.toLowerCase()) {
    guesses.model = currentGame.model;
    modelInput.style.backgroundColor = "lightgreen";
    modelInput.disabled = true; // Disable input once correct
  }

  console.log("Guesses so far:", guesses); // Debugging

  // Check if both guesses are correct
  if (guesses.make === currentGame.make && guesses.model === currentGame.model) {
    endGame(true); // Win condition
  } else {
    nextImage();
  }
});

function nextImage() {
  currentImageIndex++;
  console.log("Moving to the next image. Current Index:", currentImageIndex); // Debugging

  if (currentImageIndex < currentGame.photos.length) {
    // Load the next image in the sequence
    document.getElementById('car-photo').src = currentGame.photos[currentImageIndex];
  } else {
    // End the game when all images are used
    console.log("No more images, ending the game."); // Debugging
    endGame(false);
  }
}

function endGame(playerWon) {
  document.getElementById('car-photo').src = currentGame.photos[currentGame.photos.length - 1]; // Show full image
  document.getElementById('guess-container').style.display = "none"; // Hide the input fields

  let feedbackMessage = playerWon
    ? "Good job you win! Check out the other games."
    : "Out of guesses! Check out the other games.";

  feedbackMessage += `<br><strong>Correct Answers:</strong><br>
    Make: ${currentGame.make}<br>
    Model: ${currentGame.model}<br>`;

  if (currentGame.credits) {
    feedbackMessage += `<br><small> ${currentGame.credits}</small>`;
  }

  document.getElementById('feedback').innerHTML = feedbackMessage; // Display feedback with correct answers
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

  const dates = Object.keys(data).sort(); // Sort dates in ascending order (oldest first)
  const totalDates = dates.length; // Get the total number of dates

  dates.reverse().forEach((date, index) => {
    const dateDiv = document.createElement('div');
    dateDiv.className = "archive-date";

    // Add numbering and date
    dateDiv.innerHTML = `<span class="archive-number">#${totalDates - index}</span>
                         <span class="archive-date-text">${date}</span>`;

    dateDiv.addEventListener('click', () => {
      document.getElementById('archive-modal').classList.add('hidden');
      setupGame(data, date);
    });

    archiveGrid.appendChild(dateDiv);
  });
}


