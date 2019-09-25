const Joi = require('joi');
const mongoose = require('mongoose');

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
    },

    postType: {
        type: String,
        maxlength: 5,
    },

    link: {
        type: String,
    },

    points: {
        type: Number,
    },

    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
    }],

    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Post = mongoose.model('Post', postSchema);

function validatepost(post) {
    const schema = {
        title: Joi.string().required().min(5).max(120),
        body: Joi.string().required().max(20000),
    }

    return Joi.validate(post, schema);
}

exports.Post = Post;
exports.validate = validatePost;