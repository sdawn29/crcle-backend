const auth = require('../middleware/auth');
const {
    Post,
    validate
} = require('../models/post');
const {
    User
} = require('../models/user')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await Post.find().sort('points').select('title body author points createdAt').populate('author', 'username _id');
    res.status(200).send({
        status: "success",
        posts
    });
});

router.get('/:id', async (req, res) => {
    const Post = await Post.findById(req.params.id);

    if (!Post) return res.status(404).send('The post with the given ID is not found');

    res.status(200).send({
        status: "success",
        Post
    });
})

router.post('/', [auth], async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send({
        status: "error",
        errorMsg: "ERR_VALIDATION",
        data: error.details[0].message
    });

    try {
        const post = new Post({
            title: req.body.title,
            body: req.body.body,
            postType: req.body.postType,
            author: req.body.author,
            link: req.body.link,
        });
        await post.save();
        res.status(200).send({
            status: "success",
            post
        });

        //Updating post into users collection 
        await User.findOneAndUpdate(req.body.author, {
            "$push": {
                "posts": post._id
            }
        }, {
            "new": true,
            "upsert": true
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: "error",
            msg: err
        })
    }

});


// Api endpoint to incement or decrement points in posts
router.put('/:id/:action', [auth], async (req, res) => {
    if (req.params.action == 'upvote') {
        try {
            await Post.findOneAndUpdate(req.params.id, {
                $inc: {
                    points: 1
                }
            }, {
                new: true
            });

        } catch (err) {
            console.log(err)
        }
    }

    if (req.params.action == 'downvote') {
        try {
            await Post.findOneAndUpdate(req.params.id, {
                $inc: {
                    points: -1
                }
            }, {
                new: true
            });

        } catch (err) {
            console.log(err)
        }
    }
    res.status(200).send({
        status: "success",
        Post
    });
});


router.put('/:id', [auth], async (req, res) => {

    const Post = await Post.findOneAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
    }, {
        new: true
    });

    res.status(200).send({
        status: "success",
        Post
    });
});

router.delete('/:id', [auth], async (req, res) => {
    const Post = await Post.findByIdAndRemove(req.params.id);

    if (!Post) return res.status(404).send({
        status: "error",
        msg: "The Post with the given ID is not found"
    });

    res.status(200).send({
        status: "success",
        Post
    });
})



module.exports = router;