let COUNTDOWN = null;
let COUNTDOWN_INTERVAL = null;

self.addEventListener('message', e => {
  switch(e.data.action) {
    case "setupCount":
      setupCountdown(e.data.count);
      break;
    case "startCountdown":
      startCountdown();
      break;
  }
});

const setupCountdown = count => {
  COUNTDOWN = count;
  updateCountdown();
};

const startCountdown = () => {
  COUNTDOWN_INTERVAL = setInterval(() => {
    COUNTDOWN -= 10;
    if (COUNTDOWN <= 0) {
      COUNTDOWN = 0;
      clearInterval(COUNTDOWN_INTERVAL);
      self.postMessage({ action: "endCountdown" });
    }
    updateCountdown();
  }, 10);
};

const updateCountdown = () => {
  const minutes = (Math.floor(COUNTDOWN / 60000) + "").padStart(2, "0");
  const seconds = (Math.floor((COUNTDOWN % 60000) / 1000) + "").padStart(2, "0");
  const milliseconds = (Math.floor((COUNTDOWN % 1000) / 10) + "").padStart(2, "0");
  // document.getElementById("countdown").innerHTML = minutes + ":" + seconds + "." + milliseconds;
  self.postMessage({ action: "updateCountdown", value: minutes + ":" + seconds + "." + milliseconds });};
