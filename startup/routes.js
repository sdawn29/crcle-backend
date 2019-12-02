const users = require('../routes/users');
const auth = require('../routes/auth');
const posts = require('../routes/posts');
const comments = require('../routes/comments');

const express = require('express');
const cors = require('cors');

module.exports = function (app) {
    app.use(cors())
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/posts', posts);
    app.use('/api/comments', comments);
}