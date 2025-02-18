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

function capturerPion(deCase, versCase) {
    const deLigne = Array.from(damier.children).indexOf(deCase.parentElement);
    const deColonne = Array.from(deCase.parentElement.children).indexOf(deCase);
    const versLigne = Array.from(damier.children).indexOf(versCase.parentElement);
    const versColonne = Array.from(versCase.parentElement.children).indexOf(versCase);
  
    const ligneCapture = (deLigne + versLigne) / 2;
    const colonneCapture = (deColonne + versColonne) / 2;
  
    const caseCapture = damier.children[ligneCapture].children[colonneCapture];
    const pionCapture = caseCapture.querySelector('.pion');
  
    if (pionCapture && !pionCapture.classList.contains(tour)) {
      caseCapture.removeChild(pionCapture);
      return true;
    }
  
    return false;
  }

  function deplacerPion(deCase, versCase) {
    const pion = deCase.querySelector('.pion');
    if (estDeplacementValide(deCase, versCase)) {
      if (capturerPion(deCase, versCase)) {
        versCase.appendChild(pion);
        if (!peutCapturerEncore(versCase)) {
          changerTour();
        }
      } else {
        versCase.appendChild(pion);
        changerTour();
      }
    }
  }

  function verifierPromotion(caseElement) {
    const pion = caseElement.querySelector('.pion');
    const ligne = Array.from(damier.children).indexOf(caseElement.parentElement);
  
    if (pion && !pion.classList.contains('dame')) {
      if ((tour === 'blanc' && ligne === 0) || (tour === 'noir' && ligne === tailleDamier - 1)) {
        pion.classList.add('dame');
      }
    }
  }

  function deplacerPion(deCase, versCase) {
    const pion = deCase.querySelector('.pion');
    if (estDeplacementValide(deCase, versCase)) {
      versCase.appendChild(pion);
      verifierPromotion(versCase);
      changerTour();
    }
  }

  function verifierFinDePartie() {
    const pionsBlancs = document.querySelectorAll('.pion.blanc').length;
    const pionsNoirs = document.querySelectorAll('.pion.noir').length;
  
    if (pionsBlancs === 0) {
      alert('Les noirs ont gagné !');
      return true;
    }
    if (pionsNoirs === 0) {
      alert('Les blancs ont gagné !');
      return true;
    }
  
    return false;
  }

  function changerTour() {
    tour = tour === 'blanc' ? 'noir' : 'blanc';
    if (verifierFinDePartie()) {
      // Réinitialiser le jeu ou afficher un message
    }
  }

let pionSelectionne = null;

damier.addEventListener('click', (event) => {
  const caseCible = event.target;

  if (caseCible.classList.contains('pion')) {
    // Sélectionner un pion
    if (caseCible.classList.contains(tour)) {
      pionSelectionne = caseCible.parentElement;
      pionSelectionne.classList.add('selectionne');
    }
  } else if (caseCible.classList.contains('case')) {
    // Déplacer le pion sélectionné
    if (pionSelectionne) {
      deplacerPion(pionSelectionne, caseCible);
      pionSelectionne.classList.remove('selectionne');
      pionSelectionne = null;
    }
  }
});

function estDeplacementValide(deCase, versCase) {
  const deLigne = Array.from(damier.children).indexOf(deCase.parentElement);
  const deColonne = Array.from(deCase.parentElement.children).indexOf(deCase);
  const versLigne = Array.from(damier.children).indexOf(versCase.parentElement);
  const versColonne = Array.from(versCase.parentElement.children).indexOf(versCase);

  const direction = tour === 'blanc' ? -1 : 1; // Les blancs vont vers le haut, les noirs vers le bas

  // Vérifie si le déplacement est en diagonale et d'une case
  if (Math.abs(versLigne - deLigne) === 1 && Math.abs(versColonne - deColonne) === 1) {
    return true;
  }

  return false;
}

// Démarrer le jeu
initialiserDamier();