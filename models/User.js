var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/Post.js');

//Encriptar PWD

var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password:{type: String, required: true},
    fullname: String,
    email: {type: String, required: true},
    creationdate: {type: Date, default: Date.now},
    role: {type: String, enum: ['admin','subscriber'], default:'subscriber'},
    posts:[{type: Schema.ObjectId, ref: 'Posts', default: null}]
});

UserSchema.pre('save', function(next){
    var user = this;

    //Solo aplica la funcion hash al pwd si ha sido modificado o nuevo.

    if(!user.isModified('password')) return next();

    //Genera la SALT

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
        
        if(err) return next(err);

        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next (err);

            //Sobreescribe el pwd

            user.password = hash;
            next();
        })
    })
})

UserSchema.methods.comparePassword = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    });
};

module.exports = mongoose.model('User', UserSchema);