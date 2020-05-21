const INSTRUCTION = document.getElementById("instruction");
INSTRUCTION.classList.add("instruction-animation__out");

const showInstruction = (message, color) => {
  INSTRUCTION.innerHTML = message;
  INSTRUCTION.className = INSTRUCTION.className.replace( /(?:^|(?<= ))(glow-[a-z\-]+)(?:(?= )|$)/ , '' )
  // INSTRUCTION.classList.remove("glow-" + color);
  INSTRUCTION.classList.add("glow-" + color);

  INSTRUCTION.classList.remove("instruction-animation__out");
  INSTRUCTION.classList.add("instruction-animation__in");
};

const hideInstruction = () => {
  INSTRUCTION.classList.remove("instruction-animation__in");
  INSTRUCTION.classList.add("instruction-animation__out");
};

const randomId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

/* ***********************************************************************************
 *************************************************************************************
 *******************************                       *******************************
 *******************************    EVENT LISTENERS    *******************************
 *******************************                       *******************************
 *************************************************************************************
 ************************************************************************************* */
const isNumbers = keyNumber => [34, 38, 39, 40, 45, 95, 224, 231, 232, 233,
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(keyNumber);

const isLetter = keyNumber => (keyNumber >= 97 && keyNumber <= 122) || (keyNumber >= 65 && keyNumber <= 90);
const isSpace = keyNumber => keyNumber === 32;

window.addEventListener("keypress", e => {
  const input = isNumbers(e.which) ? "number" :
    isLetter(e.which) ? "letter" :
      isSpace(e.which) ? "space" : null;
  input && handleInput(input);
});
window.addEventListener("click", e => {
  handleInput("click");
});
window.addEventListener("mousemove", e => {
  handleInput("shake");
});