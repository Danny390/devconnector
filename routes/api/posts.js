const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile');//All the models are needed for the post, for details such as
const User = require('../../models/User');//Name, avatar, etc. The fields needed are in the Posts models file
const Post = require('../../models/Posts');

//@route    POST api/posts
//@desc     Create a post
//@access   Private
router.post('/', [auth, [
    check('text', "Text is required").not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
        //we're logged in, so token contains id; this is found by saying req.user.id
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post ({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    });

    const post = await newPost.save();

    res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    
});

//@route    Get api/posts
//@desc     Get all posts
//@access   Private
router.get('/', auth, async(req,res) => {
    try {//means it'll sort by most recent first. For oldest first, say date: 1
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    Get api/posts
//@desc     Get post by id
//@access   Private
router.get('/:id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        //If post not found
        if(!post){
            return res.status(404).json( { msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        //Id incorrect format
        if(err.kind === 'ObjectId'){
            return res.status(404).json( { msg: 'Post not found' });
        }
        res.status(500).send('Server Error')
    }
});

//@route    DELETE api/posts/:id
//@desc     Delete a post
//@access   Private
router.delete('/:id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        //If post not found
        if(!post){
            return res.status(404).json( { msg: 'Post not found' });
        }

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: "User not authorized"})
        }
        await post.remove();

        res.json({msg: "Post removed"})

    } catch (err) {
        console.error(err.message);
        //Id incorrect format
        if(err.kind === 'ObjectId'){
            return res.status(404).json( { msg: 'Post not found' });
        }
        res.status(500).send('Server Error')
    }
});

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private
router.put('/like/:id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Check if post has already been liked by logged in user
        //The 'like =>' is similar to the LIKE function in databases (it used as a comparison operator)
        //If length is greater than 0, the post has already been liked
        //Test if the like's user's id matches the logged in user's id (like.user.toString() === req.user.id)
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: "Post already liked"});
        }
        //Unshift puts it at the beggining, not the end
        post.likes.unshift({user: req.user.id});

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    DELETE api/posts/unlike/:id
//@desc     Unlike a post
//@access   Private
router.put('/unlike/:id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Check if post has already been liked by logged in user
        //The 'like =>' is similar to the LIKE function in databases (it used as a comparison operator)
        //If length is greater than 0, the post has already been liked
        //Test if the like's user's id matches the logged in user's id (like.user.toString() === req.user.id)
        if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0){
            return res.status(400).json({msg: "Post has not yet been liked"});
        }
        //Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    POST api/posts/comment/:id
//@desc     Comment on to post
//@access   Private
router.post('/comment/:id', [auth, [
    check('text', "Text is required").not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newComment = new Post ({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    });

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    
});
//This ensures that both the post id and the comment id are required for deletion of comment
//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Delete comment
//@access   Private
router.delete('/comment/:id/:comment_id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Get comment from comment array
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        //If no comment found
        if(!comment){
            return res.status(404).json( { msg: 'Comment does not exist' });
        }
        //Check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json( { msg: 'User not authorized' });
        }

        //Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;