let SCORE = localStorage.getItem("score") || 0;

const scorePoints = points => {
  const id = randomId();
  createScoreDiv(id, points);

  SCORE = Math.max(0, SCORE + points);
  WS_CLIENT.emit("setPoints", SCORE);
  updateScore();

  setTimeout(() => {
    document.getElementById(id).remove();
  }, 2000);
};

const createScoreDiv = (id, points) => {
  const tag = document.createElement("div");

  const isPositive = points > 0;
  const pointText = points >= 0 ? "+" + points : points;
  const text = document.createTextNode(pointText);
  tag.appendChild(text);

  tag.id = id;
  tag.classList.add("score-popup");
  tag.classList.add(isPositive ? "score-popup__positive" : "score-popup__negative");
  const element = document.getElementById("full-screen");
  element.appendChild(tag);
};

const updateScore = () => {
  localStorage.setItem("score", SCORE);
  document.getElementById("score-points").innerHTML = getHTMLScore(SCORE);
};
const getHTMLScore = score => {
  let html = '<span class="score-leading-zeros">';
  if (score < 10000) { html += "0"; }
  if (score < 1000) { html += "0"; }
  if (score < 100) { html += "0"; }
  if (score < 10) { html += "0"; }
  html += "</span>" + score;
  return html;
};

const updateLeaderBoard = leaderboard => {
  const myName = localStorage.getItem("name");
  document.querySelector("#leaderboard ul").innerHTML =
    leaderboard.map(player => `
          <li ${ player.name === myName ? "class='change-name' onClick='showNamePopup()'" : "" }>
            ${ player.name } &nbsp;&nbsp;&nbsp;&nbsp;${ getHTMLScore(player.score) }
          </li>`).join("");
};

// updateScore();
// updateLeaderBoard(ALL_SCORES);