const worker = new Worker('js/player-countdown-worker.js');

const setupCountdown = count => {
  worker.postMessage({ action: "setupCount", count });
};

const startCountdown = () => {
  worker.postMessage({ action: "startCountdown" });
};

worker.addEventListener('message', e => {
  switch(e.data.action) {
    case "updateCountdown":
      updateCountdown(e.data.value);
      break;
    case "endCountdown":
      showEndOfTime();
      break;
  }
});

const updateCountdown = countString => {
  document.getElementById("countdown").innerHTML = countString;
};
