const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    usersLiked: [{ type: String, default: null }],
    usersDisliked: [{ type: String, default: null }],
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Posts', postSchema);