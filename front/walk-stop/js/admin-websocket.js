const WS_CLIENT = new WebsocketClient(WEBSOCKET_URL, UserType.ADMIN, () => {
  WS_CLIENT.emit("getSequence", "");
  WS_CLIENT.emit("getParameters", "");
});

WS_CLIENT.on('leaderboard', function(leaderboard) {
  updateLeaderBoard(leaderboard);
});
WS_CLIENT.on("sequence", sequence => {
  setExistingSequence(sequence);
});
