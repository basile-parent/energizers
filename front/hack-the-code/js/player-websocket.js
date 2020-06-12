const onConnect = () => {
  if (localStorage.getItem("name")) {
    WS_CLIENT.emit('setName', localStorage.getItem("name"));
  }
  if (localStorage.getItem("score")) {
    WS_CLIENT.emit('setPoints', localStorage.getItem("score"));
  }
  document.getElementById("disconnected").classList.add("hidden");
};
const onDisconnect = () => {
  document.getElementById("disconnected").classList.remove("hidden");
};

const WS_CLIENT = new WebsocketClient(WEBSOCKET_URL, WEBSOCKET_PATH, { onConnect, onDisconnect });

WS_CLIENT.on('setCode', code => {
  fillCode(code);
});
