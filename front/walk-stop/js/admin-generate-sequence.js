let CURRENT_SEQUENCE_INSTRUCTION = null;

const generateSequence = () => {
  const selectedInstructions = SELECTED_INSTRUCTIONS;
  if (selectedInstructions.length < 2) {
    alert("Vous devez sélectionner au minimum 2 instructions");
    throw new Error("You must choose instructions at leasts 2 instructions");
  }

  const parameters = getParameters();

  const randomColors = document.getElementById("randomColors").checked;
  const generatedInstructions = [];
  let timer = 0;
  const rangeDiff = parameters.range.max - parameters.range.min;
  while (timer < parameters.duration) {
    const token = Math.round(Math.random() * rangeDiff);
    const randomTimeout = parameters.range.min + token;
    const nextTimer = timer + parameters.timeout + randomTimeout;

    if (nextTimer > parameters.duration) {
      break;
    }

    const randomInstruction = SELECTED_INSTRUCTIONS[Math.floor(Math.random() * SELECTED_INSTRUCTIONS.length)];
    timer = nextTimer;

    generatedInstructions.push({
      code: randomInstruction.replacementCode || randomInstruction.code,
      label: randomInstruction.label,
      color: randomColors ? getRandomColor() : randomInstruction.color,
      timeout: randomTimeout
    });
  }

  const rules = {
    dialogTimeout: parameters.rulesDuration,
    randomColors,
    allRules: SELECTED_INSTRUCTIONS
      .sort((a, b) => a.order - b.order)
      .map(i => ({
        code: i.code,
        label: i.label,
        color: i.color,
        replacementCode: i.replacementCode,
        replacementLabel: !i.replacementCode ? null : SELECTED_INSTRUCTIONS.find(si => si.code === i.replacementCode).label,
        replacementColor: !i.replacementCode ? null : SELECTED_INSTRUCTIONS.find(si => si.code === i.replacementCode).color,
        description: !i.replacementCode ? i.description : SELECTED_INSTRUCTIONS.find(si => si.code === i.replacementCode).description
      }))
  };

  CURRENT_SEQUENCE_INSTRUCTION = {
    id: dateId(),
    instructions: generatedInstructions,
    rules
  };

  console.log(CURRENT_SEQUENCE_INSTRUCTION);
  document.querySelector("#sequence-id span").innerHTML = CURRENT_SEQUENCE_INSTRUCTION.id;
  WS_CLIENT.emit("setSequence", CURRENT_SEQUENCE_INSTRUCTION);
  enableLaunchGame();
};

const getRandomColor = () => {
  return basicInstructions[Math.floor(Math.random() * basicInstructions.length)].color;
};

const deleteSequence = () => {
  WS_CLIENT.emit("deleteSequence", "");
  CURRENT_SEQUENCE_INSTRUCTION.rules.allRules.forEach(r => removeSelectedInstruction(r.code));
  CURRENT_SEQUENCE_INSTRUCTION = null;
  disableLaunchGame();
};

const setExistingSequence = sequence => {
  if (!sequence) {
    return;
  }
  CURRENT_SEQUENCE_INSTRUCTION = sequence;

  if (CURRENT_SEQUENCE_INSTRUCTION.rules.randomColors) {
    document.getElementById("randomColors").checked = true;
  }
  CURRENT_SEQUENCE_INSTRUCTION.rules.allRules.forEach(r => selectInstruction(r.code));
  CURRENT_SEQUENCE_INSTRUCTION.rules.allRules.forEach(r => r.replacementCode && selectReplacement(r.code, r.replacementCode));
  document.querySelector("#sequence-id span").innerHTML = CURRENT_SEQUENCE_INSTRUCTION.id;
  enableLaunchGame();
};

const enableLaunchGame = () => {
  document.getElementById("sequence-id").classList.remove("hidden");
  document.getElementById("launch-game").disabled = false;
};

const disableLaunchGame = () => {
  document.getElementById("sequence-id").classList.add("hidden");
  document.getElementById("launch-game").disabled = true;
};

const launchGame = () => {
  WS_CLIENT.emit("launchGame", "");
};