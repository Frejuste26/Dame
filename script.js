// script.js
const damier = document.getElementById('damier');
const tailleDamier = 8;
let cases = [];
let tour = 'blanc'; // 'blanc' ou 'noir'

// Initialisation du damier
function initialiserDamier() {
  for (let ligne = 0; ligne < tailleDamier; ligne++) {
    cases[ligne] = [];
    for (let colonne = 0; colonne < tailleDamier; colonne++) {
      const caseElement = document.createElement('div');
      caseElement.classList.add('case');
      if ((ligne + colonne) % 2 === 0) {
        caseElement.classList.add('noire');
      }
      damier.appendChild(caseElement);

      // Placer les pions initiaux
      if (ligne < 3 && (ligne + colonne) % 2 !== 0) {
        const pion = document.createElement('div');
        pion.classList.add('pion', 'noir');
        caseElement.appendChild(pion);
      }
      if (ligne > 4 && (ligne + colonne) % 2 !== 0) {
        const pion = document.createElement('div');
        pion.classList.add('pion', 'blanc');
        caseElement.appendChild(pion);
      }

      cases[ligne][colonne] = caseElement;
    }
  }
}

// Gestion des clics sur les cases
damier.addEventListener('click', (event) => {
  const caseCible = event.target;
  if (caseCible.classList.contains('pion')) {
    console.log('Pion cliqué !');
    // Ajoute ici la logique pour sélectionner et déplacer les pions
  }
});

// Démarrer le jeu
initialiserDamier();