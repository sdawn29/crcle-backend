const auth = require('../middleware/auth');
const {
    Comment,
    validate
} = require('../models/comment');
const {
    User
} = require('../models/user')

const {
    Post
} = require('../models/post')
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const express = require('express');
const router = express.Router();

// router.get('/', async (req, res) => {
//     const comments = await Comment.find().sort('-upvotes').populate('author', 'username _id isAdmin');
//     res.status(200).send({
//         status: "success",
//         comments
//     });
// });


// router.get('/:id', async (req, res) => {
//     try {
//         const comment = await Comment.findById(req.params.id).populate('author', 'username _id isAdmin');

//         if (!Comment) return res.status(404).send('The comment with the given ID is not found');

//         res.status(200).send({
//             status: "success",
//             comment
//         });

//     } catch (e) {
//         console.error(e)
//         res.status(500).send({
//             status: "error",
//             error: "INERNAL_SERVER_ERROR"
//         });
//     }
// })

router.post('/', [auth], async (req, res) => {
    // const {
    //     error
    // } = validate(req.body);
    // if (error) return res.status(400).send({
    //     status: "error",
    //     errorMsg: "ERR_VALIDATION",
    //     data: error.details[0].message
    // });

    const body = req.body.body;
    const author = req.body.author;
    const postId = req.body.postId
    try {
        const comment = new Comment({
            body: body,
            author: author,
            postId: postId,
        });
        await comment.save();
        res.status(200).send({
            status: "success",
            comment
        });

        //Updating comment into users collection 
        // await User.findByIdAndUpdate(author, {
        //     "$push": {
        //         "comments": comment._id
        //     }
        // }, {
        //     "new": true,
        //     "upsert": true
        // });

        // Updating comment into posts collection
        await Post.findByIdAndUpdate(postId, {
            "$push": {
                "comments": comment._id
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


// Api endpoint to incement or decrement points in comments
router.put('/:id/:action/:user/:voted', [auth], async (req, res) => {
    if (req.params.action == 'upvote' && req.params.voted == 'true') {
        try {
            const comment = await Comment.findByIdAndUpdate(req.params.id, {
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
                comment: comment
            })

        } catch (err) {
            return res.status(500).send(err);
        }
    }

    if (req.params.action == 'downvote' && req.params.voted == 'true') {
        try {
            const comment = await Comment.findByIdAndUpdate(req.params.id, {
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
                comment: comment
            })

        } catch (err) {
            return res.status(500).send(err);
        }
    }

    if (req.params.action == 'upvote' && req.params.voted == 'false') {
        try {
            await Comment.findByIdAndUpdate(req.params.id, {
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
            await Comment.findByIdAndUpdate(req.params.id, {
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
        Comment
    });
});


// router.put('/:id', [auth], async (req, res) => {

//     const Comment = await Comment.findOneAndUpdate(req.params.id, {
//         title: req.body.title,
//         body: req.body.body,
//     }, {
//         new: true,
//         upsert: true,
//     });

//     res.status(200).send({
//         status: "success",
//         Comment
//     });
// });

// router.delete('/:id', [auth], async (req, res) => {
//     const Comment = await Comment.findByIdAndRemove(req.params.id);

//     if (!Comment) return res.status(404).send({
//         status: "error",
//         msg: "The Comment with the given ID is not found"
//     });

//     res.status(200).send({
//         status: "success",
//         Comment
//     });
// })



module.exports = router;