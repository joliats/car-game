let currentDate = new Date().toISOString().split('T')[0];
let currentGame;
let currentImageIndex = 0;
let guesses = { make: "", model: "", year: "", trim: "" };

// Load the game data
fetch('cars.json')
  .then(response => response.json())
  .then(data => {
    currentGame = data[currentDate];
    if (!currentGame) {
      document.getElementById('feedback').textContent = "No game for today.";
      return;
    }
    loadGame();
  });

function loadGame() {
  document.getElementById('car-photo').src = currentGame.photos[currentImageIndex];
}

// Handle guess submission
document.getElementById('submit-guess').addEventListener('click', () => {
  const make = document.getElementById('make').value.trim();
  const model = document.getElementById('model').value.trim();
  const year = document.getElementById('year').value.trim();
  const trim = document.getElementById('trim').value.trim();

  let feedback = "";
  if (make === currentGame.make) {
    guesses.make = make;
    feedback += "Make correct! ";
  }
  if (model === currentGame.model) {
    guesses.model = model;
    feedback += "Model correct! ";
  }
  if (parseInt(year) === currentGame.year) {
    guesses.year = year;
    feedback += "Year correct! ";
  }
  if (trim === currentGame.trim) {
    guesses.trim = trim;
    feedback += "Trim correct!";
  }

  if (feedback) {
    document.getElementById('feedback').textContent = feedback;
  } else {
    document.getElementById('feedback').textContent = "Try again!";
  }

  // Check if all guesses are correct
  if (Object.values(guesses).every(value => value)) {
    document.getElementById('feedback').textContent = "You win! 🎉";
  }
});

// Next image
document.getElementById('next-image').addEventListener('click', () => {
  currentImageIndex = Math.min(currentImageIndex + 1, currentGame.photos.length - 1);
  document.getElementById('car-photo').src = currentGame.photos[currentImageIndex];
});

// Archive button
document.getElementById('view-archive').addEventListener('click', () => {
  document.getElementById('archive-modal').classList.remove('hidden');
  loadArchive();
});

// Close archive
document.getElementById('close-archive').addEventListener('click', () => {
  document.getElementById('archive-modal').classList.add('hidden');
});

// Load archive
function loadArchive() {
  fetch('cars.json')
    .then(response => response.json())
    .then(data => {
      const archiveGrid = document.getElementById('archive-grid');
      archiveGrid.innerHTML = ""; // Clear previous grid
      Object.keys(data).forEach(date => {
        const dateDiv = document.createElement('div');
        dateDiv.textContent = date;
        dateDiv.addEventListener('click', () => viewArchivedGame(data[date]));
        archiveGrid.appendChild(dateDiv);
      });
    });
}

// View archived game
function viewArchivedGame(game) {
  alert(`Game for ${game.make} ${game.model} (${game.year} ${game.trim})`);
}
