const UserType = {
  PLAYER: "player",
  ADMIN: "admin"
};

const MAX_RECONNECT_TIMEOUT = 5000;

class WebsocketClient {
  constructor(url, path, userType, connectionCallback) {
    this.socket = io(url, { path });
    this.isConnected = false;
    this.userType = userType;
    this.connectionCallback = connectionCallback;
    this.reconnectionTimeout = 300;

    this._initReconnectingProcess();
    this.socket.connect();
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
      this.reconnectionTimeout = 300;
      this.connectionCallback && this.connectionCallback();
    });
    this.socket.on('connect_error', () => {
      console.log("Erreur lors de la connexion. Tentative de reconnexion...");
      this._reconnect();
    });
    this.socket.on('disconnect', () => {
      console.log("Déconnecté. Tentative de reconnexion...");
      this.isConnected = false;
      this._reconnect();
    });
  };
  
  _reconnect = () => {
    setTimeout(() => {
        this.socket.open();
        this.reconnectionTimeout = Math.min(MAX_RECONNECT_TIMEOUT, this.reconnectionTimeout * 1.5);
      },
      this.reconnectionTimeout);
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
