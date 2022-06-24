const Post = require('../models/post');
const Service = require('../services/admin.service');
const modelUser = require('../models/user');

const fs = require('fs');
const jwt = require("jsonwebtoken");
const {models} = require("mongoose");

exports.create = (req, res, next) => {
    const postObj = JSON.parse(req.body.post);
    delete postObj._id;
    const post = new Post({
        ...postObj,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.getAll = (req, res, next) => {
    Post.find().sort({date: "desc"})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
}

exports.getOne = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(404).json({ error }));
}

exports.update = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    const adminCheck = decodedToken.admin;
    Post.findOne({ _id: req.params.id })
        .then ( post => {
            if (post.userId.includes(req.body.userId) || adminCheck) {
                //On regarde si l'image est aussi modifié avec les autres informations
                const postObj = req.file ?
                    {
                        ...JSON.parse(req.body.post),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    } : { ...req.body };
                //On mets à jour la bdd avec les nouvelles infos
                Post.updateOne({ _id: req.params.id }, { ...postObj, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                    .catch(error => res.status(400).json({ message: "Vous ne pouvez pas modifier ce post" }));
            } else {
                res.json({ message: "Non autorisé" })
                return false;
            }
        })
        .catch(error => res.status(400).json({ error }))
}

exports.delete = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    const adminCheck = decodedToken.admin;
    Post.findOne({ _id: req.params.id })
        //Si la sauce est trouvé alors on continue
        .then(post => {
            if (post.userId.includes(req.body.userId) || adminCheck) {
                //Et on supprime l'img du server
                const filename = post.imageUrl.split('/images/')[1];
                //Si l'img est vbien supprimé alors on supprime aussi les infos en bdd sinon on laisse tout
                fs.unlink(`images/${filename}`, () => {
                    Post.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Le post a était supprimé !'}))
                        .catch(error => res.status(400).json({error}));
                });
            } else {
                res.json({ message: "Non autorisé" })
                return false;
            }
        })
        .catch(error => res.status(500).json({ error }));
}

exports.likeOrNot = (req, res, next) => {
    if (req.body.like === 1) {
        Post.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    } else if (req.body.like === -1) {
        Post.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    } else {
        Post.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Post.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Post.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
}