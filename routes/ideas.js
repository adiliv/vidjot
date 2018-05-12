const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//load idea model
require('../models/Ideas');
const Idea = mongoose.model('ideas');

//idea index page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {ideas: ideas});
        })
});

//add idea form
router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('ideas/add');
});

//edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'not authorized');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
                idea: idea
            });
        }
       
    });
});

//process form
router.post('/', ensureAuthenticated, (req, res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({text: 'please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'please add some details'});
    }

    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{ 
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
    new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'Video idea added');
            res.redirect('/ideas');
        });
    }
});

//edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new value
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea updated');
            res.redirect('/ideas');
        })
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    });
});



module.exports = router;