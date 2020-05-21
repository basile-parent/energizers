let CURRENT_INSTRUCTION = null;
let INSTRUCTION_INPUT_PROPERTIES = {
  timeout : 1500,
  maxPoints : 1000,
  pointsDecreaseStartPoint: 500, // Duration when points start decreasing
  decreasePointByMillisecond: 1000 / 1500,
  timerRangeMin: 500,
  timerRangeMax: 1500,
};

const getRandomTimer = (rangeMin, rangeMax) => {
  const diff = rangeMax - rangeMin;
  const token = Math.round(Math.random() * diff);
  return rangeMin + token;
};

const calcRandomTimer = () => getRandomTimer(INSTRUCTION_INPUT_PROPERTIES.timerRangeMin, INSTRUCTION_INPUT_PROPERTIES.timerRangeMax);

const instructions = [
  { code: "click", message: "Clic", color: "green", timeout: calcRandomTimer() },
  { code: "letter", message: "Lettre", color: "red", timeout: calcRandomTimer() },
  { code: "click", message: "Clic", color: "green", timeout: calcRandomTimer() },
  { code: "number", message: "Chiffre", color: "blue", timeout: calcRandomTimer() },
  { code: "space", message: "Espace", color: "light-yellow", timeout: calcRandomTimer() },
  { code: "nothing", message: "Rien", color: "pink", timeout: calcRandomTimer() },
  { code: "shake", message: "Secoue", color: "yellow", timeout: calcRandomTimer() },
];

const runInstruction = (index) => {
  if (index >= instructions.length) {
    // Fin du jeu
    return;
  }

  CURRENT_INSTRUCTION = instructions[index];
  setTimeout(() => {
      showInstruction(CURRENT_INSTRUCTION.message, CURRENT_INSTRUCTION.color);
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

runInstruction(0);

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

    console.log(`Success +${ points } points`);
    endInstruction(points);
    return;
  }
};

const endInstructionTimeout = points => {
  if (CURRENT_INSTRUCTION.code === "nothing" && !CURRENT_INSTRUCTION.terminated) {
    const points = INSTRUCTION_INPUT_PROPERTIES.maxPoints;
    console.log(`Success +${ points } points`);
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