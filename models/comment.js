const Joi = require('joi');
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        maxlength: 20000,
    },

    postId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
    },

    upvotes: {
        type: Number,
        default: 0
    },

    downvotes: {
        type: Number,
        default: 0
    },

    upvotedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
    }],

    downvotedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
    }],

    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    reply: [{
        type: String,
        default: []
    }],

    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Comment = mongoose.model('comment', commentSchema);

function validatecomment(comment) {
    const schema = {
        title: Joi.string().required().min(5).max(120),
        body: Joi.string().required().max(20000),
    }

    return Joi.validate(comment, schema);
}

exports.comment = Comment;
exports.validate = validateComment;