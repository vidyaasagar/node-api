const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Post.find({ user: req.user.id })
        .then(posts => {
            res.render('index/dashboard', {
                posts: posts
            });
        });
});

router.get('/about', (req, res) => {
    res.render('index/about');
});

module.exports = router;
