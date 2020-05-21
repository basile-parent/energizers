const WEBSOCKET_URL = 'http://localhost:7500';
const WS_CLIENT = new WebsocketClient(WEBSOCKET_URL);

const nameInput = document.querySelector("#pseudo input");
nameInput.value = localStorage.getItem("name");
nameInput.focus();
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
const validateName = name => {
  if (!WS_CLIENT.emit('setName', name)) {
    alert("Vous n'êtes pas connecté au serveur.");
    return false;
  }

  localStorage.setItem("name", nameInput.value);
  return true;
};