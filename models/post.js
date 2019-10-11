const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi)

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 120
    },
    body: {
        type: String,
        required: true,
        maxlength: 20000,
        default: '',
    },

    postType: {
        type: String,
        maxlength: 5,
    },

    link: {
        type: String,
        default: "",
    },

    points: {
        type: Number,
        default: 0
    },

    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
        default: ''
    }],

    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Post = mongoose.model('Post', postSchema);

function validatePost(post) {
    const schema = {
        title: Joi.string().required().min(5).max(120),
        body: Joi.string().required().max(20000),
        postType: Joi.string().required().max(5),
        author: Joi.objectId(),
        link: Joi.string().max(2048),
        points: Joi.number(),
        createdAt: Joi.date(),
        comments: Joi.objectId()
    }

    return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validatePost;