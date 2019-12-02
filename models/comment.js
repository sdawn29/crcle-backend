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

    replies: [{
        type: String,
        default: []
    }],

    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = {
        body: Joi.string().required().max(20000),
        author: Joi.objectId(),
        points: Joi.number(),
        createdAt: Joi.date(),
        postId: Joi.objectId()
    }

    return Joi.validate(comment, schema);
}

exports.Comment = Comment;
exports.validate = validateComment;