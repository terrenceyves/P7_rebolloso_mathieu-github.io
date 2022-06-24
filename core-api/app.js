const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const postsRoute = require('./routes/post');
const bodyParser= require('body-parser');

const path = require('path');
require('dotenv').config({ path: require('find-config')('.env') })


//Permet de créer le serveur
const app = express();
//on retourne tout en json
app.use(express.json());


//connexion a la bdd
mongoose.connect("mongodb+srv://"+process.env.USERNAME_BDD+":"+process.env.PASSWORD_BDD+"@"+process.env.SERVEUR_BDD+"/?retryWrites=true&w=majority",
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//On mets des headers aux req
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//On créer des routes qu'on envoie au fichiers routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/posts', postsRoute);

//Execution du fichier
module.exports = app;