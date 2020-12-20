var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

//MODELS

var Post = require('../models/Post.js');
var User = require('../models/User.js');
const { InsufficientStorage } = require('http-errors');
var db = mongoose.connection;


//GET all posts by date of publish

router.get('/', function(res,req){
    Post.find().sort('-publicationdate').populate('user').exec(function(err,posts){
        if(err) res.status(500).send(err);
        else res.status(200).json(posts);
    });
});

//GET all posts by User and ID

router.get('/all/:id', function(res,req,next){
    Post.find({'user':req.params.id}).sort('-publicationdate').populate('user').exec(function(err,posts){
        if(err) res.status(500).send(err);
        else res.status(200).json(posts);
    });
});

//CREATE a new Post

router.post('/', function(req,res,next){
    User.findById(req.body.iduser, function(err,userinfo){
        if (err){
            res.status(500).send(err)
        }else{
            //CREATE post ISTANCE
            var postIstance = new Post({
                user: req.body.iduser,
                title: req.body.title,
                description: req.body.description,
            });

            //PUSH to the arr of post by user
            userinfo.posts.push(postIstance);

            userinfo.save(function(err){
                if(err) res.status(500).send(err);
                else{
                    postIstance.save(function(err){
                        if(err) res.status(500).send(err);
                        res.sendStatus(200);
                    })
                }
            })
        }
    });
});


//PUT from a existing post identified by ID

router.put('/:id', function(req,res,next){
    Post.findByIdAndUpdate(req.params.id, function(err, postinfo){
        if(err) res.status(500).send(err);
        else res.sendStatus(200);
    });
});


//DELETE post by user

router.delete('/:id', function(req,res,next){
    Post.findByIdAndDelete(req.params.id, function(err, postinfo){
        if(err) res.status(500).send(err);
        else{
            User.findByIdAndUpdate(postinfo.user, {$pull: {posts: postinfo._id}}, function(err,userinfo){
                if(err) res.status(500).send(err);
                else{
                    res.sendStatus(200);
                };
            });
        };
    });
});

module.exports = router;