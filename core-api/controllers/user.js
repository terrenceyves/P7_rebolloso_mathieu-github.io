
//ompartation du package de pour hasher les mot de passe
const bcrypt = require('bcrypt')
//importation du package jsonwebtoken pour les jeton d'authentification
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const path = require('path');
require('dotenv').config({ path: require('find-config')('.env') })

//regex pour les email
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
// fonction inscription
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            if (Object.keys(req.body.email).length === 0 || Object.keys(req.body.password).length === 0) {
                res.json({ message: "Vous devez remplir les deux champs" })
                return false;
            }

            if (validateEmail(req.body.email)) {
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ message: "Cet email est déjà utilisé" }));
            } else {
                res.json({ message: "Votre email n'est pas valide" })
            }

        })
        .catch(error => res.status(500).json({ error }));
};
// conexion utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(400).json({ message: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        admin: user.admin,
                        token: jwt.sign(
                            { userId: user._id, admin: user.admin },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};