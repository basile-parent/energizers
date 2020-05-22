let CURRENT_INSTRUCTION = null;
let INSTRUCTION_INPUT_PROPERTIES = {
  timeout: 1500,
  maxPoints: 1000,
  pointsDecreaseStartPoint: 500, // Duration when points start decreasing
  decreasePointByMillisecond: 1000 / 1500,
  timerRangeMin: 500,
  timerRangeMax: 1500,
};

const INSTRUCTION_DIV = document.getElementById("instruction");
INSTRUCTION_DIV.classList.add("instruction-animation__out");

const showInstruction = (message, color) => {
  INSTRUCTION_DIV.innerHTML = message;
  INSTRUCTION_DIV.className = INSTRUCTION_DIV.className.replace( /(?:^|(?<= ))(glow-[a-z\-]+)(?:(?= )|$)/ , '' )
  INSTRUCTION_DIV.classList.add("glow-" + color);

  INSTRUCTION_DIV.classList.remove("instruction-animation__out");
  INSTRUCTION_DIV.classList.add("instruction-animation__in");
};

const hideInstruction = () => {
  INSTRUCTION_DIV.classList.remove("instruction-animation__in");
  INSTRUCTION_DIV.classList.add("instruction-animation__out");
};

const getRandomTimer = (rangeMin, rangeMax) => {
  const diff = rangeMax - rangeMin;
  const token = Math.round(Math.random() * diff);
  return rangeMin + token;
};

const calcRandomTimer = () => getRandomTimer(INSTRUCTION_INPUT_PROPERTIES.timerRangeMin, INSTRUCTION_INPUT_PROPERTIES.timerRangeMax);

const rules = {
  dialogTimeout: 1500,
  randomColors: false,
  allRules: [
      {code: "letter", label: "Clic", color: "green", replacementLabel: "Lettre", replacementColor: "red", description: "Taper sur n'importe quelle lettre (minuscule ou majuscule)." },
      {code: "click", label: "Lettre", color: "red", replacementLabel: "Clic", replacementColor: "green", description: "Clic gauche de la souris." },
      {code: "space", label: "Chiffre", color: "blue", replacementLabel: "Espace", replacementColor: "light-yellow", description: "Taper sur la touche Espace du clavier." },
      {code: "number", label: "Espace", color: "light-yellow", replacementLabel: "Chiffre", replacementColor: "blue", description: "Taper sur n'importe quel chiffre (pavé numérique ou touches à accents)." },
      {code: "nothing", label: "Rien", color: "pink", description: "Ne RIEN faire." },
      {code: "shake", label: "Secoue", color: "yellow", description: "Bouger la souris." }
  ]};
const instructions = [
  {code: "click", label: "Clic", color: "green", timeout: calcRandomTimer()},
  {code: "letter", label: "Lettre", color: "red", timeout: calcRandomTimer()},
  {code: "click", label: "Clic", color: "green", timeout: calcRandomTimer()},
  {code: "number", label: "Chiffre", color: "blue", timeout: calcRandomTimer()},
  {code: "space", label: "Espace", color: "light-yellow", timeout: calcRandomTimer()},
  {code: "nothing", label: "Rien", color: "pink", timeout: calcRandomTimer()},
  {code: "shake", label: "Secoue", color: "yellow", timeout: calcRandomTimer()},
];

const runInstruction = (index) => {
  if (index >= instructions.length) {
    // Fin du jeu
    return;
  }

  CURRENT_INSTRUCTION = instructions[index];
  setTimeout(() => {
      showInstruction(CURRENT_INSTRUCTION.label, CURRENT_INSTRUCTION.color);
      CURRENT_INSTRUCTION.showed = true;
      CURRENT_INSTRUCTION.timer = new Date();
      setTimeout(() => {
        if (!CURRENT_INSTRUCTION.terminated) {
          endInstructionTimeout();
        }
        runInstruction(index + 1);
      }, INSTRUCTION_INPUT_PROPERTIES.timeout);
    },
    instructions[index].timeout
  );
};

const handleInput = input => {
  if (!CURRENT_INSTRUCTION || !CURRENT_INSTRUCTION.showed || CURRENT_INSTRUCTION.terminated) {
    return;
  }
  if (CURRENT_INSTRUCTION.code === "nothing") {
    console.log("Failed -500 points");
    endInstruction(-500);
    return;
  }
  if (CURRENT_INSTRUCTION.code === input) {
    const diff = new Date() - CURRENT_INSTRUCTION.timer;

    let points = INSTRUCTION_INPUT_PROPERTIES.maxPoints;
    if (diff > INSTRUCTION_INPUT_PROPERTIES.pointsDecreaseStartPoint) {
      points -= Math.max(0, Math.round(diff * INSTRUCTION_INPUT_PROPERTIES.decreasePointByMillisecond));
    }

    console.log(`Success +${points} points`);
    endInstruction(points);
  }
};

const endInstructionTimeout = () => {
  if (CURRENT_INSTRUCTION.code === "nothing" && !CURRENT_INSTRUCTION.terminated) {
    const points = INSTRUCTION_INPUT_PROPERTIES.maxPoints;
    console.log(`Success +${points} points`);
    endInstruction(points);
    return;
  }

  console.log("Failed +0 point");
  endInstruction(0);
};

const endInstruction = points => {
  CURRENT_INSTRUCTION.terminated = true;
  CURRENT_INSTRUCTION.showed = false;
  hideInstruction();
  scorePoints(points);
};

const newRules = rules => {
  showRules(rules)
  updateLexique(rules);
};

const showRules = rules => {
  document.querySelector("#rules ul").innerHTML =
    rules.allRules.map(r => `
          <li>
              <p class="rules-title">
                <span class="lexique__${r.color}">${r.label}</span>
                ${ r.replacementLabel ? ` 🡆 <span class="${ rules.randomColors ? "random-color" : "lexique__" + r.replacementColor }">${r.replacementLabel}</span>` : ""}
              </p>
              <p class="rules-description">
                  ${ r.description }
              </p>
          </li>`)
      .join("");

  if (rules.randomColors) {
    document.querySelector("#rules h2").innerHTML = "Couleurs aléatoires";
  } else {
    document.querySelector("#rules h2").innerHTML = "&nbsp;";
  }

  document.getElementById("rules").open = true;
  const loadingBar = document.querySelector("#rules-loading-bar > div");
  loadingBar.classList.add("load");
  loadingBar.style.animationDuration = `${ rules.dialogTimeout }ms`;
  setTimeout(() => {
      document.getElementById("rules").open = false;
      loadingBar.classList.add("remove");
    }, rules.dialogTimeout);
};

const updateLexique = rules => {
  document.querySelector("#lexique ul").innerHTML =
    rules.allRules.map(r => `<li><span class="lexique__${r.color}">${r.label}</span>${r.replacementLabel ? ` 🡆 <span class="lexique__${r.replacementColor}">${r.replacementLabel}</span>` : ""}</li>`)
      .join("");
};


// runInstruction(0);
// newRules(rules);