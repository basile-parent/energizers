const onConnect = () => {
  WS_CLIENT.emit("getSequence", "");
  WS_CLIENT.emit("getParameters", "");
};

const WS_CLIENT = new WebsocketClient(WEBSOCKET_URL, WEBSOCKET_PATH, { onConnect });

WS_CLIENT.on('leaderboard', function(leaderboard) {
  updateLeaderBoard(leaderboard);
});
WS_CLIENT.on("sequence", sequence => {
  setExistingSequence(sequence);
});
