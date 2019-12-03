const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi)

const crcleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        maxlength: 500,
        default: 'No Description provided',
    },

    avatar: {
        type: String,
        maxlength: 5,
    },

    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'post',
        default: [],
    }],

    moderators: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: [],
    }],

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    theme: {
        type: String,
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Crcle = mongoose.model('Crcle', crcleSchema);

function validateCrcle(crcle) {
    const schema = {
        title: Joi.string().required().max(120),
        body: Joi.string().required().max(20000),
        crcleType: Joi.string().required().max(5),
        author: Joi.objectId(),
        link: Joi.string().max(2048),
        points: Joi.number(),
        createdAt: Joi.date(),
        comments: Joi.objectId()
    }

    return Joi.validate(crcle, schema);
}

exports.Crcle = Crcle;
exports.validate = validateCrcle;