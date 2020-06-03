let CURRENT_INSTRUCTION = null;
let INSTRUCTIONS = [];
let INSTRUCTION_INPUT_PROPERTIES = {
  timeout: 1500,
  maxPoints: 1000,
  pointsDecreaseStartPoint: 500, // Duration when points start decreasing
  decreasePointByMillisecond: 1000 / 1500,
  timerRangeMin: 500,
  timerRangeMax: 1500,
};

// const getRandomTimer = (rangeMin, rangeMax) => {
//   const diff = rangeMax - rangeMin;
//   const token = Math.round(Math.random() * diff);
//   return rangeMin + token;
// };
//
// const calcRandomTimer = () => getRandomTimer(INSTRUCTION_INPUT_PROPERTIES.timerRangeMin, INSTRUCTION_INPUT_PROPERTIES.timerRangeMax);
//
// const rules = {
//   dialogTimeout: 1500,
//   randomColors: false,
//   allRules: [
//     {code: "letter", label: "Clic", color: "green", replacementLabel: "Lettre", replacementColor: "red", description: "Taper sur n'importe quelle lettre (minuscule ou majuscule)." },
//     {code: "click", label: "Lettre", color: "red", replacementLabel: "Clic", replacementColor: "green", description: "Clic gauche de la souris." },
//     {code: "space", label: "Chiffre", color: "blue", replacementLabel: "Espace", replacementColor: "light-yellow", description: "Taper sur la touche Espace du clavier." },
//     {code: "number", label: "Espace", color: "light-yellow", replacementLabel: "Chiffre", replacementColor: "blue", description: "Taper sur n'importe quel chiffre (pavé numérique ou touches à accents)." },
//     {code: "nothing", label: "Rien", color: "pink", description: "Ne RIEN faire." },
//     {code: "shake", label: "Secoue", color: "yellow", description: "Bouger la souris." }
//   ]};

// INSTRUCTIONS = [
//   {code: "click", label: "Clic", color: "green", timeout: calcRandomTimer()},
//   {code: "letter", label: "Lettre", color: "red", timeout: calcRandomTimer()},
//   {code: "click", label: "Clic", color: "green", timeout: calcRandomTimer()},
//   {code: "number", label: "Chiffre", color: "blue", timeout: calcRandomTimer()},
//   {code: "space", label: "Espace", color: "light-yellow", timeout: calcRandomTimer()},
//   {code: "nothing", label: "Rien", color: "pink", timeout: calcRandomTimer()},
//   {code: "shake", label: "Secoue", color: "yellow", timeout: calcRandomTimer()},
// ];

const INSTRUCTION_DIV = document.getElementById("instruction");
const COUNTDOWN_DIV = document.getElementById("countdown-rules");
INSTRUCTION_DIV.classList.add("instruction-animation__out");

const showInstruction = (message, color) => {
  INSTRUCTION_DIV.innerHTML = message;
  INSTRUCTION_DIV.className = INSTRUCTION_DIV.className.replace( /(?:^|(?<= ))(glow-[a-z\-]+)(?:(?= )|$)/ , '' )
  INSTRUCTION_DIV.classList.add("glow-" + color);

  INSTRUCTION_DIV.classList.remove("instruction-animation__out");
  INSTRUCTION_DIV.classList.add("instruction-animation__in");
};

const hideInstruction = () => {
  INSTRUCTION_DIV.classList.add("instruction-animation__out");
  INSTRUCTION_DIV.classList.remove("instruction-animation__in");
};

const startGame = async (instructions) => {
  INSTRUCTION_DIV.classList.add("hidden");
  COUNTDOWN_DIV.classList.remove("hidden");

  await showCount(3);
  await showCount(2);
  await showCount(1);

  COUNTDOWN_DIV.classList.add("hidden");
  INSTRUCTION_DIV.classList.remove("hidden");
  runInstruction(instructions, 0);
};

const showCount = async count => {
  return new Promise(resolve => {
    COUNTDOWN_DIV.innerHTML = count;
    COUNTDOWN_DIV.classList.remove("instruction-animation__out");
    COUNTDOWN_DIV.classList.add("instruction-animation__in");
    setTimeout(() => {
      hideCountdown();
      setTimeout(() => {
        resolve();
      }, 400);
    }, 600);
  });
};

const showEndOfTime = () => {
  return new Promise(resolve => {
    INSTRUCTION_DIV.classList.add("hidden");
    COUNTDOWN_DIV.classList.remove("hidden");
    COUNTDOWN_DIV.classList.add("countdownEnd");

    COUNTDOWN_DIV.innerHTML = "Fin&nbsp;&nbsp;&nbsp;du&nbsp;&nbsp;&nbsp;temps !";
    COUNTDOWN_DIV.classList.remove("instruction-animation__out");
    COUNTDOWN_DIV.classList.add("instruction-animation__in");
    setTimeout(() => {
      hideCountdown();
      setTimeout(() => {
        COUNTDOWN_DIV.classList.remove("countdownEnd");
        resolve();
      }, 400);
    }, 1500);
  });
};

const hideCountdown = () => {
  COUNTDOWN_DIV.classList.add("instruction-animation__out");
  COUNTDOWN_DIV.classList.remove("instruction-animation__in");
};


const runInstruction = (instructions, index) => {
  if (index >= instructions.length) {
    // Fin du jeu
    console.log("Fin des instructions");
    return;
  }

  CURRENT_INSTRUCTION = instructions[index];
  setTimeout(() => {
      const now = new Date();
      showInstruction(CURRENT_INSTRUCTION.label, CURRENT_INSTRUCTION.color);
      CURRENT_INSTRUCTION.showed = true;
      CURRENT_INSTRUCTION.timer = new Date();
      setTimeout(() => {
        if (!CURRENT_INSTRUCTION.terminated) {
          endInstructionTimeout();
        }
        runInstruction(instructions, index + 1);
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
    let diff = new Date() - CURRENT_INSTRUCTION.timer;

    let points = INSTRUCTION_INPUT_PROPERTIES.maxPoints;
    if (diff > INSTRUCTION_INPUT_PROPERTIES.pointsDecreaseStartPoint) {
      diff -= INSTRUCTION_INPUT_PROPERTIES.pointsDecreaseStartPoint;
      points = Math.max(0, points - Math.round(diff * INSTRUCTION_INPUT_PROPERTIES.decreasePointByMillisecond));
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

const launchGame = async (rules, instructions, instructionProperties) => {
  INSTRUCTION_DIV.innerHTML = "";
  INSTRUCTION_INPUT_PROPERTIES = {
    timeout: instructionProperties.timeout,
    maxPoints: instructionProperties.maxPoints,
    pointsDecreaseStartPoint: instructionProperties.maxPointsDelay,
    decreasePointByMillisecond: instructionProperties.maxPoints / (instructionProperties.timeout - instructionProperties.maxPointsDelay),
    timerRangeMin: instructionProperties.range.min,
    timerRangeMax: instructionProperties.range.max,
  };
  updateLexique(rules);
  await showRules(rules);
  await startGame(instructions);
  startCountdown();
};

const showRules = async rules => {
  return new Promise(resolve => {
    document.querySelector("#rules ul").innerHTML =
      rules.allRules.map(r => `
          <li>
              <p class="rules-title">
                <span class="${ rules.randomColors ? "random-color" : "lexique__" + r.replacementColor }">${r.label}</span>
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
    loadingBar.style.animationDuration = `${ rules.dialogTimeout / 1000 }s`;
    setTimeout(() => {
      document.getElementById("rules").open = false;
      loadingBar.classList.add("remove");
      resolve();
    }, rules.dialogTimeout);
  });
};

const updateLexique = rules => {
  document.querySelector("#lexique ul").innerHTML =
    rules.allRules.map(r => `<li><span class="lexique__${r.color}">${r.label}</span>${r.replacementLabel ? ` 🡆 <span class="lexique__${r.replacementColor}">${r.replacementLabel}</span>` : ""}</li>`)
      .join("");
};
