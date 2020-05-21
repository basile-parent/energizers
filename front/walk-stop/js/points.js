let SCORE = 0;

const scorePoints = points => {
  const id = randomId();
  createScoreDiv(id, points);

  SCORE += points;
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
  let html = '<span id="score-points__leading_zeros">';
  if (SCORE < 10000) { html += "0"; }
  if (SCORE < 1000) { html += "0"; }
  if (SCORE < 100) { html += "0"; }
  if (SCORE < 10) { html += "0"; }
  html += "</span>" + SCORE;

  document.getElementById("score-points").innerHTML = html;
};
updateScore();