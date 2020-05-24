const http = require('http');

const server = http.createServer((req, res) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Request-Method', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  // res.setHeader('Access-Control-Allow-Headers', '*');
  // if ( req.method === 'OPTIONS' ) {
  //   res.writeHead(200);
  //   res.end();
  //   return;
  // }

  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("Service for energizer.");
});

const io = require('socket.io').listen(server);

const walkStopWs = require("./walk-stop-ws");
walkStopWs.initWebsocket(io);

const hostname = '127.0.0.1';
const port = 3000;

server.listen(port);
console.log("Server started on http://" + hostname + ":" + port);