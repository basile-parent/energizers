// let CODE = "QI HYIFMLIR HAF OMI BI FIMB LVSIQ PI JAJQIY IFZ PI CVQCVMYKY, HAYDVKF BI LIKBBIMY LVSIQ PI JAJQIY IFZ PI CVVHIYIY AWIC P'AMZYIF.";
let CODE = "";
// Alphabet : AXCPIDJTKUEBLQVHOYFZMWGNSR

// https://www.dcode.fr/substitution-monoalphabetique
// Solution : NE PRESUMEZ PAS QUE LE SEUL MOYEN DE GAGNER EST DE CONCOURIR, PARFOIS LE MEILLEUR MOYEN DE GAGNER EST DE COOPERER AVEC D'AUTRES.
// Alphabet de substitution : AZERTYUIOPQSDFGHJKLMWXCVBN
// const CODE = "FT HKTLWDTN HAL JWT ST LTWS DGBTF RT UAUFTK TLM RT EGFEGWKOK, HAKYGOL ST DTOSSTWK DGBTF RT UAUFTK TLM RT EGGHTKTK AXTE R'AWMKTL.";

const fillCode = code => {
  let html = "";
  CODE = code;
  for (let i in CODE) {
    if (CODE[i] < "A" || CODE[i] > "Z") {
      html += CODE[i];
    } else {
      html += `<span class="letter">${CODE[i]}</span>`;
    }
  }
  document.getElementById("code").innerHTML = html;

  fillDecodeInput();
};

const fillDecodeInput = () => {
  document.getElementById("decode").innerHTML =
    CODE.split(" ").map(c => {
      console.log(c);
      let html = '<span class="nowrap">';
      for (let i in c) {
        if (c[i] < "A" || c[i] > "Z") {
          html += c[i];
        } else {
          html += `<input class="letter" type="text" value="${c[i]}" />`;
        }
      }
      html += "</span>";
      return html;
    }).join(" ");
};

// fillCode();
// fillDecodeInput();