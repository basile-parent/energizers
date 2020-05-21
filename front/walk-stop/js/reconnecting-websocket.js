class WebsocketClient {
  constructor(url) {
    this.socket = io.connect(WEBSOCKET_URL);
    this.isConnected = false;

    this._initReconnectingProcess();
    this._initMessageHandler();
  }

  _initReconnectingProcess = () => {
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log("Connecté");

      if (localStorage.getItem("name")) {
        this.emit('setName', localStorage.getItem("name"));
      }
      if (localStorage.getItem("score")) {
        this.emit('setPoints', localStorage.getItem("score"));
      }
    });
    this.socket.on('connect_error', () => {
      console.log("Erreur lors de la connexion. Tentative de reconnexion...");
      this.open();
    });
    this.socket.on('disconnect', () => {
      console.log("Déconnecté. Tentative de reconnexion...");
      this.isConnected = false;
      this.socket.open();
    });
  };

  _initMessageHandler = () => {
    this.socket.on('leaderboard', function(leaderboard) {
      updateLeaderBoard(leaderboard);
    });
  };

  emit = (channel, message) => {
    console.debug("Emit message :", channel, ">", message);
    if (!this.isConnected) {
      console.error("Cannot emit message : WebSocket is disconnected.");
      return false;
    }
    this.socket.emit(channel, message);
    return true;
  }

}
