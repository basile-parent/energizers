const WS_CLIENT = new WebsocketClient(WEBSOCKET_URL, WEBSOCKET_PATH, UserType.PLAYER);

WS_CLIENT.on('leaderboard', function(leaderboard) {
  updateLeaderBoard(leaderboard);
});

const nameInput = document.querySelector("#pseudo input");
nameInput.value = localStorage.getItem("name");
nameInput.addEventListener("keypress", e => {
  if (e.which === 13) {
    if (!nameInput.value.trim()) {
      return false;
    }

    validateName(nameInput.value);
    document.getElementById("pseudo").classList.add("hidden");
    return false;
  }
});

const showNamePopup = () => {
  document.getElementById("pseudo").classList.remove("hidden");
  document.querySelector("#pseudo input").focus();
};

if (!localStorage.getItem("name")) {
  showNamePopup();
}

const validateName = name => {
  if (!WS_CLIENT.emit('setName', name)) {
    alert("Vous n'êtes pas connecté au serveur.");
    return false;
  }

  localStorage.setItem("name", nameInput.value);
  return true;
};

WS_CLIENT.on("launchGame", sequence => {
  console.log(sequence);
  setupCountdown(sequence.parameters.duration);
  launchGame(sequence.rules, sequence.instructions, sequence.parameters);
});

WS_CLIENT.on("reinitScore", () => {
  SCORE = 0;
  updateScore();
});
