let PLAYERS = [];
let SEQUENCE = null;
let PARAMETERS = null;

const logPlayers = () => {
  console.log(PLAYERS.length + " joueur(s)");
  PLAYERS.length && console.log(PLAYERS.map(p => ({ id: p.socket.id, name: p.socket.name, score: p.socket.points })));
};

const randomId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const getLeaderboard = () => {
  return PLAYERS
    .filter(p => p.socket.name)
    .sort((a, b) => b.socket.points - a.socket.points)
    .map(p => ({ name: p.socket.name, score: p.socket.points }));
};

const modifyPlayer = (id, property, value) => {
  const playerIndex = PLAYERS.findIndex(p => p.socket.id === id);
  PLAYERS[playerIndex].socket[property] = value;
  logPlayers();
};

const initWebsocket = io => {
  io.sockets.on('connection', socket => {
    socket.id = randomId();
    socket.points = 0;

    PLAYERS.push({ socket });
    logPlayers();
    socket.emit('leaderboard', getLeaderboard());

    socket.on('disconnect', () => {
      console.log(socket.name ? socket.name + " disconnected" : "Unknown player disconnected");
      PLAYERS = PLAYERS.filter(p => p.socket.id !== socket.id);
      logPlayers();
    });

    socket.on('setName', name => {
      modifyPlayer(socket.id, "name", name);
      // socket.emit('leaderboard', getLeaderboard());
      socket.broadcast.emit('leaderboard', getLeaderboard());
    });
    socket.on('setPoints', points => {
      modifyPlayer(socket.id, "points", parseInt(points));
      socket.broadcast.emit('leaderboard', getLeaderboard());
    });
    socket.on('setSequence', sequence => SEQUENCE = sequence);
    socket.on('deleteSequence', () => SEQUENCE = null);
    socket.on('getSequence', () => socket.emit('sequence', SEQUENCE));
    socket.on('launchGame', () => {
      socket.broadcast.emit('launchGame', { ...SEQUENCE, parameters : PARAMETERS });
    });
    socket.on('setParameters', parameters => {
      PARAMETERS = parameters;
      console.log(PARAMETERS);
    });
    socket.on('getParameters', () => socket.emit('parameters', PARAMETERS));
    socket.on('reinitScore', () => {
      PLAYERS = PLAYERS.map(p => ({ ...p, socket: { ...p.socket, points: 0 }}));
      logPlayers();
      socket.broadcast.emit('reinitScore', "");
      socket.broadcast.emit('leaderboard', getLeaderboard());
    });
  });
};

module.exports = {
  initWebsocket
};