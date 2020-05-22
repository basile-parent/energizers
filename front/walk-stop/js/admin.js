const basicInstructions = [
    { order: 1, code: "click", label: "Clic", color: "green", description: "Taper sur n'importe quelle lettre (minuscule ou majuscule).", selected: false },
    { order: 2, code: "letter", label: "Lettre", color: "red", description: "Clic gauche de la souris.", selected: false },
    { order: 3, code: "number", label: "Chiffre", color: "blue", description: "Taper sur la touche Espace du clavier.", selected: false },
    { order: 4, code: "space", label: "Espace", color: "light-yellow", description: "Taper sur n'importe quel chiffre (pavé numérique ou touches à accents).", selected: false },
    { order: 5, code: "nothing", label: "Rien", color: "pink", description: "Ne RIEN faire.", selected: false },
    { order: 6, code: "shake", label: "Secoue", color: "yellow", description: "Bouger la souris.", selected: false }
];

let selectedInstructions = [];

const updateInstructionList = () => {
  document.querySelector("#instruction-list ul").innerHTML =
    basicInstructions
      .map(instruction => `
      <li class="${ instruction.selected ? "selected" : "" }" onClick="selectInstruction('${ instruction.code }')">
        <span class="lexique__${ instruction.color }">${ instruction.label }</span>
      </li>
      `)
      .join("")
};

const updateSelectedInstructionList = () => {
    document.querySelector("#selected-instructions ul").innerHTML =
      selectedInstructions
        .sort((a, b) => a.order - b.order)
        .map(instruction => `
            <li>
                <span class="lexique__${ instruction.color }">${ instruction.label }</span>
                <span class="${ !instruction.replacementCode ? "noReplacement" : "" }"> 🡆 </span>
                <span class="${ !instruction.replacementCode ? "noReplacement" : "" }">
                    <select onChange="selectReplacement('${ instruction.code }', this.value)">
                        <option value="">--</option>
                        ${ selectedInstructions
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
    const previousReplacementCode = selectedInstructions.find(i => i.code === code).replacementCode;
    selectedInstructions.find(i => i.code === code).replacementCode = replacementCode;
    if (replacementCode) {
        selectedInstructions.find(i => i.code === replacementCode).replacementCode = code;
    } else {
        selectedInstructions.find(i => i.code === previousReplacementCode).replacementCode = null;
    }
    updateSelectedInstructionList();
};

const selectInstruction = code => {
    if (selectedInstructions.find(i => i.code === code)) {
        return;
    }
    const instruction = basicInstructions.find(i => i.code === code);
    instruction.selected = true;
    selectedInstructions.push(instruction);
    updateInstructionList();
    updateSelectedInstructionList();
};

const removeSelectedInstruction = code => {
    selectedInstructions = selectedInstructions.filter(i => i.code !== code);
    const replacement = selectedInstructions.find(i => i.replacementCode === code);
    if (replacement) {
        replacement.replacementCode = null;
    }
    updateSelectedInstructionList();
};

updateInstructionList();