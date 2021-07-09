const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                message: 'Posts were fetched!',
                posts: posts
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
        next(err);    
    })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, entered data is incorrect!')
        error.statusCode = 422;
        throw error;
    }
    const content = req.body.content;
    const title = req.body.title;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/book1.jpg',
        creator: {name: 'FuadS'}
    });
    post.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Post created succussfully!',
                post: result
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode= 500;
            }
            next(err);
        })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if(!post){
                const error = new Error('Counl not find a post!');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Post fetched',
                post: post
            })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode= 500;
            }
            next(err);
    })
}