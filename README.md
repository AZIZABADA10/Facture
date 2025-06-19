# Générateur de Facture PDF - Application React

![React](https://img.shields.io/badge/React-18.2.0-blue)
![jsPDF](https://img.shields.io/badge/jsPDF-2.5.1-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

Cette application React permet de créer et générer des factures professionnelles au format PDF avec une mise en page soignée. Elle offre une interface intuitive pour saisir les informations de facturation et prévisualiser le résultat avant impression.

## Fonctionnalités principales

-  Création de factures avec tous les éléments nécessaires
-  Gestion de plusieurs lignes de services
-  Calcul automatique des totaux (HT, TVA, TTC)
-  Aperçu en temps réel de la facture
-  Génération de PDF prêt à imprimer
-  Sauvegarde des informations de la société pour réutilisation
-  Interface responsive et conviviale

## Technologies utilisées

- **React** (v18.2.0) - Bibliothèque JavaScript pour les interfaces utilisateur
- **jsPDF** (v2.5.1) - Génération de documents PDF côté client
- **HTML5 & CSS3** - Structure et mise en page
- **JavaScript (ES6+)** - Logique de l'application
- **Date API** - Gestion des dates

## Installation et utilisation

### Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

### Étapes d'installation

1. Clonez le dépôt :
```bash
git clone https://github.com/AZIZABADA10/Facture.git
```

2. Accédez au répertoire du projet :
```bash
cd Facture
```

3. Installez les dépendances :
```bash
npm install
```

4. Lancez l'application :
```bash
npm start
```

5. Ouvrez votre navigateur à l'adresse :
```
http://localhost:3000
```

## Guide d'utilisation

### Création d'une facture

1. Remplissez les **Informations générales** :
   - Nom de la société
   - Date de facturation
   - Numéro de facture
   - Client et ICE
   - Taux de TVA

2. Ajoutez les **Services** :
   - Description du service
   - Montant (en DH)
   - Ajoutez ou supprimez des lignes selon vos besoins

3. Consultez les **Totaux** automatiquement calculés :
   - Total HT
   - Montant TVA
   - Total TTC

4. Complétez les **Informations complémentaires** :
   - Texte d'arrêté
   - Informations de votre société (capital, adresse, etc.)

5. Utilisez les boutons :
   - **Aperçu de la facture** pour visualiser le résultat
   - **Générer PDF directement** pour créer et imprimer immédiatement

### Prévisualisation

Dans la vue d'aperçu :
- Vérifiez tous les détails de votre facture
- Utilisez le bouton **Imprimer PDF** pour générer et imprimer le document final
- Cliquez sur **← Retour** pour modifier la facture

## Structure des fichiers

```
generateur-facture-pdf/
├── src/
│   ├── App.js             # Composant principal
│   ├── index.js           # Point d'entrée de l'application
│   ├── index.css          # Styles globaux
│   └── ...                # Autres fichiers React
├── public/
│   ├── index.html         # Template HTML principal
│   └── ...                # Autres ressources statiques
├── package.json           # Dépendances et scripts
└── README.md              # Ce fichier
```

## Personnalisation

Pour adapter l'application à vos besoins :

1. Modifiez les valeurs par défaut dans `App.js` :


2. Personnalisez le style dans `index.css` ou dans les styles en ligne dans `App.js`

3. Pour modifier le modèle de facture, éditez la fonction `generatePDF` dans `App.js`

## Développer par Abada Aziz 