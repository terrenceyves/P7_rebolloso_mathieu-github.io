CREER UN RESEAU SOCIAL D'ENTREPRISE
Projet n°7 du parcours développeur web chez OpenClassrooms qui a pour objectif:

Authentifier un utilisateur et maintenir sa session
Personnaliser le contenu envoyé à un client web
Gérer un stockage de données à l'aide d'une base de donnée
Implémenter un stockage de données sécurisé 

Technologies utilisées
angular
Sass
NodeJS
ExpressJS
mongodb
bootstrap
Prérequis:
    Avoir installé GIT, NODE, npm et angular sur sa machine
INSTRUCTIONS
POUR LE REPOSITORY
Cloner le repository avec la commande
git clone git@github.com:mathoin33/P7_rebolloso_mathieu-github.io.git
Ouvrez un deuxième terminal.


POUR LE BACKEND
Ouvrez le fichier " .env-sample " : vous devez assigner des valeurs aux variables suivantes:
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
USER_TOKEN=
DB_PORT: pour personnaliser le port de la bdd (laisser vide pour le port par defaut)

DB_USERNAME: votre nom d'utilisateur pour votre base de données.

DB_PASSWORD: votre mot de passe pour votre base de données.

USER_TOKEN = variable de votre choix.

Renommer ce dossier en " .env "

Dans un nouveau terminal, a partir du dossier précédemment téléchargé, on accède au dossier Backend

cd backend
puis on installe les dépendances
npm install
enfin, quand l'installation des dépendances est terminée
npm start
ce message doit apparaitre dans la console
Connexion à la base de données: SUCCES !
POUR LE FRONTEND
Dans un nouveau terminal, on accède au dossier frontend
cd frontend
puis on installe les dépendances
npm install
enfin, quand l'installation des dépendances est terminée
npm start
DANS LE NAVIGATEUR
Ouvrez votre navigateur à l'adresse: http://localhost:3001/