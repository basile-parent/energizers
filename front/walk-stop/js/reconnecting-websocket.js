const UserType = {
  PLAYER: "player",
  ADMIN: "admin"
};

class WebsocketClient {
  constructor(url, userType) {
    this.socket = io.connect(url);
    this.isConnected = false;
    this.userType = userType;

    this._initReconnectingProcess();
  }

  _initReconnectingProcess = () => {
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log("Connecté");

      if (this.userType === UserType.PLAYER) {
        if (localStorage.getItem("name")) {
          this.emit('setName', localStorage.getItem("name"));
        }
        if (localStorage.getItem("score")) {
          this.emit('setPoints', localStorage.getItem("score"));
        }
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

  on = (channel, func) => {
    this.socket.on(channel, func);
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
