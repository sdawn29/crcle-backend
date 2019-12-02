const auth = require('../middleware/auth');
const {
    Comment,
    validate
} = require('../models/comment');
const {
    User
} = require('../models/user')
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await Post.find().sort('-upvotes').populate('author', 'username _id isAdmin');
    res.status(200).send({
        status: "success",
        posts
    });
});

// Posts after authenticating
// router.get('/:username',auth,  async (req, res) => {

//     if (!Post) return res.status(404).send('The post with the given ID is not found');

//     res.status(200).send({
//         status: "success",
//         data: Post
//     });
// })

router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('author', 'username _id isAdmin');

        if (!Post) return res.status(404).send('The post with the given ID is not found');

        res.status(200).send({
            status: "success",
            post
        });

    } catch (e) {
        console.error(e)
        res.status(500).send({
            status: "error",
            error: "INERNAL_SERVER_ERROR"
        });
    }
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

    const title = req.body.title;
    const body = req.body.body;
    const author = req.body.author;
    try {
        const post = new Post({
            title: title,
            body: body,
            author: author,
        });
        await post.save();
        res.status(200).send({
            status: "success",
            post
        });

        //Updating post into users collection 
        await User.findByIdAndUpdate(author, {
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
router.put('/:id/:action/:user/:voted', [auth], async (req, res) => {
    if (req.params.action == 'upvote' && req.params.voted == 'true') {
        try {
            const post = await Post.findByIdAndUpdate(req.params.id, {
                $inc: {
                    upvotes: 1,
                    downvotes: -1
                },
                $push: {
                    upvotedBy: req.params.user,
                },
                $pull: {
                    downvotedBy: req.params.user,
                },
            }, {
                new: true,
                upsert: true
            });
            return res.status(200).send({
                status: "success",
                post: post
            })

        } catch (err) {
            return res.status(500).send(err);
        }
    }

    if (req.params.action == 'downvote' && req.params.voted == 'true') {
        try {
            const post = await Post.findByIdAndUpdate(req.params.id, {
                $inc: {
                    upvotes: -1,
                    downvotes: 1
                },

                $pull: {
                    upvotedBy: req.params.user,
                },
                $push: {
                    downvotedBy: req.params.user,
                },
            }, {
                new: true,
                upsert: true
            });
            return res.status(200).send({
                status: "success",
                post: post
            })

        } catch (err) {
            return res.status(500).send(err);
        }
    }

    if (req.params.action == 'upvote' && req.params.voted == 'false') {
        try {
            await Post.findByIdAndUpdate(req.params.id, {
                $inc: {
                    upvotes: 1
                },
                $push: {
                    upvotedBy: req.params.user
                },
            }, {
                new: true,
                upsert: true
            });

        } catch (err) {
            return res.status(500).send(err);
        }
    }

    if (req.params.action == 'downvote' && req.params.voted == 'false') {
        try {
            await Post.findByIdAndUpdate(req.params.id, {
                $inc: {
                    downvotes: 1
                },
                $push: {
                    downvotedBy: req.params.user
                },
            }, {
                new: true,
                upsert: true
            });

        } catch (err) {
            return res.status(500).send(err);
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
        new: true,
        upsert: true,
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