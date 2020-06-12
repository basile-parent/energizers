
const initWebsocketHack = socket => {
  socket.on('setCodeToHack', payload => {
    socket.hack = {
      code: payload.code,
      solution: payload.response
    };
    socket.emit('setCode', socket.hack.code);
  });
  socket.on('getCode', () => socket.emit('setCode', socket.hack.code));
  socket.on('getSolution', () => socket.emit('setSolution', socket.hack.solution));
  socket.on('checkCode', solution => {
    if (solution === source.hack.solution) {
      socket.emit('checkCodeSuccess', "");
    } else {
      socket.emit('checkCodeFail', "");
    }
  });
};

module.exports = {
  initWebsocketHack
};