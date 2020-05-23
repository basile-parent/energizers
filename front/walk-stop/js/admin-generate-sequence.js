let CURRENT_SEQUENCE_INSTRUCTION = null;

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

const generateSequence = () => {
  const selectedInstructions = SELECTED_INSTRUCTIONS;
  if (selectedInstructions.length < 2) {
    alert("Vous devez sélectionner au minimum 2 instructions");
    throw new Error("You must choose instructions at leasts 2 instructions");
  }

  const parameters = getParameters();
  const generatedInstructions = [];
  let timer = 0;
  const rangeDiff = parameters.range.max - parameters.range.min;
  while (timer < parameters.duration) {
    const token = Math.round(Math.random() * rangeDiff);
    const randomTimeout = parameters.range.min + token;
    const nextTimeout = timer + randomTimeout;

    if ((nextTimeout + parameters.timeout) > parameters.duration) {
      break;
    }

    const randomInstruction = SELECTED_INSTRUCTIONS[Math.floor(Math.random() * SELECTED_INSTRUCTIONS.length)];
    timer += randomTimeout;

    generatedInstructions.push({
      code: randomInstruction.replacementCode || randomInstruction.code,
      label: randomInstruction.label,
      color: randomInstruction.color,
      timeout: randomTimeout
    });
  }

  const rules = {
    dialogTimeout: parameters.rulesDuration,
    randomColors: false,
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
  document.querySelector("#sequence-id span").innerHTML = CURRENT_SEQUENCE_INSTRUCTION.id;
  WS_CLIENT.emit("setSequence", CURRENT_SEQUENCE_INSTRUCTION);
  enableLaunchGame();
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