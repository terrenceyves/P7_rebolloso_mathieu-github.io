const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {Schema} = require("mongoose");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);