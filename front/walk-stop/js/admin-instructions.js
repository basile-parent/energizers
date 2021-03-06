const basicInstructions = [
    { order: 1, code: "click", label: "Clic", color: "green", description: "Clic gauche de la souris.", selected: false },
    { order: 2, code: "letter", label: "Lettre", color: "red", description: "Taper sur n'importe quelle lettre (minuscule ou majuscule).", selected: false },
    { order: 3, code: "number", label: "Chiffre", color: "blue", description: "Taper sur n'importe quel chiffre (pavé numérique ou touches à accents).", selected: false },
    { order: 4, code: "space", label: "Espace", color: "light-yellow", description: "Taper sur la touche Espace du clavier.", selected: false },
    { order: 5, code: "nothing", label: "Rien", color: "pink", description: "Ne RIEN faire.", selected: false },
    { order: 6, code: "shake", label: "Secoue", color: "yellow", description: "Bouger la souris.", selected: false }
];

let SELECTED_INSTRUCTIONS = [];

const updateInstructionList = () => {
  document.querySelector("#instruction-list ul").innerHTML =
    basicInstructions
      .map(instruction => `
      <li class="${ instruction.selected ? "selected" : "toto" }" onClick="selectInstruction('${ instruction.code }')">
        <span class="lexique__${ instruction.color }">${ instruction.label }</span>
      </li>
      `)
      .join("")
};

const _getReplacementColor = instruction => {
    if (!instruction.replacementCode) {
        return null;
    }
    const replacement = basicInstructions.find(i => i.code === instruction.replacementCode);
    return replacement?.color;
};

const updateSelectedInstructionList = () => {
    document.querySelector("#selected-instructions ul").innerHTML =
      SELECTED_INSTRUCTIONS
        .sort((a, b) => a.order - b.order)
        .map(instruction => `
            <li>
                <span class="lexique__${ instruction.color }">${ instruction.label }</span>
                <span class="${ !instruction.replacementCode ? "noReplacement" : "" }"> 🡆 </span>
                <span class="${ !instruction.replacementCode ? "noReplacement" : "" }">
                    <select onChange="selectReplacement('${ instruction.code }', this.value);" class="lexique__${ _getReplacementColor(instruction) }">
                        <option value="">--</option>
                        ${ SELECTED_INSTRUCTIONS
                            .filter(i => i.code !== instruction.code && (!i.replacementCode || i.replacementCode === instruction.code))
                            .map(i => `<option class="lexique__${ i.color }" 
                                                ${ instruction.replacementCode === i.code && "selected" }
                                                value="${ i.code }">${ i.label }</option>`)
                        }
                    </select>
                </span>
                <span class="selected-instructions__delete" onClick="removeSelectedInstruction('${ instruction.code }')">X</span>
            </li>
      `)
        .join("")
};

const selectReplacement = (code, replacementCode) => {
    const previousReplacementCode = SELECTED_INSTRUCTIONS.find(i => i.code === code).replacementCode;
    SELECTED_INSTRUCTIONS.find(i => i.code === code).replacementCode = replacementCode;
    if (replacementCode) {
        SELECTED_INSTRUCTIONS.find(i => i.code === replacementCode).replacementCode = code;
    } else {
        SELECTED_INSTRUCTIONS.find(i => i.code === previousReplacementCode).replacementCode = null;
    }
    updateSelectedInstructionList();
    disableLaunchGame();
};

const selectInstruction = code => {
    if (SELECTED_INSTRUCTIONS.find(i => i.code === code)) {
        return;
    }
    const instruction = basicInstructions.find(i => i.code === code);
    instruction.selected = true;
    console.log(instruction);
    console.log(basicInstructions);
    SELECTED_INSTRUCTIONS.push(instruction);

    updateInstructionList();
    updateSelectedInstructionList();
    disableLaunchGame();
};

const removeSelectedInstruction = code => {
    SELECTED_INSTRUCTIONS = SELECTED_INSTRUCTIONS.filter(i => i.code !== code);
    const instruction = basicInstructions.find(i => i.code === code);
    instruction.selected = false;

    const replacement = SELECTED_INSTRUCTIONS.find(i => i.replacementCode === code);
    if (replacement) {
        replacement.replacementCode = null;
    }
    updateInstructionList();
    updateSelectedInstructionList();
    disableLaunchGame();
};

updateInstructionList();
