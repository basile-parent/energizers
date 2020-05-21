const http = require('http');

const server = http.createServer();

// Chargement de socket.io
const io = require('socket.io').listen(server);

const walkStopWs = require("./walk-stop-ws");
walkStopWs.initWebsocket(io);

const hostname = '127.0.0.1';
const port = 7500;

server.listen(port);
console.log("Server started on http://" + hostname + ":" + port);