const encode = () => {
  const solution = document.getElementById("solution_input").value.toUpperCase();
  const alphabet = document.getElementById("alphabet_input").value.toUpperCase();

  // if (alphabet.length !== 26) {
  //   alert("L'alphabet doit contenir 26 caractères.");
  //   return;
  // }

  let code = "";
  const indexA = "A".charCodeAt(0);
  for (let i in solution) {
    const char = solution.charCodeAt(i);
    const index = char - indexA;
    if (index >= 0 && index < 26) {
      code += alphabet[index];
    } else {
      code += solution[i];
    }
  }

  document.getElementById("code_input").value = code;
  generateClues(code, solution, 10);
};

const generateClues = (code, solution, nbPlayers) => {
  const codeParts = code.split(" ");
  const solutionParts = solution.split(" ");

  const indices = [];
  for (let i = 0; i < codeParts.length; i++) {
    if (!indices.find(c => c.code === codeParts[i])) {
      indices.push({ code: codeParts[i], solution: solutionParts[i] });
    }
  }
  indices.sort(() => Math.random() - 0.5);

  const sumOfLettersByPlayer = Math.ceil(indices.map(c => c.code.length).reduce((acc, item) => acc += item, 0) / nbPlayers);
  console.log(sumOfLettersByPlayer);

  const indicesByPlayer = [];
  let nbPlayerClues = 0;
  let playerClues = [];
  let nbLettersForThisPlayer = 0;
  let i = 0;
  while (nbPlayerClues < nbPlayers) {
    if (nbLettersForThisPlayer > sumOfLettersByPlayer) {
      indicesByPlayer.push(playerClues);
      playerClues = [];
      nbLettersForThisPlayer = 0;
      nbPlayerClues++;
    }

    playerClues.push(indices[i % indices.length]);
    nbLettersForThisPlayer += indices[i % indices.length].code.length;
    i++;
  }

  console.log(indicesByPlayer);
  document.getElementById("clues").innerHTML =
    indicesByPlayer.map(pClues => pClues.map(clue => `${ clue.code }`).join(" / ")).map(c => `<li>${ c }</li>`).join("");
};
