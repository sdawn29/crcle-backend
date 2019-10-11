const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

require('dotenv').config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    karma: {
        type: Number,
        default: 0
    },
    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    }]
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        username: this.username,
        role: this.role
    }, process.env.TOKEN_KEY);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        username: Joi.string().min(5).max(10).required(),
        password: Joi.string().min(8).max(255).required()
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;