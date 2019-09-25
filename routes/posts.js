const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
const {Post, validate} = require('../models/Post');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const Posts = await Post.find().sort('points').select('title body difficulty');
    res.send({
        status: "success",
        data: {Posts}
    });
});

router.get('/:id', [auth], async (req, res) => {
    const Post = await Post.findById(req.params.id);

    if(!Post) return res.status(404).send('The course with the given ID is not found');

    res.send({
        status: "success",
        data: Post
    });
})

router.post('/', [auth, admin], async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send({
        status: "error",
        data: error.details[0].message
    });

    const Post = new Post({
        title: req.body.title,
        body: req.body.body,
        testcases: req.body.testcases,
        difficulty: req.body.difficulty
    });
    await Post.save();

    res.send({
        status: "success",
        data: Post
    });
});

router.put('/:id', [auth, admin], async (req, res) => {

    const Post = await Post.findOneAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        testcases: req.body.testcases,
        difficulty: req.body.difficulty
    },
    {new: true});

    res.send({
        status: "success",
        data: Post
    });
});

router.delete('/:id',[auth, admin], async (req, res) => {
    const Post = await Post.findByIdAndRemove(req.params.id);

    if(!Post) return res.status(404).send({
        status: "error",
        msg: "The Post with the given ID is not found"
    });

    res.send({
        status: "success",
        data: Post
    });
})



module.exports = router;