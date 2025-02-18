document.addEventListener('DOMContentLoaded', function () {
    const damier = document.getElementById('damier');
    const tailleDamier = 8;
    let cases = [];
    let tour = 'blanc';
    let pionSelectionne = null;

    const deplacementSound = new Audio('moves.mp3');
    const captureSound = new Audio('capture.mp3');

    function initialiserDamier() {
        damier.innerHTML = ''; // Réinitialiser le damier
        cases = [];
        for (let ligne = 0; ligne < tailleDamier; ligne++) {
            cases[ligne] = [];
            for (let colonne = 0; colonne < tailleDamier; colonne++) {
                const caseElement = document.createElement('div');
                caseElement.classList.add('case');
                if ((ligne + colonne) % 2 === 0) {
                    caseElement.classList.add('noire');
                }
                damier.appendChild(caseElement);

                if (ligne < 3 && (ligne + colonne) % 2 !== 0) {
                    ajouterPion(caseElement, 'noir');
                }
                if (ligne > 4 && (ligne + colonne) % 2 !== 0) {
                    ajouterPion(caseElement, 'blanc');
                }

                cases[ligne][colonne] = caseElement;
            }
        }
        mettreAJourInfo();
    }

    function ajouterPion(caseElement, couleur) {
        const pion = document.createElement('div');
        pion.classList.add('pion', couleur);
        caseElement.appendChild(pion);
    }

    function deplacerPion(deCase, versCase) {
        const pion = deCase.querySelector('.pion');
        if (estDeplacementValide(deCase, versCase)) {
            const capture = capturerPion(deCase, versCase);
            animerPion(pion, deCase, versCase, () => {
                versCase.appendChild(pion);
                verifierPromotion(versCase);
                if (capture && peutCapturerEncore(versCase)) {
                    return;
                }
                changerTour();
            });
            deplacementSound.play();
        }
    }

    function animerPion(pion, deCase, versCase, callback) {
        pion.classList.add('en-mouvement');
        const deRect = deCase.getBoundingClientRect();
        const versRect = versCase.getBoundingClientRect();
        const deltaX = versRect.left - deRect.left;
        const deltaY = versRect.top - deRect.top;
        pion.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        setTimeout(() => {
            pion.style.transform = '';
            pion.classList.remove('en-mouvement');
            callback();
        }, 300);
    }

    function capturerPion(deCase, versCase) {
        const [deLigne, deColonne] = obtenirCoordonnees(deCase);
        const [versLigne, versColonne] = obtenirCoordonnees(versCase);
        const ligneCapture = (deLigne + versLigne) / 2;
        const colonneCapture = (deColonne + versColonne) / 2;

        // Ensure the coordinates are within bounds
        if (ligneCapture < 0 || ligneCapture >= tailleDamier || colonneCapture < 0 || colonneCapture >= tailleDamier) {
            return false;
        }

        const caseCapture = cases[ligneCapture][colonneCapture];
        const pionCapture = caseCapture.querySelector('.pion');

        if (pionCapture && !pionCapture.classList.contains(tour)) {
            caseCapture.removeChild(pionCapture);
            captureSound.play();
            mettreAJourInfo();
            return true;
        }
        return false;
    }

    function verifierPromotion(caseElement) {
        const pion = caseElement.querySelector('.pion');
        const ligne = obtenirCoordonnees(caseElement)[0];

        if (pion && !pion.classList.contains('dame')) {
            if ((tour === 'blanc' && ligne === 0) || (tour === 'noir' && ligne === tailleDamier - 1)) {
                pion.classList.add('dame');
            }
        }
    }

    function peutCapturerEncore(versCase) {
        const [ligne, colonne] = obtenirCoordonnees(versCase);
        const directions = [[2, 2], [2, -2], [-2, 2], [-2, -2]];

        for (let [dx, dy] of directions) {
            const nouvelleLigne = ligne + dx;
            const nouvelleColonne = colonne + dy;
            if (nouvelleLigne >= 0 && nouvelleLigne < tailleDamier && nouvelleColonne >= 0 && nouvelleColonne < tailleDamier) {
                const caseCible = cases[nouvelleLigne][nouvelleColonne];
                if (estDeplacementValide(versCase, caseCible) && capturerPion(versCase, caseCible)) {
                    return true;
                }
            }
        }
        return false;
    }

    function estDeplacementValide(deCase, versCase) {
        if (!versCase || versCase.querySelector('.pion')) return false;
        const [deLigne, deColonne] = obtenirCoordonnees(deCase);
        const [versLigne, versColonne] = obtenirCoordonnees(versCase);
        const direction = tour === 'blanc' ? -1 : 1;
        const pion = deCase.querySelector('.pion');

        if (pion.classList.contains('dame')) {
            return Math.abs(versLigne - deLigne) === Math.abs(versColonne - deColonne);
        }

        if (Math.abs(versLigne - deLigne) === 1 && Math.abs(versColonne - deColonne) === 1) {
            return (versLigne - deLigne) === direction;
        }

        return Math.abs(versLigne - deLigne) === 2 && Math.abs(versColonne - deColonne) === 2;
    }

    function obtenirCoordonnees(caseElement) {
        for (let ligne = 0; ligne < tailleDamier; ligne++) {
            for (let colonne = 0; colonne < tailleDamier; colonne++) {
                if (cases[ligne][colonne] === caseElement) {
                    return [ligne, colonne];
                }
            }
        }
        return [-1, -1];
    }

    function changerTour() {
        tour = tour === 'blanc' ? 'noir' : 'blanc';
        pionSelectionne = null;
        mettreAJourInfo();
        if (verifierFinDePartie()) {
            setTimeout(initialiserDamier, 2000); // Réinitialiser le jeu après 2 secondes
        }
    }

    function mettreAJourInfo() {
        document.getElementById('tour').textContent = `Tour : ${tour.charAt(0).toUpperCase() + tour.slice(1)}`;
        const pionsBlancs = document.querySelectorAll('.pion.blanc').length;
        const pionsNoirs = document.querySelectorAll('.pion.noir').length;
        document.getElementById('score').textContent = `Blancs : ${pionsBlancs} | Noirs : ${pionsNoirs}`;
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

    document.getElementById('reset').addEventListener('click', initialiserDamier);

    damier.addEventListener('click', (event) => {
        const caseCible = event.target.closest('.case');
        if (caseCible && pionSelectionne) {
            deplacerPion(pionSelectionne, caseCible);
            pionSelectionne.classList.remove('selectionne');
            pionSelectionne = null;
        } else if (caseCible?.querySelector('.pion')?.classList.contains(tour)) {
            pionSelectionne = caseCible;
            pionSelectionne.classList.add('selectionne');
        }
    });

    initialiserDamier();
});
