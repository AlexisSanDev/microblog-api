var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User.js');
var db = mongoose.connection;

/* GET users listing. */

router.get('/', function(req, res, next) {
  User.find().sort('-creationdate').exec(function(err, users){
    if(err)res.status(500).send(err);
    else res.status(200).json(users);
  });
});


/* GET user By id */

router.get('/:id', function(req, res, next) {
  User.findById(req.params.id,function(err, userinfo){
    if(err)res.status(500).send(err);
    else res.status(200).json(userinfo);
  });
});

/* CREATE user */

router.post('/', function(req, res, next) {
  User.create(req.body,function(err, userinfo){
    if(err)res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* UPDATE user */

router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id,req.body,function(err, userinfo){
    if(err)res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* DELETE user */

router.delete('/:id', function(req, res, next) {
  User.findByIdAndDelete(req.params.id, function(err, userinfo){
    if(err)res.status(500).send(err);
    else res.sendStatus(200);
  });
});

/* CHECK if user */

router.post('/signin', function(req, res, next) {
  User.findOne({username: req.body.username}, function(err, userinfo){
    if(err)res.status(500).send('Error en el username o password');

    //If user is alive

    if(user != null){
      user.comparePassword(req.body.password, function(err,isMatch){
        if(err) return next(err);

        //if pwd is alive

        if(isMatch){
          res.status(200).send({message:'ok', role:user.role, id:user_id})
        }else{
          res.status(200).send({message:'ko'});
        }
      })
    }else{
      res.status(401).send({meesage:'ko'})
    }
  });
});

module.exports = router;
