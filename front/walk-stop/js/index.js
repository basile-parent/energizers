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
const isNumber = keyNumber => [34, 38, 39, 40, 45, 95, 224, 231, 232, 233,
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(keyNumber);

const isLetter = keyNumber => (keyNumber >= 97 && keyNumber <= 122) || (keyNumber >= 65 && keyNumber <= 90);
const isSpace = keyNumber => keyNumber === 32;

window.addEventListener("keypress", e => {
  const input = isNumber(e.which) ? "number" :
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